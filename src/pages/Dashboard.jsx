import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, subRes] = await Promise.all([
        api.get('/orders/my-orders'),
        api.get('/subscriptions/my-subscription')
      ]);
      setOrders(ordersRes.data);
      setSubscription(subRes.data);
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'picked-up': 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Manage your orders and subscriptions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-primary">{orders.length}</p>
              </div>
              <Package className="text-primary" size={40} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Active Orders</p>
                <p className="text-3xl font-bold text-blue-600">
                  {orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length}
                </p>
              </div>
              <Clock className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={40} />
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        {subscription && subscription.status === 'active' && (
          <div className="card bg-gradient-to-br from-primary to-secondary text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 capitalize">{subscription.plan} Plan</h3>
                <p className="text-blue-100 mb-4">Active until {new Date(subscription.endDate).toLocaleDateString()}</p>
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-sm text-blue-100">Total KG</p>
                    <p className="text-2xl font-bold">{subscription.totalKg} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Used</p>
                    <p className="text-2xl font-bold">{subscription.usedKg} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Remaining</p>
                    <p className="text-2xl font-bold">{subscription.remainingKg} kg</p>
                  </div>
                </div>
              </div>
              <TrendingUp size={60} />
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link to="/book" className="btn-primary">
              New Order
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={60} />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <Link to="/book" className="btn-primary inline-block">
                Place Your First Order
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order #</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Weight</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="text-primary hover:text-secondary hover:underline font-semibold"
                        >
                          {order.orderNumber}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">{order.serviceType.replace('-', ' ')}</td>
                      <td className="px-4 py-3 text-sm">{order.totalWeight} kg</td>
                      <td className="px-4 py-3 text-sm font-semibold">₹{order.totalPrice}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="card bg-blue-50">
                <h3 className="font-bold text-lg mb-3">📦 Order Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Order #:</span> {selectedOrder.orderNumber}</p>
                  <p><span className="font-semibold">Status:</span> 
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p><span className="font-semibold">Pricing Mode:</span> {selectedOrder.pricingMode === 'per-piece' ? 'Per Piece' : 'Per KG'}</p>
                  <p><span className="font-semibold">Total Price:</span> <span className="text-primary font-bold text-lg">₹{selectedOrder.totalPrice}</span></p>
                  <p><span className="font-semibold">Created:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Items/Service Details */}
              <div className="card bg-purple-50">
                <h3 className="font-bold text-lg mb-3">🛍️ Order Items</h3>
                {selectedOrder.pricingMode === 'per-piece' ? (
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-medium">{item.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">Qty: {item.quantity}</span>
                          <span className="text-primary font-bold">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg">
                    <p><span className="font-semibold">Service:</span> {selectedOrder.serviceType?.replace('-', ' ').toUpperCase()}</p>
                    <p><span className="font-semibold">Weight:</span> {selectedOrder.totalWeight} kg</p>
                  </div>
                )}
              </div>

              {/* Pickup Schedule */}
              <div className="card bg-yellow-50">
                <h3 className="font-bold text-lg mb-3">📅 Pickup & Delivery</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Pickup Date:</p>
                    <p>{new Date(selectedOrder.pickupDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Expected Delivery:</p>
                    <p>{new Date(selectedOrder.deliveryDate).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Pickup Address */}
              {selectedOrder.pickupAddress?.fullAddress && (
                <div className="card bg-blue-50">
                  <h3 className="font-bold text-lg mb-3">📍 Pickup Address</h3>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{selectedOrder.pickupAddress.fullAddress}</p>
                    {selectedOrder.pickupAddress.landmark && (
                      <p className="text-gray-600 mt-2">🏷️ Landmark: {selectedOrder.pickupAddress.landmark}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <div className="card bg-orange-50">
                  <h3 className="font-bold text-lg mb-3">📋 Special Instructions</h3>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-700">{selectedOrder.specialInstructions}</p>
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="card bg-green-50">
                <h3 className="font-bold text-lg mb-3">💵 Payment</h3>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-green-700">Pay After Delivery</p>
                  <p className="text-sm text-gray-600">Cash on Delivery / UPI on Delivery</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4">
              <button
                onClick={() => setShowOrderModal(false)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
