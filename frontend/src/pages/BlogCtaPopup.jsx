import { useState } from 'react';

const CTAWithPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setIsOpen(false);
  };

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* CTA Button */}
      <div className="text-center my-12">
        <button
          onClick={openPopup}
          className="px-6 py-3 bg-pink-300 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-300 hover:bg-pink-400"
        >
          Join Our Community
        </button>
      </div>

      {/* Popup Form */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Subscribe to Our Newsletter</h2>
              <button
                onClick={closePopup}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            {/* Description */}
            <div className="flex-shrink-0 px-6 py-4">
              <p className="text-gray-600">Stay updated with our latest products, tips, and more.</p>
            </div>

            {/* Scrollable form content */}
            <div className="flex-grow overflow-y-auto px-6 pb-6">
              <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                {/* Name Input */}
                <label htmlFor="name" className="text-base font-medium text-gray-700">
                  Your Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 transition duration-300"
                />

                {/* Email Input */}
                <label htmlFor="email" className="text-base font-medium text-gray-700">
                  Your Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 transition duration-300"
                />

                {/* Message Input */}
                <label htmlFor="message" className="text-base font-medium text-gray-700">
                  Your Message:
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message"
                  rows="4"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 transition duration-300"
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  className="px-6 py-3 bg-pink-300 text-white rounded-md shadow-md transition-all duration-300 hover:bg-pink-400 mt-4"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CTAWithPopup;