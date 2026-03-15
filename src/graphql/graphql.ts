/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Bigdecimal: { input: any; output: any; }
  Boolean1: { input: any; output: any; }
  Date: { input: any; output: any; }
  Enum: { input: any; output: any; }
  Float64: { input: any; output: any; }
  Int32: { input: any; output: any; }
  Int64: { input: any; output: any; }
  String1: { input: any; output: any; }
  Timestamptz: { input: any; output: any; }
  Uuid: { input: any; output: any; }
};

export type BoolAggExp = {
  __typename?: 'BoolAggExp';
  _count: Scalars['Int64']['output'];
  _count_distinct: Scalars['Int64']['output'];
  bool_and?: Maybe<Scalars['Boolean1']['output']>;
  bool_or?: Maybe<Scalars['Boolean1']['output']>;
  every?: Maybe<Scalars['Boolean1']['output']>;
};

export type BoolBoolExp = {
  _and?: InputMaybe<Array<BoolBoolExp>>;
  _eq?: InputMaybe<Scalars['Boolean1']['input']>;
  _gt?: InputMaybe<Scalars['Boolean1']['input']>;
  _gte?: InputMaybe<Scalars['Boolean1']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean1']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean1']['input']>;
  _lte?: InputMaybe<Scalars['Boolean1']['input']>;
  _neq?: InputMaybe<Scalars['Boolean1']['input']>;
  _not?: InputMaybe<BoolBoolExp>;
  _or?: InputMaybe<Array<BoolBoolExp>>;
};

export type CategorySpendLimits = {
  __typename?: 'CategorySpendLimits';
  category: Scalars['String1']['output'];
  companyId: Scalars['Uuid']['output'];
  createdAt?: Maybe<Scalars['Timestamptz']['output']>;
  id: Scalars['Uuid']['output'];
  maxReceiptAmount: Scalars['Bigdecimal']['output'];
};

export type CategorySpendLimitsAggExp = {
  __typename?: 'CategorySpendLimitsAggExp';
  _count: Scalars['Int64']['output'];
  category: TextAggExp;
  companyId: UuidAggExp;
  createdAt: TimestamptzAggExp;
  id: UuidAggExp;
  maxReceiptAmount: NumericAggExp;
};

export type CategorySpendLimitsBoolExp = {
  _and?: InputMaybe<Array<CategorySpendLimitsBoolExp>>;
  _not?: InputMaybe<CategorySpendLimitsBoolExp>;
  _or?: InputMaybe<Array<CategorySpendLimitsBoolExp>>;
  category?: InputMaybe<TextBoolExp>;
  companyId?: InputMaybe<UuidBoolExp>;
  createdAt?: InputMaybe<TimestamptzBoolExp>;
  id?: InputMaybe<UuidBoolExp>;
  maxReceiptAmount?: InputMaybe<NumericBoolExp>;
};

export type CategorySpendLimitsFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CategorySpendLimitsOrderByExp>>;
  where?: InputMaybe<CategorySpendLimitsBoolExp>;
};

export type CategorySpendLimitsOrderByExp = {
  category?: InputMaybe<OrderBy>;
  companyId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  maxReceiptAmount?: InputMaybe<OrderBy>;
};

export type Companies = {
  __typename?: 'Companies';
  createdAt?: Maybe<Scalars['Timestamptz']['output']>;
  id: Scalars['Uuid']['output'];
  name: Scalars['String1']['output'];
  receipts?: Maybe<Array<Receipts>>;
  receiptsAggregate: ReceiptsAggExp;
  users?: Maybe<Array<Users>>;
  usersAggregate: UsersAggExp;
};


export type CompaniesReceiptsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ReceiptsOrderByExp>>;
  where?: InputMaybe<ReceiptsBoolExp>;
};


export type CompaniesReceiptsAggregateArgs = {
  filter_input?: InputMaybe<ReceiptsFilterInput>;
};


export type CompaniesUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderByExp>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type CompaniesUsersAggregateArgs = {
  filter_input?: InputMaybe<UsersFilterInput>;
};

export type CompaniesAggExp = {
  __typename?: 'CompaniesAggExp';
  _count: Scalars['Int64']['output'];
  createdAt: TimestamptzAggExp;
  id: UuidAggExp;
  name: TextAggExp;
};

export type CompaniesBoolExp = {
  _and?: InputMaybe<Array<CompaniesBoolExp>>;
  _not?: InputMaybe<CompaniesBoolExp>;
  _or?: InputMaybe<Array<CompaniesBoolExp>>;
  createdAt?: InputMaybe<TimestamptzBoolExp>;
  id?: InputMaybe<UuidBoolExp>;
  name?: InputMaybe<TextBoolExp>;
  receipts?: InputMaybe<ReceiptsBoolExp>;
  users?: InputMaybe<UsersBoolExp>;
};

export type CompaniesFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CompaniesOrderByExp>>;
  where?: InputMaybe<CompaniesBoolExp>;
};

export type CompaniesOrderByExp = {
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
};

export type DashboardAlerts = {
  __typename?: 'DashboardAlerts';
  alertId?: Maybe<Scalars['String1']['output']>;
  alertType?: Maybe<Scalars['String1']['output']>;
  amount?: Maybe<Scalars['Bigdecimal']['output']>;
  category?: Maybe<Scalars['String1']['output']>;
  companyId?: Maybe<Scalars['Uuid']['output']>;
  countValue?: Maybe<Scalars['Int64']['output']>;
  employeeCount?: Maybe<Scalars['Int64']['output']>;
  limitAmount?: Maybe<Scalars['Bigdecimal']['output']>;
  maxPrice?: Maybe<Scalars['Bigdecimal']['output']>;
  minPrice?: Maybe<Scalars['Bigdecimal']['output']>;
  percentDelta?: Maybe<Scalars['Bigdecimal']['output']>;
  periodKey?: Maybe<Scalars['String1']['output']>;
  priority?: Maybe<Scalars['Bigdecimal']['output']>;
  productName?: Maybe<Scalars['String1']['output']>;
  receiptId?: Maybe<Scalars['Uuid']['output']>;
  teamMedian?: Maybe<Scalars['Float64']['output']>;
  teamTotalSpent?: Maybe<Scalars['Bigdecimal']['output']>;
  userId?: Maybe<Scalars['Uuid']['output']>;
  userName?: Maybe<Scalars['String1']['output']>;
  vendorName?: Maybe<Scalars['String1']['output']>;
  vendorTaxId?: Maybe<Scalars['String1']['output']>;
};

export type DashboardAlertsAggExp = {
  __typename?: 'DashboardAlertsAggExp';
  _count: Scalars['Int64']['output'];
  alertId: TextAggExp;
  alertType: TextAggExp;
  amount: NumericAggExp;
  category: TextAggExp;
  companyId: UuidAggExp;
  countValue: Int8AggExp;
  employeeCount: Int8AggExp;
  limitAmount: NumericAggExp;
  maxPrice: NumericAggExp;
  minPrice: NumericAggExp;
  percentDelta: NumericAggExp;
  periodKey: TextAggExp;
  priority: NumericAggExp;
  productName: TextAggExp;
  receiptId: UuidAggExp;
  teamMedian: Float8AggExp;
  teamTotalSpent: NumericAggExp;
  userId: UuidAggExp;
  userName: TextAggExp;
  vendorName: TextAggExp;
  vendorTaxId: TextAggExp;
};

export type DashboardAlertsBoolExp = {
  _and?: InputMaybe<Array<DashboardAlertsBoolExp>>;
  _not?: InputMaybe<DashboardAlertsBoolExp>;
  _or?: InputMaybe<Array<DashboardAlertsBoolExp>>;
  alertId?: InputMaybe<TextBoolExp>;
  alertType?: InputMaybe<TextBoolExp>;
  amount?: InputMaybe<NumericBoolExp>;
  category?: InputMaybe<TextBoolExp>;
  companyId?: InputMaybe<UuidBoolExp>;
  countValue?: InputMaybe<Int8BoolExp>;
  employeeCount?: InputMaybe<Int8BoolExp>;
  limitAmount?: InputMaybe<NumericBoolExp>;
  maxPrice?: InputMaybe<NumericBoolExp>;
  minPrice?: InputMaybe<NumericBoolExp>;
  percentDelta?: InputMaybe<NumericBoolExp>;
  periodKey?: InputMaybe<TextBoolExp>;
  priority?: InputMaybe<NumericBoolExp>;
  productName?: InputMaybe<TextBoolExp>;
  receiptId?: InputMaybe<UuidBoolExp>;
  teamMedian?: InputMaybe<Float8BoolExp>;
  teamTotalSpent?: InputMaybe<NumericBoolExp>;
  userId?: InputMaybe<UuidBoolExp>;
  userName?: InputMaybe<TextBoolExp>;
  vendorName?: InputMaybe<TextBoolExp>;
  vendorTaxId?: InputMaybe<TextBoolExp>;
};

export type DashboardAlertsFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardAlertsOrderByExp>>;
  where?: InputMaybe<DashboardAlertsBoolExp>;
};

export type DashboardAlertsOrderByExp = {
  alertId?: InputMaybe<OrderBy>;
  alertType?: InputMaybe<OrderBy>;
  amount?: InputMaybe<OrderBy>;
  category?: InputMaybe<OrderBy>;
  companyId?: InputMaybe<OrderBy>;
  countValue?: InputMaybe<OrderBy>;
  employeeCount?: InputMaybe<OrderBy>;
  limitAmount?: InputMaybe<OrderBy>;
  maxPrice?: InputMaybe<OrderBy>;
  minPrice?: InputMaybe<OrderBy>;
  percentDelta?: InputMaybe<OrderBy>;
  periodKey?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  productName?: InputMaybe<OrderBy>;
  receiptId?: InputMaybe<OrderBy>;
  teamMedian?: InputMaybe<OrderBy>;
  teamTotalSpent?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  userName?: InputMaybe<OrderBy>;
  vendorName?: InputMaybe<OrderBy>;
  vendorTaxId?: InputMaybe<OrderBy>;
};

export type DashboardCategorySpend = {
  __typename?: 'DashboardCategorySpend';
  category?: Maybe<Scalars['String1']['output']>;
  companyId?: Maybe<Scalars['Uuid']['output']>;
  periodKey?: Maybe<Scalars['String1']['output']>;
  ratio?: Maybe<Scalars['Bigdecimal']['output']>;
  totalSpent?: Maybe<Scalars['Bigdecimal']['output']>;
};

export type DashboardCategorySpendAggExp = {
  __typename?: 'DashboardCategorySpendAggExp';
  _count: Scalars['Int64']['output'];
  category: TextAggExp;
  companyId: UuidAggExp;
  periodKey: TextAggExp;
  ratio: NumericAggExp;
  totalSpent: NumericAggExp;
};

export type DashboardCategorySpendBoolExp = {
  _and?: InputMaybe<Array<DashboardCategorySpendBoolExp>>;
  _not?: InputMaybe<DashboardCategorySpendBoolExp>;
  _or?: InputMaybe<Array<DashboardCategorySpendBoolExp>>;
  category?: InputMaybe<TextBoolExp>;
  companyId?: InputMaybe<UuidBoolExp>;
  periodKey?: InputMaybe<TextBoolExp>;
  ratio?: InputMaybe<NumericBoolExp>;
  totalSpent?: InputMaybe<NumericBoolExp>;
};

export type DashboardCategorySpendFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardCategorySpendOrderByExp>>;
  where?: InputMaybe<DashboardCategorySpendBoolExp>;
};

export type DashboardCategorySpendOrderByExp = {
  category?: InputMaybe<OrderBy>;
  companyId?: InputMaybe<OrderBy>;
  periodKey?: InputMaybe<OrderBy>;
  ratio?: InputMaybe<OrderBy>;
  totalSpent?: InputMaybe<OrderBy>;
};

export type DashboardEmployeeSpend = {
  __typename?: 'DashboardEmployeeSpend';
  companyId?: Maybe<Scalars['Uuid']['output']>;
  periodKey?: Maybe<Scalars['String1']['output']>;
  receiptCount?: Maybe<Scalars['Int64']['output']>;
  topCategory?: Maybe<Scalars['String1']['output']>;
  totalSpent?: Maybe<Scalars['Bigdecimal']['output']>;
  userId?: Maybe<Scalars['Uuid']['output']>;
  userName?: Maybe<Scalars['String1']['output']>;
};

export type DashboardEmployeeSpendAggExp = {
  __typename?: 'DashboardEmployeeSpendAggExp';
  _count: Scalars['Int64']['output'];
  companyId: UuidAggExp;
  periodKey: TextAggExp;
  receiptCount: Int8AggExp;
  topCategory: TextAggExp;
  totalSpent: NumericAggExp;
  userId: UuidAggExp;
  userName: TextAggExp;
};

export type DashboardEmployeeSpendBoolExp = {
  _and?: InputMaybe<Array<DashboardEmployeeSpendBoolExp>>;
  _not?: InputMaybe<DashboardEmployeeSpendBoolExp>;
  _or?: InputMaybe<Array<DashboardEmployeeSpendBoolExp>>;
  companyId?: InputMaybe<UuidBoolExp>;
  periodKey?: InputMaybe<TextBoolExp>;
  receiptCount?: InputMaybe<Int8BoolExp>;
  topCategory?: InputMaybe<TextBoolExp>;
  totalSpent?: InputMaybe<NumericBoolExp>;
  userId?: InputMaybe<UuidBoolExp>;
  userName?: InputMaybe<TextBoolExp>;
};

export type DashboardEmployeeSpendFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardEmployeeSpendOrderByExp>>;
  where?: InputMaybe<DashboardEmployeeSpendBoolExp>;
};

export type DashboardEmployeeSpendOrderByExp = {
  companyId?: InputMaybe<OrderBy>;
  periodKey?: InputMaybe<OrderBy>;
  receiptCount?: InputMaybe<OrderBy>;
  topCategory?: InputMaybe<OrderBy>;
  totalSpent?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  userName?: InputMaybe<OrderBy>;
};

export type DashboardProducts = {
  __typename?: 'DashboardProducts';
  companyId?: Maybe<Scalars['Uuid']['output']>;
  employeeCount?: Maybe<Scalars['Int64']['output']>;
  maxUnitPrice?: Maybe<Scalars['Bigdecimal']['output']>;
  minUnitPrice?: Maybe<Scalars['Bigdecimal']['output']>;
  periodKey?: Maybe<Scalars['String1']['output']>;
  productName?: Maybe<Scalars['String1']['output']>;
  purchaseCount?: Maybe<Scalars['Int64']['output']>;
  totalQuantity?: Maybe<Scalars['Bigdecimal']['output']>;
  totalSpent?: Maybe<Scalars['Bigdecimal']['output']>;
};

export type DashboardProductsAggExp = {
  __typename?: 'DashboardProductsAggExp';
  _count: Scalars['Int64']['output'];
  companyId: UuidAggExp;
  employeeCount: Int8AggExp;
  maxUnitPrice: NumericAggExp;
  minUnitPrice: NumericAggExp;
  periodKey: TextAggExp;
  productName: TextAggExp;
  purchaseCount: Int8AggExp;
  totalQuantity: NumericAggExp;
  totalSpent: NumericAggExp;
};

