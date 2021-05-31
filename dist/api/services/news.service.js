"use strict";
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
exports.NewsService = void 0;
const logger_1 = __importDefault(require("../../common/logger"));
const deleted_1 = require("../models/deleted");
const new_1 = require("../models/new");
class NewsService {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("fetch all news");
            const news = yield new_1.New.find();
            return news;
        });
    }
    delete(name, tag) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Delete new");
            yield new_1.New.updateMany({ [tag]: name }, { "show": false });
            const newDelete = new deleted_1.Deleted({ tag, title: name });
            yield newDelete.save();
            return true;
        });
    }
}
exports.NewsService = NewsService;
exports.default = new NewsService();
//# sourceMappingURL=news.service.js.map