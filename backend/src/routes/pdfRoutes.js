import express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.post('/generate-pdf', async (req, res) => {
  const htmlContent = req.body.htmlContent; 

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent); 
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send({ error: 'Failed to generate PDF' });
  }
});

export default router;
