import { Injectable } from '@nestjs/common';
import { DateUtil } from '../utils/date.util';
import { CanonicalNormalizedEvent } from '../types/normalized';

@Injectable()
export class ErpTransformer {

  transform(inv: any): CanonicalNormalizedEvent {
    const amount = this.resolveAmount(inv);

    return {
      type: 'invoice',

      tx_id: inv.folio ?? null,

      currency: inv.moneda ?? 'MXN',

      amount,

      timestamp: DateUtil.parseDate(inv.fecha_emision),

      from: this.clean(inv.emisor?.nombre),

      to: this.clean(inv.receptor?.nombre),

      source: 'ERP',
    };
  }

  // =========================

  private resolveAmount(inv: any): number | null {
    const raw =
      inv.monto_total ??
      inv.total_amount ??
      inv.subtotal_amount ??
      inv.subtotal ??
      inv.subTotal ??
      null;

    return raw ? Number(raw) : null;
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