import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from '../assets/background.jpg';
import levitationinfo from '../assets/levitationinfo.png';

const backendUrl = "https://invoice-backend-e3gv.onrender.com";

const AuthFlow = () => {
  const [currentState, setCurrentState] = useState<'Register' | 'Login' | 'AddProduct'>('Register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
        setCurrentState('Login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

      localStorage.setItem("token", response.data.token);

      setCurrentState('AddProduct');
      navigate("/add-product");
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <div className="bg-gray-800 p-4 flex justify-between items-center mb-10">
        <div className="flex items-center">
          <img
            width="141"
            height="48"
            border-radius="5"
            src={levitationinfo}
            alt="Levitation Infotech"
            className="mr-4 mx-10"
          />
        </div>
        <div>
          {currentState === "Register" || currentState === "AddProduct" ? (
            <button
              onClick={() => setCurrentState("Login")}
              className="text-black bg-lime-300 px-4 py-2 rounded-md hover:bg-lime-400 transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => setCurrentState("Register")}
              className="text-black bg-lime-300 px-4 py-2 rounded-md hover:bg-lime-400 transition"
            >
              Register
            </button>
          )}
        </div>
      </div>

      <div className="flex w-full min-h-screen">
        <div className="w-full max-w-md p-6 bg-black text-white rounded-md shadow-md mt-6 mx-6">
          {currentState === 'Register' && (
            <>
              <h1 className="text-3xl mb-2 text-white font-bold">Sign up to begin journey</h1>
              <p className="text-gray-400 mb-6">This is a basic signup page used for levitation assignment purposes.</p>
              {error && <div className="text-red-500 mb-4">{error}</div>}

              <form onSubmit={handleRegister}>
                <label htmlFor="name" className="block text-lg font-medium mb-2 text-gray-300">
                  Enter Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-3 border border-gray-500 bg-gray-800 text-gray-300 rounded-md placeholder-gray-500"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <p className="text-gray-400 mt-0 mb-4">This name will be displayed with your inquiry</p>

                <label htmlFor="email" className="block text-lg font-medium mb-2 text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-3 border border-gray-500 bg-gray-800 text-gray-300 rounded-md placeholder-gray-500"
                  placeholder="Enter Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-gray-400 mt-0 mb-4">This email will be displayed with your inquiry</p>

                <label htmlFor="password" className="block text-lg font-medium mb-2 text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full p-3 border border-gray-500 bg-gray-800 text-white rounded-md placeholder-gray-500"
                  placeholder="Enter the Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-gray-400 mt-0 mb-6">Any further updates will be forwarded on this Email ID</p>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="w-30 py-2 px-4 bg-gray-700 text-lime-300 rounded-md"
                  >
                    Register
                  </button>

                  <div className="text-center">
                    <p>
                      Already have an account?{" "}
                      <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => setCurrentState('Login')}
                      >
                        Login here
                      </span>
                    </p>
                  </div>
                </div>
                <div
                  className="absolute mt-8 top-32 right-0 w-[50%] h-[70%] bg-cover bg-center bg-no-repeat rounded-l-[50px] shadow-lg"
                  style={{ backgroundImage: `url(${backgroundImage})` }} 
                >
                </div>
              </form>
            </>
          )}
          {currentState === 'Login' && (
            <>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center">
                  <img
                    width="141"
                    height="48"
                    src={levitationinfo}
                    alt="Levitation Infotech"
                    className="mr-4 mx-10"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-bold mx-10 mb-4 text-white">Let the Journey Begin!</h2>
              <p className="text-gray-400 mb-8 mx-10">This is basic login page which is used for levitation</p>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleLogin}>
                <label htmlFor="Email" className="block mx-10 text-lg font-medium mb-2 text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full mx-10 p-3 mb-4 border border-neutral-600 bg-stone-900 text-gray-300 rounded-md placeholder-neutral-500"
                  placeholder="Enter Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-gray-400 mx-10 mt-[-2vh] mb-6">This email will be displayed with your inquiry</p>
                <label htmlFor="Password" className="block mx-10 text-lg font-medium mb-2 text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full mx-10 p-3 mb-4 border border-neutral-600 bg-stone-900 text-gray-300 rounded-md placeholder-neutral-500"
                  placeholder="Enter the Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex mt-4 items-start justify-between">
                <button
                  type="submit"
                  className="w-[30%] mx-10 p-3 bg-stone-800 text-lime-300 rounded-md hover:bg-stone-700 transition"
                >
                  Login Now
                </button>
              
              <div className="mt-4 mx-[-5%] text-center">
                <p>
                  Forget password?
                </p>
              </div>
              </div>
              <div
                className="absolute mt-8 top-32 right-0 w-[50%] h-[70%] bg-cover bg-center bg-no-repeat rounded-l-[50px] shadow-lg"
                style={{
                  backgroundImage: `url(https://media.licdn.com/dms/image/v2/D4E22AQGULhoJfZhM3Q/feedshare-shrink_800/feedshare-shrink_800/0/1733117588880?e=2147483647&v=beta&t=f0gPMO1y1rUkzEUE8FZtM6J9C_A7z3dDAjj8_1i8sBo)`
                }}>
              </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;

