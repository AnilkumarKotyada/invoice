import Product from "../models/productModel.js";

const addProduct = async (req, res) => {
  const { name, quantity, price } = req.body;

  console.log("User ID from req.user:", req.user?.id);

  try {
    const productTotal = quantity * price;
    const gst = (productTotal * 18) / 100;
    const newProduct = new Product({
      userId: req.user.id, 
      name,
      quantity,
      price,
      total: productTotal,
      gst,
    });
    await newProduct.save();
    return res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { addProduct, getProducts };
