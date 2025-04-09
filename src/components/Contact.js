import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation links */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-900"
        >
          Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 py-8 px-6 sm:px-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Contact SwiftAssist</h1>
            <p className="mt-2 text-blue-100 max-w-2xl">
              We're here to help. Reach out to us with any questions about our services.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
            {/* Company Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">About Us</h2>
              <div className="prose max-w-none text-gray-600 space-y-4">
                <p>
                  SwiftAssist is a leading provider of AI-powered customer support solutions. 
                  Founded in 2023, we're on a mission to help businesses deliver exceptional 
                  customer experiences through intelligent automation.
                </p>
                <p>
                  Our platform enables businesses of all sizes to provide instant, 24/7 
                  support to their customers, reducing wait times and increasing satisfaction.
                </p>
                <p>
                  We believe in the power of AI to transform customer service, but we also 
                  know that the human touch is irreplaceable. That's why our solutions are 
                  designed to complement human agents, not replace them.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-3">
                      1
                    </span>
                    <span><strong>Customer First:</strong> We prioritize customer needs in everything we build.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-3">
                      2
                    </span>
                    <span><strong>Innovation:</strong> We continuously explore new technologies to improve our solutions.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-3">
                      3
                    </span>
                    <span><strong>Transparency:</strong> We believe in open communication with our customers.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-3">
                      4
                    </span>
                    <span><strong>Security:</strong> We prioritize data security and privacy in all our operations.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              
              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Email */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                      <p className="mt-1 text-gray-600">For general inquiries and support</p>
                      <a href="mailto:support@swiftassist.com" className="mt-2 inline-block text-blue-600 font-medium hover:text-blue-800">
                        support@swiftassist.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                      <p className="mt-1 text-gray-600">Monday to Friday, 9am - 5pm EST</p>
                      <a href="tel:+18004567890" className="mt-2 inline-block text-blue-600 font-medium hover:text-blue-800">
                        +1 (800) 456-7890
                      </a>
                    </div>
                  </div>
                </div>

                {/* Office */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Visit Us</h3>
                      <p className="mt-1 text-gray-600">Our headquarters</p>
                      <address className="mt-2 not-italic text-blue-600">
                        123 Innovation Drive<br />
                        Suite 400<br />
                        San Francisco, CA 94103
                      </address>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900">Weekdays</h4>
                      <p className="text-gray-600">9:00 AM - 5:00 PM</p>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900">Weekends</h4>
                      <p className="text-gray-600">Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 sm:px-10">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} SwiftAssist. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;