const moment = require('moment');

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
    let out = `[${moment().format()}] [${func.toUpperCase()}] ${message}`;
    console[func](out);
}

module.exports = {
    "log": log,
    "warn": warn,
    "error": error
}
