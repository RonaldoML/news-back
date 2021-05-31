import express from "express";
import { Application } from "express";
import path from "path";
import http from "http";
import os from "os";
import cors from 'cors';
import cookieParser from "cookie-parser";
import l from "./logger";
import morgan from "morgan";
import { IDatabase } from "./database";
import { Agenda } from 'agenda/es';
import fetch from 'node-fetch';

import errorHandler from "../api/middlewares/error.handler";
import * as OpenApiValidator from "express-openapi-validator";
import mongoose from "mongoose";
import { New } from "../api/models/new";
import { Deleted } from "../api/models/deleted";

const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + "/../..");
    app.set("appPath", root + "client");
    app.use(morgan("dev"));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
    //CORS
    app.use(cors());
    //Lectura y parseo del body
    app.use(express.json());
    const apiSpec = path.join(__dirname, "api.yml");
    const validateResponses = !!(
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === "true"
    );
    app.use(process.env.OPENAPI_SPEC || "/spec", express.static(apiSpec));
    app.use(
      OpenApiValidator.middleware({
        apiSpec,
        validateResponses,
        ignorePaths: /.*\/spec(\/|$)/,
      })
    );

  }

  router(routes: (app: Application) => void): ExpressServer {
    routes(app);
    app.use(errorHandler);
    return this;
  }

  database(db: IDatabase): ExpressServer {
    db.init();
    return this;
  }

  fetching (connectionString: string): ExpressServer{

    var agenda = new Agenda({ db: {address: connectionString, collection: "agendaJobs"} });

    agenda.define('testing', async(job, done) => {
        const resp = await fetch('https://hn.algolia.com/api/v1/search_by_date?query=nodejs');
        const result = await resp.json();
        if(mongoose.connection.collection('news')){
          mongoose.connection.collections.news.insertMany(result.hits);
        }else{
          const cl = await mongoose.connection.createCollection('news');
          cl.insertMany(result.hits);
        }
        let pet = await Deleted.find();
        Promise.all(pet.map(async p => {
        const tag: String = p.tag;
        const name: String = p.title;
        return await New.updateMany({ [tag.toString()]: name },
        { "show" : false })})).then(value=>console.log({value})).catch(error => console.log({error}))
            done();
        });

    agenda.on('ready', () => {
      agenda.every('1 hours', 'testing');
      agenda.start();
    });
    return this
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || "development"
        } @: ${os.hostname()} on port: ${p}}`
      );

    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}

