"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../../core");
const knex = require("knex");
const mysqlConnection = () => {
    let config = core_1.getConfig();
    console.log(process.env.MYSQL_DB_HOST);
    return knex({
        client: 'mysql',
        connection: {
            host: String(process.env.MYSQL_DB_HOST ? process.env.MYSQL_DB_HOST : 'localhost'),
            port: Number(config.get('MYSQL_PORT')),
            user: String(config.get('MYSQL_USER')),
            password: String(config.get('MYSQL_PASSWORD')),
            database: String(config.get('MYSQL_DATABASE')),
        },
        debug: false,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 100,
            reapIntervalMillis: 150,
        },
        acquireConnectionTimeout: 60000,
        log: {
            error(message) { },
        },
    });
};
function InjectRepositorys() {
    return function (target, propertyKey) {
        Object.defineProperty(target, propertyKey, {
            enumerable: true,
            get: function () {
                return mysqlConnection();
            },
            set: function (value) { },
        });
    };
}
exports.InjectRepositorys = InjectRepositorys;
