import { setex, get } from "@shared/redis"

export interface ITokenCacheDao {
	storeToken(key: string, token: string, minutes?: number): Promise<void>,
	existsToken(key: string, token: string): Promise<boolean>;
}

class TokenCacheDao implements ITokenCacheDao {

	readonly TOKEN_KEY = (username: string) => {
		return "TOKENS:" + username;
	}

	/**
	 *
	 * @param username
	 * @param token
	 * @param minutes
	 */
	public async storeToken(key: string, token: string, minutes: number = 30): Promise<void> {
		const seconds = minutes * 60;
		setex()(this.TOKEN_KEY(key), seconds, token);
		return Promise.resolve();
	}

	/**
	 *
	 * @param username
	 * @param token
	 */
	public async existsToken(key: string, token: string): Promise<boolean> {
		const result = await get()(this.TOKEN_KEY(key));
		return result === token;
	}

}

export default TokenCacheDao;
