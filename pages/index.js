// pages/index.js
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEthereumAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEthereumAddress(walletAddress)) {
      setErrorMessage('Please enter a valid Ethereum wallet address');
      return;
    }

    setIsLoading(true);
    setTransactionStatus(null);
    setErrorMessage('');

    try {
      const response = await fetch('/api/claim-mon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress }),
      });

      const data = await response.json();

      if (response.ok) {
        setTransactionStatus({
          status: 'success',
          message: 'Tokens sent successfully!',
          data: data
        });
      } else {
        setTransactionStatus({
          status: 'error',
          message: data.message || data.error || 'Failed to send tokens'
        });
      }
    } catch (error) {
      setTransactionStatus({
        status: 'error',
        message: 'An error occurred while connecting to the faucet'
      });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <Head>
        <title>MonChain Faucet | Get Test Tokens</title>
        <meta name="description" content="MonChain faucet for receiving test tokens" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              MonChain Faucet
            </h1>
            <p className="text-xl text-gray-300">
              Get test tokens to interact with the MonChain network
            </p>
          </div>

          {/* Card */}
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Request Tokens</h2>
              <p className="text-gray-300">
                Enter your wallet address below to receive MON tokens for testing purposes.
                Tokens will be sent directly to your wallet after submission.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Address
                </label>
                <input
                  id="wallet-address"
                  type="text"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
                {errorMessage && (
                  <p className="mt-2 text-red-400 text-sm">{errorMessage}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 
                  ${isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transform hover:-translate-y-1'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Request Tokens'
                )}
              </button>
            </form>

            {/* Transaction Status */}
            {transactionStatus && (
              <div className={`mt-8 p-4 rounded-lg ${
                transactionStatus.status === 'success' 
                  ? 'bg-green-800 bg-opacity-30 border border-green-700' 
                  : 'bg-red-800 bg-opacity-30 border border-red-700'
              }`}>
                <div className="flex items-start">
                  {transactionStatus.status === 'success' ? (
                    <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  )}
                  <div>
                    <h3 className={`font-medium ${
                      transactionStatus.status === 'success' ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {transactionStatus.status === 'success' ? 'Success!' : 'Error'}
                    </h3>
                    <p className="mt-1 text-sm">{transactionStatus.message}</p>
                    {transactionStatus.data && transactionStatus.data.txHash && (
                      <p className="mt-2 text-sm">
                        <span className="font-medium">Transaction Hash: </span>
                        <a 
                          href={`https://explorer.monscan.org/tx/${transactionStatus.data.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline break-all"
                        >
                          {transactionStatus.data.txHash}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="mt-8 bg-blue-900 bg-opacity-30 border border-blue-800 rounded-lg p-4">
              <h3 className="font-medium text-blue-300 mb-2">Important Information</h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-300">
                <li>Tokens are intended for testing purposes only</li>
                <li>Limited to 1 MON tokens per request</li>
                <li>Maximum 1 requests per wallet address per day</li>
                <li>Please allow up to 1-2 minutes for tokens to arrive in your wallet</li>
              </ul>
            </div>
          </div>

          {/* Network Info */}
          <div className="mt-10 text-center text-gray-400 text-sm">
            <h3 className="font-medium mb-2">Network Information</h3>
            <div className="space-y-1">
              <p>Network Name: MonChain Testnet</p>
              <p>RPC URL: https://rpc.monchain.org</p>
              <p>Chain ID: 16789</p>
              <p>Currency Symbol: MON</p>
              <p>Block Explorer: <a href="https://explorer.monchain.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">explorer.monchain.org</a></p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} MonChain. All rights reserved.</p>
      </footer>
    </div>
  );
}