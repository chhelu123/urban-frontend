import { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, Clock, DollarSign, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import api from '../api/axios';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.delete(`/admin/orders/${orderId}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete order');
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage orders, users, and monitor business</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition">
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-primary">{stats?.totalOrders || 0}</p>
              </div>
              <Package className="text-primary" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.pendingOrders || 0}</p>
              </div>
              <Clock className="text-orange-600" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats?.completedOrders || 0}</p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">₹{stats?.totalRevenue || 0}</p>
              </div>
              <DollarSign className="text-purple-600" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="flex gap-4 border-b pb-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'orders' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === 'users' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Users ({users.length})
            </button>

          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="mt-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto text-gray-400 mb-4" size={60} />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order #</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address & Location</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Service/Items</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">
                            <button
                              onClick={() => {
                                console.log('=== FULL ORDER DATA ===');
                                console.log('Order:', JSON.stringify(order, null, 2));
                                console.log('Pricing Mode:', order.pricingMode);
                                console.log('Items:', order.items);
                                console.log('Live Location:', order.liveLocation);
                                console.log('Pickup Address:', order.pickupAddress);
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                              className="text-primary hover:text-secondary hover:underline font-semibold"
                            >
                              {order.orderNumber}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div>
                              <p className="font-medium">{order.userId?.name}</p>
                              <p className="text-gray-500 text-xs">{order.userId?.phone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm max-w-md">
                            <div className="space-y-2">
                              {/* Written Address */}
                              {order.pickupAddress?.fullAddress && (
                                <div className="bg-blue-50 p-3 rounded text-xs border border-blue-200">
                                  <p className="font-semibold text-blue-800 mb-2">📝 Written Address:</p>
                                  <div className="bg-white p-2 rounded mb-2">
                                    <p className="text-gray-800 font-medium">{order.pickupAddress.fullAddress}</p>
                                    {order.pickupAddress.landmark && (
                                      <p className="text-gray-600 mt-1">🏷️ Landmark: {order.pickupAddress.landmark}</p>
                                    )}
                                    <p className="text-gray-500 text-xs mt-1">
                                      {order.pickupAddress.area}, {order.pickupAddress.city} - {order.pickupAddress.pincode}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Location Map */}
                              {order.liveLocation && (
                                <div className="bg-green-50 p-3 rounded text-xs border border-green-200">
                                  <p className="font-semibold text-green-800 mb-2">📍 GPS Location:</p>
                                  <div className="rounded overflow-hidden border border-gray-300 mb-2">
                                    <iframe
                                      width="100%"
                                      height="150"
                                      frameBorder="0"
                                      style={{ border: 0 }}
                                      src={`https://www.google.com/maps?q=${order.liveLocation.latitude},${order.liveLocation.longitude}&output=embed`}
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                  <a 
                                    href={`https://www.google.com/maps?q=${order.liveLocation.latitude},${order.liveLocation.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline font-semibold inline-block"
                                  >
                                    🗺️ Open in Google Maps →
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {order.pricingMode === 'per-piece' ? (
                              <div className="space-y-1">
                                <p className="font-semibold text-primary">Per Piece Order</p>
                                {order.items?.slice(0, 3).map((item, i) => (
                                  <p key={i} className="text-xs text-gray-600">
                                    {item.name} x{item.quantity}
                                  </p>
                                ))}
                                {order.items?.length > 3 && (
                                  <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
                                )}
                              </div>
                            ) : (
                              <div>
                                <p className="capitalize">{order.serviceType?.replace('-', ' ')}</p>
                                <p className="text-xs text-gray-600">{order.totalWeight} kg</p>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold">₹{order.totalPrice}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex flex-col gap-2">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs"
                              >
                                <option value="pending">Pending</option>
                                <option value="picked-up">Picked Up</option>
                                <option value="processing">Processing</option>
                                <option value="ready">Ready</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={() => deleteOrder(order._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                        <td className="px-4 py-3 text-sm">{user.email}</td>
                        <td className="px-4 py-3 text-sm">{user.phone}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <div className="grid md:grid-cols-2 gap-6">
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

                <div className="card bg-green-50">
                  <h3 className="font-bold text-lg mb-3">👤 Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Name:</span> {selectedOrder.userId?.name}</p>
                    <p><span className="font-semibold">Email:</span> {selectedOrder.userId?.email}</p>
                    <p><span className="font-semibold">Phone:</span> {selectedOrder.userId?.phone}</p>
                  </div>
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

              {/* Written Address */}
              {selectedOrder.pickupAddress?.fullAddress && (
                <div className="card bg-blue-50">
                  <h3 className="font-bold text-lg mb-3">📝 Written Pickup Address</h3>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{selectedOrder.pickupAddress.fullAddress}</p>
                    {selectedOrder.pickupAddress.landmark && (
                      <p className="text-gray-600 mt-2">🏷️ Landmark: {selectedOrder.pickupAddress.landmark}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-2">
                      {selectedOrder.pickupAddress.area}, {selectedOrder.pickupAddress.city} - {selectedOrder.pickupAddress.pincode}
                    </p>
                  </div>
                </div>
              )}

              {/* Live Location */}
              {selectedOrder.liveLocation && (
                <div className="card bg-green-50">
                  <h3 className="font-bold text-lg mb-3">📍 Live GPS Location</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg text-sm">
                      <p className="text-gray-600 mb-2">{selectedOrder.liveLocation.address}</p>
                      <p className="text-xs text-gray-500">
                        Coordinates: {selectedOrder.liveLocation.latitude.toFixed(6)}, {selectedOrder.liveLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                    
                    <div className="rounded-lg overflow-hidden border-2 border-green-300">
                      <iframe
                        width="100%"
                        height="300"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${selectedOrder.liveLocation.latitude},${selectedOrder.liveLocation.longitude}&output=embed`}
                        allowFullScreen
                      ></iframe>
                    </div>
                    
                    <a
                      href={`https://www.google.com/maps?q=${selectedOrder.liveLocation.latitude},${selectedOrder.liveLocation.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-center block"
                    >
                      🗺️ Open in Google Maps for Navigation
                    </a>
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

              {/* Update Status */}
              <div className="card bg-gray-50">
                <h3 className="font-bold text-lg mb-3">🔄 Update Order Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder._id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value });
                  }}
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="picked-up">Picked Up</option>
                  <option value="processing">Processing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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

export default Admin;
