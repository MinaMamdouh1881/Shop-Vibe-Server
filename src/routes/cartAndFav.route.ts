import { Router } from 'express';
import { saveCart, saveFav } from '../controllers/cartAndFave.controller';
import verifyToken from '../middlewares/verifyToken';

const router = Router();

router.put('/saveCart', verifyToken, saveCart);
router.put('/saveFav', verifyToken, saveFav);

export default router;
