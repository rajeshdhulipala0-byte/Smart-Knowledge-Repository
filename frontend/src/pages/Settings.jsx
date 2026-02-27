import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import { FiUser, FiSettings, FiBookmark, FiMoon, FiSun, FiUpload, FiX } from 'react-icons/fi';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: 'light',
    emailNotifications: true,
    language: 'en',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        twitter: user.social?.twitter || '',
        linkedin: user.social?.linkedin || '',
        github: user.social?.github || '',
      });
      const userPreferences = user.preferences || {
        theme: 'light',
        emailNotifications: true,
        language: 'en',
      };
      setPreferences(userPreferences);
      
      // Apply theme on load
      applyTheme(userPreferences.theme);
      
      // Update avatar preview when user avatar changes
      if (user.avatar) {
        setAvatarPreview(`http://localhost:5000${user.avatar}?t=${Date.now()}`);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user, user?.avatar]); // Add user?.avatar as dependency

  // Function to apply theme
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'auto') {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authService.updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        social: {
          twitter: profileData.twitter,
          linkedin: profileData.linkedin,
          github: profileData.github,
        },
      });
      
      if (response.success) {
        updateUser(response.data);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.uploadAvatar(file);
      console.log('Avatar upload response:', response);
      if (response.success) {
        updateUser(response.data);
        // Add cache busting parameter to force image reload
        const avatarUrl = `http://localhost:5000${response.data.avatar}?t=${Date.now()}`;
        setAvatarPreview(avatarUrl);
        toast.success('Avatar uploaded successfully!');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your avatar?')) return;

    setLoading(true);
    try {
      const response = await authService.deleteAvatar();
      if (response.success) {
        updateUser(response.data);
        setAvatarPreview(null);
        toast.success('Avatar deleted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete avatar');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authService.updateProfile({
        preferences,
      });
      
      if (response.success) {
        updateUser(response.data);
        toast.success('Preferences updated successfully!');
        
        // Apply theme
        applyTheme(preferences.theme);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'account', label: 'Account', icon: <FiSettings /> },
    { id: 'preferences', label: 'Preferences', icon: <FiMoon /> },
  ];

  return (
    <div className="fade-in max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>

                {/* Avatar Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          key={avatarPreview}
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                        <FiUpload />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          disabled={loading}
                        />
                      </label>
                      {avatarPreview && (
                        <button
                          onClick={handleAvatarDelete}
                          disabled={loading}
                          className="inline-flex items-center space-x-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
                        >
                          <FiX />
                          <span>Remove</span>
                        </button>
                      )}
                      <p className="text-xs text-gray-500">JPG, PNG or GIF (max. 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows="4"
                      maxLength="500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 characters</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter
                        </label>
                        <input
                          type="text"
                          value={profileData.twitter}
                          onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="@username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="text"
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="linkedin.com/in/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub
                        </label>
                        <input
                          type="text"
                          value={profileData.github}
                          onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="github.com/username"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Account Created</h3>
                    <p className="text-gray-600">
                      {user?.createdAt && new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Last Login</h3>
                    <p className="text-gray-600">
                      {user?.lastLogin && new Date(user.lastLogin).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Role</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      user?.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      onClick={() => toast.info('Account deletion feature coming soon')}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferences</h2>

                <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, theme })}
                          className={`p-4 border-2 rounded-lg transition ${
                            preferences.theme === theme
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            {theme === 'light' ? <FiSun size={24} /> : <FiMoon size={24} />}
                            <span className="capitalize font-medium">{theme}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-gray-800">Email Notifications</span>
                        <p className="text-sm text-gray-500">Receive email notifications about your activity</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Stats Section */}
          {activeTab === 'account' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-primary-600">{user?.stats?.knowledgeCreated || 0}</div>
                <div className="text-gray-600 mt-1">Knowledge Created</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{user?.stats?.bookmarks || 0}</div>
                <div className="text-gray-600 mt-1">Bookmarks</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">{user?.stats?.knowledgeViewed || 0}</div>
                <div className="text-gray-600 mt-1">Items Viewed</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
