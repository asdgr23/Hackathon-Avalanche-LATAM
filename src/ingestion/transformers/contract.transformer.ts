import { Injectable } from '@nestjs/common';
import { DateUtil } from '../utils/date.util';
import { EntityResolutionService } from 'src/entity-resolution/entity-resolution.service';
import { CanonicalNormalizedEvent } from '../types/normalized';

@Injectable()
export class ContractTransformer {

  constructor(private entityResolution: EntityResolutionService) {}

  transform(c: any): CanonicalNormalizedEvent {

    const supplier = this.clean(c.proveedor?.nombre);
    const client = this.clean(c.cliente?.nombre);

    return {
      type: 'contract',

      tx_id: c.contract_id ?? null,

      currency: c.moneda ?? 'MXN',

      amount: this.resolveValue(c), // monthly value o contrato

      timestamp: DateUtil.parseDate(c.vigencia?.inicio),

      from: supplier,
      to: client,

      source: 'CONTRACT',
    };
  }

  // =========================

  private resolveValue(c: any): number | null {
    if (c.valor_mensual_aprox) {
      return Number(c.valor_mensual_aprox);
    }

    if (!c.rango_valor) return null;

    const numbers = c.rango_valor
      .replace(/[^\d\-]/g, '')
      .split('-')
      .map(n => Number(n));

    if (numbers.length === 2 && !isNaN(numbers[0]) && !isNaN(numbers[1])) {
      return (numbers[0] + numbers[1]) / 2;
    }

    return numbers[0] ?? null;
  }

  private clean(name?: string) {
    if (!name) return null;

    return name
      .toLowerCase()
      .replace(/\b(s\.a\.|s\.a\.p\.i\.|sa de cv|s de rl de cv|de cv)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}