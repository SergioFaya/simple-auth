import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import UserDao from '@daos/User/UserDao';
import { errors, IRequest } from '@shared/constants';
import User from '@entities/User';

const router = Router();
const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;


/**
 * GET /api/users/all
 */
// router.get('/all', async (req: Request, res: Response) => {
// 	const users = await userDao.getAll();
// 	return res.status(OK).json({ users });
// });

const validateUser = (user: User, res: Response) => {
	if (!user.email || !user.password || !user.username) {
		res.status(BAD_REQUEST).json({
			message: "Object user not complete. Required email, username and password."
		})
	} else {
		// TODO: validar campos de formulario, pass mayor que 8, user sin caracteres especiales y max de cada campo 20 menos de email que va con todo

		if (user.email.length > 0) {

		}
	}
}
/**
 * POST /api/users/add
 */
router.post('/add', async (req: IRequest, res: Response) => {
	const { user } = req.body;
	if (!user) {
		return res.status(BAD_REQUEST).json({
			error: errors.paramMissingError,
		});
	}

	const valid = validateUser(user, res);

	await userDao.add(user);
	return res.status(CREATED).end();
});



/**
 * PUT /api/users/update
 */
router.put('/update', async (req: IRequest, res: Response) => {
	const { user } = req.body;
	if (!user) {
		return res.status(BAD_REQUEST).json({
			error: errors.paramMissingError,
		});
	}
	user.id = Number(user.id);
	await userDao.update(user);
	return res.status(OK).end();
});



/**
 * DELETE /api/users/delete/:id
 */
router.delete('/delete/:id', async (req: IRequest, res: Response) => {
	const { id } = req.params;
	await userDao.delete(Number(id));
	return res.status(OK).end();
});


export default router;
