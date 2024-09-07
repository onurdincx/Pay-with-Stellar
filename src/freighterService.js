// src/freighterService.js
export const connectFreighter = async () => {
    try {
      // Check if Freighter is installed
      if (!window.FreighterApi) {
        alert('Freighter wallet is not installed. Please install it first.');
        return null;
      }
  
      // Request accounts
      const accounts = await window.FreighterApi.getPublicKey();
      return accounts;
    } catch (error) {
      console.error('Failed to connect to Freighter:', error);
      return null;
    }
  };
  
  export const getAccountDetails = async (publicKey) => {
    try {
      const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
      const account = await response.json();
      return account;
    } catch (error) {
      console.error('Failed to get account details:', error);
      return null;
    }
  };
  