const moment = require('moment');

let timerStart;
let timerTime = 60 * 60 * 1000;

let status = false;
let finished = false;

function setTime(m) {
    timerTime = m * 60 * 1000;
}

function startTimer() {
    if (!status) {
        status = true;
        timerStart = Date.now();
    }
}

function addTime(m) {
    timerTime += m * 60 * 1000;
    if (m > 0) {
        finished = false;
    }
}

function apiSetTime(req, res) {
    try {
        const time = Number(req.body.timerTime);
        timerLag = 0;
        if (time) {
            setTime(time);
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (_) {
        res.sendStatus(400);
    }
}

function apiStartTimer(req, res) {
    startTimer();
    res.sendStatus(200);
}

function apiGetTime(req, res) {
    if (!finished && status) {
        const tempNow = Date.now();
        const tempStart = new Date(timerStart);

        const tempDiff = new Date(tempNow - tempStart);
        const timerRemain = new Date(timerTime - tempDiff);
        const timeOffset = new Date().getTimezoneOffset();

        if (timerRemain <= 0) {
            finished = true;
        }
        res.send({timerRemain, timeOffset, status, finished});
    } else if (!finished) {
        const timeOffset = new Date().getTimezoneOffset();
        res.send({timerRemain: timerTime, timeOffset, status, finished});
    } else {
        status = false;
        res.send({status, finished});
    }
}

function apiResetTimer(req, res) {
    status = false;
    res.sendStatus(200);
}

function apiAddTime(req, res) {
    try {
        const time = Number(req.body.timerTime);
        addTime(time);
        res.sendStatus(200);
    } catch (_) {
        res.sendStatus(400);
    }
}

module.exports = {
    apiGetTime,
    apiSetTime,
    apiStartTimer,
    apiResetTimer,
    apiAddTime
}
