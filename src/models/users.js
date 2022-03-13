'use strict';
import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_phone_number_confirmed: {
    type: Boolean,
    required: true,
    default:false
  },
  photo: {
    type: String,
  },
  nik: {
    type: Number,
  },
  ktp_picture: {
    type: String,
  },
  selfie_with_ktp: {
    type: String,
  },
  npwp: {
    type: Number,
  },
  npwp_picture: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  is_email_confirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  address: {
    type: String,
  },
  sub_district: {
    type: String,
  },
  district: {
    type: String,
  },
  city: {
    type: String,
  },
  province: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  owner_level: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Owner_Level'
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Brand'
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Role',
    required: true,
  },
  is_active: {
    type: Boolean,
    required: true,
    default:false
  },
});

const user = mongoose.model('User',userSchema);
export default user;