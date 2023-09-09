import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './routers/router';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: __dirname + '/.env' });
// dotenv.config();

console.clear();
console.log(`[Time :] ${new Date().toLocaleTimeString()}`);
const app: Application = express();

const corsConfig = {
	origin: '*',
	// origin:true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true,
};
// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
//   });
  
// app.use(
// 	cors({
// 	  origin: "*",
// 	  credentials: true, // Allow credentials (cookies)
// 	})
//   );

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(router);

try {
	mongoose.connection.on('open', () => console.log('🍁 Connected to Database'));

	app.listen(process.env.SERVER_PORT, () => {
		console.log(`🚀 Server is listening on port http://localhost:${process.env.SERVER_PORT}`);
	});
} catch (error) {
	console.log(error);
}
