import { Injectable } from '@nestjs/common';
import { DateUtil } from '../utils/date.util';

@Injectable()
export class ErpTransformer {

  transform(inv: any) {
    const amount = this.resolveAmount(inv);

    return {
      type: 'ERP_INVOICE',

      invoice_id: inv.folio ?? null,
      series: inv.serie ?? null,

      issuer: this.clean(inv.emisor?.nombre),
      issuer_rfc: inv.emisor?.rfc ?? null,

      receiver: this.clean(inv.receptor?.nombre),
      receiver_rfc: inv.receptor?.rfc ?? null,

      amount: amount,
      currency: inv.moneda ?? 'MXN',

      issue_date: DateUtil.parseDate(inv.fecha_emision),
      due_date: DateUtil.parseDate(inv.fecha_vencimiento),
      payment_date: DateUtil.parseDate(inv.fecha_pago),

      status: inv.estado ?? 'unknown',

      category: inv.categoria ?? null,
      concept: inv.concepto ?? null,

      contract_ref: inv.contrato_ref ?? null,
      uuid_sat: inv.uuid_sat ?? null,
    };
  }

  // =========================
  // AMOUNT RESOLUTION (CRÍTICO)
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

  // =========================
  // CLEAN ENTITY
  // =========================

  private clean(name?: string) {
    if (!name) return null;

    return name
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim();
  }

}