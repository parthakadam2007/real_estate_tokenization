// Import SHA256 hash function from the 'crypto-js' library 
import SHA256 from 'crypto-js/sha256';

// Block class represents a single block in the blockchain
class Block {
  constructor(index, previousHash, data, timestamp) {
    this.index = index; // The index of the block in the blockchain
    this.previousHash = previousHash; // Hash of the previous block
    this.data = data; // The data stored in the block (transaction details)
    this.timestamp = timestamp; // The timestamp when the block was created
    this.hash = this.calculateHash(); // The hash of the current block (calculated during block creation)
  }

  // Function to calculate the SHA256 hash of the block using its data
  calculateHash() {
    return SHA256(
      this.index + 
      this.previousHash + 
      JSON.stringify(this.data) + // Convert the data to a string for hashing
      this.timestamp
    ).toString(); // Return the hash as a string
  }
}

// Blockchain class manages the blockchain (chain of blocks) and the property ledger
export class Blockchain {
  constructor() {
    // Initialize the blockchain with a genesis block (the first block)
    this.chain = [this.createGenesisBlock()];
    this.ledger = {}; // A ledger to track ownership of properties (keyed by propertyId)
  }

  // Function to create the genesis block (first block in the chain)
  createGenesisBlock() {
    return new Block(0, "0", "Genesis Block", new Date().toISOString()); // Block with index 0 and no previous block
  }

  // Function to get the latest block in the blockchain (the most recent one)
  getLatestBlock() {
    return this.chain[this.chain.length - 1]; // The last block in the chain
  }

  // Function to add a new block to the blockchain with provided data
  addBlock(data) {
    const latestBlock = this.getLatestBlock(); // Get the latest block
    const newBlock = new Block( // Create a new block based on the latest block
      this.chain.length, // The index of the new block is the length of the chain (since blocks are added sequentially)
      latestBlock.hash, // Set the previous block's hash to ensure the chain is intact
      data, // The data (transaction details) to be stored in the block
      new Date().toISOString() // Timestamp when the block is created
    );
    this.chain.push(newBlock); // Add the new block to the chain
  }

  // Function to add a transaction to the blockchain
  addTransaction(propertyId, seller, buyer, price, sharePercentage) {
    // If the property doesn't exist in the ledger, initialize it as an empty object
    if (!this.ledger[propertyId]) {
      this.ledger[propertyId] = {};
    }

    // Check if the seller has enough share of the property to sell
    if (seller in this.ledger[propertyId]) {
      if (this.ledger[propertyId][seller] < sharePercentage) {
        throw new Error(`Seller does not have enough share to transfer ${sharePercentage}%`); // Error if seller doesn't have enough shares
      }
      this.ledger[propertyId][seller] -= sharePercentage; // Subtract the share percentage from the seller's ownership
      if (this.ledger[propertyId][seller] <= 0) {
        delete this.ledger[propertyId][seller]; // Remove seller from ledger if they no longer own any shares
      }
    } else if (sharePercentage > 0) {
      throw new Error("Seller does not own any shares to transfer"); // Error if the seller doesn't own any shares
    }

    // Add the buyer's share to the ledger
    this.ledger[propertyId][buyer] = (this.ledger[propertyId][buyer] || 0) + sharePercentage;

    // Check if total ownership exceeds 100% (invalid transaction)
    const totalShare = Object.values(this.ledger[propertyId]).reduce((a, b) => a + b, 0);
    if (totalShare > 100) {
      throw new Error(`Total ownership share exceeds 100% for property ${propertyId}`); // Error if total ownership exceeds 100%
    }

    // Create a transaction object to record the sale details
    const transaction = {
      seller, // Seller's ID
      buyer, // Buyer's ID
      price, // Price of the property
      sharePercentage, // Percentage of the property being transferred
      timestamp: new Date().toISOString() // Timestamp of the transaction
    };

    // Add the transaction to the blockchain by creating a new block
    this.addBlock({ propertyId, transaction });
  }

  // Function to get the ownership history for a given property
  getPropertyHistory(propertyId) {
    return this.ledger[propertyId] || {}; // Return the ownership record for the property, or an empty object if no record exists
  }
}

// Function to generate a random property ID
export function generatePropertyId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // Letters
  const numbers = '0123456789'; // Digits
  const allChars = chars + numbers; // All possible characters for property ID

  let id = '';
  
  // Generate the first two characters (letters)
  for (let i = 0; i < 2; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  
  // Generate the next two characters (numbers)
  for (let i = 0; i < 2; i++) {
    id += numbers[Math.floor(Math.random() * numbers.length)];
  }
  
  // Generate the last two characters (any character: letters or numbers)
  for (let i = 0; i < 2; i++) {
    id += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return id; // Return the generated property ID
  console.log(id)
}