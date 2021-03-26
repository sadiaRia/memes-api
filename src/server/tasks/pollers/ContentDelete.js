const _ = require('lodash'),
  async = require('async'),
  moment = require('moment'),
  Contens = require('../../content/content'),
  BasePoller = require('../BasePoller');

const ContentDelete = function () {
  this.pollableQuery = function (callback) {
    let query = {
      createdAt: {
        $lt: moment().subtract(7, 'days').toDate()
      },
    };
    console.log(query);
    Contens.updateMany(query, { $set: { deleted: true } }, { multi: true }, (err) => {
      if (err) { console.log('=== something went wrong to delete event'); }
      callback(err);
    });

  };

  this.emitPolledDocuments = function (polledDocuments, callback) {
    polledDocuments = _.compact(polledDocuments);
    console.log('Inside emit polled documents', polledDocuments);
    callback(null, polledDocuments);
  };

  this.poll = function (callback) {
    const self = this;
    self.getDocuments(function (err, polledDocuments) {
      if (err) {
        console.log('Failed to fetch polled documents');
        return callback(err);
      }
      self.emitPolledDocuments(polledDocuments, callback);
    });
  };
};

ContentDelete.prototype = new BasePoller();

module.exports = ContentDelete;
