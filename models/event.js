'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Event = new Schema({
  google: {
    id: String,
  },
  sheet: {
    id: String,
    row: Number
  },
  calendar: {
    id: String,
    eventId: String
  }
});

module.exports = mongoose.model('Event', Event);
