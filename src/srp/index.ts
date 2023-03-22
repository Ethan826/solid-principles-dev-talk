import type { Newtype, RTE } from "../sf-fp";

interface TransactionRecord {
  readonly id: number;
  readonly amount: number;
  readonly date: Date;
}

interface PaymentSummary {
  readonly totalReceipts: number;
  readonly transactions: {
    readonly reconciled: ReadonlyArray<TransactionRecord>;
    readonly unreconciled: ReadonlyArray<TransactionRecord>;
  };
}

interface PaymentProcessor<ChargeCardReturn, SummarizePaymentsReturn> {
  readonly chargeCreditCard: (
    cardNumber: string,
    amount: number
  ) => ChargeCardReturn;

  readonly summarizePayments: (
    startDate: Date,
    endDate?: Date
  ) => SummarizePaymentsReturn;
}

// =============================================================================
// External collaborators
// =============================================================================

interface ExternalPaymentGateway {
  chargeCard: (cardNumber: string, amount: number) => Promise<void>;
}

interface AccountDatabase {
  addTransaction: (amount: number, date: Date) => Promise<number>;
  transactionIsReconciled: (id: number) => Promise<boolean>;
}

// =============================================================================
// OOP impl
// =============================================================================

declare function chargeCreditCardOop(
  cardNumber: string,
  amount: number
): Promise<number>;

declare function summarizePaymentsOop(
  startDate: Date,
  endDate?: Date
): Promise<PaymentSummary>;

export class ClassyPaymentProcessor
  implements PaymentProcessor<Promise<number>, Promise<PaymentSummary>>
{
  constructor(
    private externalPaymentGateway: ExternalPaymentGateway,
    private accountDatabase: AccountDatabase
  ) {}

  public chargeCreditCard: (
    cardNumber: string,
    amount: number
  ) => Promise<number> = chargeCreditCardOop;

  public summarizePayments: (
    startDate: Date,
    endDate?: Date
  ) => Promise<PaymentSummary> = summarizePaymentsOop;
}

// =============================================================================
// FP impl
// =============================================================================

export class PaymentGatewayError extends Error {}
export class AccountDatabaseError extends Error {}

// eslint-disable-next-line @typescript-eslint/ban-types
type ChargeCreditCardDeps = {};
// eslint-disable-next-line @typescript-eslint/ban-types
type SummarizePaymentsDeps = {};

type DatabaseId = Newtype<{ readonly DatabaseId: unique symbol }, number>;

declare function chargeCreditCardFp(
  cardNumber: string,
  amount: number
): RTE.ReaderTaskEither<ChargeCreditCardDeps, PaymentGatewayError, DatabaseId>;

declare function summarizePaymentsFp(
  startDate: Date,
  endDate?: Date | undefined
): RTE.ReaderTaskEither<
  SummarizePaymentsDeps,
  AccountDatabaseError,
  PaymentSummary
>;

export const FpPaymentProcessor: PaymentProcessor<
  RTE.ReaderTaskEither<ChargeCreditCardDeps, PaymentGatewayError, DatabaseId>,
  RTE.ReaderTaskEither<
    SummarizePaymentsDeps,
    AccountDatabaseError,
    PaymentSummary
  >
> = {
  chargeCreditCard: chargeCreditCardFp,
  summarizePayments: summarizePaymentsFp,
};
