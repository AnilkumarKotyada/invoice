import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const AddProductForm = () => {
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const GST_RATE = 0.18;


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(response.data);
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error fetching products:", err.message);
        }
    }
};
    fetchProducts();
  }, [products]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = quantity > 0 && price > 0 ? quantity * price : 0;
    const product = { name, quantity, price, total };

    if (!name || quantity <= 0 || price <= 0) {
      console.error("All fields are required and must be valid.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/products`, product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const newProduct = response.data;
      console.log("Product added successfully:", newProduct);

      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setName("");
      setQuantity(0);
      setPrice(0);
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const getSubtotal = () => {
    return products.reduce((acc, product) => acc + (product.total || 0), 0);
  };
  const getGST = () => {
    return getSubtotal() * GST_RATE;
  };
  const generatePDF = (products, getSubtotal, getGST) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE GENERATOR", pageWidth - 10, 20, { align: "right" });
    doc.setFontSize(10);
    doc.setTextColor(169, 169, 169);
    doc.text("Sample Output should be this", pageWidth - 10, 30, { align: "right" });
    doc.setDrawColor(220, 220, 220);
    const lineStartX = 20;
    const lineStartY = 33;
    const lineEndX = pageWidth - 10;
    doc.setLineWidth(0.5);
    doc.line(lineStartX, lineStartY, lineEndX, lineStartY);

    let yPosition = 40;
    const name = "Name: Customer Name"
    const email = "mail@example.com";
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const headerCornerRadius = 7;
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(20, yPosition, pageWidth - 25, 30, headerCornerRadius, headerCornerRadius, "F");
    doc.setTextColor(255, 255, 255);
    const yOffset = -5;
    doc.setFontSize(12);
    doc.text(name, 20, yPosition + 18 + yOffset);
    const dateWidth = doc.getTextWidth(formattedDate);
    const dateX = pageWidth - 20 - dateWidth;
    doc.text(formattedDate, dateX, yPosition + 18 + yOffset);
    const emailWidth = doc.getTextWidth(email);
    const emailX = pageWidth - 20 - emailWidth;
    doc.text(`Email: ${email}`, emailX, yPosition + 24 + yOffset);
    doc.setTextColor(0, 0, 0);
    yPosition += 40;
    const headerHeight = 12;
    const columnWidth = (pageWidth - 30) / 4;
    const tableCornerRadius = 3;
    doc.setFillColor(0, 0, 0);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(20, yPosition, columnWidth * 4, headerHeight, tableCornerRadius, tableCornerRadius, "F");

    doc.setFontSize(12);
    doc.text("Product Name", 20 + columnWidth / 2, yPosition + headerHeight / 2, { align: "center", baseline: "middle" });
    doc.text("Quantity", 20 + columnWidth * 1.5, yPosition + headerHeight / 2, { align: "center", baseline: "middle" });
    doc.text("Price", 10 + columnWidth * 2.75, yPosition + headerHeight / 2, { align: "center", baseline: "middle" });
    doc.text("Total Amount", 10 + columnWidth * 3.75, yPosition + headerHeight / 2, { align: "center", baseline: "middle" });
    doc.setTextColor(0, 0, 0);
    yPosition += headerHeight + 10;
    doc.setFontSize(10);
    products.forEach((product) => {
      doc.text(product.name, 25, yPosition);
      doc.text(String(product.quantity), 20 + columnWidth * 1.5, yPosition, { align: "right" });
      doc.text(`INR ${product.price.toFixed(2)}`, 20 + columnWidth * 2.75, yPosition, { align: "right" });
      doc.text(`INR ${product.total.toFixed(2)}`, 20 + columnWidth * 3.75, yPosition, { align: "right" });
      yPosition += 10;
    });

    yPosition += 10;
    doc.text(`Total Charges: INR ${getSubtotal().toFixed(2)}`, pageWidth - 20, yPosition, { align: "right" });
    yPosition += 10;
    doc.text(`GST (18%): INR ${getGST().toFixed(2)}`, pageWidth - 20, yPosition, { align: "right" });

    yPosition += 10;
    doc.text(`Total Amount: INR ${(getSubtotal() + getGST()).toFixed(2)}`, pageWidth - 20, yPosition, { align: "right" });

    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${formattedDate}`, 20, yPosition + 10);
    const thankYouYPosition = yPosition + 20;
    doc.setFillColor(0, 0, 0);

    const textWidth = doc.getTextWidth("Thank you for your purchase!") + 10;
    const textX = (pageWidth - textWidth) / 2;

    const cornerRadius = 5;
    doc.roundedRect(textX, thankYouYPosition, textWidth, 10, cornerRadius, cornerRadius, "F");

    doc.setTextColor(255, 255, 255);
    doc.text("Thank you for your purchase!", pageWidth / 2, thankYouYPosition + 7, { align: "center" });

    doc.save("invoice.pdf");
  };


  return (
    <div className="bg-black w-screen flex flex-col">
      <div className="bg-gray-800 p-4 flex justify-between items-center mb-10">
        <div className="flex items-center">
          <img
            width="141"
            height="48"
            src="https://levitation.in/wp-content/uploads/2023/12/Frame-39624.svg"
            alt="Levitation Infotech"
            className="mr-4 mx-10 cursor-pointer"
            onClick={handleLogout}
          />
        </div>
        <button
          onClick={handleLogout}
          className="bg-lime-400 text-white py-2 px-4 rounded hover:bg-lime-500"
        >
          Logout
        </button>
      </div>

      <div className="min-h-screen top-0 left-[10%] max-w-md mt-6 w-full bg-black p-6 rounded-md shadow-md mx-2">
        <h2 className="text-2xl font-bold mb-4 mx-6 text-left text-white">Add Products</h2>
        <p className="mx-6 text-stone-300">
          This is a basic Add Product page used for Levitation assignment purposes.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-24 mx-6 mt-6 mb-4">
            <div className="flex-1">
              <label htmlFor="name" className="block text-lg font-medium text-gray-100">
                Product Name
              </label>
              <input
                type="text"
                className="w-96 max-w-md mb-8 p-3 border border-stone-400 bg-neutral-500 text-white placeholder:text-gray-400 rounded"
                placeholder="Enter the Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="price" className="block mt-[-3%] mb-4 text-lg font-medium text-gray-200">
                Product Price
              </label>
              <input
                type="text"
                className="w-96 max-w-md mt-[-6%] mb-10 p-3 border border-stone-400 bg-neutral-500 text-white placeholder:text-gray-400 rounded"
                placeholder="Enter the price"  // Updated placeholder text
                value={price || ''}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : 0)}
              />
              <div className="flex justify-center mb-[-18%]">
                <button
                  type="submit"
                  className="w-1/2 p-3 bg-stone-600 text-lime-300 rounded text-center flex items-center justify-center space-x-2"
                >
                  <span>Add Product</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 mt-[-14%]">
              <label htmlFor="quantity" className="block text-lg font-medium text-gray-200">
                Quantity
              </label>
              <input
                type="text"
                className="w-96 max-w-md mt-0 mb-[-8%] p-3 border border-stone-400 bg-neutral-500 text-white placeholder:text-gray-400 rounded"
                placeholder="Enter the Quantity"
                value={quantity || ''}
                onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : 0)}

              />
            </div>
          </div>
        </form>

        <div className="mt-24">
          <table className="w-[350%] mx-auto text-white">
            <thead>
              <tr>
                <th className="p-2 border border-stone-600 bg-white text-black flex items-center space-x-2">
                  <span>Product Name</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                    />
                  </svg>
                </th>
                <th className="p-2 border border-stone-600 bg-white text-black text-left">Price</th>
                <th className="p-2 border border-stone-600 bg-white text-black flex items-center space-x-2">
                  <span>Quantity</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                    />
                  </svg>
                </th>
                <th className="p-2 border border-stone-600 bg-white text-black text-left">Total Price</th>
              </tr>
            </thead>
            <>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td className="p-2 border border-stone-600">{product.name}</td>
                    <td className="p-2 border border-stone-600">{product.price}</td>
                    <td className="p-2 border border-stone-600">{product.quantity}</td>
                    <td className="p-2 border border-stone-600">INR {product.total}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} className="p-2 pr-[12%] text-right border border-stone-600">Sub-Total</td>
                  <td className="p-2 border border-stone-600">INR {getSubtotal()}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-2 pr-[12%] border text-right border-stone-600">Inl + GST 18%</td>
                  <td className="p-2 border border-stone-600">INR {getGST()}</td>
                </tr>
              </tbody>
            </>

          </table>
        </div>

        <div className="mt-12 flex justify-end mx-[-125%]">
          <button onClick={(_e) => generatePDF(products, getSubtotal, getGST)} className="w-1/3 p-3 bg-stone-600 text-lime-300 rounded text-center">
            Generate PDF Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
