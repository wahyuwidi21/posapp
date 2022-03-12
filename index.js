import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import usersRouter from './src/routes/users';
import rolesRouter from './src/routes/roles';
import ownerLevelRouter from './src/routes/owner_level';
import brandRouter from './src/routes/brand';
import cors from 'cors';
// import minio from './src/helpers/minio';
import config, { HOST } from './src/config/config';

const port = process.env.PORT || 3000;
const app = express();
const mongoose = require('mongoose');
const options = {
   autoIndex: false, // Don't build indexes
   maxPoolSize: config.pool.max,
   minPoolSize:config.pool.min, // Maintain up to 10 socket connections
   serverSelectionTimeoutMS: config.pool.idle, // Keep trying to send operations for 5 seconds
   socketTimeoutMS: config.pool.acquire, // Close sockets after 45 seconds of inactivity
   family: 4 // Use IPv4, skip trying IPv6
 };
// const uri = `mongodb://${config.USER}:${config.PASSWORD}@${config.HOST}:${config.PORT}/${config.DB}`;
const uri = `mongodb://${config.HOST}:${config.PORT}/${config.DB}`;

app.use(cors());
app.use(helmet());
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


console.log('Try to connect to ' + uri);
 mongoose.connect(uri,options,{
   useNewUrlParser: true, 
   useUnifiedTopology: true })
 .then(() => console.log('Connected to DB!'))
 .catch(error => console.log('Error DB: ' + error.message));

app.use('/account/v1/brand', brandRouter);
app.use('/account/v1/role', rolesRouter);
app.use('/account/v1/ownerLevel', ownerLevelRouter);
app.use('/account/v1/users', usersRouter);

app.listen(port, () => {
   console.log(`Server is running on PORT ${port}`);
});
export default app;