export type DashboardProductsBoolExp = {
  _and?: InputMaybe<Array<DashboardProductsBoolExp>>;
  _not?: InputMaybe<DashboardProductsBoolExp>;
  _or?: InputMaybe<Array<DashboardProductsBoolExp>>;
  companyId?: InputMaybe<UuidBoolExp>;
  employeeCount?: InputMaybe<Int8BoolExp>;
  maxUnitPrice?: InputMaybe<NumericBoolExp>;
  minUnitPrice?: InputMaybe<NumericBoolExp>;
  periodKey?: InputMaybe<TextBoolExp>;
  productName?: InputMaybe<TextBoolExp>;
  purchaseCount?: InputMaybe<Int8BoolExp>;
  totalQuantity?: InputMaybe<NumericBoolExp>;
  totalSpent?: InputMaybe<NumericBoolExp>;
};

export type DashboardProductsFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardProductsOrderByExp>>;
  where?: InputMaybe<DashboardProductsBoolExp>;
};

export type DashboardProductsOrderByExp = {
  companyId?: InputMaybe<OrderBy>;
  employeeCount?: InputMaybe<OrderBy>;
  maxUnitPrice?: InputMaybe<OrderBy>;
  minUnitPrice?: InputMaybe<OrderBy>;
  periodKey?: InputMaybe<OrderBy>;
  productName?: InputMaybe<OrderBy>;
  purchaseCount?: InputMaybe<OrderBy>;
  totalQuantity?: InputMaybe<OrderBy>;
  totalSpent?: InputMaybe<OrderBy>;
};

export type DashboardReceiptHistory = {
  __typename?: 'DashboardReceiptHistory';
  companyId?: Maybe<Scalars['Uuid']['output']>;
  createdAt?: Maybe<Scalars['Timestamptz']['output']>;
  flaggedReason?: Maybe<Scalars['String1']['output']>;
  imageUrl?: Maybe<Scalars['String1']['output']>;
  itemCount?: Maybe<Scalars['Int64']['output']>;
  periodKey?: Maybe<Scalars['String1']['output']>;
  primaryCategory?: Maybe<Scalars['String1']['output']>;
  rawText?: Maybe<Scalars['String1']['output']>;
  receiptDate?: Maybe<Scalars['Date']['output']>;
  receiptId?: Maybe<Scalars['Uuid']['output']>;
  status?: Maybe<Scalars['String1']['output']>;
  totalAmount?: Maybe<Scalars['Bigdecimal']['output']>;
  userId?: Maybe<Scalars['Uuid']['output']>;
  userName?: Maybe<Scalars['String1']['output']>;
  vendorName?: Maybe<Scalars['String1']['output']>;
  vendorTaxId?: Maybe<Scalars['String1']['output']>;
  vendorTaxIdValid?: Maybe<Scalars['Boolean1']['output']>;
};

export type DashboardReceiptHistoryAggExp = {
  __typename?: 'DashboardReceiptHistoryAggExp';
  _count: Scalars['Int64']['output'];
  companyId: UuidAggExp;
  createdAt: TimestamptzAggExp;
  flaggedReason: TextAggExp;
  imageUrl: TextAggExp;
  itemCount: Int8AggExp;
  periodKey: TextAggExp;
  primaryCategory: TextAggExp;
  rawText: TextAggExp;
  receiptDate: DateAggExp;
  receiptId: UuidAggExp;
  status: TextAggExp;
  totalAmount: NumericAggExp;
  userId: UuidAggExp;
  userName: TextAggExp;
  vendorName: TextAggExp;
  vendorTaxId: TextAggExp;
  vendorTaxIdValid: BoolAggExp;
};

export type DashboardReceiptHistoryBoolExp = {
  _and?: InputMaybe<Array<DashboardReceiptHistoryBoolExp>>;
  _not?: InputMaybe<DashboardReceiptHistoryBoolExp>;
  _or?: InputMaybe<Array<DashboardReceiptHistoryBoolExp>>;
  companyId?: InputMaybe<UuidBoolExp>;
  createdAt?: InputMaybe<TimestamptzBoolExp>;
  flaggedReason?: InputMaybe<TextBoolExp>;
  imageUrl?: InputMaybe<TextBoolExp>;
  itemCount?: InputMaybe<Int8BoolExp>;
  periodKey?: InputMaybe<TextBoolExp>;
  primaryCategory?: InputMaybe<TextBoolExp>;
  rawText?: InputMaybe<TextBoolExp>;
  receiptDate?: InputMaybe<DateBoolExp>;
  receiptId?: InputMaybe<UuidBoolExp>;
  status?: InputMaybe<TextBoolExp>;
  totalAmount?: InputMaybe<NumericBoolExp>;
  userId?: InputMaybe<UuidBoolExp>;
  userName?: InputMaybe<TextBoolExp>;
  vendorName?: InputMaybe<TextBoolExp>;
  vendorTaxId?: InputMaybe<TextBoolExp>;
  vendorTaxIdValid?: InputMaybe<BoolBoolExp>;
};

export type DashboardReceiptHistoryFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardReceiptHistoryOrderByExp>>;
  where?: InputMaybe<DashboardReceiptHistoryBoolExp>;
};

export type DashboardReceiptHistoryOrderByExp = {
  companyId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  flaggedReason?: InputMaybe<OrderBy>;
  imageUrl?: InputMaybe<OrderBy>;
  itemCount?: InputMaybe<OrderBy>;
  periodKey?: InputMaybe<OrderBy>;
  primaryCategory?: InputMaybe<OrderBy>;
  rawText?: InputMaybe<OrderBy>;
  receiptDate?: InputMaybe<OrderBy>;
  receiptId?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  userName?: InputMaybe<OrderBy>;
  vendorName?: InputMaybe<OrderBy>;
  vendorTaxId?: InputMaybe<OrderBy>;
  vendorTaxIdValid?: InputMaybe<OrderBy>;
};

export type DashboardReceiptItemsPeriodized = {
  __typename?: 'DashboardReceiptItemsPeriodized';
  category?: Maybe<Scalars['String1']['output']>;
  companyId?: Maybe<Scalars['Uuid']['output']>;
  createdAt?: Maybe<Scalars['Timestamptz']['output']>;
  dashboardCategory?: Maybe<Scalars['String1']['output']>;
  flaggedReason?: Maybe<Scalars['String1']['output']>;
  imageUrl?: Maybe<Scalars['String1']['output']>;
  itemId?: Maybe<Scalars['Uuid']['output']>;
  normalizedDescription?: Maybe<Scalars['String1']['output']>;
  periodKey?: Maybe<Scalars['String1']['output']>;
  quantity?: Maybe<Scalars['Bigdecimal']['output']>;
  rawDescription?: Maybe<Scalars['String1']['output']>;
  rawText?: Maybe<Scalars['String1']['output']>;
  receiptDate?: Maybe<Scalars['Date']['output']>;
  receiptId?: Maybe<Scalars['Uuid']['output']>;
  sourceText?: Maybe<Scalars['String1']['output']>;
  status?: Maybe<Scalars['String1']['output']>;
  totalAmount?: Maybe<Scalars['Bigdecimal']['output']>;
  totalPrice?: Maybe<Scalars['Bigdecimal']['output']>;
  unitPrice?: Maybe<Scalars['Bigdecimal']['output']>;
  userId?: Maybe<Scalars['Uuid']['output']>;
  userName?: Maybe<Scalars['String1']['output']>;
  vendorName?: Maybe<Scalars['String1']['output']>;
  vendorTaxId?: Maybe<Scalars['String1']['output']>;
  vendorTaxIdValid?: Maybe<Scalars['Boolean1']['output']>;
};

export type DashboardReceiptItemsPeriodizedAggExp = {
  __typename?: 'DashboardReceiptItemsPeriodizedAggExp';
  _count: Scalars['Int64']['output'];
  category: TextAggExp;
  companyId: UuidAggExp;
  createdAt: TimestamptzAggExp;
  dashboardCategory: TextAggExp;
  flaggedReason: TextAggExp;
  imageUrl: TextAggExp;
  itemId: UuidAggExp;
  normalizedDescription: TextAggExp;
  periodKey: TextAggExp;
  quantity: NumericAggExp;
  rawDescription: TextAggExp;
  rawText: TextAggExp;
  receiptDate: DateAggExp;
  receiptId: UuidAggExp;
  sourceText: TextAggExp;
  status: TextAggExp;
  totalAmount: NumericAggExp;
  totalPrice: NumericAggExp;
  unitPrice: NumericAggExp;
  userId: UuidAggExp;
  userName: TextAggExp;
  vendorName: TextAggExp;
  vendorTaxId: TextAggExp;
  vendorTaxIdValid: BoolAggExp;
};

export type DashboardReceiptItemsPeriodizedBoolExp = {
  _and?: InputMaybe<Array<DashboardReceiptItemsPeriodizedBoolExp>>;
  _not?: InputMaybe<DashboardReceiptItemsPeriodizedBoolExp>;
  _or?: InputMaybe<Array<DashboardReceiptItemsPeriodizedBoolExp>>;
  category?: InputMaybe<TextBoolExp>;
  companyId?: InputMaybe<UuidBoolExp>;
  createdAt?: InputMaybe<TimestamptzBoolExp>;
  dashboardCategory?: InputMaybe<TextBoolExp>;
  flaggedReason?: InputMaybe<TextBoolExp>;
  imageUrl?: InputMaybe<TextBoolExp>;
  itemId?: InputMaybe<UuidBoolExp>;
  normalizedDescription?: InputMaybe<TextBoolExp>;
  periodKey?: InputMaybe<TextBoolExp>;
  quantity?: InputMaybe<NumericBoolExp>;
  rawDescription?: InputMaybe<TextBoolExp>;
  rawText?: InputMaybe<TextBoolExp>;
  receiptDate?: InputMaybe<DateBoolExp>;
  receiptId?: InputMaybe<UuidBoolExp>;
  sourceText?: InputMaybe<TextBoolExp>;
  status?: InputMaybe<TextBoolExp>;
  totalAmount?: InputMaybe<NumericBoolExp>;
  totalPrice?: InputMaybe<NumericBoolExp>;
  unitPrice?: InputMaybe<NumericBoolExp>;
  userId?: InputMaybe<UuidBoolExp>;
  userName?: InputMaybe<TextBoolExp>;
  vendorName?: InputMaybe<TextBoolExp>;
  vendorTaxId?: InputMaybe<TextBoolExp>;
  vendorTaxIdValid?: InputMaybe<BoolBoolExp>;
};

export type DashboardReceiptItemsPeriodizedFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardReceiptItemsPeriodizedOrderByExp>>;
  where?: InputMaybe<DashboardReceiptItemsPeriodizedBoolExp>;
};

export type DashboardReceiptItemsPeriodizedOrderByExp = {
  category?: InputMaybe<OrderBy>;
  companyId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  dashboardCategory?: InputMaybe<OrderBy>;
  flaggedReason?: InputMaybe<OrderBy>;
  imageUrl?: InputMaybe<OrderBy>;
  itemId?: InputMaybe<OrderBy>;
  normalizedDescription?: InputMaybe<OrderBy>;
  periodKey?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  rawDescription?: InputMaybe<OrderBy>;
  rawText?: InputMaybe<OrderBy>;
  receiptDate?: InputMaybe<OrderBy>;
  receiptId?: InputMaybe<OrderBy>;
  sourceText?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  totalPrice?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  userName?: InputMaybe<OrderBy>;
  vendorName?: InputMaybe<OrderBy>;
  vendorTaxId?: InputMaybe<OrderBy>;
  vendorTaxIdValid?: InputMaybe<OrderBy>;
};

export type DashboardReceiptsPeriodized = {
  __typename?: 'DashboardReceiptsPeriodized';
  companyId?: Maybe<Scalars['Uuid']['output']>;
  createdAt?: Maybe<Scalars['Timestamptz']['output']>;
  flaggedReason?: Maybe<Scalars['String1']['output']>;
  imageUrl?: Maybe<Scalars['String1']['output']>;
  periodKey?: Maybe<Scalars['String1']['output']>;
  rawText?: Maybe<Scalars['String1']['output']>;
  receiptDate?: Maybe<Scalars['Date']['output']>;
  receiptId?: Maybe<Scalars['Uuid']['output']>;
  status?: Maybe<Scalars['String1']['output']>;
  totalAmount?: Maybe<Scalars['Bigdecimal']['output']>;
  userId?: Maybe<Scalars['Uuid']['output']>;
  userName?: Maybe<Scalars['String1']['output']>;
  vendorName?: Maybe<Scalars['String1']['output']>;
  vendorTaxId?: Maybe<Scalars['String1']['output']>;
  vendorTaxIdValid?: Maybe<Scalars['Boolean1']['output']>;
};

export type DashboardReceiptsPeriodizedAggExp = {
  __typename?: 'DashboardReceiptsPeriodizedAggExp';
  _count: Scalars['Int64']['output'];
  companyId: UuidAggExp;
  createdAt: TimestamptzAggExp;
  flaggedReason: TextAggExp;
  imageUrl: TextAggExp;
  periodKey: TextAggExp;
  rawText: TextAggExp;
  receiptDate: DateAggExp;
  receiptId: UuidAggExp;
  status: TextAggExp;
  totalAmount: NumericAggExp;
  userId: UuidAggExp;
  userName: TextAggExp;
  vendorName: TextAggExp;
  vendorTaxId: TextAggExp;
  vendorTaxIdValid: BoolAggExp;
};

export type DashboardReceiptsPeriodizedBoolExp = {
  _and?: InputMaybe<Array<DashboardReceiptsPeriodizedBoolExp>>;
  _not?: InputMaybe<DashboardReceiptsPeriodizedBoolExp>;
  _or?: InputMaybe<Array<DashboardReceiptsPeriodizedBoolExp>>;
  companyId?: InputMaybe<UuidBoolExp>;
  createdAt?: InputMaybe<TimestamptzBoolExp>;
  flaggedReason?: InputMaybe<TextBoolExp>;
  imageUrl?: InputMaybe<TextBoolExp>;
  periodKey?: InputMaybe<TextBoolExp>;
  rawText?: InputMaybe<TextBoolExp>;
  receiptDate?: InputMaybe<DateBoolExp>;
  receiptId?: InputMaybe<UuidBoolExp>;
  status?: InputMaybe<TextBoolExp>;
  totalAmount?: InputMaybe<NumericBoolExp>;
  userId?: InputMaybe<UuidBoolExp>;
  userName?: InputMaybe<TextBoolExp>;
  vendorName?: InputMaybe<TextBoolExp>;
  vendorTaxId?: InputMaybe<TextBoolExp>;
  vendorTaxIdValid?: InputMaybe<BoolBoolExp>;
};

export type DashboardReceiptsPeriodizedFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardReceiptsPeriodizedOrderByExp>>;
  where?: InputMaybe<DashboardReceiptsPeriodizedBoolExp>;
};

export type DashboardReceiptsPeriodizedOrderByExp = {
  companyId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  flaggedReason?: InputMaybe<OrderBy>;
  imageUrl?: InputMaybe<OrderBy>;
  periodKey?: InputMaybe<OrderBy>;
  rawText?: InputMaybe<OrderBy>;
  receiptDate?: InputMaybe<OrderBy>;
  receiptId?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  userName?: InputMaybe<OrderBy>;
  vendorName?: InputMaybe<OrderBy>;
  vendorTaxId?: InputMaybe<OrderBy>;
  vendorTaxIdValid?: InputMaybe<OrderBy>;
};

