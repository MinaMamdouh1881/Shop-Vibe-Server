import { Response, Request } from 'express';
import { TokenPayload } from '../middlewares/verifyToken';
import Cart from '../modules/cart.schema';
import WishList from '../modules/wishlist.schema';

//SAVE CART
export async function saveCart(req: Request, res: Response) {
  const user = req.user as TokenPayload;
  const { items } = req.body;

  try {
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const newCart = await Cart.findOneAndUpdate(
      { user: user.id },
      { items },
      { new: true }
    ).populate('items.product', 'name price image');

    res.status(200).json({
      success: true,
      message: 'Cart Save Successfully',
      cart: newCart.items,
    });
    return;
  } catch (error) {
    console.log('Error saving cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return;
  }
}
//SAVE WISHLIST
export async function saveFav(req: Request, res: Response) {
  const user = req.user as TokenPayload;
  const { items } = req.body;

  try {
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const newWishList = await WishList.findOneAndUpdate(
      { user: user.id },
      { items },
      { new: true }
    ).populate('items', 'name price image');
    res.status(200).json({
      success: true,
      message: 'Wish List Saved Successfully',
      wishList: newWishList.items,
    });
    return;
  } catch (error) {
    console.log('Error saving Wish List:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save Wish List',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return;
  }
}