"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
class DataCleaning {
    constructor() { }
    getData(data) {
        for (let key of Object.keys(config_1.deviceConfigDevice)) {
            if (!config_1.deviceConfigDevice[key].test(data[key])) {
                return false;
            }
        }
        return true;
    }
    iterator() { }
}
exports.DataCleaning = DataCleaning;
