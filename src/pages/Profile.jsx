import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      area: '',
      city: '',
      pincode: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          area: user.address?.area || '',
          city: user.address?.city || '',
          pincode: user.address?.pincode || ''
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data } = await api.patch('/auth/profile', formData);
      updateUser(data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        area: user.address?.area || '',
        city: user.address?.city || '',
        pincode: user.address?.pincode || ''
      }
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 btn-primary"
            >
              <Edit2 size={20} />
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <div className="card text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={48} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{user?.email}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {user?.role}
            </span>
          </div>

          {/* Profile Details Form */}
          <div className="md:col-span-2 card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="mr-2" size={20} />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline mr-1" size={16} />
                        Email
                      </label>
                      <input
                        type="email"
                        disabled
                        className="input-field bg-gray-100"
                        value={formData.email}
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline mr-1" size={16} />
                        Phone
                      </label>
                      <input
                        type="tel"
                        disabled={!isEditing}
                        className="input-field"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2" size={20} />
                  Address Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="House/Flat number, Building name, Street"
                      value={formData.address.street}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, street: e.target.value } 
                      })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Area/Locality</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className="input-field"
                        placeholder="Area name"
                        value={formData.address.area}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, area: e.target.value } 
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        className="input-field"
                        placeholder="City"
                        value={formData.address.city}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, city: e.target.value } 
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      className="input-field"
                      placeholder="6-digit pincode"
                      value={formData.address.pincode}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, pincode: e.target.value } 
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={20} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="text-xl font-bold text-primary">
              {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 mb-1">Account Status</p>
            <p className="text-xl font-bold text-green-600">Active</p>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 mb-1">Account Type</p>
            <p className="text-xl font-bold text-purple-600 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
