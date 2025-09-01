import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken';
import {
  checkOutHandler,
  checkOutCallbackHandler,
} from '../controllers/checkout.controller';

const router = Router();

router.post('/checkout', verifyToken, checkOutHandler);
router.post('/checkout-callback', verifyToken, checkOutCallbackHandler);

export default router;
