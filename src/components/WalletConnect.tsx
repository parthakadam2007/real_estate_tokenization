import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  onConnect: () => void;
  connected: boolean;
  walletAddress?: string;
}

export function WalletConnect({ onConnect, connected, walletAddress }: WalletConnectProps) {
  return (
    <button
      onClick={onConnect}
      className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
    >
      <Wallet className="w-5 h-5" />
      {connected ? 
        <span className="font-medium">{walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}</span> :
        <span className="font-medium">Connect Wallet</span>
      }
    </button>
  );
}