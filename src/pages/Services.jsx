import { Link } from 'react-router-dom';
import { Sparkles, Shirt, Wind, Droplets, Zap, Package } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Droplets size={48} />,
      title: 'Wash & Dry',
      price: '₹99/kg',
      description: 'Premium machine wash with hygienic tumble dry. Perfect for everyday clothes.',
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
      icon: <Zap size={48} />,
      title: 'Wash & Iron',
      price: '₹149/kg',
      description: 'Complete laundry service with premium steam ironing for a crisp wrinkle-free finish.',
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

  const process = [
    { step: '1', title: 'Book Online', desc: 'Schedule pickup via website or call' },
    { step: '2', title: 'We Pickup', desc: 'Free pickup from your doorstep' },
    { step: '3', title: 'We Clean', desc: 'Professional washing & care' },
    { step: '4', title: 'We Deliver', desc: 'Fresh laundry delivered back' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Professional laundry services tailored to your needs. From everyday wash to premium dry cleaning.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, idx) => (
              <div key={idx} className="card hover:scale-105 transition-transform">
                <div className="text-primary mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-3xl font-bold text-primary mb-4">{service.price}</p>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      {feature}
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

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Additional Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <Shirt className="text-primary mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-2">Special Items</h3>
              <p className="text-gray-600 mb-4">We handle special items with extra care:</p>
              <ul className="space-y-2">
                <li>• Blankets & Comforters - ₹200/piece</li>
                <li>• Bedsheets - ₹100/piece</li>
                <li>• Curtains - Custom pricing</li>
                <li>• Suits & Formal wear - Premium care</li>
              </ul>
            </div>


          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">Book your first order and experience hassle-free laundry</p>
          <Link to="/book" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block">
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
