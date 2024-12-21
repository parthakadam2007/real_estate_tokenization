import { useState } from 'react';

export default function PropertyHistoryPage({ blockchain, properties }) {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const getTransactionHistory = (propertyId) => {
    return blockchain.chain
      .filter(block => block.data?.propertyId === propertyId)
      .map(block => block.data.transaction);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Property History</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold mb-4">Select Property</h3>
            <div className="space-y-2">
              {properties.map(property => (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedProperty?.id === property.id
                      ? 'bg-blue-50 border-blue-200 border'
                      : 'hover:bg-gray-50 border'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{property.title}</div>
                      <div className="text-sm text-gray-500">{property.id}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedProperty ? (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-6">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="text-xl font-semibold mt-4">{selectedProperty.title}</h3>
                <p className="text-gray-600">{selectedProperty.location}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Current Ownership</h4>
                {Object.entries(blockchain.getPropertyHistory(selectedProperty.id)).map(([owner, share]) => (
                  <div key={owner} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">{owner}</span>
                    <span className="text-blue-600 font-semibold">{share}%</span>
                  </div>
                ))}

                <h4 className="font-semibold mt-6">Transaction History</h4>
                {getTransactionHistory(selectedProperty.id).map((transaction, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Type:</span> {transaction.type}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Seller:</span> {transaction.seller}
                      </div>
                      <div>
                        <span className="font-medium">Buyer:</span> {transaction.buyer}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span>{' '}
                        ₹{transaction.price.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Share:</span>{' '}
                        {transaction.sharePercentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
              Select a property to view its history
            </div>
          )}
        </div>
      </div>
    </div>
  );
}