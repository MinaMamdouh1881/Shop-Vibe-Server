import { Router } from 'express';
import verifyToken from '../middlewares/verifyToken';
import {checkOutHandler} from '../controllers/checkout.controller';

const router = Router();

router.post('/checkout', verifyToken, checkOutHandler);

export default router;
