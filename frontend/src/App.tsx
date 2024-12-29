import {  Route, Routes, BrowserRouter } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import AddProductPage from './pages/AddProductPage';
import GeneratePDFPage from './pages/GeneratePDFPage';
import AuthFlow from './components/RegistrationForm';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthFlow />} />
        <Route path='/login' element={<AuthFlow />} />  
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/generate-pdf" element={<GeneratePDFPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
