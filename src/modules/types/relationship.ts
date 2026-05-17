export type GraphRelationship = {
  type: 'SENT' | 'RECEIVED' | 'OWES' | 'CONTRACTED';

  properties: {
    amount: number;
    currency: string;
    timestamp: string;
    source: string;
  };
};