import puppeteer from "puppeteer";
import Product from "../models/productModel.js";


const generateInvoice = async (req, res) => {
  const { userId, products } = req.body;

  try {
    const savedProducts = [];
    for (const product of products) {
      const savedProduct = new Product({ ...product, userId });
      await savedProduct.save();
      savedProducts.push(savedProduct);
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(`
      <h1>Invoice</h1>
      <p>User ID: ${userId}</p>
      <ul>
        ${savedProducts
          .map(
            (product) => `
          <li>${product.name}: ${product.quantity} x ${product.rate} = ${product.total}</li>`
          )
          .join("")}
      </ul>
      <p>Total GST: ${savedProducts.reduce((acc, product) => acc + product.gst, 0)}</p>
    `);

    const pdfBuffer = await page.pdf();
    await browser.close();
    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export{ generateInvoice };
