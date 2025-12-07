import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, MapPin, Plus, Minus, Trash2 } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const BookNow = () => {
  const [pricingMode, setPricingMode] = useState('per-kg'); // 'per-kg' or 'per-piece'
  const [formData, setFormData] = useState({
    serviceType: 'wash-iron',
    totalWeight: '',
    pickupDate: '',
    specialInstructions: '',
    pickupAddress: {
      fullAddress: '',
      landmark: ''
    }
  });
  
  // Per-piece items
  const [selectedItems, setSelectedItems] = useState([]);
  
  const [liveLocation, setLiveLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [useRegisteredAddress, setUseRegisteredAddress] = useState(true);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  // Item categories with prices
  const itemCategories = {
    clothing: [
      { name: 'Shirt (Ironed)', price: 29 },
      { name: 'T-Shirt (Ironed)', price: 25 },
      { name: 'Pant/Trousers', price: 49 },
      { name: 'Jeans', price: 59 },
      { name: 'Kurta/Kurti', price: 49 },
      { name: 'Formal Blazer', price: 149 },
      { name: 'Saree - Normal', price: 99 },
      { name: 'Saree - Premium', price: 149 }
    ],
    household: [
      { name: 'Bedsheet (Any size)', price: 99 },
      { name: 'Blanket (Single)', price: 149 },
      { name: 'Blanket (Double)', price: 199 },
      { name: 'Comforter / Quilt', price: 199 },
      { name: 'Pillow Cover', price: 19 },
      { name: 'Curtains', price: 149, unit: 'kg' }
    ],
    shoes: [
      { name: 'Normal Cleaning', price: 249, unit: 'pair' },
      { name: 'Premium Deep Clean', price: 349, unit: 'pair' },
      { name: 'White Sneaker Special', price: 399, unit: 'pair' }
    ]
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedItems, formData.totalWeight, formData.serviceType, pricingMode]);

  const calculateTotalPrice = () => {
    if (pricingMode === 'per-piece') {
      const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setCalculatedPrice(total);
    } else {
      // Per kg pricing
      const weight = parseFloat(formData.totalWeight) || 0;
      const pricePerKg = formData.serviceType === 'wash-dry' ? 99 : 149;
      setCalculatedPrice(weight * pricePerKg);
    }
  };

  const addItem = (item) => {
    const existingItem = selectedItems.find(i => i.name === item.name);
    if (existingItem) {
      setSelectedItems(selectedItems.map(i => 
        i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemName, change) => {
    setSelectedItems(selectedItems.map(item => {
      if (item.name === itemName) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (itemName) => {
    setSelectedItems(selectedItems.filter(item => item.name !== itemName));
  };

  const getLiveLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            setLiveLocation({
              latitude,
              longitude,
              address: data.display_name,
              timestamp: new Date()
            });
          } catch (err) {
            setLiveLocation({
              latitude,
              longitude,
              address: `Lat: ${latitude}, Lng: ${longitude}`,
              timestamp: new Date()
            });
          }
          setLocationLoading(false);
        },
        (error) => {
          setError('Unable to get location. Please enable location services.');
          setLocationLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!liveLocation) {
      setError('Please allow location access to proceed');
      return;
    }

    if (pricingMode === 'per-piece' && selectedItems.length === 0) {
      setError('Please add at least one item');
      return;
    }

    if (pricingMode === 'per-kg' && !formData.totalWeight) {
      setError('Please enter weight');
      return;
    }

    if (!useRegisteredAddress && !formData.pickupAddress.fullAddress) {
      setError('Please enter complete pickup address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const orderData = {
        pricingMode,
        serviceType: pricingMode === 'per-piece' ? 'per-piece' : formData.serviceType,
        totalWeight: pricingMode === 'per-kg' ? parseFloat(formData.totalWeight) : 0,
        items: pricingMode === 'per-piece' ? selectedItems : [{ type: 'clothes', weight: parseFloat(formData.totalWeight) }],
        totalPrice: calculatedPrice,
        pickupAddress: useRegisteredAddress ? {
          ...user.address,
          fullAddress: `${user.address.street}, ${user.address.area}, ${user.address.city} - ${user.address.pincode}`
        } : {
          ...user.address,
          fullAddress: formData.pickupAddress.fullAddress,
          landmark: formData.pickupAddress.landmark
        },
        liveLocation,
        pickupDate: formData.pickupDate,
        specialInstructions: formData.specialInstructions
      };

      await api.post('/orders', orderData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Book Your Laundry</h2>
          <p className="text-gray-600">Choose your preferred pricing method</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pricing Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Pricing Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPricingMode('per-kg')}
                  className={`p-4 border-2 rounded-lg transition ${
                    pricingMode === 'per-kg'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <Package className="mx-auto mb-2" size={32} />
                  <p className="font-semibold text-lg">Per KG</p>
                  <p className="text-sm text-gray-600">Bulk laundry by weight</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPricingMode('per-piece')}
                  className={`p-4 border-2 rounded-lg transition ${
                    pricingMode === 'per-piece'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <Package className="mx-auto mb-2" size={32} />
                  <p className="font-semibold text-lg">Per Piece</p>
                  <p className="text-sm text-gray-600">Individual item pricing</p>
                </button>
              </div>
            </div>

            {/* Per KG Section */}
            {pricingMode === 'per-kg' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    className="input-field"
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    <option value="wash-dry">Wash + Dry (₹99/kg)</option>
                    <option value="wash-iron">Wash + Iron (₹149/kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    className="input-field"
                    placeholder="Approximate weight (e.g., 5 kg)"
                    value={formData.totalWeight}
                    onChange={(e) => setFormData({ ...formData, totalWeight: e.target.value })}
                  />
                  <p className="text-sm text-gray-700 mt-2 font-semibold">
                    💡 Don't worry! We'll weigh your laundry accurately at your doorstep during pickup.
                  </p>
                </div>
              </>
            )}

            {/* Per Piece Section */}
            {pricingMode === 'per-piece' && (
              <div className="space-y-6">
                {/* Clothing Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">👕 Clothing Items</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {itemCategories.clothing.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addItem(item)}
                        className="flex justify-between items-center p-3 border border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-primary font-bold">₹{item.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Household Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🛏️ Household Items</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {itemCategories.household.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addItem(item)}
                        className="flex justify-between items-center p-3 border border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-primary font-bold">₹{item.price}{item.unit ? `/${item.unit}` : ''}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shoe Cleaning */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">👟 Shoe Cleaning</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {itemCategories.shoes.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addItem(item)}
                        className="flex justify-between items-center p-3 border border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-primary font-bold">₹{item.price}/{item.unit}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Items */}
                {selectedItems.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Selected Items</h3>
                    <div className="space-y-2">
                      {selectedItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg">
                          <span className="font-medium">{item.name}</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.name, -1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.name, 1)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Plus size={16} />
                            </button>
                            <span className="text-primary font-bold w-20 text-right">₹{item.price * item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.name)}
                              className="p-1 hover:bg-red-100 text-red-600 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price Display */}
            {calculatedPrice > 0 && (
              <div className="bg-primary/10 border border-primary rounded-lg p-4">
                <p className="text-lg font-semibold text-primary">
                  Total Price: ₹{calculatedPrice}
                </p>
              </div>
            )}

            {/* Pickup Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-2" size={18} />
                Pickup Date & Time
              </label>
              <input
                type="datetime-local"
                required
                className="input-field"
                value={formData.pickupDate}
                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline mr-2" size={18} />
                Your Location (Required)
              </label>
              {!liveLocation ? (
                <button
                  type="button"
                  onClick={getLiveLocation}
                  disabled={locationLoading}
                  className="btn-secondary w-full"
                >
                  {locationLoading ? 'Getting Location...' : '📍 Allow Location Access'}
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 font-semibold mb-2">✓ Location Captured</p>
                  <p className="text-sm text-gray-600 mb-3">{liveLocation.address}</p>
                  
                  <div className="rounded-lg overflow-hidden border border-gray-300 mb-3">
                    <iframe
                      width="100%"
                      height="200"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=${liveLocation.latitude},${liveLocation.longitude}&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <button
                    type="button"
                    onClick={getLiveLocation}
                    className="text-primary text-sm hover:underline"
                  >
                    Update Location
                  </button>
                </div>
              )}
            </div>

            {/* Pickup Address */}
            {isAuthenticated && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MapPin className="inline mr-2" size={18} />
                  Pickup Address
                </label>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUseRegisteredAddress(true);
                      setFormData({ 
                        ...formData, 
                        pickupAddress: { fullAddress: '', landmark: '' } 
                      });
                    }}
                    className={`p-4 border-2 rounded-lg transition text-left ${
                      useRegisteredAddress
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <p className="font-semibold mb-2">Use Registered Address</p>
                    <p className="text-xs text-gray-600">{user?.address?.street || 'No address saved'}</p>
                    <p className="text-xs text-gray-600">{user?.address?.area || ''}, {user?.address?.city || ''}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseRegisteredAddress(false)}
                    className={`p-4 border-2 rounded-lg transition text-left ${
                      !useRegisteredAddress
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <p className="font-semibold mb-2">Enter New Address</p>
                    <p className="text-xs text-gray-600">Use different pickup location</p>
                  </button>
                </div>

                {useRegisteredAddress && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                    <p className="font-semibold text-blue-800 mb-2">Selected Address:</p>
                    <p className="text-gray-800">{user?.address?.street}</p>
                    <p className="text-gray-700">{user?.address?.area}, {user?.address?.city} - {user?.address?.pincode}</p>
                  </div>
                )}

                {!useRegisteredAddress && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complete Address
                      </label>
                      <textarea
                        className="input-field"
                        rows="3"
                        required
                        placeholder="Enter complete address with house/flat number, floor, building name, street, area"
                        value={formData.pickupAddress.fullAddress}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          pickupAddress: { ...formData.pickupAddress, fullAddress: e.target.value } 
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Nearby landmark for easy location"
                        value={formData.pickupAddress.landmark}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          pickupAddress: { ...formData.pickupAddress, landmark: e.target.value } 
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                className="input-field"
                rows="3"
                placeholder="Any special care instructions..."
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              />
            </div>

            {/* Payment Method */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                💵 Payment Method
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Pay After Delivery</p>
                    <p className="text-sm text-gray-600">Cash on Delivery / UPI on Delivery</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-gray-700">
                    👍 <span className="font-semibold">No advance payment required!</span> Pay conveniently when we deliver your fresh laundry.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4"
            >
              {loading ? 'Booking...' : '👍 Confirm Booking - Pay After Delivery'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookNow;
