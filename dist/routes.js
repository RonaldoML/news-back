"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("./api/controllers/news/router"));
function routes(app) {
    app.use("/app/v1/news", router_1.default);
}
exports.default = routes;
//# sourceMappingURL=routes.js.map