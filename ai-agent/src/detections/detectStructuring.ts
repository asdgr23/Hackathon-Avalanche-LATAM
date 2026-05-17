export function detectStructuring(
  transactions: any[]
): boolean {

  let suspiciousCount = 0;

  for (const tx of transactions) {

    // intenta detectar distintos nombres posibles
    const amount =
      Number(
        tx.amount ||
        tx.transaction_amount ||
        tx.value ||
        tx.usd_amount ||
        0
      );

    // Structuring típico:
    // montos justo debajo del threshold
    if (
      amount >= 8000 &&
      amount <= 9999
    ) {
      suspiciousCount++;
    }
  }

  // Si hay varias transacciones sospechosas,
  // levantamos flag
  return suspiciousCount >= 3;
}