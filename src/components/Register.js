import React from 'react';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center">
      <div className="max-w-xl w-full px-6 py-16 bg-white bg-opacity-90 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact our sales team if you're interested, thanks!</h1>
        <p className="text-lg text-gray-600 mb-8">We're not accepting new registrations at this time.</p>
        <a href="mailto:sales@example.com" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Contact Sales</a>
      </div>
    </div>
  );
};

export default Register;
