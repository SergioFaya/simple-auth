import { Request } from 'express';
import User from 'src/models/User';


export const errors = {
	paramMissingError: 'One or more of the required parameters was missing.',

}

export interface IRequest extends Request {
	body: {
		user: User;
	}
}
