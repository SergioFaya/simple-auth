import redis, { ClientOpts, RedisClient } from 'redis';
import { promisify } from 'util';

let client: RedisClient;


// TODO: extract to session
export const createRedisClient = (opts: ClientOpts): RedisClient => {
	client = redis.createClient(opts);
	return client;
}

export const getClient = (): RedisClient => {
	if (client) {
		return client;
	}
	throw new Error("Redis connection cannot be stablished.")

};
// hashed
export const hget = () => promisify(getClient().hget).bind(client)
export const hset = () => promisify(getClient().hset).bind(client)

// key valued
export const setex = () => promisify(getClient().setex).bind(client)
export const get = () => promisify(getClient().get).bind(client)