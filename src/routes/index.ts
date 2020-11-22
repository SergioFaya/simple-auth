import { Router } from 'express';
import UserRouter from './Users';
import OauthRouter from './Oauth';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/oauth', OauthRouter)

// Export the base-router
export default router;
