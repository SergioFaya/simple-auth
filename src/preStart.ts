import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';
// reflect metadada must be imported to add decorators
import "reflect-metadata";
import { createConnection } from 'typeorm';
import User from '@entities/User';
import { createRedisClient } from '@shared/redis';


// Setup command line options
const options = commandLineArgs([
	{
		name: 'env',
		alias: 'e',
		defaultValue: 'development',
		type: String,
	},
]);

// Set the env file
const result2 = dotenv.config({
	path: `./env/${options.env as string}.env`,
});

if (result2.error) {
	throw result2.error;
}

/**
 * Start db connection
 */
// TODO: extraer a variables de entorno
createConnection({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "postgres",
	password: "example",
	database: "my-oauth",
	entities: [
		User
	],
	synchronize: true,
	logging: false
}).then(() => {
	console.log("Db connection stablished")

}).catch(error => console.log(error));

/**
 * Start redis connection
 */
const client = createRedisClient({
	auth_pass: 'example',
});

client.on("connect", () => {
	console.log("Connected to redis cache");
});

client.on("error", (error) => {
	console.error(error);
});
