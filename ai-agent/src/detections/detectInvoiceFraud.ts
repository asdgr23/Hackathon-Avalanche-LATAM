export function detectInvoiceFraud(
  invoices: any[],
  contracts: any[]
): boolean {

  for (const invoice of invoices) {

    const matchingContract =
      contracts.find(
        (c) =>
          c.contract_id ===
          invoice.contract_id
      );

    if (!matchingContract) {
      continue;
    }

    if (
      invoice.amount >
      matchingContract.amount * 1.5
    ) {

      return true;
    }
  }

  return false;
}