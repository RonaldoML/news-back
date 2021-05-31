import { Application } from "express";
import newsRouter from "./api/controllers/news/router";
export default function routes(app: Application): void {
  app.use("/app/v1/news", newsRouter)
}
