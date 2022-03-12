'use strict';
const mongoose = require('mongoose');

const roleSchema= new mongoose.Schema({
  role_name: {
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

const role = mongoose.model('Role',roleSchema);
module.exports = role;