import { useState, useEffect } from 'react'
import { Plus, MapPin, Edit, Trash2, Home, Building2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addressAPI } from '../services/api'
import { LoadingSpinner } from '../components/Loading/LoadingPage'

interface Address {
  address_id: string
  address_type: string
  full_name: string
  mobile_number: string
  address_line1: string
  landmark?: string
  pincode: string
  city?: string
  state?: string
  is_default: boolean
}

export default function AddressPage() {
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { user, token } = useAuth()

  const [formData, setFormData] = useState({
    address_type: 'home',
    full_name: user?.name || '',
    mobile_number: user?.phone || '',
    address_line1: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    is_default: false
  })

  const addressTypeIcons = {
    home: Home,
    work: Building2,
    other: ShoppingBag
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    if (!token) return

    try {
      setLoading(true)
      const data = await addressAPI.getAddresses(token)
      setAddresses(data)
    } catch (error) {
      console.error('Error loading addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      setSubmitting(true)

      if (editingAddress) {
        // Update existing address
        const updatedAddress = await addressAPI.updateAddress(token, editingAddress.address_id, formData)
        setAddresses(prev => prev.map(addr =>
          addr.address_id === editingAddress.address_id ? updatedAddress : addr
        ))
      } else {
        // Create new address
        const newAddress = await addressAPI.createAddress(token, formData)
        setAddresses(prev => [...prev, newAddress])
      }

      // Reset form
      setShowAddForm(false)
      setEditingAddress(null)
      setFormData({
        address_type: 'home',
        full_name: user?.name || '',
        mobile_number: user?.phone || '',
        address_line1: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        is_default: false
      })
    } catch (error) {
      console.error('Error saving address:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      address_type: address.address_type,
      full_name: address.full_name,
      mobile_number: address.mobile_number,
      address_line1: address.address_line1,
      landmark: address.landmark || '',
      pincode: address.pincode,
      city: address.city || '',
      state: address.state || '',
      is_default: address.is_default
    })
    setShowAddForm(true)
    // Scroll to top when editing
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!token || !confirm('Are you sure you want to delete this address?')) return

    try {
      await addressAPI.deleteAddress(token, addressId)
      setAddresses(prev => prev.filter(addr => addr.address_id !== addressId))
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    if (!token) return

    try {
      await addressAPI.setDefaultAddress(token, addressId)
      await loadAddresses() // Reload to update default status
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
              <p className="text-sm text-gray-600">Manage your delivery addresses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading addresses...</p>
          </div>
        ) : !showAddForm ? (
          <>
            {/* Add New Address Button */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {addresses.length === 0
                  ? "No saved addresses yet. Add your first address below."
                  : `You have ${addresses.length} saved address${addresses.length !== 1 ? 'es' : ''}`
                }
              </p>
              <button
                onClick={() => {
                  setShowAddForm(true)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Addresses List with Scroll */}
            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
              {addresses.map((address) => {
                const Icon = addressTypeIcons[address.address_type as keyof typeof addressTypeIcons] || MapPin

                return (
                  <div
                    key={address.address_id}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Icon className="h-5 w-5 text-brand-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900 capitalize">{address.address_type}</h4>
                            {address.is_default && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900 font-medium mt-1">{address.full_name}</p>
                          <p className="text-gray-600">{address.mobile_number}</p>
                          <p className="text-gray-600 mt-1">{address.address_line1}</p>
                          {address.landmark && (
                            <p className="text-gray-600">Near {address.landmark}</p>
                          )}
                          <p className="text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!address.is_default && (
                          <button
                            onClick={() => handleSetDefault(address.address_id)}
                            className="text-xs text-brand-600 hover:text-brand-700 px-2 py-1 border border-brand-600 rounded"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.address_id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {addresses.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No addresses saved yet</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary"
                >
                  Add Your First Address
                </button>
              </div>
            )}
          </>
        ) : (
          // Add/Edit Address Form
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmitAddress} className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingAddress(null)
                  }}
                  className="text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded"
                >
                  Cancel
                </button>
              </div>

              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Address Type</label>
                <div className="flex space-x-6">
                  {Object.entries(addressTypeIcons).map(([type, Icon]) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="address_type"
                        value={type}
                        checked={formData.address_type === type}
                        onChange={(e) => setFormData(prev => ({ ...prev, address_type: e.target.value }))}
                        className="text-brand-600"
                      />
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="capitalize font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address_line1}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_line1: e.target.value }))}
                  placeholder="House/Flat no., Street name, Area"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                    placeholder="Near..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                  className="text-brand-600"
                />
                <span className="text-sm text-gray-700">Set as default address</span>
              </label>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? (
                    <LoadingSpinner size="sm" className="text-white" />
                  ) : (
                    editingAddress ? 'Update Address' : 'Save Address'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}