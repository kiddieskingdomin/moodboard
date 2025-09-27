import React, { useState } from 'react';
import { Car, Fuel, Gauge, Users, Settings, Calendar, Star, ShieldCheck } from 'lucide-react';

const fleetData = [
  {
    id: 1,
    category: 'Executive Sedans',
    model: 'Mercedes-Benz S-Class',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
    price: '$199/day',
    specs: {
      seats: 4,
      transmission: 'Automatic',
      fuel: 'Premium',
      mileage: 'Unlimited',
      year: 2023
    },
    features: [
      'Leather seats',
      'Premium sound system',
      'Climate control',
      'WiFi hotspot',
      'Chauffeur available'
    ],
    rating: 4.9
  },
  {
    id: 2,
    category: 'Luxury SUVs',
    model: 'Range Rover Autobiography',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    price: '$249/day',
    specs: {
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Premium',
      mileage: 'Unlimited',
      year: 2023
    },
    features: [
      'Four-zone climate',
      'Massage seats',
      'Off-road capability',
      'Heated steering wheel',
      'Privacy package'
    ],
    rating: 4.8
  },
  {
    id: 3,
    category: 'Sports Cars',
    model: 'Porsche 911 Carrera',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
    price: '$399/day',
    specs: {
      seats: 2,
      transmission: 'PDK Automatic',
      fuel: 'Premium',
      mileage: '200 mi/day',
      year: 2023
    },
    features: [
      'Sports exhaust',
      'Active suspension',
      'Carbon fiber trim',
      'Track mode',
      'Premium package'
    ],
    rating: 4.9
  },
  {
    id: 4,
    category: 'Luxury Vans',
    model: 'Mercedes-Benz V-Class',
    image: 'https://images.unsplash.com/photo-1622411542984-5b6b6b0a0f1d',
    price: '$229/day',
    specs: {
      seats: 7,
      transmission: 'Automatic',
      fuel: 'Diesel',
      mileage: 'Unlimited',
      year: 2023
    },
    features: [
      'Executive lounge seats',
      'Dual sliding doors',
      'Ambient lighting',
      'Entertainment system',
      'Privacy curtains'
    ],
    rating: 4.7
  },
  {
    id: 5,
    category: 'Electric Vehicles',
    model: 'Tesla Model S Plaid',
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e',
    price: '$279/day',
    specs: {
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Electric',
      mileage: '300 mi/day',
      year: 2023
    },
    features: [
      '1020 hp',
      '0-60 in 1.99s',
      '390 mile range',
      'Premium audio',
      'Full self-driving'
    ],
    rating: 4.9
  },
  {
    id: 6,
    category: 'Limousines',
    model: 'Lincoln Navigator L',
    image: 'https://images.unsplash.com/photo-1592841200221-6534bd9f7976',
    price: '$349/day',
    specs: {
      seats: 10,
      transmission: 'Automatic',
      fuel: 'Premium',
      mileage: 'Unlimited',
      year: 2023
    },
    features: [
      'Extended wheelbase',
      'Premium bar setup',
      'Mood lighting',
      'Privacy partition',
      'Entertainment system'
    ],
    rating: 4.8
  }
];

export default function FleetPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  const categories = ['All', 'Executive Sedans', 'Luxury SUVs', 'Sports Cars', 'Electric Vehicles', 'Limousines', 'Luxury Vans'];

  const filteredFleet = selectedCategory === 'All' 
    ? fleetData 
    : fleetData.filter(vehicle => vehicle.category === selectedCategory);

  const sortedFleet = [...filteredFleet].sort((a, b) => {
    if (sortBy === 'price-low') return parseInt(a.price.slice(1)) - parseInt(b.price.slice(1));
    if (sortBy === 'price-high') return parseInt(b.price.slice(1)) - parseInt(a.price.slice(1));
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // recommended/default
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-black py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-amber-500">Our</span> Premium Fleet
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Experience unmatched luxury with our meticulously maintained collection of premium vehicles
          </p>
        </div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1480')] bg-cover bg-center"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedFleet.map(vehicle => (
            <div key={vehicle.id} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
              <div className="relative">
                <img 
                  src={`${vehicle.image}?auto=format&fit=crop&w=600`} 
                  alt={vehicle.model} 
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {vehicle.rating}
                </div>
                <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-lg">
                  <span className="text-amber-500 font-bold">{vehicle.price}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{vehicle.model}</h3>
                  <span className="text-amber-500 text-sm bg-amber-500/10 px-2 py-1 rounded">
                    {vehicle.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 my-4 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-2 text-amber-500" />
                    {vehicle.specs.seats} seats
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Settings className="h-4 w-4 mr-2 text-amber-500" />
                    {vehicle.specs.transmission}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Fuel className="h-4 w-4 mr-2 text-amber-500" />
                    {vehicle.specs.fuel}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Gauge className="h-4 w-4 mr-2 text-amber-500" />
                    {vehicle.specs.mileage}
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-amber-500 mb-2">FEATURES</h4>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                    {vehicle.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-amber-500 mr-1">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <button className="text-sm text-amber-500 hover:text-amber-400 font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Check availability
                  </button>
                  <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded-lg transition-all">
                    Book now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mt-20 bg-gray-800 rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="text-amber-500">Why</span> Choose Our Fleet
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start">
              <div className="bg-amber-500/10 p-3 rounded-lg mr-4 flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Impeccable Maintenance</h3>
                <p className="text-gray-400">
                  Every vehicle undergoes rigorous 150-point inspections and regular detailing to ensure pristine condition.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-500/10 p-3 rounded-lg mr-4 flex-shrink-0">
                <Star className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Latest Models</h3>
                <p className="text-gray-400">
                  Our fleet is refreshed annually with the newest luxury models featuring cutting-edge technology.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-amber-500/10 p-3 rounded-lg mr-4 flex-shrink-0">
                <Users className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Personalized Service</h3>
                <p className="text-gray-400">
                  Dedicated account managers and 24/7 support ensure a seamless rental experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our concierge service can source any luxury vehicle to meet your specific requirements.
          </p>
          <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3 px-8 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/20">
            Contact Our Specialists
          </button>
        </div>
      </div>
    </div>
  );
}