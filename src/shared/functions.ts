import logger from './Logger';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import bcrypt from 'bcrypt';

const tokenSecret = "WjKJHMvaLkEnfsN3JHFY"


export const pErr = (err: Error) => {
	if (err) {
		logger.err(err);
	}
};

export const getRandomInt = () => {
	return Math.floor(Math.random() * 1_000_000_000_000);
};

export const generateRandomCode = (length: number) => {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

export const generateJWT = async (payload: String): Promise<string> => {
	const signJwt = promisify(jwt.sign);
	const token = await signJwt(payload, tokenSecret)
	return token as string;
}

export const verifyJWT = (token: string): string => {
	const decoded = jwt.verify(token, tokenSecret)
	return decoded as string;
}

export const hashText = (text: string) => {
	const salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(text, salt);
}
