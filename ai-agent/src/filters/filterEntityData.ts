export function filterEntityData(

  entityQuery: string,

  transactions: any[],
  invoices: any[],
  contracts: any[],
  satRegistry: any[]

) {

  const query =
    entityQuery.toLowerCase();

  const txs = transactions.filter(

    (tx) =>

      JSON.stringify(tx)
        .toLowerCase()
        .includes(query)
  );

  const invs = invoices.filter(

    (inv) =>

      JSON.stringify(inv)
        .toLowerCase()
        .includes(query)
  );

  const conts = contracts.filter(

    (c) =>

      JSON.stringify(c)
        .toLowerCase()
        .includes(query)
  );

  const sat = satRegistry.filter(

    (s) =>

      JSON.stringify(s)
        .toLowerCase()
        .includes(query)
  );

  return {

    transactions: txs,

    invoices: invs,

    contracts: conts,

    satRegistry: sat,
  };
}