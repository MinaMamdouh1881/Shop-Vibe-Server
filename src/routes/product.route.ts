import { Router } from 'express';
import {
  addAll,
  getProducts,
  getProductByID,
  getFeaturedMan,
  getFeaturedWoman,
  getBestSalesMan,
  getBestSalesWoman,
} from '../controllers/product.controller';

const router = Router();

router.get('/addAll', addAll);
router.get('/getProducts/:gender', getProducts);
router.get('/product/:id', getProductByID);
router.get('/getfeaturedman', getFeaturedMan);
router.get('/getfeaturedwoman', getFeaturedWoman);
router.get('/getbestsalesman', getBestSalesMan);
router.get('/getbestsaleswoman', getBestSalesWoman);

export default router;
