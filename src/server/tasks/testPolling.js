'use strict';

const schedule = require('node-schedule');

let started = false;
let contentDeletePollJob;

const ContentDelete = require('./pollers/ContentDelete');

const contentDelete = new ContentDelete();
const start = () => {
  console.log('Test polling start method called');
  if (started) { return; }
  started = true;

  const pollingIntervalInMinutes = 59;
  // const cronRule = '00 10 23 * * *'; //running this task 11:10
  const cronRule = '0 0 */12 * * *'; //running this task every twelve hours

  contentDeletePollJob = schedule.scheduleJob(cronRule, _contentDelete((err) => {
    if (err) { console.log('Polling failed', err); }
    console.log('Polling successfully started');
  }));

};

const stop = () => {
  contentDeletePollJob.cancel();
  started = false;
};

function _contentDelete(callback) {
  return () => { contentDelete.poll(callback); };
}


module.exports = {
  start,
  stop
};
