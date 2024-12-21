import React from 'react';
import BuyerProfile from '../components/profiles/BuyerProfile';
import SellerProfile from '../components/profiles/SellerProfile';
import { getUserPurchaseHistory, getUserProperties } from '../utils/profileUtils';

export default function ProfilePage({ userId, userType, blockchain, userData }) {
  const user = {
    ...userData,
    purchases: userType === 'buyer' ? getUserPurchaseHistory(userId, blockchain) : [],
    properties: userType === 'seller' ? getUserProperties(userId, blockchain) : []
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>
      {userType === 'buyer' ? (
        <BuyerProfile buyer={user} />
      ) : (
        <SellerProfile seller={user} />
      )}
    </div>
  );
}