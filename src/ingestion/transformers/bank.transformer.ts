import { Injectable } from "@nestjs/common";
import { CanonicalNormalizedEvent } from "../types/normalized";
import { FieldMapper } from "../utils/field-mapper.util";
import { DateUtil } from "../utils/date.util";

@Injectable()
export class BankTransformer {

  transform(tx: any): CanonicalNormalizedEvent {
    return {
      type: 'transfer',

      tx_id: tx.tx_id ?? null,

      currency: tx.currency ?? 'MXN',

      amount: Number(
        FieldMapper.pick(tx, ['amount', 'monto', 'importe', 'total_amount'])
      ),

      timestamp: DateUtil.parseDate(
        FieldMapper.pick(tx, ['posted_at', 'fecha', 'date', 'fecha_operacion'])
      ),

      from: this.clean(
        FieldMapper.pick(tx, ['sender_name', 'emisor.nombre'])
      ),

      to: this.clean(
        FieldMapper.pick(tx, ['receiver_name', 'receptor.nombre'])
      ),

      source: 'BANK',
    };
  }

  private clean(name?: string) {
    if (!name) return null;

    return name
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim();
  }
}