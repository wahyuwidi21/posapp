import config, { HOST } from '../config/config';

const mongoose = require('mongoose');
const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: config.pool.max,
  minPoolSize:config.pool.min, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: config.pool.idle, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: config.pool.acquire, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
const uri = `mongodb://${config.DB}:${config.PASSWORD}@${config.HOST}:${config.PORT}/${config.DB}`;
mongoose.connect(uri,options,{
  useNewUrlParser: true, 
  useUnifiedTopology: true })
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