export type DashboardSummary = {
  __typename?: 'DashboardSummary';
  companyId?: Maybe<Scalars['Uuid']['output']>;
  periodKey?: Maybe<Scalars['String1']['output']>;
  receiptsProcessed?: Maybe<Scalars['Int64']['output']>;
  totalSpent?: Maybe<Scalars['Bigdecimal']['output']>;
  uniqueEmployees?: Maybe<Scalars['Int64']['output']>;
  uniqueProducts?: Maybe<Scalars['Int64']['output']>;
};

export type DashboardSummaryAggExp = {
  __typename?: 'DashboardSummaryAggExp';
  _count: Scalars['Int64']['output'];
  companyId: UuidAggExp;
  periodKey: TextAggExp;
  receiptsProcessed: Int8AggExp;
  totalSpent: NumericAggExp;
  uniqueEmployees: Int8AggExp;
  uniqueProducts: Int8AggExp;
};

export type DashboardSummaryBoolExp = {
  _and?: InputMaybe<Array<DashboardSummaryBoolExp>>;
  _not?: InputMaybe<DashboardSummaryBoolExp>;
  _or?: InputMaybe<Array<DashboardSummaryBoolExp>>;
  companyId?: InputMaybe<UuidBoolExp>;
  periodKey?: InputMaybe<TextBoolExp>;
  receiptsProcessed?: InputMaybe<Int8BoolExp>;
  totalSpent?: InputMaybe<NumericBoolExp>;
  uniqueEmployees?: InputMaybe<Int8BoolExp>;
  uniqueProducts?: InputMaybe<Int8BoolExp>;
};

export type DashboardSummaryFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardSummaryOrderByExp>>;
  where?: InputMaybe<DashboardSummaryBoolExp>;
};

export type DashboardSummaryOrderByExp = {
  companyId?: InputMaybe<OrderBy>;
  periodKey?: InputMaybe<OrderBy>;
  receiptsProcessed?: InputMaybe<OrderBy>;
  totalSpent?: InputMaybe<OrderBy>;
  uniqueEmployees?: InputMaybe<OrderBy>;
  uniqueProducts?: InputMaybe<OrderBy>;
};

export type DateAggExp = {
  __typename?: 'DateAggExp';
  _count: Scalars['Int64']['output'];
  _count_distinct: Scalars['Int64']['output'];
  max?: Maybe<Scalars['Date']['output']>;
  min?: Maybe<Scalars['Date']['output']>;
};

export type DateBoolExp = {
  _and?: InputMaybe<Array<DateBoolExp>>;
  _eq?: InputMaybe<Scalars['Date']['input']>;
  _gt?: InputMaybe<Scalars['Date']['input']>;
  _gte?: InputMaybe<Scalars['Date']['input']>;
  _in?: InputMaybe<Array<Scalars['Date']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Date']['input']>;
  _lte?: InputMaybe<Scalars['Date']['input']>;
  _neq?: InputMaybe<Scalars['Date']['input']>;
  _not?: InputMaybe<DateBoolExp>;
  _or?: InputMaybe<Array<DateBoolExp>>;
};

/** Responses from the 'delete_category_spend_limits_by_category_and_company_id' procedure */
export type DeleteCategorySpendLimitsByCategoryAndCompanyIdResponse = {
  __typename?: 'DeleteCategorySpendLimitsByCategoryAndCompanyIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<CategorySpendLimits>;
};

/** Responses from the 'delete_category_spend_limits_by_id' procedure */
export type DeleteCategorySpendLimitsByIdResponse = {
  __typename?: 'DeleteCategorySpendLimitsByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<CategorySpendLimits>;
};

/** Responses from the 'delete_companies_by_id' procedure */
export type DeleteCompaniesByIdResponse = {
  __typename?: 'DeleteCompaniesByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Companies>;
};

/** Responses from the 'delete_receipt_items_by_id' procedure */
export type DeleteReceiptItemsByIdResponse = {
  __typename?: 'DeleteReceiptItemsByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<ReceiptItems>;
};

/** Responses from the 'delete_receipts_by_id' procedure */
export type DeleteReceiptsByIdResponse = {
  __typename?: 'DeleteReceiptsByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Receipts>;
};

/** Responses from the 'delete_spend_policies_by_category_and_company_id' procedure */
export type DeleteSpendPoliciesByCategoryAndCompanyIdResponse = {
  __typename?: 'DeleteSpendPoliciesByCategoryAndCompanyIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<SpendPolicies>;
};

/** Responses from the 'delete_spend_policies_by_id' procedure */
export type DeleteSpendPoliciesByIdResponse = {
  __typename?: 'DeleteSpendPoliciesByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<SpendPolicies>;
};

/** Responses from the 'delete_users_by_email' procedure */
export type DeleteUsersByEmailResponse = {
  __typename?: 'DeleteUsersByEmailResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Users>;
};

/** Responses from the 'delete_users_by_id' procedure */
export type DeleteUsersByIdResponse = {
  __typename?: 'DeleteUsersByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Users>;
};

export type Float8AggExp = {
  __typename?: 'Float8AggExp';
  _count: Scalars['Int64']['output'];
  _count_distinct: Scalars['Int64']['output'];
  avg?: Maybe<Scalars['Float64']['output']>;
  max?: Maybe<Scalars['Float64']['output']>;
  min?: Maybe<Scalars['Float64']['output']>;
  stddev?: Maybe<Scalars['Float64']['output']>;
  stddev_pop?: Maybe<Scalars['Float64']['output']>;
  stddev_samp?: Maybe<Scalars['Float64']['output']>;
  sum?: Maybe<Scalars['Float64']['output']>;
  var_pop?: Maybe<Scalars['Float64']['output']>;
  var_samp?: Maybe<Scalars['Float64']['output']>;
  variance?: Maybe<Scalars['Float64']['output']>;
};

export type Float8BoolExp = {
  _and?: InputMaybe<Array<Float8BoolExp>>;
  _eq?: InputMaybe<Scalars['Float64']['input']>;
  _gt?: InputMaybe<Scalars['Float64']['input']>;
  _gte?: InputMaybe<Scalars['Float64']['input']>;
  _in?: InputMaybe<Array<Scalars['Float64']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Float64']['input']>;
  _lte?: InputMaybe<Scalars['Float64']['input']>;
  _neq?: InputMaybe<Scalars['Float64']['input']>;
  _not?: InputMaybe<Float8BoolExp>;
  _or?: InputMaybe<Array<Float8BoolExp>>;
};

export type InsertCategorySpendLimitsObjectInput = {
  category: Scalars['String1']['input'];
  companyId: Scalars['Uuid']['input'];
  createdAt?: InputMaybe<Scalars['Timestamptz']['input']>;
  id?: InputMaybe<Scalars['Uuid']['input']>;
  maxReceiptAmount: Scalars['Bigdecimal']['input'];
};

/** Responses from the 'insert_category_spend_limits' procedure */
export type InsertCategorySpendLimitsResponse = {
  __typename?: 'InsertCategorySpendLimitsResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<CategorySpendLimits>;
};

export type InsertCompaniesObjectInput = {
  createdAt?: InputMaybe<Scalars['Timestamptz']['input']>;
  id?: InputMaybe<Scalars['Uuid']['input']>;
  name: Scalars['String1']['input'];
};

/** Responses from the 'insert_companies' procedure */
export type InsertCompaniesResponse = {
  __typename?: 'InsertCompaniesResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Companies>;
};

export type InsertDashboardAlertsObjectInput = {
  alertId?: InputMaybe<Scalars['String1']['input']>;
  alertType?: InputMaybe<Scalars['String1']['input']>;
  amount?: InputMaybe<Scalars['Bigdecimal']['input']>;
  category?: InputMaybe<Scalars['String1']['input']>;
  companyId?: InputMaybe<Scalars['Uuid']['input']>;
  countValue?: InputMaybe<Scalars['Int64']['input']>;
  employeeCount?: InputMaybe<Scalars['Int64']['input']>;
  limitAmount?: InputMaybe<Scalars['Bigdecimal']['input']>;
  maxPrice?: InputMaybe<Scalars['Bigdecimal']['input']>;
  minPrice?: InputMaybe<Scalars['Bigdecimal']['input']>;
  percentDelta?: InputMaybe<Scalars['Bigdecimal']['input']>;
  periodKey?: InputMaybe<Scalars['String1']['input']>;
  priority?: InputMaybe<Scalars['Bigdecimal']['input']>;
  productName?: InputMaybe<Scalars['String1']['input']>;
  receiptId?: InputMaybe<Scalars['Uuid']['input']>;
  teamMedian?: InputMaybe<Scalars['Float64']['input']>;
  teamTotalSpent?: InputMaybe<Scalars['Bigdecimal']['input']>;
  userId?: InputMaybe<Scalars['Uuid']['input']>;
  userName?: InputMaybe<Scalars['String1']['input']>;
  vendorName?: InputMaybe<Scalars['String1']['input']>;
  vendorTaxId?: InputMaybe<Scalars['String1']['input']>;
};

/** Responses from the 'insert_dashboard_alerts' procedure */
export type InsertDashboardAlertsResponse = {
  __typename?: 'InsertDashboardAlertsResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<DashboardAlerts>;
};

export type InsertDashboardCategorySpendObjectInput = {
  category?: InputMaybe<Scalars['String1']['input']>;
  companyId?: InputMaybe<Scalars['Uuid']['input']>;
  periodKey?: InputMaybe<Scalars['String1']['input']>;
  ratio?: InputMaybe<Scalars['Bigdecimal']['input']>;
  totalSpent?: InputMaybe<Scalars['Bigdecimal']['input']>;
};

/** Responses from the 'insert_dashboard_category_spend' procedure */
export type InsertDashboardCategorySpendResponse = {
  __typename?: 'InsertDashboardCategorySpendResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<DashboardCategorySpend>;
};

export type InsertDashboardEmployeeSpendObjectInput = {
  companyId?: InputMaybe<Scalars['Uuid']['input']>;
  periodKey?: InputMaybe<Scalars['String1']['input']>;
  receiptCount?: InputMaybe<Scalars['Int64']['input']>;
  topCategory?: InputMaybe<Scalars['String1']['input']>;
  totalSpent?: InputMaybe<Scalars['Bigdecimal']['input']>;
  userId?: InputMaybe<Scalars['Uuid']['input']>;
  userName?: InputMaybe<Scalars['String1']['input']>;
};

/** Responses from the 'insert_dashboard_employee_spend' procedure */
export type InsertDashboardEmployeeSpendResponse = {
  __typename?: 'InsertDashboardEmployeeSpendResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<DashboardEmployeeSpend>;
};

export type InsertDashboardProductsObjectInput = {
  companyId?: InputMaybe<Scalars['Uuid']['input']>;
  employeeCount?: InputMaybe<Scalars['Int64']['input']>;
  maxUnitPrice?: InputMaybe<Scalars['Bigdecimal']['input']>;
  minUnitPrice?: InputMaybe<Scalars['Bigdecimal']['input']>;
  periodKey?: InputMaybe<Scalars['String1']['input']>;
  productName?: InputMaybe<Scalars['String1']['input']>;
  purchaseCount?: InputMaybe<Scalars['Int64']['input']>;
  totalQuantity?: InputMaybe<Scalars['Bigdecimal']['input']>;
  totalSpent?: InputMaybe<Scalars['Bigdecimal']['input']>;
};

/** Responses from the 'insert_dashboard_products' procedure */
export type InsertDashboardProductsResponse = {
  __typename?: 'InsertDashboardProductsResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<DashboardProducts>;
};

export type InsertDashboardReceiptHistoryObjectInput = {
  companyId?: InputMaybe<Scalars['Uuid']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamptz']['input']>;
  flaggedReason?: InputMaybe<Scalars['String1']['input']>;
  imageUrl?: InputMaybe<Scalars['String1']['input']>;
  itemCount?: InputMaybe<Scalars['Int64']['input']>;
  periodKey?: InputMaybe<Scalars['String1']['input']>;
  primaryCategory?: InputMaybe<Scalars['String1']['input']>;
  rawText?: InputMaybe<Scalars['String1']['input']>;
  receiptDate?: InputMaybe<Scalars['Date']['input']>;
  receiptId?: InputMaybe<Scalars['Uuid']['input']>;
  status?: InputMaybe<Scalars['String1']['input']>;
  totalAmount?: InputMaybe<Scalars['Bigdecimal']['input']>;
  userId?: InputMaybe<Scalars['Uuid']['input']>;
  userName?: InputMaybe<Scalars['String1']['input']>;
  vendorName?: InputMaybe<Scalars['String1']['input']>;
  vendorTaxId?: InputMaybe<Scalars['String1']['input']>;
  vendorTaxIdValid?: InputMaybe<Scalars['Boolean1']['input']>;
};

/** Responses from the 'insert_dashboard_receipt_history' procedure */
export type InsertDashboardReceiptHistoryResponse = {
  __typename?: 'InsertDashboardReceiptHistoryResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<DashboardReceiptHistory>;
};

export type InsertDashboardReceiptItemsPeriodizedObjectInput = {
  category?: InputMaybe<Scalars['String1']['input']>;
  companyId?: InputMaybe<Scalars['Uuid']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamptz']['input']>;
  dashboardCategory?: InputMaybe<Scalars['String1']['input']>;
  flaggedReason?: InputMaybe<Scalars['String1']['input']>;
  imageUrl?: InputMaybe<Scalars['String1']['input']>;
  itemId?: InputMaybe<Scalars['Uuid']['input']>;
  normalizedDescription?: InputMaybe<Scalars['String1']['input']>;
  periodKey?: InputMaybe<Scalars['String1']['input']>;
  quantity?: InputMaybe<Scalars['Bigdecimal']['input']>;
  rawDescription?: InputMaybe<Scalars['String1']['input']>;
  rawText?: InputMaybe<Scalars['String1']['input']>;
  receiptDate?: InputMaybe<Scalars['Date']['input']>;
  receiptId?: InputMaybe<Scalars['Uuid']['input']>;
  sourceText?: InputMaybe<Scalars['String1']['input']>;
  status?: InputMaybe<Scalars['String1']['input']>;
  totalAmount?: InputMaybe<Scalars['Bigdecimal']['input']>;
  totalPrice?: InputMaybe<Scalars['Bigdecimal']['input']>;
  unitPrice?: InputMaybe<Scalars['Bigdecimal']['input']>;
  userId?: InputMaybe<Scalars['Uuid']['input']>;
  userName?: InputMaybe<Scalars['String1']['input']>;
  vendorName?: InputMaybe<Scalars['String1']['input']>;
  vendorTaxId?: InputMaybe<Scalars['String1']['input']>;
  vendorTaxIdValid?: InputMaybe<Scalars['Boolean1']['input']>;
};

/** Responses from the 'insert_dashboard_receipt_items_periodized' procedure */
export type InsertDashboardReceiptItemsPeriodizedResponse = {
  __typename?: 'InsertDashboardReceiptItemsPeriodizedResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<DashboardReceiptItemsPeriodized>;
};

