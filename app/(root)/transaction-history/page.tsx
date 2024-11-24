import HeaderBox from '@/components/HeaderBox';
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import React from 'react';

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

const createDummyTransactions = (count: number): Transaction[] => {
  const transactionNames = [
    'Uber', 'Razorpay', 'Flight', 'Amazon', 'Swiggy', 'Zomato', 'Netflix', 'Spotify', 'Google', 'Apple',
    'Walmart', 'Target', 'Starbucks', 'McDonalds', 'Burger King', 'Subway', 'Dominos', 'Pizza Hut', 'KFC', 'Taco Bell',
    'Lyft', 'PayPal', 'Stripe', 'Square', 'Best Buy', 'Costco', 'eBay', 'Etsy', 'Home Depot', 'Lowe\'s',
    'Shell', 'BP', 'Chevron', 'Exxon', 'Mobil', '7-Eleven', 'Circle K', 'Wawa', 'Kroger', 'Safeway'
  ];

  const transactions: Transaction[] = [];
  for (let i = 1; i <= count; i++) {
    transactions.push({
      id: `txn-${i}`,
      date: new Date().toISOString(),
      amount: Math.floor(Math.random() * 10000) + 1,
      type: i % 2 === 0 ? 'debit' : 'credit',
      category: 'Shopping',
      name: transactionNames[i % transactionNames.length], // Assign names in sequence
      paymentChannel: 'online',
     
    });
  }
  return transactions;
};

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ 
    userId: loggedIn.$id 
  });

  if (!accounts) return;

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  // Use dummy transactions if account transactions are not available
  const transactions = account?.transactions || createDummyTransactions(50);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  );

  // Check if currentBalance is NaN and set it to 320 if it is
  const currentBalance = isNaN(account?.data.currentBalance) ? 320 : account?.data.currentBalance;

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox 
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">{account?.data.name}</h2>
            <p className="text-14 text-blue-25">
              {account?.data.officialName}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {account?.data.mask}
            </p>
          </div>
          
          <div className='transactions-account-balance'>
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">{formatAmount(currentBalance)}</p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable 
            transactions={currentTransactions}
          />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;