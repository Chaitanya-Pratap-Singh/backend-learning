/** @format */

import mongoose from "mongoose";
import { dbName } from "../constants.js";

const dbConnect = async () => {
	try {
		const connectionInstance = await mongoose.connect(
			`${process.env.MONGODB_URI}/{dbName}`
		);
		console.log(`connected to mongo at ${connectionInstance.connection.host}`);
	} catch (error) {
		console.log("DB connection error ", error);
		process.exit(1);
	}
};

export default dbConnect;
