const moment = require('moment');
const fs = require('fs');

function log(message) {
    _write('log', message);
}

function warn(message) {
    _write('warn', message);
}

function error(message) {
    _write('error', message);
}

function _write(func, message) {
    let m = moment();
    let out = `[${m.format()}] [${func.toUpperCase()}] ${message}`;
    console[func](out);
    fs.appendFileSync(`./logs/${m.format('YYYY-MM-DD')}.log`, `${out}\n`);
}

module.exports = {
    "log": log,
    "warn": warn,
    "error": error
}
