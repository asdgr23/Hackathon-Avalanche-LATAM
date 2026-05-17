export function detectLayering(
  transactions: any[]
): boolean {

  const entities =
    new Set<string>();

  for (const tx of transactions) {

    entities.add(tx.sender);

    entities.add(tx.receiver);
  }

  return entities.size > 10;
}