import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import api from '../api/axios';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: <Package /> },
    { key: 'picked-up', label: 'Picked Up', icon: <Truck /> },
    { key: 'processing', label: 'Processing', icon: <Clock /> },
    { key: 'ready', label: 'Ready', icon: <CheckCircle /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle /> }
  ];

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setOrder(null);

    try {
      const { data } = await api.get(`/orders/track/${orderNumber}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h2>
          <p className="text-gray-600">Enter your order number to track status</p>
        </div>

        <div className="card mb-8">
          <form onSubmit={handleTrack} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                required
                className="input-field pl-10"
                placeholder="Enter Order Number (e.g., UW1234567890)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-4">
              {error}
            </div>
          )}
        </div>

        {order && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Order #{order.orderNumber}</h3>
                  <p className="text-gray-600">
                    Service: <span className="font-semibold">{order.serviceType}</span>
                  </p>
                  <p className="text-gray-600">
                    Weight: <span className="font-semibold">{order.totalWeight} kg</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">₹{order.totalPrice}</p>
                  <p className="text-sm text-gray-600">Total Amount</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Pickup Date</p>
                  <p className="font-semibold">{new Date(order.pickupDate).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Expected Delivery</p>
                  <p className="font-semibold">{new Date(order.deliveryDate).toLocaleString()}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative">
                <div className="flex justify-between items-center">
                  {statusSteps.map((step, idx) => {
                    const currentIndex = getStatusIndex(order.status);
                    const isCompleted = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div key={step.key} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                              isCompleted
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}
                          >
                            {step.icon}
                          </div>
                          <p
                            className={`text-xs text-center font-medium ${
                              isCompleted ? 'text-primary' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                        {idx < statusSteps.length - 1 && (
                          <div
                            className={`absolute top-6 left-1/2 w-full h-0.5 ${
                              idx < currentIndex ? 'bg-primary' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="card">
                <h4 className="font-semibold mb-2">Special Instructions</h4>
                <p className="text-gray-600">{order.specialInstructions}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
