var redis = require('redis');
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var app = express();
const ace = require('@adonisjs/ace');
ace.command('greet {name: Name of the user to greet}', 'Command description', function ({ name }) {
    console.log(`Hello ${name}`);
});
ace.wireUpWithCommander();
ace.invoke();
