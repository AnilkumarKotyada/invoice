import  { useState } from "react";
import axios from "axios";

const backendUrl = https://invoice-backend-e3gv.onrender.com;

const GeneratePDF = () => {
  const [htmlContent, setHtmlContent] = useState('');

  const handleGeneratePDF = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/generate-pdf`, { htmlContent }, {
        responseType: 'arraybuffer',
      });

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'generated.pdf'; 
      link.click();

      URL.revokeObjectURL(pdfUrl);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl mb-4">Generate PDF</h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded"
          rows={6}
          placeholder="Enter HTML content here"
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
        />
        <button
          onClick={handleGeneratePDF}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default GeneratePDF;
