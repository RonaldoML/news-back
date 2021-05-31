import "./common/env";
import Database from "./common/database";
import Server from "./common/server";
import routes from "./routes";

const port: number = parseInt(process.env.PORT || "5000");
const connectionString: string = process.env.MONGODB_URI

const db: Database = new Database(connectionString);
export default new Server().database(db).fetching(connectionString).router(routes).listen(port);
