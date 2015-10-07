'use strict';

const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  city: {
    type: Number,
    index: true
  },
  date: {
    type: Date,
    index: true
  },
  accident: {
    type: Number
  },
  level: {
    type: Number
  },
  weather: {
    code: {
      type: String
    },
    wind: {
      type: Number
    },
    temperature: {
      type: String
    },
    dampness: {
      type: Number
    }
  }
});

module.exports = mongoose.model('Info', itemSchema);
