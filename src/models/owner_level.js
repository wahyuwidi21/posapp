'use strict';
const mongoose = require('mongoose');

const roleSchema= new mongoose.Schema({
  owner_level: {
    type: String,
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Brand'
  },
  is_active: {
    type: Boolean,
    required: true,
    default:false
  },
});

const role = mongoose.model('Owner_Level',roleSchema);
module.exports = role;