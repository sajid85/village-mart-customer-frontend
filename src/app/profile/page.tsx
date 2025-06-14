'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon, 
  KeyIcon, 
  ShoppingBagIcon, 
  HomeIcon, 
  CreditCardIcon, 
  CogIcon 
} from '@heroicons/react/24/outline';
import { getProfile, updateProfile, changePassword, updateSettings, deleteAccount } from '@/utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SettingsFormData {
  emailNotifications: boolean;
  newsletterSubscription: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settingsForm, setSettingsForm] = useState<SettingsFormData>({
    emailNotifications: false,
    newsletterSubscription: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserProfile();
  }, [router]);

  const fetchUserProfile = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      setProfileForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      toast.success('Profile updated successfully');
      fetchUserProfile(); // Refresh user data
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password');
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(settingsForm);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      try {
        await deleteAccount(user?.id || '');
        localStorage.removeItem('token');
        router.push('/login');
        toast.success('Account deleted successfully');
      } catch (error) {
        console.error('Failed to delete account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'orders') {
      router.push('/orders');
    } else {
      setActiveTab(tab);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Personal Information', icon: UserIcon },
    { id: 'password', name: 'Password', icon: KeyIcon },
    { id: 'orders', name: 'Order History', icon: ShoppingBagIcon },
    { id: 'addresses', name: 'Addresses', icon: HomeIcon },
    { id: 'payments', name: 'Payment Methods', icon: CreditCardIcon },
    { id: 'settings', name: 'Account Settings', icon: CogIcon },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <tab.icon className="w-5 h-5 mr-2" />
                      {tab.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate}>
                    <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={profileForm.phoneNumber}
                          onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-300"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordChange}>
                    <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-300"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Order History</h2>
                    {/* Order history content will be implemented later */}
                    <p className="text-gray-500">No orders found.</p>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
                    {/* Address management content will be implemented later */}
                    <p className="text-gray-500">No addresses saved.</p>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                    {/* Payment methods content will be implemented later */}
                    <p className="text-gray-500">No payment methods saved.</p>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <form onSubmit={handleSettingsUpdate}>
                    <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="emailNotifications"
                          name="emailNotifications"
                          type="checkbox"
                          checked={settingsForm.emailNotifications}
                          onChange={(e) => setSettingsForm({ ...settingsForm, emailNotifications: e.target.checked })}
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                          Receive email notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="newsletterSubscription"
                          name="newsletterSubscription"
                          type="checkbox"
                          checked={settingsForm.newsletterSubscription}
                          onChange={(e) => setSettingsForm({ ...settingsForm, newsletterSubscription: e.target.checked })}
                          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="newsletterSubscription" className="ml-2 block text-sm text-gray-900">
                          Subscribe to newsletter
                        </label>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-300"
                      >
                        Update Settings
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'profile' && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Danger Zone</h2>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-300"
                    >
                      Delete Account
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 