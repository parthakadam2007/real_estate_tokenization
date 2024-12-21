// Get the purchase history of a specific user (buyer)
export const getUserPurchaseHistory = (userId, blockchain) => { 
  return blockchain.chain
    .filter(block => block.data?.transaction?.buyer === userId) // Filter blocks where the user is the buyer
    .map(block => ({
      id: block.hash,
      propertyId: block.data.propertyId,
      propertyTitle: block.data.propertyTitle || 'Unknown Property',
      price: block.data.transaction.price,
      sharePercentage: block.data.transaction.sharePercentage,
      date: block.timestamp
    }));
};

// Get the current properties owned by a user
export const getUserProperties = (userId, blockchain) => {
  const properties = new Map();
  
  // Process all transactions to build current ownership
  blockchain.chain.forEach(block => {
    if (!block.data?.transaction) return; // Skip blocks without transactions
    
    const { propertyId, transaction } = block.data;
    if (!properties.has(propertyId)) {
      // Initialize the property if not already added
      properties.set(propertyId, {
        id: propertyId,
        title: block.data.propertyTitle || 'Unknown Property',
        sharePercentage: 0, // Start with 0% ownership
        status: 'available'
      });
    }
    
    const property = properties.get(propertyId);
    
    // Update ownership based on transaction data
    if (transaction.seller === userId) {
      property.sharePercentage -= transaction.sharePercentage; // Reduce share if selling
    }
    if (transaction.buyer === userId) {
      property.sharePercentage += transaction.sharePercentage; // Increase share if buying
    }
    
    // Change status to 'sold' if the user no longer owns any share
    if (property.sharePercentage <= 0) {
      property.status = 'sold';
    }
  });
  
  // Return only properties where the user owns shares
  return Array.from(properties.values()).filter(p => p.sharePercentage > 0);
};