export type InsertDashboardReceiptsPeriodizedObjectInput = {
  companyId?: InputMaybe<Scalars['Uuid']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamptz']['input']>;
  flaggedReason?: InputMaybe<Scalars['String1']['input']>;
  imageUrl?: InputMaybe<Scalars['String1']['input']>;
  periodKey?: InputMaybe<Scalars['String1']['input']>;
  rawText?: InputMaybe<Scalars['String1']['input']>;
  receiptDate?: InputMaybe<Scalars['Date']['input']>;
  receiptId?: InputMaybe<Scalars['Uuid']['input']>;
  status?: InputMaybe<Scalars['String1']['input']>;
  totalAmount?: InputMaybe<Scalars['Bigdecimal']['input']>;
  userId?: InputMaybe<Scalars['Uuid']['input']>;
  userName?: InputMaybe<Scalars['String1']['input']>;
  vendorName?: InputMaybe<Scalars['String1']['input']>;
  vendorTaxId?: InputMaybe<Scalars['String1']['input']>;
  vendorTaxIdValid?: InputMaybe<Scalars['Boolean1']['input']>;
};

/** Responses from the 'insert_dashboard_receipts_periodized' procedure */
export type InsertDashboardReceiptsPeriodizedResponse = {
  __typename?: 'InsertDashboardReceiptsPeriodizedResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<DashboardReceiptsPeriodized>;
};

export type InsertDashboardSummaryObjectInput = {
  companyId?: InputMaybe<Scalars['Uuid']['input']>;
  periodKey?: InputMaybe<Scalars['String1']['input']>;
  receiptsProcessed?: InputMaybe<Scalars['Int64']['input']>;
  totalSpent?: InputMaybe<Scalars['Bigdecimal']['input']>;
  uniqueEmployees?: InputMaybe<Scalars['Int64']['input']>;
  uniqueProducts?: InputMaybe<Scalars['Int64']['input']>;
};

/** Responses from the 'insert_dashboard_summary' procedure */
export type InsertDashboardSummaryResponse = {
  __typename?: 'InsertDashboardSummaryResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<DashboardSummary>;
};

export type InsertReceiptItemsObjectInput = {
  category?: InputMaybe<Scalars['String1']['input']>;
  createdAt?: InputMaybe<Scalars['Timestamptz']['input']>;
  description: Scalars['String1']['input'];
  id?: InputMaybe<Scalars['Uuid']['input']>;
  isPriceAnomaly?: InputMaybe<Scalars['Boolean1']['input']>;
  normalizedDescription: Scalars['String1']['input'];
  quantity?: InputMaybe<Scalars['Bigdecimal']['input']>;
  rawDescription: Scalars['String1']['input'];
  receiptId: Scalars['Uuid']['input'];
  totalPrice: Scalars['Bigdecimal']['input'];
  unitPrice: Scalars['Bigdecimal']['input'];
};

/** Responses from the 'insert_receipt_items' procedure */
export type InsertReceiptItemsResponse = {
  __typename?: 'InsertReceiptItemsResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<ReceiptItems>;
};

export type InsertReceiptsObjectInput = {
  companyId: Scalars['Uuid']['input'];
  createdAt?: InputMaybe<Scalars['Timestamptz']['input']>;
  flaggedReason?: InputMaybe<Scalars['String1']['input']>;
  id?: InputMaybe<Scalars['Uuid']['input']>;
  imageUrl?: InputMaybe<Scalars['String1']['input']>;
  rawText?: InputMaybe<Scalars['String1']['input']>;
  receiptDate: Scalars['Date']['input'];
  status?: InputMaybe<Scalars['String1']['input']>;
  totalAmount: Scalars['Bigdecimal']['input'];
  userId: Scalars['Uuid']['input'];
  vendorName: Scalars['String1']['input'];
  vendorTaxId?: InputMaybe<Scalars['String1']['input']>;
  vendorTaxIdValid?: InputMaybe<Scalars['Boolean1']['input']>;
};

/** Responses from the 'insert_receipts' procedure */
export type InsertReceiptsResponse = {
  __typename?: 'InsertReceiptsResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Receipts>;
};

export type InsertSpendPoliciesObjectInput = {
  category: Scalars['String1']['input'];
  companyId: Scalars['Uuid']['input'];
  createdAt?: InputMaybe<Scalars['Timestamptz']['input']>;
  id?: InputMaybe<Scalars['Uuid']['input']>;
  maxPerMonth?: InputMaybe<Scalars['Bigdecimal']['input']>;
  maxPerTransaction?: InputMaybe<Scalars['Bigdecimal']['input']>;
};

/** Responses from the 'insert_spend_policies' procedure */
export type InsertSpendPoliciesResponse = {
  __typename?: 'InsertSpendPoliciesResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<SpendPolicies>;
};

export type InsertUsersObjectInput = {
  companyId: Scalars['Uuid']['input'];
  createdAt?: InputMaybe<Scalars['Timestamptz']['input']>;
  email: Scalars['String1']['input'];
  fullName: Scalars['String1']['input'];
  id?: InputMaybe<Scalars['Uuid']['input']>;
  role: Scalars['Enum']['input'];
};

/** Responses from the 'insert_users' procedure */
export type InsertUsersResponse = {
  __typename?: 'InsertUsersResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Users>;
};

export type Int8AggExp = {
  __typename?: 'Int8AggExp';
  _count: Scalars['Int64']['output'];
  _count_distinct: Scalars['Int64']['output'];
  avg?: Maybe<Scalars['Bigdecimal']['output']>;
  bit_and?: Maybe<Scalars['Int64']['output']>;
  bit_or?: Maybe<Scalars['Int64']['output']>;
  bit_xor?: Maybe<Scalars['Int64']['output']>;
  max?: Maybe<Scalars['Int64']['output']>;
  min?: Maybe<Scalars['Int64']['output']>;
  stddev?: Maybe<Scalars['Bigdecimal']['output']>;
  stddev_pop?: Maybe<Scalars['Bigdecimal']['output']>;
  stddev_samp?: Maybe<Scalars['Bigdecimal']['output']>;
  sum?: Maybe<Scalars['Bigdecimal']['output']>;
  var_pop?: Maybe<Scalars['Bigdecimal']['output']>;
  var_samp?: Maybe<Scalars['Bigdecimal']['output']>;
  variance?: Maybe<Scalars['Bigdecimal']['output']>;
};

export type Int8BoolExp = {
  _and?: InputMaybe<Array<Int8BoolExp>>;
  _eq?: InputMaybe<Scalars['Int64']['input']>;
  _gt?: InputMaybe<Scalars['Int64']['input']>;
  _gte?: InputMaybe<Scalars['Int64']['input']>;
  _in?: InputMaybe<Array<Scalars['Int64']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int64']['input']>;
  _lte?: InputMaybe<Scalars['Int64']['input']>;
  _neq?: InputMaybe<Scalars['Int64']['input']>;
  _not?: InputMaybe<Int8BoolExp>;
  _or?: InputMaybe<Array<Int8BoolExp>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Delete any row on the 'category_spend_limits' collection using the 'category' and 'company_id' keys */
  deleteCategorySpendLimitsByCategoryAndCompanyId: DeleteCategorySpendLimitsByCategoryAndCompanyIdResponse;
  /** Delete any row on the 'category_spend_limits' collection using the 'id' key */
  deleteCategorySpendLimitsById: DeleteCategorySpendLimitsByIdResponse;
  /** Delete any row on the 'companies' collection using the 'id' key */
  deleteCompaniesById: DeleteCompaniesByIdResponse;
  /** Delete any row on the 'receipt_items' collection using the 'id' key */
  deleteReceiptItemsById: DeleteReceiptItemsByIdResponse;
  /** Delete any row on the 'receipts' collection using the 'id' key */
  deleteReceiptsById: DeleteReceiptsByIdResponse;
  /** Delete any row on the 'spend_policies' collection using the 'category' and 'company_id' keys */
  deleteSpendPoliciesByCategoryAndCompanyId: DeleteSpendPoliciesByCategoryAndCompanyIdResponse;
  /** Delete any row on the 'spend_policies' collection using the 'id' key */
  deleteSpendPoliciesById: DeleteSpendPoliciesByIdResponse;
  /** Delete any row on the 'users' collection using the 'email' key */
  deleteUsersByEmail: DeleteUsersByEmailResponse;
  /** Delete any row on the 'users' collection using the 'id' key */
  deleteUsersById: DeleteUsersByIdResponse;
  /** Insert into the category_spend_limits table */
  insertCategorySpendLimits: InsertCategorySpendLimitsResponse;
  /** Insert into the companies table */
  insertCompanies: InsertCompaniesResponse;
  /** Insert into the dashboard_alerts table */
  insertDashboardAlerts: InsertDashboardAlertsResponse;
  /** Insert into the dashboard_category_spend table */
  insertDashboardCategorySpend: InsertDashboardCategorySpendResponse;
  /** Insert into the dashboard_employee_spend table */
  insertDashboardEmployeeSpend: InsertDashboardEmployeeSpendResponse;
  /** Insert into the dashboard_products table */
  insertDashboardProducts: InsertDashboardProductsResponse;
  /** Insert into the dashboard_receipt_history table */
  insertDashboardReceiptHistory: InsertDashboardReceiptHistoryResponse;
  /** Insert into the dashboard_receipt_items_periodized table */
  insertDashboardReceiptItemsPeriodized: InsertDashboardReceiptItemsPeriodizedResponse;
  /** Insert into the dashboard_receipts_periodized table */
  insertDashboardReceiptsPeriodized: InsertDashboardReceiptsPeriodizedResponse;
  /** Insert into the dashboard_summary table */
  insertDashboardSummary: InsertDashboardSummaryResponse;
  /** Insert into the receipt_items table */
  insertReceiptItems: InsertReceiptItemsResponse;
  /** Insert into the receipts table */
  insertReceipts: InsertReceiptsResponse;
  /** Insert into the spend_policies table */
  insertSpendPolicies: InsertSpendPoliciesResponse;
  /** Insert into the users table */
  insertUsers: InsertUsersResponse;
  /** Update any row on the 'category_spend_limits' collection using the 'category' and 'company_id' keys */
  updateCategorySpendLimitsByCategoryAndCompanyId: UpdateCategorySpendLimitsByCategoryAndCompanyIdResponse;
  /** Update any row on the 'category_spend_limits' collection using the 'id' key */
  updateCategorySpendLimitsById: UpdateCategorySpendLimitsByIdResponse;
  /** Update any row on the 'companies' collection using the 'id' key */
  updateCompaniesById: UpdateCompaniesByIdResponse;
  /** Update any row on the 'receipt_items' collection using the 'id' key */
  updateReceiptItemsById: UpdateReceiptItemsByIdResponse;
  /** Update any row on the 'receipts' collection using the 'id' key */
  updateReceiptsById: UpdateReceiptsByIdResponse;
  /** Update any row on the 'spend_policies' collection using the 'category' and 'company_id' keys */
  updateSpendPoliciesByCategoryAndCompanyId: UpdateSpendPoliciesByCategoryAndCompanyIdResponse;
  /** Update any row on the 'spend_policies' collection using the 'id' key */
  updateSpendPoliciesById: UpdateSpendPoliciesByIdResponse;
  /** Update any row on the 'users' collection using the 'email' key */
  updateUsersByEmail: UpdateUsersByEmailResponse;
  /** Update any row on the 'users' collection using the 'id' key */
  updateUsersById: UpdateUsersByIdResponse;
};


export type MutationDeleteCategorySpendLimitsByCategoryAndCompanyIdArgs = {
  keyCategory: Scalars['String1']['input'];
  keyCompanyId: Scalars['Uuid']['input'];
  preCheck?: InputMaybe<CategorySpendLimitsBoolExp>;
};


export type MutationDeleteCategorySpendLimitsByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  preCheck?: InputMaybe<CategorySpendLimitsBoolExp>;
};


export type MutationDeleteCompaniesByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  preCheck?: InputMaybe<CompaniesBoolExp>;
};


export type MutationDeleteReceiptItemsByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  preCheck?: InputMaybe<ReceiptItemsBoolExp>;
};


export type MutationDeleteReceiptsByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  preCheck?: InputMaybe<ReceiptsBoolExp>;
};


export type MutationDeleteSpendPoliciesByCategoryAndCompanyIdArgs = {
  keyCategory: Scalars['String1']['input'];
  keyCompanyId: Scalars['Uuid']['input'];
  preCheck?: InputMaybe<SpendPoliciesBoolExp>;
};


export type MutationDeleteSpendPoliciesByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  preCheck?: InputMaybe<SpendPoliciesBoolExp>;
};


export type MutationDeleteUsersByEmailArgs = {
  keyEmail: Scalars['String1']['input'];
  preCheck?: InputMaybe<UsersBoolExp>;
};


export type MutationDeleteUsersByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  preCheck?: InputMaybe<UsersBoolExp>;
};


export type MutationInsertCategorySpendLimitsArgs = {
  objects: Array<InsertCategorySpendLimitsObjectInput>;
  postCheck?: InputMaybe<CategorySpendLimitsBoolExp>;
};


export type MutationInsertCompaniesArgs = {
  objects: Array<InsertCompaniesObjectInput>;
  postCheck?: InputMaybe<CompaniesBoolExp>;
};


export type MutationInsertDashboardAlertsArgs = {
  objects: Array<InsertDashboardAlertsObjectInput>;
  postCheck?: InputMaybe<DashboardAlertsBoolExp>;
};


export type MutationInsertDashboardCategorySpendArgs = {
  objects: Array<InsertDashboardCategorySpendObjectInput>;
  postCheck?: InputMaybe<DashboardCategorySpendBoolExp>;
};


export type MutationInsertDashboardEmployeeSpendArgs = {
  objects: Array<InsertDashboardEmployeeSpendObjectInput>;
  postCheck?: InputMaybe<DashboardEmployeeSpendBoolExp>;
};


export type MutationInsertDashboardProductsArgs = {
  objects: Array<InsertDashboardProductsObjectInput>;
  postCheck?: InputMaybe<DashboardProductsBoolExp>;
};


export type MutationInsertDashboardReceiptHistoryArgs = {
  objects: Array<InsertDashboardReceiptHistoryObjectInput>;
  postCheck?: InputMaybe<DashboardReceiptHistoryBoolExp>;
};


export type MutationInsertDashboardReceiptItemsPeriodizedArgs = {
  objects: Array<InsertDashboardReceiptItemsPeriodizedObjectInput>;
  postCheck?: InputMaybe<DashboardReceiptItemsPeriodizedBoolExp>;
};


export type MutationInsertDashboardReceiptsPeriodizedArgs = {
  objects: Array<InsertDashboardReceiptsPeriodizedObjectInput>;
  postCheck?: InputMaybe<DashboardReceiptsPeriodizedBoolExp>;
};


export type MutationInsertDashboardSummaryArgs = {
  objects: Array<InsertDashboardSummaryObjectInput>;
  postCheck?: InputMaybe<DashboardSummaryBoolExp>;
};


