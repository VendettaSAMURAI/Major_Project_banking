import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import BankCard from './BankCard';
import { countTransactionCategories } from '@/lib/utils';

const RightSidebar = ({ user, transactions = [], banks = [] }: RightSidebarProps) => {
  // Calculate financial metrics
  const totalBalance = 320; // Updated total amount left to 320
  const transactionCategories = countTransactionCategories(transactions);

  // Example dummy categories
  const dummyCategoriesLeft = [
    'Electricity Bills',
    'Wi-Fi Plans',
    'Grocery Expenses',
  ];

  // Example of dummy transaction counts (e.g., 3-4 transactions per category)
  const dummyTransactionCounts = {
    'Electricity Bills': 3,
    'Wi-Fi Plans': 4,
    'Grocery Expenses': 2,
  };

  return (
    <aside className="right-sidebar bg-white p-4 shadow-md rounded-lg">
      {/* Profile Section */}
      <section className="flex flex-col pb-8">
        <div className="profile-banner h-16 bg-blue-500 rounded-t-lg"></div>
        <div className="profile flex items-center gap-4 mt-4">
          <div className="profile-img w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full">
            <span className="text-5xl font-bold text-blue-500">
              {user?.firstName?.[0] || 'U'}
            </span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name text-lg font-bold text-gray-800">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="profile-email text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </section>

      {/* Banks Section */}
      <section className="banks mt-6">
        <div className="flex w-full justify-between items-center mb-4">
          <h2 className="header-2 text-lg font-semibold text-gray-800">My Banks</h2>
          <Link href="/" className="flex gap-2 items-center">
            <Image src="/icons/plus.svg" width={20} height={20} alt="plus" />
            <span className="text-sm font-semibold text-gray-600">Add Bank</span>
          </Link>
        </div>

        {banks.length > 0 ? (
          <div className="relative flex flex-col items-center gap-5">
            <div className="relative z-10">
              <BankCard
                key={banks[0]?.$id}
                account={banks[0]}
                userName={`${user?.firstName} ${user?.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1]?.$id}
                  account={banks[1]}
                  userName={`${user?.firstName} ${user?.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No banks available.</p>
        )}
      </section>

      {/* Financial Dashboard Section */}
      <section className="mt-10 flex flex-1 flex-col gap-6">
        <h2 className="header-2 text-lg font-semibold text-gray-800">
          Financial Management Dashboard
        </h2>

        {/* Embedded Dashboard */}
        <div className="financial-dashboard bg-gray-100 p-4 rounded-lg shadow-sm">
          <div className="dashboard-item">
            <h3 className="text-sm font-medium text-gray-600">Total Amount Left</h3>
            <p className="text-xl font-bold text-green-600">
              ${totalBalance.toFixed(2)}
            </p>
          </div>

          <div className="dashboard-item mt-4">
            <h3 className="text-sm font-medium text-gray-600">Categories Left to Pay</h3>
            <ul className="text-sm text-gray-600">
              {dummyCategoriesLeft.map((category, index) => (
                <li key={index} className="flex justify-between">
                  <span>{category}</span>
                  <span className="text-gray-500">Pending</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard-item mt-4">
            <h3 className="text-sm font-medium text-gray-600">Spending Categories</h3>
            {Object.keys(transactionCategories).length > 0 ? (
              <ul className="text-sm text-gray-600">
                {Object.entries(transactionCategories).map(([category, count]) => (
                  <li key={category} className="flex justify-between">
                    <span>{category}</span>
                    <span>{count} transactions</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="text-sm text-gray-600">
                {dummyCategoriesLeft.map((category, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{category}</span>
                    <span>{dummyTransactionCounts[category]} transactions</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightSidebar;
