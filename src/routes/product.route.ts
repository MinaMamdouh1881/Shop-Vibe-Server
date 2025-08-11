import { Router } from 'express';
import {
  addAll,
  getProducts,
  getProductByID,
  getFeaturedMan,
  getFeaturedWoman,
  getBestSalesMan,
  getBestSalesWoman,
  getNewArrival,
} from '../controllers/product.controller';

const router = Router();

router.get('/addAll', addAll);
router.get('/getProducts/:gender', getProducts);
router.get('/product/:id', getProductByID);
router.get('/getfeaturedman', getFeaturedMan);
router.get('/getfeaturedwoman', getFeaturedWoman);
router.get('/getbestsalesman', getBestSalesMan);
router.get('/getbestsaleswoman', getBestSalesWoman);
router.get('/getNewArrival', getNewArrival);

export default router;
