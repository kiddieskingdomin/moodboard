import React from 'react';
import { Briefcase, Users, Clock, Shield, Globe, BarChart, ArrowRight, Star } from 'lucide-react';

export default function CorporatePage() {
  const services = [
    {
      icon: <Briefcase className="h-8 w-8 text-amber-500" />,
      title: "Executive Transportation",
      description: "Discreet, reliable chauffeured services for C-level executives and business leaders",
      features: [
        "24/7 availability",
        "Meet-and-greet service",
        "Real-time flight tracking",
        "Confidentiality guaranteed"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-amber-500" />,
      title: "Team Transfers",
      description: "Comfortable group transportation for corporate events and employee mobility",
      features: [
        "Luxury vans & coaches",
        "Uniformed chauffeurs",
        "Bulk booking discounts",
        "Custom pickup schedules"
      ]
    },
    {
      icon: <Globe className="h-8 w-8 text-amber-500" />,
      title: "Airport Solutions",
      description: "Seamless airport transfers with flight monitoring and wait time flexibility",
      features: [
        "Global airport coverage",
        "VIP terminal access",
        "Baggage assistance",
        "Corporate billing"
      ]
    },
    {
      icon: <BarChart className="h-8 w-8 text-amber-500" />,
      title: "Event Transportation",
      description: "Large-scale transportation solutions for conferences and corporate events",
      features: [
        "Dedicated event coordinators",
        "Branded vehicles available",
        "Attendee tracking system",
        "Multi-day rate packages"
      ]
    }
  ];

  const clients = [
    "Tech Giants Inc.",
    "Global Financial Partners",
    "Premier Consulting Group",
    "Summit Healthcare",
    "Horizon Energy Solutions",
    "Apex Legal Associates"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-black py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-amber-500">Corporate</span> Mobility Solutions
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Premium transportation services designed for businesses that value reliability, discretion, and exceptional service
          </p>
        </div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1480')] bg-cover bg-center"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Value Proposition */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-6">
            <span className="text-amber-500">Why</span> Corporations Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="bg-amber-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Security First</h3>
              <p className="text-gray-400">
                All chauffeurs undergo rigorous background checks and our vehicles feature executive protection packages
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="bg-amber-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">99.7% On-Time</h3>
              <p className="text-gray-400">
                Industry-leading punctuality with real-time tracking and contingency planning
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl p-8">
              <div className="bg-amber-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dedicated Account Management</h3>
              <p className="text-gray-400">
                Your single point of contact for all transportation needs
              </p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-amber-500">Tailored</span> Services
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-start">
                    <div className="mr-6">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                      <p className="text-gray-400 mb-5">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-amber-500 mr-2 mt-1">•</span>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-8 py-4 flex justify-between items-center">
                  <span className="text-sm text-gray-400">Custom solutions available</span>
                  <button className="text-amber-500 hover:text-amber-400 font-medium flex items-center group">
                    Learn more
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Logos */}
        <div className="mb-20">
          <h3 className="text-xl text-center text-gray-400 mb-8">TRUSTED BY LEADING COMPANIES</h3>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {clients.map((client, index) => (
              <div key={index} className="text-xl font-medium text-gray-300 hover:text-white transition-colors">
                {client}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to elevate your corporate travel?</h2>
              <p className="text-lg mb-8">
                Our mobility specialists will design a custom solution for your organization
              </p>
              <button className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors">
                Request Corporate Proposal
              </button>
            </div>
            <div className="hidden md:block bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800')] bg-cover bg-center"></div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-amber-500">Client</span> Testimonials
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Matrika Mobility has transformed how we handle executive transportation. Their reliability allows us to focus on business.",
                author: "Sarah Chen, CFO Tech Giants Inc.",
                rating: 5
              },
              {
                quote: "The airport transfer solution saved us 12% in travel costs while improving our executives' experience.",
                author: "Michael Rodriguez, Travel Manager",
                rating: 5
              },
              {
                quote: "For our annual conference, their team moved 300+ attendees flawlessly. Absolute professionals.",
                author: "David Park, Event Director",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
                <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                <p className="text-gray-400">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}