'use client'

import React, { useState } from 'react';

const EmployeeLogin = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock login logic (replace with your API call)
    console.log('Employee ID:', employeeId);
    console.log('Password:', password);

    // Reset the form
    setEmployeeId('');
    setPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Dealer Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-600 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              placeholder="Enter your Employee ID"
              className="w-full px-4 py-2 border rounded-lg text-white focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg text-white focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 my-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Login
          </button>
            <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 my-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLogin;
