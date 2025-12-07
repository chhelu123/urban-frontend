import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Pricing = () => {
  const services = [
    { 
      name: 'Wash + Dry', 
      price: '₹99/kg', 
      features: [
        'Premium machine wash', 
        'Hygienic tumble dry', 
        'Soft fabric finish', 
        '24hr doorstep delivery',
        'Free Pickup & Delivery',
        'Fresh sealed packaging'
      ] 
    },
    { 
      name: 'Wash + Iron', 
      price: '₹149/kg', 
      features: [
        'Premium machine wash', 
        'Steam ironing', 
        'Crisp wrinkle-free finish', 
        '24hr doorstep delivery',
        'Free Pickup & Delivery',
        'Fresh sealed packaging'
      ] 
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Pay Per Use Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Choose what works best for you</p>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8">Pay Per Use</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="card hover:scale-105 transition-transform">
                <h4 className="text-2xl font-bold mb-2">{service.name}</h4>
                <p className="text-4xl font-bold text-primary mb-6">{service.price}</p>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/book" className="btn-primary w-full text-center block">
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>



        {/* Additional Info */}
        <div className="card bg-primary text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Free Pickup & Delivery</h3>
          <p className="text-lg mb-6">Within 3km radius • No hidden charges • Transparent pricing</p>
          <Link to="/book" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
