import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Bell, Globe, Save, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('sprinkleX_language') || 'en');
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem('sprinkleX_notifications') || 'true')
  );

  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  // Translations
  const t = {
    en: {
      profile: 'Profile & Settings',
      personalInfo: 'Personal Information',
      name: 'Full Name',
      phone: 'Phone Number', 
      email: 'Email Address',
      settings: 'Settings',
      language: 'Language',
      notifications: 'SMS Notifications',
      english: 'English',
      tamil: 'Tamil',
      edit: 'Edit',
      save: 'Save Changes',
      cancel: 'Cancel',
      updated: 'Profile updated successfully!',
      back: 'Back to Dashboard'
    },
    ta: {
      profile: 'சுயவிவரம் & அமைப்புகள்',
      personalInfo: 'தனிப்பட்ட தகவல்',
      name: 'முழு பெயர்',
      phone: 'தொலைபேசி எண்',
      email: 'மின்னஞ்சல் முகவரி',
      settings: 'அமைப்புகள்',
      language: 'மொழி',
      notifications: 'SMS அறிவிப்புகள்',
      english: 'ஆங்கிலம்',
      tamil: 'தமிழ்',
      edit: 'திருத்து',
      save: 'மாற்றங்களை சேமி',
      cancel: 'ரத்து செய்',
      updated: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
      back: 'டாஷ்போர்டுக்குத் திரும்பு'
    }
  };

  const getText = (key) => t[language][key] || t.en[key];

  const updateEditData = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
    
    // Show success message (in a real app, you might use a toast)
    alert(getText('updated'));
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('sprinkleX_language', newLanguage);
  };

  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('sprinkleX_notifications', JSON.stringify(newValue));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sprinkle-green to-green-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{getText('profile')}</h1>
                <p className="text-green-100 mt-1">
                  {user?.name || 'Farmer'}
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Personal Information */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User size={20} className="mr-2 text-sprinkle-green" />
                  {getText('personalInfo')}
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sprinkle-green hover:text-green-600 transition-colors"
                  >
                    {getText('edit')}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    {getText('name')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => updateEditData('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      {user?.name || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    {getText('phone')}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => updateEditData('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      {user?.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    {getText('email')}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => updateEditData('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      {user?.email || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-sprinkle-green hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Save size={16} className="mr-2" />
                      {getText('save')}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          name: user?.name || '',
                          phone: user?.phone || '',
                          email: user?.email || ''
                        });
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      {getText('cancel')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Bell size={20} className="mr-2 text-sprinkle-green" />
                {getText('settings')}
              </h2>

              <div className="space-y-6">
                {/* Language Setting */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <Globe size={20} className="mr-3 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {getText('language')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        language === 'en'
                          ? 'bg-sprinkle-green text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {getText('english')}
                    </button>
                    <button
                      onClick={() => handleLanguageChange('ta')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        language === 'ta'
                          ? 'bg-sprinkle-green text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {getText('tamil')}
                    </button>
                  </div>
                </div>

                {/* Notification Setting */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <Bell size={20} className="mr-3 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {getText('notifications')}
                    </span>
                  </div>
                  <button
                    onClick={handleNotificationToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-sprinkle-green' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;