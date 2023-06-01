"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todos_1 = __importDefault(require("./routes/todos"));
// CONFIG
const app = (0, express_1.default)();
// MIDDLEWARE
app.use(express_1.default.json({}));
app.use(todos_1.default);
// STARTUP
app.listen(3000, () => {
    console.log('Server listening at port 3000!');
});
