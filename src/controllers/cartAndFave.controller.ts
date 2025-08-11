import { Response, Request } from 'express';
import User from '../modules/user.schema';
import { TokenPayload } from '../middlewares/verifyToken';

export async function saveCart(req: Request, res: Response) {
  const user = req.user as TokenPayload;
  const { cart } = req.body;

  try {
    if (cart.length > 0) {
      await User.findByIdAndUpdate(user.id, { myCart: cart });
      res
        .status(200)
        .json({ success: true, message: 'Cart Save Successfully' });
      return;
    }
    res.status(400).json({ success: false, message: 'No items in the cart' });
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
export async function saveFav(req: Request, res: Response) {
  const user = req.user as TokenPayload;
  const { fav }: { fav: string[] } = req.body;
  console.log(user);
  console.log(fav);
  

  try {
    if (fav.length > 0) {
      await User.findByIdAndUpdate(user.id, { myFavorites: fav });
      res
        .status(200)
        .json({ success: true, message: 'My Favorites Saved Successfully' });
      return;
    }
    res
      .status(400)
      .json({ success: false, message: 'No items in My Favorites' });
    return;
  } catch (error) {
    console.log('Error saving My Favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save My Favorites',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return;
  }
}

// import { Response, Request } from 'express';
// import User from '../modules/user.schema';
// import { TokenPayload } from '../middlewares/verifyToken';

// export async function saveCart(req: Request, res: Response) {
//   const user = req.user as TokenPayload;
//   const { cart } = req.body;

//   try {
//     if (user && cart) {
//       const updatedUser = await User.findByIdAndUpdate(user.id, {
//         myCart: cart,
//       });

//       if (!updatedUser) {
//         res.status(404).json({ success: false, message: 'User not found' });
//         return;
//       }

//       res.status(200).json({
//         success: true,
//         message: 'Cart saved successfully',
//         cart: updatedUser.myCart,
//       });
//       return;
//     } else {
//       res.status(400).json({ success: false, message: 'Invalid request data' });
//       return;
//     }
//   } catch (error) {
//     console.error('Error saving cart:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to save cart',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     });
//     return;
//   }
// }
// export async function saveFav(req: Request, res: Response) {
//   res.status(200).json({ success: true, message: 'Hi saveFav' });
//   return;
// }
