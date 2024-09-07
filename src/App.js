import React, { useState } from 'react';
import StellarSdk from 'stellar-sdk';
import { connectFreighter, getAccountDetails } from './freighterService';

const App = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');

  const handleConnectWallet = async () => {
    const address = await connectFreighter();
    if (address) {
      setWalletAddress(address);
      const accountDetails = await getAccountDetails(address);
      if (accountDetails) {
        setBalance(accountDetails.balances.find(b => b.asset_type === 'native').balance);
      }
    }
  };

  const handleSendXLM = async (event) => {
    event.preventDefault();
    const recipient = document.getElementById('recipient').value;
    const amount = document.getElementById('amount').value;
    const message = document.getElementById('message').value;

    try {
      const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
      const account = await server.loadAccount(walletAddress);
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: recipient,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        }))
        .addMemo(StellarSdk.Memo.text(message))
        .setTimeout(30)
        .build();

      // Sign and submit the transaction
      const secretKey = 'SECRET_KEY_YOUR_WALLET';  // Enter secretkey here
      const keypair = StellarSdk.Keypair.fromSecret(secretKey);
      transaction.sign(keypair);

      const result = await server.submitTransaction(transaction);
      alert('Transaction successful! Hash: ' + result.hash);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed!');
    }
  };

  return (
    <div>
      <h1>Pay with Stellar!</h1>
      <h3>"Send messages with a touch of luxury!"<br></br>❤️ ✨💬 ❤️</h3>
      <button onClick={handleConnectWallet}>Connect Wallet</button>
      {walletAddress && (
        <div>
          <p>Connected Address: {walletAddress}</p>
          <p>Balance: {balance} XLM</p>
        </div>
      )}
      <form onSubmit={handleSendXLM}>
        <h2>Send XLM</h2>
        <label>
          Recipient Address:
          <input type="text" id="recipient" required />
        </label>
        <label>
          Amount (XLM):
          <input type="number" id="amount" step="0.0001" required />
        </label>
        <label>
          Message:
          <input type="text" id="message" />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
