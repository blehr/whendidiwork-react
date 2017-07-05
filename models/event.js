'use strict';

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var Event = new Schema({
  google: {
    id: String,
  },
  sheet: {
    id: String,
    range: String
  },
  calendar: {
    id: String,
    eventId: String
  }
});

module.exports = mongoose.model('Event', Event);
