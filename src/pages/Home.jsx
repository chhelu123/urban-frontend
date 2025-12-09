import { Link } from 'react-router-dom';
import { Sparkles, Clock, Shield, Truck, CheckCircle, Star, Award, Users, Phone } from 'lucide-react';

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
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-secondary text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Award className="mr-2" size={20} />
              <span className="text-sm font-semibold">Trusted by 1000+ Happy Customers</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Premium Laundry<br />Delivered to Your Door
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Professional care for your clothes. Free pickup & delivery in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/book" className="bg-white text-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-2xl hover:shadow-xl transform hover:scale-105 text-center">
                Book Now - Pay After Delivery
              </Link>
              <Link to="/pricing" className="border-2 border-white bg-white/10 backdrop-blur-sm px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition text-center">
                View Pricing
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">1000+</div>
                <div className="text-sm text-blue-200">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">24hr</div>
                <div className="text-sm text-blue-200">Fast Delivery</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#FCD34D" className="text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-blue-200">5-Star Rated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose UrbanWash?</h2>
            <p className="text-xl text-gray-600">Professional service you can trust</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group hover:shadow-2xl transition-all duration-300 bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:border-primary">
                <div className="text-primary mb-4 flex justify-center transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Professional care for every fabric</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-primary">
                <div className="bg-gradient-to-br from-primary to-secondary p-6 text-white">
                  <h3 className="text-3xl font-bold mb-2">{service.name}</h3>
                  <p className="text-4xl font-bold">{service.price}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/book" className="btn-primary w-full text-center block text-lg py-4">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Trusted by families across Nallasopara</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', review: 'Best laundry service! Always on time and clothes smell amazing.', rating: 5 },
              { name: 'Rahul Patel', review: 'Professional service and great pricing. Highly recommended!', rating: 5 },
              { name: 'Anjali Desai', review: 'Love the doorstep pickup. Saves so much time!', rating: 5 }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-100">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#FCD34D" className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Experience Premium Laundry Care?</h2>
          <p className="text-xl mb-8 text-blue-100">Join 1000+ satisfied customers • Free pickup & delivery • Pay after delivery</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-2xl inline-block">
              Get Started Today
            </Link>
            <a href="tel:+919876543210" className="border-2 border-white bg-white/10 backdrop-blur-sm px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition inline-flex items-center justify-center">
              <Phone className="mr-2" size={20} />
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
