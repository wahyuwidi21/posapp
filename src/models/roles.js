'use strict';

import mongoose from 'mongoose';

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
export default role;