export type MutationInsertReceiptItemsArgs = {
  objects: Array<InsertReceiptItemsObjectInput>;
  postCheck?: InputMaybe<ReceiptItemsBoolExp>;
};


export type MutationInsertReceiptsArgs = {
  objects: Array<InsertReceiptsObjectInput>;
  postCheck?: InputMaybe<ReceiptsBoolExp>;
};


export type MutationInsertSpendPoliciesArgs = {
  objects: Array<InsertSpendPoliciesObjectInput>;
  postCheck?: InputMaybe<SpendPoliciesBoolExp>;
};


export type MutationInsertUsersArgs = {
  objects: Array<InsertUsersObjectInput>;
  postCheck?: InputMaybe<UsersBoolExp>;
};


export type MutationUpdateCategorySpendLimitsByCategoryAndCompanyIdArgs = {
  keyCategory: Scalars['String1']['input'];
  keyCompanyId: Scalars['Uuid']['input'];
  postCheck?: InputMaybe<CategorySpendLimitsBoolExp>;
  preCheck?: InputMaybe<CategorySpendLimitsBoolExp>;
  updateColumns: UpdateCategorySpendLimitsByCategoryAndCompanyIdUpdateColumnsInput;
};


export type MutationUpdateCategorySpendLimitsByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  postCheck?: InputMaybe<CategorySpendLimitsBoolExp>;
  preCheck?: InputMaybe<CategorySpendLimitsBoolExp>;
  updateColumns: UpdateCategorySpendLimitsByIdUpdateColumnsInput;
};


export type MutationUpdateCompaniesByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  postCheck?: InputMaybe<CompaniesBoolExp>;
  preCheck?: InputMaybe<CompaniesBoolExp>;
  updateColumns: UpdateCompaniesByIdUpdateColumnsInput;
};


export type MutationUpdateReceiptItemsByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  postCheck?: InputMaybe<ReceiptItemsBoolExp>;
  preCheck?: InputMaybe<ReceiptItemsBoolExp>;
  updateColumns: UpdateReceiptItemsByIdUpdateColumnsInput;
};


export type MutationUpdateReceiptsByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  postCheck?: InputMaybe<ReceiptsBoolExp>;
  preCheck?: InputMaybe<ReceiptsBoolExp>;
  updateColumns: UpdateReceiptsByIdUpdateColumnsInput;
};


export type MutationUpdateSpendPoliciesByCategoryAndCompanyIdArgs = {
  keyCategory: Scalars['String1']['input'];
  keyCompanyId: Scalars['Uuid']['input'];
  postCheck?: InputMaybe<SpendPoliciesBoolExp>;
  preCheck?: InputMaybe<SpendPoliciesBoolExp>;
  updateColumns: UpdateSpendPoliciesByCategoryAndCompanyIdUpdateColumnsInput;
};


export type MutationUpdateSpendPoliciesByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  postCheck?: InputMaybe<SpendPoliciesBoolExp>;
  preCheck?: InputMaybe<SpendPoliciesBoolExp>;
  updateColumns: UpdateSpendPoliciesByIdUpdateColumnsInput;
};


export type MutationUpdateUsersByEmailArgs = {
  keyEmail: Scalars['String1']['input'];
  postCheck?: InputMaybe<UsersBoolExp>;
  preCheck?: InputMaybe<UsersBoolExp>;
  updateColumns: UpdateUsersByEmailUpdateColumnsInput;
};


export type MutationUpdateUsersByIdArgs = {
  keyId: Scalars['Uuid']['input'];
  postCheck?: InputMaybe<UsersBoolExp>;
  preCheck?: InputMaybe<UsersBoolExp>;
  updateColumns: UpdateUsersByIdUpdateColumnsInput;
};

export type NumericAggExp = {
  __typename?: 'NumericAggExp';
  _count: Scalars['Int64']['output'];
  _count_distinct: Scalars['Int64']['output'];
  avg?: Maybe<Scalars['Bigdecimal']['output']>;
  max?: Maybe<Scalars['Bigdecimal']['output']>;
  min?: Maybe<Scalars['Bigdecimal']['output']>;
  stddev?: Maybe<Scalars['Bigdecimal']['output']>;
  stddev_pop?: Maybe<Scalars['Bigdecimal']['output']>;
  stddev_samp?: Maybe<Scalars['Bigdecimal']['output']>;
  sum?: Maybe<Scalars['Bigdecimal']['output']>;
  var_pop?: Maybe<Scalars['Bigdecimal']['output']>;
  var_samp?: Maybe<Scalars['Bigdecimal']['output']>;
  variance?: Maybe<Scalars['Bigdecimal']['output']>;
};

export type NumericBoolExp = {
  _and?: InputMaybe<Array<NumericBoolExp>>;
  _eq?: InputMaybe<Scalars['Bigdecimal']['input']>;
  _gt?: InputMaybe<Scalars['Bigdecimal']['input']>;
  _gte?: InputMaybe<Scalars['Bigdecimal']['input']>;
  _in?: InputMaybe<Array<Scalars['Bigdecimal']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Bigdecimal']['input']>;
  _lte?: InputMaybe<Scalars['Bigdecimal']['input']>;
  _neq?: InputMaybe<Scalars['Bigdecimal']['input']>;
  _not?: InputMaybe<NumericBoolExp>;
  _or?: InputMaybe<Array<NumericBoolExp>>;
};

export enum OrderBy {
  /** Sorts the data in ascending order */
  Asc = 'Asc',
  /** Sorts the data in descending order */
  Desc = 'Desc'
}

export type Query = {
  __typename?: 'Query';
  categorySpendLimits?: Maybe<Array<CategorySpendLimits>>;
  categorySpendLimitsAggregate?: Maybe<CategorySpendLimitsAggExp>;
  categorySpendLimitsByCategorySpendLimitsCompanyIdCategoryKey?: Maybe<CategorySpendLimits>;
  categorySpendLimitsById?: Maybe<CategorySpendLimits>;
  companies?: Maybe<Array<Companies>>;
  companiesAggregate?: Maybe<CompaniesAggExp>;
  companiesById?: Maybe<Companies>;
  dashboardAlerts?: Maybe<Array<DashboardAlerts>>;
  dashboardAlertsAggregate?: Maybe<DashboardAlertsAggExp>;
  dashboardCategorySpend?: Maybe<Array<DashboardCategorySpend>>;
  dashboardCategorySpendAggregate?: Maybe<DashboardCategorySpendAggExp>;
  dashboardEmployeeSpend?: Maybe<Array<DashboardEmployeeSpend>>;
  dashboardEmployeeSpendAggregate?: Maybe<DashboardEmployeeSpendAggExp>;
  dashboardProducts?: Maybe<Array<DashboardProducts>>;
  dashboardProductsAggregate?: Maybe<DashboardProductsAggExp>;
  dashboardReceiptHistory?: Maybe<Array<DashboardReceiptHistory>>;
  dashboardReceiptHistoryAggregate?: Maybe<DashboardReceiptHistoryAggExp>;
  dashboardReceiptItemsPeriodized?: Maybe<Array<DashboardReceiptItemsPeriodized>>;
  dashboardReceiptItemsPeriodizedAggregate?: Maybe<DashboardReceiptItemsPeriodizedAggExp>;
  dashboardReceiptsPeriodized?: Maybe<Array<DashboardReceiptsPeriodized>>;
  dashboardReceiptsPeriodizedAggregate?: Maybe<DashboardReceiptsPeriodizedAggExp>;
  dashboardSummary?: Maybe<Array<DashboardSummary>>;
  dashboardSummaryAggregate?: Maybe<DashboardSummaryAggExp>;
  receiptItems?: Maybe<Array<ReceiptItems>>;
  receiptItemsAggregate?: Maybe<ReceiptItemsAggExp>;
  receiptItemsById?: Maybe<ReceiptItems>;
  receipts?: Maybe<Array<Receipts>>;
  receiptsAggregate?: Maybe<ReceiptsAggExp>;
  receiptsById?: Maybe<Receipts>;
  spendPolicies?: Maybe<Array<SpendPolicies>>;
  spendPoliciesAggregate?: Maybe<SpendPoliciesAggExp>;
  spendPoliciesById?: Maybe<SpendPolicies>;
  spendPoliciesBySpendPoliciesCompanyIdCategoryKey?: Maybe<SpendPolicies>;
  users?: Maybe<Array<Users>>;
  usersAggregate?: Maybe<UsersAggExp>;
  usersByEmail?: Maybe<Users>;
  usersById?: Maybe<Users>;
};


export type QueryCategorySpendLimitsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CategorySpendLimitsOrderByExp>>;
  where?: InputMaybe<CategorySpendLimitsBoolExp>;
};


export type QueryCategorySpendLimitsAggregateArgs = {
  filter_input?: InputMaybe<CategorySpendLimitsFilterInput>;
};


export type QueryCategorySpendLimitsByCategorySpendLimitsCompanyIdCategoryKeyArgs = {
  category: Scalars['String1']['input'];
  companyId: Scalars['Uuid']['input'];
};


export type QueryCategorySpendLimitsByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type QueryCompaniesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CompaniesOrderByExp>>;
  where?: InputMaybe<CompaniesBoolExp>;
};


export type QueryCompaniesAggregateArgs = {
  filter_input?: InputMaybe<CompaniesFilterInput>;
};


export type QueryCompaniesByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type QueryDashboardAlertsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardAlertsOrderByExp>>;
  where?: InputMaybe<DashboardAlertsBoolExp>;
};


export type QueryDashboardAlertsAggregateArgs = {
  filter_input?: InputMaybe<DashboardAlertsFilterInput>;
};


export type QueryDashboardCategorySpendArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardCategorySpendOrderByExp>>;
  where?: InputMaybe<DashboardCategorySpendBoolExp>;
};


export type QueryDashboardCategorySpendAggregateArgs = {
  filter_input?: InputMaybe<DashboardCategorySpendFilterInput>;
};


export type QueryDashboardEmployeeSpendArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardEmployeeSpendOrderByExp>>;
  where?: InputMaybe<DashboardEmployeeSpendBoolExp>;
};


export type QueryDashboardEmployeeSpendAggregateArgs = {
  filter_input?: InputMaybe<DashboardEmployeeSpendFilterInput>;
};


export type QueryDashboardProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardProductsOrderByExp>>;
  where?: InputMaybe<DashboardProductsBoolExp>;
};


export type QueryDashboardProductsAggregateArgs = {
  filter_input?: InputMaybe<DashboardProductsFilterInput>;
};


export type QueryDashboardReceiptHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardReceiptHistoryOrderByExp>>;
  where?: InputMaybe<DashboardReceiptHistoryBoolExp>;
};


export type QueryDashboardReceiptHistoryAggregateArgs = {
  filter_input?: InputMaybe<DashboardReceiptHistoryFilterInput>;
};


export type QueryDashboardReceiptItemsPeriodizedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardReceiptItemsPeriodizedOrderByExp>>;
  where?: InputMaybe<DashboardReceiptItemsPeriodizedBoolExp>;
};


export type QueryDashboardReceiptItemsPeriodizedAggregateArgs = {
  filter_input?: InputMaybe<DashboardReceiptItemsPeriodizedFilterInput>;
};


export type QueryDashboardReceiptsPeriodizedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardReceiptsPeriodizedOrderByExp>>;
  where?: InputMaybe<DashboardReceiptsPeriodizedBoolExp>;
};


export type QueryDashboardReceiptsPeriodizedAggregateArgs = {
  filter_input?: InputMaybe<DashboardReceiptsPeriodizedFilterInput>;
};


export type QueryDashboardSummaryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardSummaryOrderByExp>>;
  where?: InputMaybe<DashboardSummaryBoolExp>;
};


export type QueryDashboardSummaryAggregateArgs = {
  filter_input?: InputMaybe<DashboardSummaryFilterInput>;
};


export type QueryReceiptItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ReceiptItemsOrderByExp>>;
  where?: InputMaybe<ReceiptItemsBoolExp>;
};


export type QueryReceiptItemsAggregateArgs = {
  filter_input?: InputMaybe<ReceiptItemsFilterInput>;
};


export type QueryReceiptItemsByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type QueryReceiptsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ReceiptsOrderByExp>>;
  where?: InputMaybe<ReceiptsBoolExp>;
};


export type QueryReceiptsAggregateArgs = {
  filter_input?: InputMaybe<ReceiptsFilterInput>;
};


export type QueryReceiptsByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type QuerySpendPoliciesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<SpendPoliciesOrderByExp>>;
  where?: InputMaybe<SpendPoliciesBoolExp>;
};


export type QuerySpendPoliciesAggregateArgs = {
  filter_input?: InputMaybe<SpendPoliciesFilterInput>;
};


export type QuerySpendPoliciesByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type QuerySpendPoliciesBySpendPoliciesCompanyIdCategoryKeyArgs = {
  category: Scalars['String1']['input'];
  companyId: Scalars['Uuid']['input'];
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderByExp>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type QueryUsersAggregateArgs = {
  filter_input?: InputMaybe<UsersFilterInput>;
};


export type QueryUsersByEmailArgs = {
  email: Scalars['String1']['input'];
};


export type QueryUsersByIdArgs = {
  id: Scalars['Uuid']['input'];
};

export type ReceiptItems = {
  __typename?: 'ReceiptItems';
  category?: Maybe<Scalars['String1']['output']>;
  createdAt?: Maybe<Scalars['Timestamptz']['output']>;
  description: Scalars['String1']['output'];
  id: Scalars['Uuid']['output'];
  isPriceAnomaly?: Maybe<Scalars['Boolean1']['output']>;
  normalizedDescription: Scalars['String1']['output'];
  quantity?: Maybe<Scalars['Bigdecimal']['output']>;
  rawDescription: Scalars['String1']['output'];
  receipt?: Maybe<Receipts>;
  receiptId: Scalars['Uuid']['output'];
  totalPrice: Scalars['Bigdecimal']['output'];
  unitPrice: Scalars['Bigdecimal']['output'];
};

export type ReceiptItemsAggExp = {
  __typename?: 'ReceiptItemsAggExp';
  _count: Scalars['Int64']['output'];
  category: TextAggExp;
  createdAt: TimestamptzAggExp;
  description: TextAggExp;
  id: UuidAggExp;
  isPriceAnomaly: BoolAggExp;
  normalizedDescription: TextAggExp;
  quantity: NumericAggExp;
  rawDescription: TextAggExp;
  receiptId: UuidAggExp;
  totalPrice: NumericAggExp;
  unitPrice: NumericAggExp;
};

export type ReceiptItemsBoolExp = {
  _and?: InputMaybe<Array<ReceiptItemsBoolExp>>;
  _not?: InputMaybe<ReceiptItemsBoolExp>;
  _or?: InputMaybe<Array<ReceiptItemsBoolExp>>;
  category?: InputMaybe<TextBoolExp>;
  createdAt?: InputMaybe<TimestamptzBoolExp>;
  description?: InputMaybe<TextBoolExp>;
  id?: InputMaybe<UuidBoolExp>;
  isPriceAnomaly?: InputMaybe<BoolBoolExp>;
  normalizedDescription?: InputMaybe<TextBoolExp>;
  quantity?: InputMaybe<NumericBoolExp>;
  rawDescription?: InputMaybe<TextBoolExp>;
  receipt?: InputMaybe<ReceiptsBoolExp>;
  receiptId?: InputMaybe<UuidBoolExp>;
  totalPrice?: InputMaybe<NumericBoolExp>;
  unitPrice?: InputMaybe<NumericBoolExp>;
};

export type ReceiptItemsFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ReceiptItemsOrderByExp>>;
  where?: InputMaybe<ReceiptItemsBoolExp>;
};

