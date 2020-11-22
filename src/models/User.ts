import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum UserRole {
	APP = 'app',
	USER = 'user',
	ADMIN = 'admin'
}


@Entity()
class User {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	role: UserRole;

	constructor(username: string, role: UserRole, email?: string, password?: string) {
		this.username = username;
		this.role = role;

		if (email) {
			this.email = email;
		}
		if (password) {
			this.password = password;
		}
	}
}

export default User;
