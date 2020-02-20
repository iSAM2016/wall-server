"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasktime = {
    development: {
        nginx: '* */1 * * * *',
    },
    prod: {
        nginx: '*/4 * * * * *',
    },
};
exports.tasktime = tasktime;