export type ReceiptItemsOrderByExp = {
  category?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  description?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  isPriceAnomaly?: InputMaybe<OrderBy>;
  normalizedDescription?: InputMaybe<OrderBy>;
  quantity?: InputMaybe<OrderBy>;
  rawDescription?: InputMaybe<OrderBy>;
  receipt?: InputMaybe<ReceiptsOrderByExp>;
  receiptId?: InputMaybe<OrderBy>;
  totalPrice?: InputMaybe<OrderBy>;
  unitPrice?: InputMaybe<OrderBy>;
};

export type Receipts = {
  __typename?: 'Receipts';
  company?: Maybe<Companies>;
  companyId: Scalars['Uuid']['output'];
  createdAt?: Maybe<Scalars['Timestamptz']['output']>;
  flaggedReason?: Maybe<Scalars['String1']['output']>;
  id: Scalars['Uuid']['output'];
  imageUrl?: Maybe<Scalars['String1']['output']>;
  rawText?: Maybe<Scalars['String1']['output']>;
  receiptDate: Scalars['Date']['output'];
  receiptItems?: Maybe<Array<ReceiptItems>>;
  receiptItemsAggregate: ReceiptItemsAggExp;
  status?: Maybe<Scalars['String1']['output']>;
  totalAmount: Scalars['Bigdecimal']['output'];
  user?: Maybe<Users>;
  userId: Scalars['Uuid']['output'];
  vendorName: Scalars['String1']['output'];
  vendorTaxId?: Maybe<Scalars['String1']['output']>;
  vendorTaxIdValid: Scalars['Boolean1']['output'];
};


export type ReceiptsReceiptItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ReceiptItemsOrderByExp>>;
  where?: InputMaybe<ReceiptItemsBoolExp>;
};


export type ReceiptsReceiptItemsAggregateArgs = {
  filter_input?: InputMaybe<ReceiptItemsFilterInput>;
};

export type ReceiptsAggExp = {
  __typename?: 'ReceiptsAggExp';
  _count: Scalars['Int64']['output'];
  companyId: UuidAggExp;
  createdAt: TimestamptzAggExp;
  flaggedReason: TextAggExp;
  id: UuidAggExp;
  imageUrl: TextAggExp;
  rawText: TextAggExp;
  receiptDate: DateAggExp;
  status: TextAggExp;
  totalAmount: NumericAggExp;
  userId: UuidAggExp;
  vendorName: TextAggExp;
  vendorTaxId: TextAggExp;
  vendorTaxIdValid: BoolAggExp;
};

export type ReceiptsBoolExp = {
  _and?: InputMaybe<Array<ReceiptsBoolExp>>;
  _not?: InputMaybe<ReceiptsBoolExp>;
  _or?: InputMaybe<Array<ReceiptsBoolExp>>;
  company?: InputMaybe<CompaniesBoolExp>;
  companyId?: InputMaybe<UuidBoolExp>;
  createdAt?: InputMaybe<TimestamptzBoolExp>;
  flaggedReason?: InputMaybe<TextBoolExp>;
  id?: InputMaybe<UuidBoolExp>;
  imageUrl?: InputMaybe<TextBoolExp>;
  rawText?: InputMaybe<TextBoolExp>;
  receiptDate?: InputMaybe<DateBoolExp>;
  receiptItems?: InputMaybe<ReceiptItemsBoolExp>;
  status?: InputMaybe<TextBoolExp>;
  totalAmount?: InputMaybe<NumericBoolExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidBoolExp>;
  vendorName?: InputMaybe<TextBoolExp>;
  vendorTaxId?: InputMaybe<TextBoolExp>;
  vendorTaxIdValid?: InputMaybe<BoolBoolExp>;
};

export type ReceiptsFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ReceiptsOrderByExp>>;
  where?: InputMaybe<ReceiptsBoolExp>;
};

export type ReceiptsOrderByExp = {
  company?: InputMaybe<CompaniesOrderByExp>;
  companyId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  flaggedReason?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  imageUrl?: InputMaybe<OrderBy>;
  rawText?: InputMaybe<OrderBy>;
  receiptDate?: InputMaybe<OrderBy>;
  status?: InputMaybe<OrderBy>;
  totalAmount?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderByExp>;
  userId?: InputMaybe<OrderBy>;
  vendorName?: InputMaybe<OrderBy>;
  vendorTaxId?: InputMaybe<OrderBy>;
  vendorTaxIdValid?: InputMaybe<OrderBy>;
};

export type SpendPolicies = {
  __typename?: 'SpendPolicies';
  category: Scalars['String1']['output'];
  companyId: Scalars['Uuid']['output'];
  createdAt?: Maybe<Scalars['Timestamptz']['output']>;
  id: Scalars['Uuid']['output'];
  maxPerMonth?: Maybe<Scalars['Bigdecimal']['output']>;
  maxPerTransaction?: Maybe<Scalars['Bigdecimal']['output']>;
};

export type SpendPoliciesAggExp = {
  __typename?: 'SpendPoliciesAggExp';
  _count: Scalars['Int64']['output'];
  category: TextAggExp;
  companyId: UuidAggExp;
  createdAt: TimestamptzAggExp;
  id: UuidAggExp;
  maxPerMonth: NumericAggExp;
  maxPerTransaction: NumericAggExp;
};

export type SpendPoliciesBoolExp = {
  _and?: InputMaybe<Array<SpendPoliciesBoolExp>>;
  _not?: InputMaybe<SpendPoliciesBoolExp>;
  _or?: InputMaybe<Array<SpendPoliciesBoolExp>>;
  category?: InputMaybe<TextBoolExp>;
  companyId?: InputMaybe<UuidBoolExp>;
  createdAt?: InputMaybe<TimestamptzBoolExp>;
  id?: InputMaybe<UuidBoolExp>;
  maxPerMonth?: InputMaybe<NumericBoolExp>;
  maxPerTransaction?: InputMaybe<NumericBoolExp>;
};

export type SpendPoliciesFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<SpendPoliciesOrderByExp>>;
  where?: InputMaybe<SpendPoliciesBoolExp>;
};

export type SpendPoliciesOrderByExp = {
  category?: InputMaybe<OrderBy>;
  companyId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  maxPerMonth?: InputMaybe<OrderBy>;
  maxPerTransaction?: InputMaybe<OrderBy>;
};

export type Subscription = {
  __typename?: 'Subscription';
  categorySpendLimits?: Maybe<Array<CategorySpendLimits>>;
  categorySpendLimitsAggregate?: Maybe<CategorySpendLimitsAggExp>;
  categorySpendLimitsByCategorySpendLimitsCompanyIdCategoryKey?: Maybe<CategorySpendLimits>;
  categorySpendLimitsById?: Maybe<CategorySpendLimits>;
  companies?: Maybe<Array<Companies>>;
  companiesAggregate?: Maybe<CompaniesAggExp>;
  companiesById?: Maybe<Companies>;
  dashboardAlerts?: Maybe<Array<DashboardAlerts>>;
  dashboardAlertsAggregate?: Maybe<DashboardAlertsAggExp>;
  dashboardCategorySpend?: Maybe<Array<DashboardCategorySpend>>;
  dashboardCategorySpendAggregate?: Maybe<DashboardCategorySpendAggExp>;
  dashboardEmployeeSpend?: Maybe<Array<DashboardEmployeeSpend>>;
  dashboardEmployeeSpendAggregate?: Maybe<DashboardEmployeeSpendAggExp>;
  dashboardProducts?: Maybe<Array<DashboardProducts>>;
  dashboardProductsAggregate?: Maybe<DashboardProductsAggExp>;
  dashboardReceiptHistory?: Maybe<Array<DashboardReceiptHistory>>;
  dashboardReceiptHistoryAggregate?: Maybe<DashboardReceiptHistoryAggExp>;
  dashboardReceiptItemsPeriodized?: Maybe<Array<DashboardReceiptItemsPeriodized>>;
  dashboardReceiptItemsPeriodizedAggregate?: Maybe<DashboardReceiptItemsPeriodizedAggExp>;
  dashboardReceiptsPeriodized?: Maybe<Array<DashboardReceiptsPeriodized>>;
  dashboardReceiptsPeriodizedAggregate?: Maybe<DashboardReceiptsPeriodizedAggExp>;
  dashboardSummary?: Maybe<Array<DashboardSummary>>;
  dashboardSummaryAggregate?: Maybe<DashboardSummaryAggExp>;
  receiptItems?: Maybe<Array<ReceiptItems>>;
  receiptItemsAggregate?: Maybe<ReceiptItemsAggExp>;
  receiptItemsById?: Maybe<ReceiptItems>;
  receipts?: Maybe<Array<Receipts>>;
  receiptsAggregate?: Maybe<ReceiptsAggExp>;
  receiptsById?: Maybe<Receipts>;
  spendPolicies?: Maybe<Array<SpendPolicies>>;
  spendPoliciesAggregate?: Maybe<SpendPoliciesAggExp>;
  spendPoliciesById?: Maybe<SpendPolicies>;
  spendPoliciesBySpendPoliciesCompanyIdCategoryKey?: Maybe<SpendPolicies>;
  users?: Maybe<Array<Users>>;
  usersAggregate?: Maybe<UsersAggExp>;
  usersByEmail?: Maybe<Users>;
  usersById?: Maybe<Users>;
};


export type SubscriptionCategorySpendLimitsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CategorySpendLimitsOrderByExp>>;
  where?: InputMaybe<CategorySpendLimitsBoolExp>;
};


export type SubscriptionCategorySpendLimitsAggregateArgs = {
  filter_input?: InputMaybe<CategorySpendLimitsFilterInput>;
};


export type SubscriptionCategorySpendLimitsByCategorySpendLimitsCompanyIdCategoryKeyArgs = {
  category: Scalars['String1']['input'];
  companyId: Scalars['Uuid']['input'];
};


export type SubscriptionCategorySpendLimitsByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type SubscriptionCompaniesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CompaniesOrderByExp>>;
  where?: InputMaybe<CompaniesBoolExp>;
};


export type SubscriptionCompaniesAggregateArgs = {
  filter_input?: InputMaybe<CompaniesFilterInput>;
};


export type SubscriptionCompaniesByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type SubscriptionDashboardAlertsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardAlertsOrderByExp>>;
  where?: InputMaybe<DashboardAlertsBoolExp>;
};


export type SubscriptionDashboardAlertsAggregateArgs = {
  filter_input?: InputMaybe<DashboardAlertsFilterInput>;
};


export type SubscriptionDashboardCategorySpendArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardCategorySpendOrderByExp>>;
  where?: InputMaybe<DashboardCategorySpendBoolExp>;
};


export type SubscriptionDashboardCategorySpendAggregateArgs = {
  filter_input?: InputMaybe<DashboardCategorySpendFilterInput>;
};


export type SubscriptionDashboardEmployeeSpendArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardEmployeeSpendOrderByExp>>;
  where?: InputMaybe<DashboardEmployeeSpendBoolExp>;
};


export type SubscriptionDashboardEmployeeSpendAggregateArgs = {
  filter_input?: InputMaybe<DashboardEmployeeSpendFilterInput>;
};


export type SubscriptionDashboardProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardProductsOrderByExp>>;
  where?: InputMaybe<DashboardProductsBoolExp>;
};


export type SubscriptionDashboardProductsAggregateArgs = {
  filter_input?: InputMaybe<DashboardProductsFilterInput>;
};


export type SubscriptionDashboardReceiptHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardReceiptHistoryOrderByExp>>;
  where?: InputMaybe<DashboardReceiptHistoryBoolExp>;
};


export type SubscriptionDashboardReceiptHistoryAggregateArgs = {
  filter_input?: InputMaybe<DashboardReceiptHistoryFilterInput>;
};


export type SubscriptionDashboardReceiptItemsPeriodizedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardReceiptItemsPeriodizedOrderByExp>>;
  where?: InputMaybe<DashboardReceiptItemsPeriodizedBoolExp>;
};


export type SubscriptionDashboardReceiptItemsPeriodizedAggregateArgs = {
  filter_input?: InputMaybe<DashboardReceiptItemsPeriodizedFilterInput>;
};


export type SubscriptionDashboardReceiptsPeriodizedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardReceiptsPeriodizedOrderByExp>>;
  where?: InputMaybe<DashboardReceiptsPeriodizedBoolExp>;
};


export type SubscriptionDashboardReceiptsPeriodizedAggregateArgs = {
  filter_input?: InputMaybe<DashboardReceiptsPeriodizedFilterInput>;
};


export type SubscriptionDashboardSummaryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DashboardSummaryOrderByExp>>;
  where?: InputMaybe<DashboardSummaryBoolExp>;
};


export type SubscriptionDashboardSummaryAggregateArgs = {
  filter_input?: InputMaybe<DashboardSummaryFilterInput>;
};


export type SubscriptionReceiptItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ReceiptItemsOrderByExp>>;
  where?: InputMaybe<ReceiptItemsBoolExp>;
};


export type SubscriptionReceiptItemsAggregateArgs = {
  filter_input?: InputMaybe<ReceiptItemsFilterInput>;
};


export type SubscriptionReceiptItemsByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type SubscriptionReceiptsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ReceiptsOrderByExp>>;
  where?: InputMaybe<ReceiptsBoolExp>;
};


export type SubscriptionReceiptsAggregateArgs = {
  filter_input?: InputMaybe<ReceiptsFilterInput>;
};


export type SubscriptionReceiptsByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type SubscriptionSpendPoliciesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<SpendPoliciesOrderByExp>>;
  where?: InputMaybe<SpendPoliciesBoolExp>;
};


export type SubscriptionSpendPoliciesAggregateArgs = {
  filter_input?: InputMaybe<SpendPoliciesFilterInput>;
};


export type SubscriptionSpendPoliciesByIdArgs = {
  id: Scalars['Uuid']['input'];
};


export type SubscriptionSpendPoliciesBySpendPoliciesCompanyIdCategoryKeyArgs = {
  category: Scalars['String1']['input'];
  companyId: Scalars['Uuid']['input'];
};


export type SubscriptionUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderByExp>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type SubscriptionUsersAggregateArgs = {
  filter_input?: InputMaybe<UsersFilterInput>;
};


export type SubscriptionUsersByEmailArgs = {
  email: Scalars['String1']['input'];
};


export type SubscriptionUsersByIdArgs = {
  id: Scalars['Uuid']['input'];
};

export type TextAggExp = {
  __typename?: 'TextAggExp';
  _count: Scalars['Int64']['output'];
  _count_distinct: Scalars['Int64']['output'];
  max?: Maybe<Scalars['String1']['output']>;
  min?: Maybe<Scalars['String1']['output']>;
};

