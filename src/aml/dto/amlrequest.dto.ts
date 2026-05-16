export class AmlRequestDto {
  entity_id: string;

  transactions: {
    from: string;
    to: string;
    amount: number;
    timestamp: string;
  }[];

  graph_edges?: {
    from: string;
    to: string;
    type: string;
  }[];
}