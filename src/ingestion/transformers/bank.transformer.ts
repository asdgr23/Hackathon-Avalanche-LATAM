import { Injectable } from '@nestjs/common';
import { DateUtil } from '../utils/date.util';
import { FieldMapper } from '../utils/field-mapper.util';

@Injectable()
export class BankTransformer {
  transform(tx: any) {
    return {
      type: 'BANK_TX',
      currency: tx.currency ?? 'MXN',
      tx_id: tx.tx_id ?? null,
      rfc_from: tx.sender_rfc ?? null,
      rfc_to: tx.receiver_rfc ?? null,
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
    )
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