// lib/dummyTransactions.ts

// Define a type for the transaction
interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'debit' | 'credit';
    category: string;
    name: string;
    paymentChannel: string;
  }
  
  // Function to create dummy transactions
  export const createDummyTransactions = (count: number): Transaction[] => {
    const transactionNames = ['Uber', 'Razorpay', 'Flight', 'Amazon', 'Swiggy', 'Zomato', 'Netflix', 'Spotify', 'Google', 'Apple'];
    const transactions: Transaction[] = [];
    for (let i = 1; i <= count; i++) {
      transactions.push({
        id: `txn-${i}`,
        date: new Date().toISOString(),
        amount: Math.floor(Math.random() * 10000) + 1,
        type: i % 2 === 0 ? 'debit' : 'credit',
        category: 'Shopping',
        name: transactionNames[Math.floor(Math.random() * transactionNames.length)],
        paymentChannel: 'online',
      });
    }
    return transactions;
  };