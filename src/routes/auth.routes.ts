import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import passport from 'passport';

const router = Router();

//for troubleshooting purpose
router.get('/gettest', authController.test);
router.get('/getasdf', authController.test);
router.post('/posttest', authController.test);
router.post('/postasdf', authController.test);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);

// OAuth Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        res.json(req.user);
    }
);

export default router;
