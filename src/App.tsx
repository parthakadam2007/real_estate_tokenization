import React, { useState } from 'react';
import { Home } from 'lucide-react';
import { WalletConnect } from './components/WalletConnect';
import { PropertyCard } from './components/PropertyCard';
import type { Property } from './types/Property';

// Mock data - In a real app, this would come from the Solana blockchain
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Beachfront Villa',
    price: 250,
    location: 'Miami Beach, FL',
    description: 'Luxurious beachfront property with stunning ocean views',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    bedrooms: 4,
    bathrooms: 3.5,
    squareFootage: 3200,
    owner: '8xk7nAstQYAHxRuZWGdHQZhwc4maqKv9dX6vGzM5Hj4B'
  },
  {
    id: '2',
    title: 'Downtown Penthouse',
    price: 180,
    location: 'New York, NY',
    description: 'Spectacular penthouse in the heart of Manhattan',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 2100,
    owner: '5xj8mBstLMAHxRuZWGdHQZhwc4maqKv9dX6vGzM5Hj4B'
  }
];

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();

  const connectWallet = async () => {
    try {
      // In a real app, this would connect to Phantom wallet
      setConnected(true);
      setWalletAddress('8xk7nAstQYAHxRuZWGdHQZhwc4maqKv9dX6vGzM5Hj4B');
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Home className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Solana Estates</h1>
            </div>
            <WalletConnect 
              onConnect={connectWallet}
              connected={connected}
              walletAddress={walletAddress}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;