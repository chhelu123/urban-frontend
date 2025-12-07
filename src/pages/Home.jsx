import { Link } from 'react-router-dom';
import { Sparkles, Clock, Shield, Truck, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    { icon: <Truck size={40} />, title: 'Free Pickup & Delivery', desc: 'Doorstep service within 3km' },
    { icon: <Clock size={40} />, title: '24-48 Hour Turnaround', desc: 'Fast and reliable service' },
    { icon: <Shield size={40} />, title: 'Hygienic Process', desc: 'Professional machine wash' },
    { icon: <Sparkles size={40} />, title: 'Premium Quality', desc: 'Fabric-specific care' }
  ];

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Laundry at Your Doorstep
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Professional laundry service with free pickup & delivery. Your time matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition text-center">
                  Book Now
                </Link>
                <Link to="/pricing" className="border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary transition text-center">
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-green-300" />
                    <span>No queues, no hassle</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-green-300" />
                    <span>Transparent pricing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-green-300" />
                    <span>Real-time tracking</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="text-green-300" />
                    <span>Subscription plans available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="card text-center">
                <div className="text-primary mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Our Services</h2>
          <p className="text-center text-gray-600 mb-12">Choose the service that fits your needs</p>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="card hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <p className="text-3xl font-bold text-primary mb-6">{service.price}</p>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle size={20} className="text-green-500" />
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
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience Hassle-Free Laundry?</h2>
          <p className="text-xl mb-8 text-blue-100">Join hundreds of satisfied customers in Nallasopara</p>
          <Link to="/register" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
