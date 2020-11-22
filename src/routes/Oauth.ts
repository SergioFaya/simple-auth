import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import { errors, IRequest } from '@shared/constants';
import { generateJWT, generateRandomCode, hashText, verifyJWT } from '@shared/functions';
import CodeCacheDao from '@daos/chache/CodeCacheDao';
import UserDao from '@daos/User/UserDao';
import TokenCacheDao from '@daos/chache/TokenCacheDao';

const router = Router();
const AUTHCODE_LENGHT = 10;
const codeCacheDao = new CodeCacheDao();
const userDao = new UserDao();
const tokenCacheDao = new TokenCacheDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * POST /api/oauth/authorize
 *
 * Establece un codigo temporal para la autenticacion del usuario que se devuelve y se utiliza como intercambio por un token de larga duracion
 *
 * FIXME: este endpoint puede ser utilizado para enviar webhooks a otros servicios de autenticación a modo de oauth
 */
router.post('/authorize', async (req: Request, res: Response) => {
	const { username } = req.body.user;
	const user = await userDao.getOne(username);
	if (user) {
		const code = generateRandomCode(AUTHCODE_LENGHT);
		await codeCacheDao.storeTempCodeForUser(username, code);
		res.status(OK).json({
			code
		});
	} else {
		res.status(BAD_REQUEST).json({
			message: "Username not valid"
		});
	}
});

/**
 * POST /api/oauth/login
 *
 * Mediante el codigo temporal de la operacion authorize se genera un token final en caso de que el código sea
 * correcto o en caso contrario se devuelve ese error
 */
router.post('/login', async (req: Request, res: Response) => {
	const { username, code } = req.body;
	if (!code || !username) {
		res.status(BAD_REQUEST).json({
			error: errors.paramMissingError,
		});
	}
	if (!codeCacheDao.checkTempCodeForUser(username, code)) {
		res.status(BAD_REQUEST).json({
			error: errors.paramMissingError,
		});
	} else {
		await codeCacheDao.deleteTempCode(username);
		const hash = await hashText(username);
		const token = await generateJWT(hash);
		await tokenCacheDao.storeToken(hash, token);
		res.status(CREATED).json({ token })
	}
});

/**
 * POST /api/oauth/checkAuth
 *
 * Se comprueba si el token de sesion del usuario es válido
 */
router.post('/checkAuth', async (req: Request, res: Response) => {
	const { token } = req.body;
	const hash = await verifyJWT(token);
	const auth = await tokenCacheDao.existsToken(hash, token);
	res.status(OK).json({ auth })
});

export default router;
