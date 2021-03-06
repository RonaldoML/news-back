"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./common/env");
const database_1 = __importDefault(require("./common/database"));
const server_1 = __importDefault(require("./common/server"));
const routes_1 = __importDefault(require("./routes"));
const port = parseInt(process.env.PORT || "5000");
const connectionString = process.env.MONGODB_URI;
const db = new database_1.default(connectionString);
exports.default = new server_1.default().database(db).fetching(connectionString).router(routes_1.default).listen(port);
//# sourceMappingURL=index.js.map