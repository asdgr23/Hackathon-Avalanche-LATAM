export function detectRapidMovement(
  transactions: any[]
): boolean {

  for (let i = 1; i < transactions.length; i++) {

    const prev = transactions[i - 1];

    const curr = transactions[i];

    const prevTime =
      new Date(prev.timestamp).getTime();

    const currTime =
      new Date(curr.timestamp).getTime();

    const diffMinutes =
      (currTime - prevTime)
      / 1000
      / 60;

    if (diffMinutes < 5) {
      return true;
    }
  }

  return false;
}