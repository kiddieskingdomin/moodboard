import { useState, useEffect } from "react";
import { FiX, FiCheck, FiInfo, FiStar, FiShoppingCart } from "react-icons/fi";

const ProductEnquiryForm = ({ product, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    color: "",
    quantity: 1
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        color: product.colorOptions?.value?.[0] || "",
        quantity: 1
      });
      setSubmitted(false);
      setErrors({});
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    // Validate color for Alphabet category
    if (product.category === "Alphabet" && !formData.color) {
      newErrors.color = "Please select a color";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log("Enquiry submitted:", {
        ...formData,
        product: product.title,
        productId: product.id
      });
      
      setSubmitted(true);
      
      // Reset form after successful submission (optional)
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          color: product.colorOptions?.value?.[0] || "",
          quantity: 1
        });
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-pink-300 to-pink-400 p-4 rounded-t-2xl text-white relative">
          <h2 className="text-xl font-bold text-center">Enquire About This Product</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 p-1 rounded-full hover:bg-pink-500 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Form Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <FiCheck size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-6">
                Your enquiry has been submitted successfully. We'll get back to you soon.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-pink-300 text-white rounded-md hover:bg-pink-400 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Product Info */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-200">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{product.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full text-xs">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex text-amber-400 mr-2">
                      <FiStar className="fill-amber-400" />
                      <FiStar className="fill-amber-400" />
                      <FiStar className="fill-amber-400" />
                      <FiStar className="fill-amber-400" />
                      <FiStar className="fill-amber-400" />
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  <div className="mt-2 font-semibold text-pink-500">
                    {product.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Quantity Field */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                {/* Color Selection (only for Alphabet category) */}
                {product.category === "Alphabet" && product.colorOptions && (
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Color *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {product.colorOptions.value.map((color) => (
                        <div
                          key={color}
                          className={`relative border rounded-lg p-3 text-center cursor-pointer transition-all ${
                            formData.color === color
                              ? "border-pink-500 bg-pink-50 ring-2 ring-pink-200"
                              : "border-gray-300 hover:border-pink-300"
                          }`}
                          onClick={() => setFormData({...formData, color})}
                        >
                          <div
                            className="w-4 h-4 rounded-full mx-auto mb-2"
                            style={{
                              backgroundColor:
                                color === "Lavender" ? "#E6E6FA" :
                                color === "Mint Green" ? "#98FB98" :
                                color === "Teal" ? "#008080" :
                                color === "Baby Pink" ? "#F4C2C2" :
                                color === "Princess Pink" ? "#F8C8DC" :
                                color === "Light Blue" ? "#ADD8E6" : "#ccc"
                            }}
                          ></div>
                          <span className="text-xs font-medium">{color}</span>
                        </div>
                      ))}
                    </div>
                    {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color}</p>}
                  </div>
                )}

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Tell us about your requirements or any questions you have..."
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-sm text-blue-700 border border-blue-100">
                  <FiInfo size={18} className="mt-0.5 flex-shrink-0" />
                  <p>We'll contact you within 24 hours to discuss your requirements.</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-300 to-pink-400 text-white font-semibold rounded-lg hover:from-pink-400 hover:to-pink-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FiShoppingCart size={18} />
                  Submit Enquiry
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEnquiryForm;