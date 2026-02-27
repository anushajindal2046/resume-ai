import { Router } from 'express';
import { signup, login, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', (req, res, next) => {
  signup(req, res).catch(next);
});
router.post('/login', (req, res, next) => {
  login(req, res).catch(next);
});
router.get('/me', requireAuth, (req, res, next) => {
  me(req, res).catch(next);
});

export default router;
