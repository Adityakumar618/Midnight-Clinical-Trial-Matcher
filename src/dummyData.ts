export const CONFIG = {
  NETWORK: 'midnight-testnet',
  CHAIN_ID: 1,
  THRESHOLD_SCORE: 700,
};

export const DUMMY_FINANCIAL_DATA = {
  bills: [
    { id: '1', provider: 'Electric Co', status: 'paid', amount: 150 },
    { id: '2', provider: 'Water Dept', status: 'paid', amount: 45 },
    { id: '3', provider: 'Rent', status: 'paid', amount: 1200 },
  ],
  totalScore: 750,
};
