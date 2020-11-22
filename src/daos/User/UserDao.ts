import User from 'src/models/User';
import { getConnection, } from 'typeorm';

export interface IUserDao {
	getOne: (email: string) => Promise<User | undefined>;
	getAll: () => Promise<User[] | undefined>;
	add: (user: User) => Promise<void>;
	update: (user: User) => Promise<void>;
	delete: (id: number) => Promise<void>;
}

class UserDao implements IUserDao {

	readonly getRepo = () => getConnection().getRepository(User);

	/**
	 * @param name
	 */
	public getOne(username: string): Promise<User | undefined> {
		return this.getRepo().findOne({
			where: {
				username
			}
		})
	}

	/**
	 *
	 */
	public getAll(): Promise<User[] | undefined> {
		// TODO
		return this.getRepo().find();
	}


	/**
	 *
	 * @param user
	 */
	public async add(user: User): Promise<void> {
		await this.getRepo().insert(user);
	}


	/**
	 *
	 * @param user
	 */
	public async update(user: User): Promise<void> {
		await this.getRepo().update(user.id, user)
	}


	/**
	 *
	 * @param id
	 */
	public async delete(id: number): Promise<void> {
		await this.getRepo().delete(id)
	}
}

export default UserDao;
