export type GraphNodeRef = {
  id: string; // wallet, rfc, account id
  type: 'WALLET' | 'COMPANY' | 'PERSON' | 'CONTRACT';
};