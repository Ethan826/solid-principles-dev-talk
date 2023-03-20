interface TransactionRecord {
  userId: string;
  amount: number;
  date: Date;
}

interface PaymentSummary {
  readonly totalReceipts: number;
  readonly transactions: ReadonlyArray<TransactionRecord>;
  readonly reconciledByAccounting: boolean;
}

interface PaymentProcessor {
  readonly chargeCreditCard: (
    cardNumber: string,
    amount: number
  ) => Promise<void>;

  readonly printPaymentSummaries: (
    startDate: Date,
    endDate?: Date
  ) => Promise<PaymentSummary>;
}
