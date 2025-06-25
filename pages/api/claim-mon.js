// pages/api/claim-mon.js
export default async function handler(req, res) {
    // Only allow POST method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { wallet_address } = req.body;
  
      // Validate wallet address
      if (!wallet_address || !/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
        return res.status(400).json({ error: 'Invalid wallet address' });
      }
  
      // Call the Supabase function
      const response = await fetch(
        'https://iyppmmnflwqrbezacmaf.supabase.co/functions/v1/claimMon',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wallet_address }),
        }
      );
  
      const data = await response.json();
  
      // Forward the response from the Supabase function
      if (response.ok) {
        return res.status(200).json(data);
      } else {
        return res.status(response.status).json(data);
      }
    } catch (error) {
      console.error('Error processing faucet request:', error);
      return res.status(500).json({ error: 'Failed to process faucet request' });
    }
  }