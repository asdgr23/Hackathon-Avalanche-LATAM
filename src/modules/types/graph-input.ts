import { EntityTransaction } from "./entity-transaction";
import { ResolvedEntity } from "./resolved-entity";

export interface EntityGraphInput {
  entities: ResolvedEntity[];
  transactions: EntityTransaction[];
}