export type TextBoolExp = {
  _and?: InputMaybe<Array<TextBoolExp>>;
  _eq?: InputMaybe<Scalars['String1']['input']>;
  _gt?: InputMaybe<Scalars['String1']['input']>;
  _gte?: InputMaybe<Scalars['String1']['input']>;
  _ilike?: InputMaybe<Scalars['String1']['input']>;
  _in?: InputMaybe<Array<Scalars['String1']['input']>>;
  _iregex?: InputMaybe<Scalars['String1']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _like?: InputMaybe<Scalars['String1']['input']>;
  _lt?: InputMaybe<Scalars['String1']['input']>;
  _lte?: InputMaybe<Scalars['String1']['input']>;
  _neq?: InputMaybe<Scalars['String1']['input']>;
  _nilike?: InputMaybe<Scalars['String1']['input']>;
  _niregex?: InputMaybe<Scalars['String1']['input']>;
  _nlike?: InputMaybe<Scalars['String1']['input']>;
  _not?: InputMaybe<TextBoolExp>;
  _nregex?: InputMaybe<Scalars['String1']['input']>;
  _or?: InputMaybe<Array<TextBoolExp>>;
  _regex?: InputMaybe<Scalars['String1']['input']>;
  starts_with?: InputMaybe<Scalars['String1']['input']>;
  ts_match_tt?: InputMaybe<Scalars['String1']['input']>;
};

export type TimestamptzAggExp = {
  __typename?: 'TimestamptzAggExp';
  _count: Scalars['Int64']['output'];
  _count_distinct: Scalars['Int64']['output'];
  max?: Maybe<Scalars['Timestamptz']['output']>;
  min?: Maybe<Scalars['Timestamptz']['output']>;
};

export type TimestamptzBoolExp = {
  _and?: InputMaybe<Array<TimestamptzBoolExp>>;
  _eq?: InputMaybe<Scalars['Timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['Timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['Timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['Timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['Timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['Timestamptz']['input']>;
  _not?: InputMaybe<TimestamptzBoolExp>;
  _or?: InputMaybe<Array<TimestamptzBoolExp>>;
};

/** Responses from the 'update_category_spend_limits_by_category_and_company_id' procedure */
export type UpdateCategorySpendLimitsByCategoryAndCompanyIdResponse = {
  __typename?: 'UpdateCategorySpendLimitsByCategoryAndCompanyIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<CategorySpendLimits>;
};

/** Update the columns of the 'category_spend_limits' collection */
export type UpdateCategorySpendLimitsByCategoryAndCompanyIdUpdateColumnsInput = {
  /** Update the 'category' column in the 'category_spend_limits' collection. */
  category?: InputMaybe<UpdateColumnCategorySpendLimitsCategoryInput>;
  /** Update the 'company_id' column in the 'category_spend_limits' collection. */
  companyId?: InputMaybe<UpdateColumnCategorySpendLimitsCompanyIdInput>;
  /** Update the 'created_at' column in the 'category_spend_limits' collection. */
  createdAt?: InputMaybe<UpdateColumnCategorySpendLimitsCreatedAtInput>;
  /** Update the 'id' column in the 'category_spend_limits' collection. */
  id?: InputMaybe<UpdateColumnCategorySpendLimitsIdInput>;
  /** Update the 'max_receipt_amount' column in the 'category_spend_limits' collection. */
  maxReceiptAmount?: InputMaybe<UpdateColumnCategorySpendLimitsMaxReceiptAmountInput>;
};

/** Responses from the 'update_category_spend_limits_by_id' procedure */
export type UpdateCategorySpendLimitsByIdResponse = {
  __typename?: 'UpdateCategorySpendLimitsByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<CategorySpendLimits>;
};

/** Update the columns of the 'category_spend_limits' collection */
export type UpdateCategorySpendLimitsByIdUpdateColumnsInput = {
  /** Update the 'category' column in the 'category_spend_limits' collection. */
  category?: InputMaybe<UpdateColumnCategorySpendLimitsCategoryInput>;
  /** Update the 'company_id' column in the 'category_spend_limits' collection. */
  companyId?: InputMaybe<UpdateColumnCategorySpendLimitsCompanyIdInput>;
  /** Update the 'created_at' column in the 'category_spend_limits' collection. */
  createdAt?: InputMaybe<UpdateColumnCategorySpendLimitsCreatedAtInput>;
  /** Update the 'id' column in the 'category_spend_limits' collection. */
  id?: InputMaybe<UpdateColumnCategorySpendLimitsIdInput>;
  /** Update the 'max_receipt_amount' column in the 'category_spend_limits' collection. */
  maxReceiptAmount?: InputMaybe<UpdateColumnCategorySpendLimitsMaxReceiptAmountInput>;
};

/** Update the 'category' column in the 'category_spend_limits' collection */
export type UpdateColumnCategorySpendLimitsCategoryInput = {
  /** Set the column to this value */
  set: Scalars['String1']['input'];
};

/** Update the 'company_id' column in the 'category_spend_limits' collection */
export type UpdateColumnCategorySpendLimitsCompanyIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'created_at' column in the 'category_spend_limits' collection */
export type UpdateColumnCategorySpendLimitsCreatedAtInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Timestamptz']['input']>;
};

/** Update the 'id' column in the 'category_spend_limits' collection */
export type UpdateColumnCategorySpendLimitsIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'max_receipt_amount' column in the 'category_spend_limits' collection */
export type UpdateColumnCategorySpendLimitsMaxReceiptAmountInput = {
  /** Set the column to this value */
  set: Scalars['Bigdecimal']['input'];
};

/** Update the 'created_at' column in the 'companies' collection */
export type UpdateColumnCompaniesCreatedAtInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Timestamptz']['input']>;
};

/** Update the 'id' column in the 'companies' collection */
export type UpdateColumnCompaniesIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'name' column in the 'companies' collection */
export type UpdateColumnCompaniesNameInput = {
  /** Set the column to this value */
  set: Scalars['String1']['input'];
};

/** Update the 'category' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsCategoryInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['String1']['input']>;
};

/** Update the 'created_at' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsCreatedAtInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Timestamptz']['input']>;
};

/** Update the 'description' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsDescriptionInput = {
  /** Set the column to this value */
  set: Scalars['String1']['input'];
};

/** Update the 'id' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'is_price_anomaly' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsIsPriceAnomalyInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Boolean1']['input']>;
};

/** Update the 'normalized_description' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsNormalizedDescriptionInput = {
  /** Set the column to this value */
  set: Scalars['String1']['input'];
};

/** Update the 'quantity' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsQuantityInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Bigdecimal']['input']>;
};

/** Update the 'raw_description' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsRawDescriptionInput = {
  /** Set the column to this value */
  set: Scalars['String1']['input'];
};

/** Update the 'receipt_id' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsReceiptIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'total_price' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsTotalPriceInput = {
  /** Set the column to this value */
  set: Scalars['Bigdecimal']['input'];
};

/** Update the 'unit_price' column in the 'receipt_items' collection */
export type UpdateColumnReceiptItemsUnitPriceInput = {
  /** Set the column to this value */
  set: Scalars['Bigdecimal']['input'];
};

/** Update the 'company_id' column in the 'receipts' collection */
export type UpdateColumnReceiptsCompanyIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'created_at' column in the 'receipts' collection */
export type UpdateColumnReceiptsCreatedAtInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Timestamptz']['input']>;
};

/** Update the 'flagged_reason' column in the 'receipts' collection */
export type UpdateColumnReceiptsFlaggedReasonInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['String1']['input']>;
};

/** Update the 'id' column in the 'receipts' collection */
export type UpdateColumnReceiptsIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'image_url' column in the 'receipts' collection */
export type UpdateColumnReceiptsImageUrlInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['String1']['input']>;
};

/** Update the 'raw_text' column in the 'receipts' collection */
export type UpdateColumnReceiptsRawTextInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['String1']['input']>;
};

/** Update the 'receipt_date' column in the 'receipts' collection */
export type UpdateColumnReceiptsReceiptDateInput = {
  /** Set the column to this value */
  set: Scalars['Date']['input'];
};

/** Update the 'status' column in the 'receipts' collection */
export type UpdateColumnReceiptsStatusInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['String1']['input']>;
};

/** Update the 'total_amount' column in the 'receipts' collection */
export type UpdateColumnReceiptsTotalAmountInput = {
  /** Set the column to this value */
  set: Scalars['Bigdecimal']['input'];
};

/** Update the 'user_id' column in the 'receipts' collection */
export type UpdateColumnReceiptsUserIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'vendor_name' column in the 'receipts' collection */
export type UpdateColumnReceiptsVendorNameInput = {
  /** Set the column to this value */
  set: Scalars['String1']['input'];
};

/** Update the 'vendor_tax_id' column in the 'receipts' collection */
export type UpdateColumnReceiptsVendorTaxIdInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['String1']['input']>;
};

/** Update the 'vendor_tax_id_valid' column in the 'receipts' collection */
export type UpdateColumnReceiptsVendorTaxIdValidInput = {
  /** Set the column to this value */
  set: Scalars['Boolean1']['input'];
};

/** Update the 'category' column in the 'spend_policies' collection */
export type UpdateColumnSpendPoliciesCategoryInput = {
  /** Set the column to this value */
  set: Scalars['String1']['input'];
};

/** Update the 'company_id' column in the 'spend_policies' collection */
export type UpdateColumnSpendPoliciesCompanyIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'created_at' column in the 'spend_policies' collection */
export type UpdateColumnSpendPoliciesCreatedAtInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Timestamptz']['input']>;
};

/** Update the 'id' column in the 'spend_policies' collection */
export type UpdateColumnSpendPoliciesIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'max_per_month' column in the 'spend_policies' collection */
export type UpdateColumnSpendPoliciesMaxPerMonthInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Bigdecimal']['input']>;
};

/** Update the 'max_per_transaction' column in the 'spend_policies' collection */
export type UpdateColumnSpendPoliciesMaxPerTransactionInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Bigdecimal']['input']>;
};

/** Update the 'company_id' column in the 'users' collection */
export type UpdateColumnUsersCompanyIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'created_at' column in the 'users' collection */
export type UpdateColumnUsersCreatedAtInput = {
  /** Set the column to this value */
  set?: InputMaybe<Scalars['Timestamptz']['input']>;
};

/** Update the 'email' column in the 'users' collection */
export type UpdateColumnUsersEmailInput = {
  /** Set the column to this value */
  set: Scalars['String1']['input'];
};

/** Update the 'full_name' column in the 'users' collection */
export type UpdateColumnUsersFullNameInput = {
  /** Set the column to this value */
  set: Scalars['String1']['input'];
};

/** Update the 'id' column in the 'users' collection */
export type UpdateColumnUsersIdInput = {
  /** Set the column to this value */
  set: Scalars['Uuid']['input'];
};

/** Update the 'role' column in the 'users' collection */
export type UpdateColumnUsersRoleInput = {
  /** Set the column to this value */
  set: Scalars['Enum']['input'];
};

/** Responses from the 'update_companies_by_id' procedure */
export type UpdateCompaniesByIdResponse = {
  __typename?: 'UpdateCompaniesByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Companies>;
};

/** Update the columns of the 'companies' collection */
export type UpdateCompaniesByIdUpdateColumnsInput = {
  /** Update the 'created_at' column in the 'companies' collection. */
  createdAt?: InputMaybe<UpdateColumnCompaniesCreatedAtInput>;
  /** Update the 'id' column in the 'companies' collection. */
  id?: InputMaybe<UpdateColumnCompaniesIdInput>;
  /** Update the 'name' column in the 'companies' collection. */
  name?: InputMaybe<UpdateColumnCompaniesNameInput>;
};

/** Responses from the 'update_receipt_items_by_id' procedure */
export type UpdateReceiptItemsByIdResponse = {
  __typename?: 'UpdateReceiptItemsByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<ReceiptItems>;
};

/** Update the columns of the 'receipt_items' collection */
export type UpdateReceiptItemsByIdUpdateColumnsInput = {
  /** Update the 'category' column in the 'receipt_items' collection. */
  category?: InputMaybe<UpdateColumnReceiptItemsCategoryInput>;
  /** Update the 'created_at' column in the 'receipt_items' collection. */
  createdAt?: InputMaybe<UpdateColumnReceiptItemsCreatedAtInput>;
  /** Update the 'description' column in the 'receipt_items' collection. */
  description?: InputMaybe<UpdateColumnReceiptItemsDescriptionInput>;
  /** Update the 'id' column in the 'receipt_items' collection. */
  id?: InputMaybe<UpdateColumnReceiptItemsIdInput>;
  /** Update the 'is_price_anomaly' column in the 'receipt_items' collection. */
  isPriceAnomaly?: InputMaybe<UpdateColumnReceiptItemsIsPriceAnomalyInput>;
  /** Update the 'normalized_description' column in the 'receipt_items' collection. */
  normalizedDescription?: InputMaybe<UpdateColumnReceiptItemsNormalizedDescriptionInput>;
  /** Update the 'quantity' column in the 'receipt_items' collection. */
  quantity?: InputMaybe<UpdateColumnReceiptItemsQuantityInput>;
  /** Update the 'raw_description' column in the 'receipt_items' collection. */
  rawDescription?: InputMaybe<UpdateColumnReceiptItemsRawDescriptionInput>;
  /** Update the 'receipt_id' column in the 'receipt_items' collection. */
  receiptId?: InputMaybe<UpdateColumnReceiptItemsReceiptIdInput>;
  /** Update the 'total_price' column in the 'receipt_items' collection. */
  totalPrice?: InputMaybe<UpdateColumnReceiptItemsTotalPriceInput>;
  /** Update the 'unit_price' column in the 'receipt_items' collection. */
  unitPrice?: InputMaybe<UpdateColumnReceiptItemsUnitPriceInput>;
};

/** Responses from the 'update_receipts_by_id' procedure */
export type UpdateReceiptsByIdResponse = {
  __typename?: 'UpdateReceiptsByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Receipts>;
};

/** Update the columns of the 'receipts' collection */
export type UpdateReceiptsByIdUpdateColumnsInput = {
  /** Update the 'company_id' column in the 'receipts' collection. */
  companyId?: InputMaybe<UpdateColumnReceiptsCompanyIdInput>;
  /** Update the 'created_at' column in the 'receipts' collection. */
  createdAt?: InputMaybe<UpdateColumnReceiptsCreatedAtInput>;
  /** Update the 'flagged_reason' column in the 'receipts' collection. */
  flaggedReason?: InputMaybe<UpdateColumnReceiptsFlaggedReasonInput>;
  /** Update the 'id' column in the 'receipts' collection. */
  id?: InputMaybe<UpdateColumnReceiptsIdInput>;
  /** Update the 'image_url' column in the 'receipts' collection. */
  imageUrl?: InputMaybe<UpdateColumnReceiptsImageUrlInput>;
  /** Update the 'raw_text' column in the 'receipts' collection. */
  rawText?: InputMaybe<UpdateColumnReceiptsRawTextInput>;
  /** Update the 'receipt_date' column in the 'receipts' collection. */
  receiptDate?: InputMaybe<UpdateColumnReceiptsReceiptDateInput>;
  /** Update the 'status' column in the 'receipts' collection. */
  status?: InputMaybe<UpdateColumnReceiptsStatusInput>;
  /** Update the 'total_amount' column in the 'receipts' collection. */
  totalAmount?: InputMaybe<UpdateColumnReceiptsTotalAmountInput>;
  /** Update the 'user_id' column in the 'receipts' collection. */
  userId?: InputMaybe<UpdateColumnReceiptsUserIdInput>;
  /** Update the 'vendor_name' column in the 'receipts' collection. */
  vendorName?: InputMaybe<UpdateColumnReceiptsVendorNameInput>;
  /** Update the 'vendor_tax_id' column in the 'receipts' collection. */
  vendorTaxId?: InputMaybe<UpdateColumnReceiptsVendorTaxIdInput>;
  /** Update the 'vendor_tax_id_valid' column in the 'receipts' collection. */
  vendorTaxIdValid?: InputMaybe<UpdateColumnReceiptsVendorTaxIdValidInput>;
};

