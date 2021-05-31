"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_sequence_1 = __importDefault(require("mongoose-sequence"));
const AutoIncrement = mongoose_sequence_1.default(mongoose_1.default);
const schema = new mongoose_1.default.Schema({
    author: String,
    title: String,
    story_title: String,
    url: String,
    story_url: String,
    created_at: String,
    show: { type: Boolean, default: true },
}, {
    collection: "news",
});
exports.New = mongoose_1.default.model("New", schema);
//# sourceMappingURL=new.js.map