import { useState } from 'react';

export default function BlockchainPage({ blockchain }) {
  const [filter, setFilter] = useState('all');
  
  const filteredChain = blockchain.chain.filter(block => {
    if (filter === 'all') return true;
    return block.data?.transaction?.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blockchain Ledger</h2>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm"
        >
          <option value="all">All Transactions</option>
          <option value="buy">Buy Transactions</option>
          <option value="sell">Sell Transactions</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {filteredChain.map((block, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Block:</span> {block.index}
              </div>
              <div>
                <span className="font-medium">Timestamp:</span>{' '}
                {new Date(block.timestamp).toLocaleString()}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Previous Hash:</span>{' '}
                <span className="font-mono text-sm break-all">{block.previousHash}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Hash:</span>{' '}
                <span className="font-mono text-sm break-all">{block.hash}</span>
              </div>
              {block.data?.transaction && (
                <div className="col-span-2 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Transaction Details:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Property ID: {block.data.propertyId}</div>
                    <div>Type: {block.data.transaction.type}</div>
                    <div>Seller: {block.data.transaction.seller}</div>
                    <div>Buyer: {block.data.transaction.buyer}</div>
                    <div>Price: ₹{block.data.transaction.price.toLocaleString()}</div>
                    <div>Share: {block.data.transaction.sharePercentage}%</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}