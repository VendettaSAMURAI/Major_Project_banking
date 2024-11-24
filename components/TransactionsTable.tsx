import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionCategoryStyles } from "@/constants";
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils";

// Define types for your props
interface Transaction {
  id: string; // Assuming this is the unique identifier
  name: string;
  amount: number;
  date: string;
  type: 'debit' | 'credit';
  paymentChannel: string;
  category: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const CategoryBadge = ({ category }: { category: string }) => {
  // Get the styles based on the category, with fallback to 'default'
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;

  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  if (!transactions || transactions.length === 0) {
    return <div>No transactions available</div>;
  }

  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Channel</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => {
          const status = getTransactionStatus(new Date(t.date)) || 'Unknown'; // Fallback if status is undefined
          const amount = formatAmount(t.amount);

          // Debit/Credit Handling
          const isDebit = t.type === 'debit';
          const isCredit = t.type === 'credit';

          return (
            <TableRow
              key={t.id} // Ensure this is unique for each row
              className={cn(
                isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]',
                '!over:bg-none !border-b-DEFAULT'
              )}
            >
              {/* Transaction Name */}
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(t.name)}
                  </h1>
                </div>
              </TableCell>

              {/* Amount (Debit/Credit handling) */}
              <TableCell
                className={cn(
                  'pl-2 pr-10 font-semibold',
                  isDebit || amount[0] === '-' ? 'text-[#f04438]' : 'text-[#039855]'
                )}
              >
                {isDebit ? `-${amount}` : isCredit ? amount : amount}
              </TableCell>

              {/* Status (Using CategoryBadge) */}
              <TableCell className="pl-2 pr-10">
                <CategoryBadge category={status} />
              </TableCell>

              {/* Date */}
              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(t.date)).dateTime}
              </TableCell>

              {/* Payment Channel */}
              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                {t.paymentChannel || 'N/A'} {/* Fallback to 'N/A' if paymentChannel is missing */}
              </TableCell>

              {/* Category */}
              <TableCell className="pl-2 pr-10 max-md:hidden">
                <CategoryBadge category={t.category || 'Unknown'} /> {/* Fallback to 'Unknown' if category is missing */}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionsTable;