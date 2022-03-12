'use strict';
const mongoose = require('mongoose');

const brandSchema= new mongoose.Schema({
  brand_name: {
    type: String,
    required: true,
  },
  office_address: {
    type: String,
    required: true,
    default:false
  },
  pic_name: {
    type: String,
    required: true,
    default:false
  },
  pic_phone: {
    type: String,
    required: true,
    default:false
  },
  is_active: {
    type: Boolean,
    required: true,
    default:false 
  },
});

const brand = mongoose.model('Brand',brandSchema);
module.exports = brand;