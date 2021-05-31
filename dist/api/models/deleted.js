"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deleted = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    title: String,
    tag: String,
}, {
    collection: "deleted",
});
exports.Deleted = mongoose_1.default.model("Deleted", schema);
//# sourceMappingURL=deleted.js.map