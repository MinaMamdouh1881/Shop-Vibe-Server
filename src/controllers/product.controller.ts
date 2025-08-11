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
      res.status(200).json({ success: true, products });
      return;
    }

    if (
      typeof category === 'string' &&
      validcategories.includes(category.trim())
    ) {
      const products = await Products.find({
        gender,
        category: category.trim(),
      }).select('name price image description');
      res.status(200).json({ success: true, products });
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
    const product = await Products.findById(id).select(
      '-createdAt -updatedAt -__v -sales'
    );
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
    const products = await Products.find({
      featured: true,
      gender: 'men',
    }).select('name price image description');
    res.status(200).json({ success: true, products });
    return;
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
    const products = await Products.find({
      featured: true,
      gender: 'women',
    }).select('name price image description');
    res.status(200).json({ success: true, products });
    return;
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
    const products = await Products.find({ sales: { $gt: 0 }, gender: 'men' })
      .select('name price image description')
      .sort({ sales: -1 })
      .limit(20);
    res.status(200).json({ success: true, products });
    return;
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
    const products = await Products.find({ sales: { $gt: 0 }, gender: 'women' })
      .select('name price image description')
      .sort({ sales: -1 })
      .limit(20);
    res.status(200).json({ success: true, products });
    return;
  } catch (error) {
    console.log('Error while getting featured products in man', error);
    res
      .status(500)
      .json({ error: 'internal error in getting featured products in man' });
    return;
  }
}

//Get New Arrival Product
export async function getNewArrival(req: Request, res: Response) {
  try {
    const pants = await Products.find({ category: 'pants' })
      .sort({
        updatedAt: -1,
      })
      .limit(3)
      .select('name price image description');
    const shoes = await Products.find({ category: 'shoes' })
      .sort({
        updatedAt: -1,
      })
      .limit(3)
      .select('name price image description');
    const shirt = await Products.find({ category: 'shirt' })
      .sort({
        updatedAt: -1,
      })
      .limit(3)
      .select('name price image description');
    const tShirt = await Products.find({ category: 't-shirt' })
      .sort({
        updatedAt: -1,
      })
      .limit(3)
      .select('name price image description');
    const skirt = await Products.find({ category: 'skirt' })
      .sort({
        updatedAt: -1,
      })
      .limit(3)
      .select('name price image description');
    const heels = await Products.find({ category: 'heels' })
      .sort({
        updatedAt: -1,
      })
      .limit(2)
      .select('name price image description');
    const blouse = await Products.find({ category: 'blouse' })
      .sort({
        updatedAt: -1,
      })
      .limit(3)
      .select('name price image description');
    res.status(200).json({
      success: true,
      products: [
        ...shoes,
        ...pants,
        ...shirt,
        ...tShirt,
        ...skirt,
        ...heels,
        ...blouse,
      ],
    });
    return;
  } catch (error) {
    console.log('Error while getting featured products in man', error);
    res
      .status(500)
      .json({ error: 'internal error in getting featured products in man' });
    return;
  }
}
