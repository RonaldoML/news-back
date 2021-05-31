"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./logger"));
const morgan_1 = __importDefault(require("morgan"));
const es_1 = require("agenda/es");
const node_fetch_1 = __importDefault(require("node-fetch"));
const error_handler_1 = __importDefault(require("../api/middlewares/error.handler"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const mongoose_1 = __importDefault(require("mongoose"));
const new_1 = require("../api/models/new");
const deleted_1 = require("../api/models/deleted");
const app = express_1.default();
class ExpressServer {
    constructor() {
        const root = path_1.default.normalize(__dirname + "/../..");
        app.set("appPath", root + "client");
        app.use(morgan_1.default("dev"));
        app.use(cookie_parser_1.default(process.env.SESSION_SECRET));
        app.use(express_1.default.static(`${root}/public`));
        //CORS
        app.use(cors_1.default());
        //Lectura y parseo del body
        app.use(express_1.default.json());
        const apiSpec = path_1.default.join(__dirname, "api.yml");
        const validateResponses = !!(process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
            process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === "true");
        app.use(process.env.OPENAPI_SPEC || "/spec", express_1.default.static(apiSpec));
        app.use(OpenApiValidator.middleware({
            apiSpec,
            validateResponses,
            ignorePaths: /.*\/spec(\/|$)/,
        }));
    }
    router(routes) {
        routes(app);
        app.use(error_handler_1.default);
        return this;
    }
    database(db) {
        db.init();
        return this;
    }
    fetching(connectionString) {
        var agenda = new es_1.Agenda({ db: { address: connectionString, collection: "agendaJobs" } });
        agenda.define('testing', (job, done) => __awaiter(this, void 0, void 0, function* () {
            const resp = yield node_fetch_1.default('https://hn.algolia.com/api/v1/search_by_date?query=nodejs');
            const result = yield resp.json();
            if (mongoose_1.default.connection.collection('news')) {
                mongoose_1.default.connection.collections.news.insertMany(result.hits);
            }
            else {
                const cl = yield mongoose_1.default.connection.createCollection('news');
                cl.insertMany(result.hits);
            }
            let pet = yield deleted_1.Deleted.find();
            Promise.all(pet.map((p) => __awaiter(this, void 0, void 0, function* () {
                const tag = p.tag;
                const name = p.title;
                return yield new_1.New.updateMany({ [tag.toString()]: name }, { "show": false });
            }))).then(value => console.log({ value })).catch(error => console.log({ error }));
            done();
        }));
        agenda.on('ready', () => {
            agenda.every('1 hours', 'testing');
            agenda.start();
        });
        return this;
    }
    listen(port) {
        const welcome = (p) => () => logger_1.default.info(`up and running in ${process.env.NODE_ENV || "development"} @: ${os_1.default.hostname()} on port: ${p}}`);
        http_1.default.createServer(app).listen(port, welcome(port));
        return app;
    }
}
exports.default = ExpressServer;
//# sourceMappingURL=server.js.map