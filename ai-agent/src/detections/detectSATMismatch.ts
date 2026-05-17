export function detectSATMismatch(
  transactions: any[],
  satRegistry: any[]
): boolean {

  let totalVolume = 0;

  for (const tx of transactions) {

    totalVolume += Number(
      tx.amount ||
      tx.transaction_amount ||
      0
    );
  }

  for (const entity of satRegistry) {

    const declaredRevenue =
      Number(
        entity.annual_declared_revenue ||
        entity.declared_revenue ||
        0
      );

    // Si mueve MUCHÍSIMO más
    // de lo declarado al SAT
    if (
      declaredRevenue > 0 &&
      totalVolume >
      declaredRevenue * 5
    ) {
      return true;
    }
  }

  return false;
}