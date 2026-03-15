/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query ScanBootstrap {\n    users(order_by: [{ fullName: Asc }]) {\n      id\n      fullName\n      companyId\n    }\n  }\n": typeof types.ScanBootstrapDocument,
    "\n  query ScanUserContext($id: Uuid!) {\n    usersById(id: $id) {\n      id\n      fullName\n      companyId\n    }\n  }\n": typeof types.ScanUserContextDocument,
    "\n  mutation InsertScanReceipt($objects: [InsertReceiptsObjectInput!]!) {\n    insertReceipts(objects: $objects) {\n      returning {\n        id\n        vendorName\n        receiptDate\n        totalAmount\n        status\n        imageUrl\n        userId\n        vendorTaxId\n        vendorTaxIdValid\n        companyId\n      }\n    }\n  }\n": typeof types.InsertScanReceiptDocument,
    "\n  mutation InsertScanReceiptItems($objects: [InsertReceiptItemsObjectInput!]!) {\n    insertReceiptItems(objects: $objects) {\n      affectedRows\n      returning {\n        id\n        description\n        category\n        quantity\n        unitPrice\n        totalPrice\n      }\n    }\n  }\n": typeof types.InsertScanReceiptItemsDocument,
    "\n  mutation UpdateScanReceipt(\n    $keyId: Uuid!\n    $updateColumns: UpdateReceiptsByIdUpdateColumnsInput!\n  ) {\n    updateReceiptsById(keyId: $keyId, updateColumns: $updateColumns) {\n      returning {\n        id\n        vendorName\n        receiptDate\n        totalAmount\n        status\n        imageUrl\n        userId\n        vendorTaxId\n        vendorTaxIdValid\n        companyId\n      }\n    }\n  }\n": typeof types.UpdateScanReceiptDocument,
    "\n  query ScanReceiptItemIds($id: Uuid!) {\n    receiptsById(id: $id) {\n      id\n      receiptItems {\n        id\n      }\n    }\n  }\n": typeof types.ScanReceiptItemIdsDocument,
    "\n  mutation DeleteScanReceiptItem($id: Uuid!) {\n    deleteReceiptItemsById(keyId: $id) {\n      affectedRows\n    }\n  }\n": typeof types.DeleteScanReceiptItemDocument,
};
const documents: Documents = {
    "\n  query ScanBootstrap {\n    users(order_by: [{ fullName: Asc }]) {\n      id\n      fullName\n      companyId\n    }\n  }\n": types.ScanBootstrapDocument,
    "\n  query ScanUserContext($id: Uuid!) {\n    usersById(id: $id) {\n      id\n      fullName\n      companyId\n    }\n  }\n": types.ScanUserContextDocument,
    "\n  mutation InsertScanReceipt($objects: [InsertReceiptsObjectInput!]!) {\n    insertReceipts(objects: $objects) {\n      returning {\n        id\n        vendorName\n        receiptDate\n        totalAmount\n        status\n        imageUrl\n        userId\n        vendorTaxId\n        vendorTaxIdValid\n        companyId\n      }\n    }\n  }\n": types.InsertScanReceiptDocument,
    "\n  mutation InsertScanReceiptItems($objects: [InsertReceiptItemsObjectInput!]!) {\n    insertReceiptItems(objects: $objects) {\n      affectedRows\n      returning {\n        id\n        description\n        category\n        quantity\n        unitPrice\n        totalPrice\n      }\n    }\n  }\n": types.InsertScanReceiptItemsDocument,
    "\n  mutation UpdateScanReceipt(\n    $keyId: Uuid!\n    $updateColumns: UpdateReceiptsByIdUpdateColumnsInput!\n  ) {\n    updateReceiptsById(keyId: $keyId, updateColumns: $updateColumns) {\n      returning {\n        id\n        vendorName\n        receiptDate\n        totalAmount\n        status\n        imageUrl\n        userId\n        vendorTaxId\n        vendorTaxIdValid\n        companyId\n      }\n    }\n  }\n": types.UpdateScanReceiptDocument,
    "\n  query ScanReceiptItemIds($id: Uuid!) {\n    receiptsById(id: $id) {\n      id\n      receiptItems {\n        id\n      }\n    }\n  }\n": types.ScanReceiptItemIdsDocument,
    "\n  mutation DeleteScanReceiptItem($id: Uuid!) {\n    deleteReceiptItemsById(keyId: $id) {\n      affectedRows\n    }\n  }\n": types.DeleteScanReceiptItemDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ScanBootstrap {\n    users(order_by: [{ fullName: Asc }]) {\n      id\n      fullName\n      companyId\n    }\n  }\n"): typeof import('./graphql').ScanBootstrapDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ScanUserContext($id: Uuid!) {\n    usersById(id: $id) {\n      id\n      fullName\n      companyId\n    }\n  }\n"): typeof import('./graphql').ScanUserContextDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InsertScanReceipt($objects: [InsertReceiptsObjectInput!]!) {\n    insertReceipts(objects: $objects) {\n      returning {\n        id\n        vendorName\n        receiptDate\n        totalAmount\n        status\n        imageUrl\n        userId\n        vendorTaxId\n        vendorTaxIdValid\n        companyId\n      }\n    }\n  }\n"): typeof import('./graphql').InsertScanReceiptDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InsertScanReceiptItems($objects: [InsertReceiptItemsObjectInput!]!) {\n    insertReceiptItems(objects: $objects) {\n      affectedRows\n      returning {\n        id\n        description\n        category\n        quantity\n        unitPrice\n        totalPrice\n      }\n    }\n  }\n"): typeof import('./graphql').InsertScanReceiptItemsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateScanReceipt(\n    $keyId: Uuid!\n    $updateColumns: UpdateReceiptsByIdUpdateColumnsInput!\n  ) {\n    updateReceiptsById(keyId: $keyId, updateColumns: $updateColumns) {\n      returning {\n        id\n        vendorName\n        receiptDate\n        totalAmount\n        status\n        imageUrl\n        userId\n        vendorTaxId\n        vendorTaxIdValid\n        companyId\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateScanReceiptDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ScanReceiptItemIds($id: Uuid!) {\n    receiptsById(id: $id) {\n      id\n      receiptItems {\n        id\n      }\n    }\n  }\n"): typeof import('./graphql').ScanReceiptItemIdsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteScanReceiptItem($id: Uuid!) {\n    deleteReceiptItemsById(keyId: $id) {\n      affectedRows\n    }\n  }\n"): typeof import('./graphql').DeleteScanReceiptItemDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
