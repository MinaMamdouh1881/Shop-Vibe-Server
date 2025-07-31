import { Request, Response } from 'express';
import Products from '../modules/products.schema';
import blouse from '../../public/blouse.json';
import heels from '../../public/heels.json';
import pants from '../../public/pants.json';
import shirt from '../../public/shirt.json';
import shoes from '../../public/shoes.json';
import skirt from '../../public/skirt.json';
import tShirt from '../../public/t-shirt.json';
import mongoose from 'mongoose';

//to add all products i have for once
export async function addAll(req: Request, res: Response) {
  //delete all product
  // try {
  //   await Products.deleteMany();
  //   res.status(200).json({ msg: 'All product deleted successfully' });
  //   return;
  // }

  //add All

  try {
    const existingProducts = await Products.find();
    if (existingProducts.length > 0) {
      res
        .status(400)
        .json({ error: 'Sorry You have already add all products' });
      return;
    }
    await Products.insertMany([
      ...blouse,
      ...heels,
      ...pants,
      ...shirt,
      ...shoes,
      ...skirt,
      ...tShirt,
    ]);
    res.status(201).json({ msg: 'All product added successfully' });
    return;
  } catch (error) {
    console.log('Error while adding products ', error);
    res.status(500).json({ error: 'internal error in adding products' });
    return;
  }
}

//Get Products
export async function getProducts(req: Request, res: Response) {
  const validGenras = ['women', 'men'];
  const validcategories = [
    'shoes',
    'pants',
    'shirt',
    't-shirt',
    'skirt',
    'heels',
    'blouse',
  ];
  const { gender } = req.params;
  const { category } = req.query;

  if (!validGenras.includes(gender)) {
    res.status(404).json({ success: false, error: 'Not Found' });
    return;
  }

  try {
    if (!category) {
      const products = await Products.find({ gender });
      res.status(404).json({ success: true, products });
      return;
    }

    if (
      typeof category === 'string' &&
      validcategories.includes(category.trim())
    ) {
      const products = await Products.find({
        gender,
        category: category.trim(),
      });
      res.status(404).json({ success: true, products });
      return;
    }

    res.status(400).json({ success: false, error: 'select valid category' });
    return;
  } catch (error) {
    console.log('Error while Getting products ', error);
    res.status(500).json({ error: 'internal error in Getting products' });
    return;
  }
}

//Get Product By ID
export async function getProductByID(req: Request, res: Response) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, error: 'Invalid Product ID' });
    return;
  }

  try {
    const product = await Products.findById(id);
    if (!product) {
      res.status(404).json({ success: false, error: 'Product Not Found' });
      return;
    }
    res.status(200).json({ success: true, product });
    return;
  } catch (error) {
    console.log('Error while getting products by id ', error);
    res.status(500).json({ error: 'internal error in getting products' });
    return;
  }
}

// Get featured In Man
export async function getFeaturedMan(req: Request, res: Response) {
  try {
    const products = await Products.find({ featured: true, gender: 'men' });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log('Error while getting featured products in man', error);
    res
      .status(500)
      .json({ error: 'internal error in getting featured products in man' });
    return;
  }
}

// Get featured In Man
export async function getFeaturedWoman(req: Request, res: Response) {
  try {
    const products = await Products.find({ featured: true, gender: 'women' });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log('Error while getting featured products in man', error);
    res
      .status(500)
      .json({ error: 'internal error in getting featured products in man' });
    return;
  }
}

// Get best sales In Man
export async function getBestSalesMan(req: Request, res: Response) {
  try {
    // const products = await Products.find({ featured: true, gender: 'women' });
    const products = await Products.find({ sales: { $gt: 0 }, gender: 'men' })
      .sort({ sales: -1 })
      .limit(20);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log('Error while getting featured products in man', error);
    res
      .status(500)
      .json({ error: 'internal error in getting featured products in man' });
    return;
  }
}
// Get best sales In Woman
export async function getBestSalesWoman(req: Request, res: Response) {
  try {
    // const products = await Products.find({ featured: true, gender: 'women' });
    const products = await Products.find({ sales: { $gt: 0 }, gender: 'women' })
      .sort({ sales: -1 })
      .limit(20);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log('Error while getting featured products in man', error);
    res
      .status(500)
      .json({ error: 'internal error in getting featured products in man' });
    return;
  }
}
