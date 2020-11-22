import { get, getClient, setex } from "@shared/redis"

export interface ICodeCacheDao {
	storeTempCodeForUser(username: string, code: string, seconds?: number): Promise<void>,
	checkTempCodeForUser(username: string, code: string): Promise<boolean>,
	deleteTempCode(username: string): void,
}

class CodeCacheDao implements ICodeCacheDao {

	readonly CODE_KEY = (username: string) => {
		return "CODES:" + username
	}

	public async checkTempCodeForUser(username: string, code: string): Promise<boolean> {
		const key = this.CODE_KEY(username);
		const result = await get()(key);
		return result === code;
	}

	public async storeTempCodeForUser(username: string, code: string, seconds: number = 300): Promise<void> {
		const key = this.CODE_KEY(username);
		await setex()(key, seconds, code);
	}

	public async deleteTempCode(username: string) {
		await getClient().del(username)
	}
}

export default CodeCacheDao;