/** Responses from the 'update_spend_policies_by_category_and_company_id' procedure */
export type UpdateSpendPoliciesByCategoryAndCompanyIdResponse = {
  __typename?: 'UpdateSpendPoliciesByCategoryAndCompanyIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<SpendPolicies>;
};

/** Update the columns of the 'spend_policies' collection */
export type UpdateSpendPoliciesByCategoryAndCompanyIdUpdateColumnsInput = {
  /** Update the 'category' column in the 'spend_policies' collection. */
  category?: InputMaybe<UpdateColumnSpendPoliciesCategoryInput>;
  /** Update the 'company_id' column in the 'spend_policies' collection. */
  companyId?: InputMaybe<UpdateColumnSpendPoliciesCompanyIdInput>;
  /** Update the 'created_at' column in the 'spend_policies' collection. */
  createdAt?: InputMaybe<UpdateColumnSpendPoliciesCreatedAtInput>;
  /** Update the 'id' column in the 'spend_policies' collection. */
  id?: InputMaybe<UpdateColumnSpendPoliciesIdInput>;
  /** Update the 'max_per_month' column in the 'spend_policies' collection. */
  maxPerMonth?: InputMaybe<UpdateColumnSpendPoliciesMaxPerMonthInput>;
  /** Update the 'max_per_transaction' column in the 'spend_policies' collection. */
  maxPerTransaction?: InputMaybe<UpdateColumnSpendPoliciesMaxPerTransactionInput>;
};

/** Responses from the 'update_spend_policies_by_id' procedure */
export type UpdateSpendPoliciesByIdResponse = {
  __typename?: 'UpdateSpendPoliciesByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<SpendPolicies>;
};

/** Update the columns of the 'spend_policies' collection */
export type UpdateSpendPoliciesByIdUpdateColumnsInput = {
  /** Update the 'category' column in the 'spend_policies' collection. */
  category?: InputMaybe<UpdateColumnSpendPoliciesCategoryInput>;
  /** Update the 'company_id' column in the 'spend_policies' collection. */
  companyId?: InputMaybe<UpdateColumnSpendPoliciesCompanyIdInput>;
  /** Update the 'created_at' column in the 'spend_policies' collection. */
  createdAt?: InputMaybe<UpdateColumnSpendPoliciesCreatedAtInput>;
  /** Update the 'id' column in the 'spend_policies' collection. */
  id?: InputMaybe<UpdateColumnSpendPoliciesIdInput>;
  /** Update the 'max_per_month' column in the 'spend_policies' collection. */
  maxPerMonth?: InputMaybe<UpdateColumnSpendPoliciesMaxPerMonthInput>;
  /** Update the 'max_per_transaction' column in the 'spend_policies' collection. */
  maxPerTransaction?: InputMaybe<UpdateColumnSpendPoliciesMaxPerTransactionInput>;
};

/** Responses from the 'update_users_by_email' procedure */
export type UpdateUsersByEmailResponse = {
  __typename?: 'UpdateUsersByEmailResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Users>;
};

/** Update the columns of the 'users' collection */
export type UpdateUsersByEmailUpdateColumnsInput = {
  /** Update the 'company_id' column in the 'users' collection. */
  companyId?: InputMaybe<UpdateColumnUsersCompanyIdInput>;
  /** Update the 'created_at' column in the 'users' collection. */
  createdAt?: InputMaybe<UpdateColumnUsersCreatedAtInput>;
  /** Update the 'email' column in the 'users' collection. */
  email?: InputMaybe<UpdateColumnUsersEmailInput>;
  /** Update the 'full_name' column in the 'users' collection. */
  fullName?: InputMaybe<UpdateColumnUsersFullNameInput>;
  /** Update the 'id' column in the 'users' collection. */
  id?: InputMaybe<UpdateColumnUsersIdInput>;
  /** Update the 'role' column in the 'users' collection. */
  role?: InputMaybe<UpdateColumnUsersRoleInput>;
};

/** Responses from the 'update_users_by_id' procedure */
export type UpdateUsersByIdResponse = {
  __typename?: 'UpdateUsersByIdResponse';
  /** The number of rows affected by the mutation */
  affectedRows: Scalars['Int32']['output'];
  /** Data from rows affected by the mutation */
  returning: Array<Users>;
};

/** Update the columns of the 'users' collection */
export type UpdateUsersByIdUpdateColumnsInput = {
  /** Update the 'company_id' column in the 'users' collection. */
  companyId?: InputMaybe<UpdateColumnUsersCompanyIdInput>;
  /** Update the 'created_at' column in the 'users' collection. */
  createdAt?: InputMaybe<UpdateColumnUsersCreatedAtInput>;
  /** Update the 'email' column in the 'users' collection. */
  email?: InputMaybe<UpdateColumnUsersEmailInput>;
  /** Update the 'full_name' column in the 'users' collection. */
  fullName?: InputMaybe<UpdateColumnUsersFullNameInput>;
  /** Update the 'id' column in the 'users' collection. */
  id?: InputMaybe<UpdateColumnUsersIdInput>;
  /** Update the 'role' column in the 'users' collection. */
  role?: InputMaybe<UpdateColumnUsersRoleInput>;
};

export type UserRoleAggExp = {
  __typename?: 'UserRoleAggExp';
  _count: Scalars['Int64']['output'];
  _count_distinct: Scalars['Int64']['output'];
  max?: Maybe<Scalars['Enum']['output']>;
  min?: Maybe<Scalars['Enum']['output']>;
};

export type UserRoleBoolExp = {
  _and?: InputMaybe<Array<UserRoleBoolExp>>;
  _eq?: InputMaybe<Scalars['Enum']['input']>;
  _gt?: InputMaybe<Scalars['Enum']['input']>;
  _gte?: InputMaybe<Scalars['Enum']['input']>;
  _in?: InputMaybe<Array<Scalars['Enum']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Enum']['input']>;
  _lte?: InputMaybe<Scalars['Enum']['input']>;
  _neq?: InputMaybe<Scalars['Enum']['input']>;
  _not?: InputMaybe<UserRoleBoolExp>;
  _or?: InputMaybe<Array<UserRoleBoolExp>>;
};

export type Users = {
  __typename?: 'Users';
  company?: Maybe<Companies>;
  companyId: Scalars['Uuid']['output'];
  createdAt?: Maybe<Scalars['Timestamptz']['output']>;
  email: Scalars['String1']['output'];
  fullName: Scalars['String1']['output'];
  id: Scalars['Uuid']['output'];
  receipts?: Maybe<Array<Receipts>>;
  receiptsAggregate: ReceiptsAggExp;
  role: Scalars['Enum']['output'];
};


export type UsersReceiptsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ReceiptsOrderByExp>>;
  where?: InputMaybe<ReceiptsBoolExp>;
};


export type UsersReceiptsAggregateArgs = {
  filter_input?: InputMaybe<ReceiptsFilterInput>;
};

export type UsersAggExp = {
  __typename?: 'UsersAggExp';
  _count: Scalars['Int64']['output'];
  companyId: UuidAggExp;
  createdAt: TimestamptzAggExp;
  email: TextAggExp;
  fullName: TextAggExp;
  id: UuidAggExp;
  role: UserRoleAggExp;
};

export type UsersBoolExp = {
  _and?: InputMaybe<Array<UsersBoolExp>>;
  _not?: InputMaybe<UsersBoolExp>;
  _or?: InputMaybe<Array<UsersBoolExp>>;
  company?: InputMaybe<CompaniesBoolExp>;
  companyId?: InputMaybe<UuidBoolExp>;
  createdAt?: InputMaybe<TimestamptzBoolExp>;
  email?: InputMaybe<TextBoolExp>;
  fullName?: InputMaybe<TextBoolExp>;
  id?: InputMaybe<UuidBoolExp>;
  receipts?: InputMaybe<ReceiptsBoolExp>;
  role?: InputMaybe<UserRoleBoolExp>;
};

export type UsersFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UsersOrderByExp>>;
  where?: InputMaybe<UsersBoolExp>;
};

export type UsersOrderByExp = {
  company?: InputMaybe<CompaniesOrderByExp>;
  companyId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  fullName?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
};

export type UuidAggExp = {
  __typename?: 'UuidAggExp';
  _count: Scalars['Int64']['output'];
  _count_distinct: Scalars['Int64']['output'];
};

export type UuidBoolExp = {
  _and?: InputMaybe<Array<UuidBoolExp>>;
  _eq?: InputMaybe<Scalars['Uuid']['input']>;
  _gt?: InputMaybe<Scalars['Uuid']['input']>;
  _gte?: InputMaybe<Scalars['Uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['Uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Uuid']['input']>;
  _lte?: InputMaybe<Scalars['Uuid']['input']>;
  _neq?: InputMaybe<Scalars['Uuid']['input']>;
  _not?: InputMaybe<UuidBoolExp>;
  _or?: InputMaybe<Array<UuidBoolExp>>;
};

export type ScanBootstrapQueryVariables = Exact<{ [key: string]: never; }>;


export type ScanBootstrapQuery = { __typename?: 'Query', users?: Array<{ __typename?: 'Users', id: any, fullName: any, companyId: any }> | null };

export type ScanUserContextQueryVariables = Exact<{
  id: Scalars['Uuid']['input'];
}>;


export type ScanUserContextQuery = { __typename?: 'Query', usersById?: { __typename?: 'Users', id: any, fullName: any, companyId: any } | null };

export type InsertScanReceiptMutationVariables = Exact<{
  objects: Array<InsertReceiptsObjectInput> | InsertReceiptsObjectInput;
}>;


export type InsertScanReceiptMutation = { __typename?: 'Mutation', insertReceipts: { __typename?: 'InsertReceiptsResponse', returning: Array<{ __typename?: 'Receipts', id: any, vendorName: any, receiptDate: any, totalAmount: any, status?: any | null, imageUrl?: any | null, userId: any, vendorTaxId?: any | null, vendorTaxIdValid: any, companyId: any }> } };

export type InsertScanReceiptItemsMutationVariables = Exact<{
  objects: Array<InsertReceiptItemsObjectInput> | InsertReceiptItemsObjectInput;
}>;


export type InsertScanReceiptItemsMutation = { __typename?: 'Mutation', insertReceiptItems: { __typename?: 'InsertReceiptItemsResponse', affectedRows: any, returning: Array<{ __typename?: 'ReceiptItems', id: any, description: any, category?: any | null, quantity?: any | null, unitPrice: any, totalPrice: any }> } };

export type UpdateScanReceiptMutationVariables = Exact<{
  keyId: Scalars['Uuid']['input'];
  updateColumns: UpdateReceiptsByIdUpdateColumnsInput;
}>;


export type UpdateScanReceiptMutation = { __typename?: 'Mutation', updateReceiptsById: { __typename?: 'UpdateReceiptsByIdResponse', returning: Array<{ __typename?: 'Receipts', id: any, vendorName: any, receiptDate: any, totalAmount: any, status?: any | null, imageUrl?: any | null, userId: any, vendorTaxId?: any | null, vendorTaxIdValid: any, companyId: any }> } };

export type ScanReceiptItemIdsQueryVariables = Exact<{
  id: Scalars['Uuid']['input'];
}>;


export type ScanReceiptItemIdsQuery = { __typename?: 'Query', receiptsById?: { __typename?: 'Receipts', id: any, receiptItems?: Array<{ __typename?: 'ReceiptItems', id: any }> | null } | null };

export type DeleteScanReceiptItemMutationVariables = Exact<{
  id: Scalars['Uuid']['input'];
}>;


export type DeleteScanReceiptItemMutation = { __typename?: 'Mutation', deleteReceiptItemsById: { __typename?: 'DeleteReceiptItemsByIdResponse', affectedRows: any } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const ScanBootstrapDocument = new TypedDocumentString(`
    query ScanBootstrap {
  users(order_by: [{fullName: Asc}]) {
    id
    fullName
    companyId
  }
}
    `) as unknown as TypedDocumentString<ScanBootstrapQuery, ScanBootstrapQueryVariables>;
export const ScanUserContextDocument = new TypedDocumentString(`
    query ScanUserContext($id: Uuid!) {
  usersById(id: $id) {
    id
    fullName
    companyId
  }
}
    `) as unknown as TypedDocumentString<ScanUserContextQuery, ScanUserContextQueryVariables>;
export const InsertScanReceiptDocument = new TypedDocumentString(`
    mutation InsertScanReceipt($objects: [InsertReceiptsObjectInput!]!) {
  insertReceipts(objects: $objects) {
    returning {
      id
      vendorName
      receiptDate
      totalAmount
      status
      imageUrl
      userId
      vendorTaxId
      vendorTaxIdValid
      companyId
    }
  }
}
    `) as unknown as TypedDocumentString<InsertScanReceiptMutation, InsertScanReceiptMutationVariables>;
export const InsertScanReceiptItemsDocument = new TypedDocumentString(`
    mutation InsertScanReceiptItems($objects: [InsertReceiptItemsObjectInput!]!) {
  insertReceiptItems(objects: $objects) {
    affectedRows
    returning {
      id
      description
      category
      quantity
      unitPrice
      totalPrice
    }
  }
}
    `) as unknown as TypedDocumentString<InsertScanReceiptItemsMutation, InsertScanReceiptItemsMutationVariables>;
export const UpdateScanReceiptDocument = new TypedDocumentString(`
    mutation UpdateScanReceipt($keyId: Uuid!, $updateColumns: UpdateReceiptsByIdUpdateColumnsInput!) {
  updateReceiptsById(keyId: $keyId, updateColumns: $updateColumns) {
    returning {
      id
      vendorName
      receiptDate
      totalAmount
      status
      imageUrl
      userId
      vendorTaxId
      vendorTaxIdValid
      companyId
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateScanReceiptMutation, UpdateScanReceiptMutationVariables>;
export const ScanReceiptItemIdsDocument = new TypedDocumentString(`
    query ScanReceiptItemIds($id: Uuid!) {
  receiptsById(id: $id) {
    id
    receiptItems {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<ScanReceiptItemIdsQuery, ScanReceiptItemIdsQueryVariables>;
export const DeleteScanReceiptItemDocument = new TypedDocumentString(`
    mutation DeleteScanReceiptItem($id: Uuid!) {
  deleteReceiptItemsById(keyId: $id) {
    affectedRows
  }
}
    `) as unknown as TypedDocumentString<DeleteScanReceiptItemMutation, DeleteScanReceiptItemMutationVariables>;