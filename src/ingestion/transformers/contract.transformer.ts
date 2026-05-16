import { Injectable } from '@nestjs/common';
import { DateUtil } from '../utils/date.util';
import { EntityResolutionService } from 'src/entity-resolution/entity-resolution.service';

@Injectable()
export class ContractTransformer {
  constructor(private entityResolution: EntityResolutionService) {}

  transform(c: any) {
   const supplierRawName = c.proveedor?.nombre;
    const clientRawName = c.cliente?.nombre;

    const supplierName = this.clean(supplierRawName);
    const clientName = this.clean(clientRawName);

    const supplierEntity = this.entityResolution.resolve({
      name: supplierName,
      rfc: c.proveedor?.rfc,
    });

    const clientEntity = this.entityResolution.resolve({
      name: clientName,
      rfc: c.cliente?.rfc,
    });
    return {
      type: 'CONTRACT',

      contract_id: c.contract_id ?? null,
      contract_type: c.tipo ?? null,
      description: c.descripcion ?? null,

      supplier: this.clean(c.proveedor?.nombre),
      supplier_rfc: c.proveedor?.rfc ?? null,
      supplier_entity: supplierEntity?.entity_id ?? null,

      client: this.clean(c.cliente?.nombre),
      client_rfc: c.cliente?.rfc ?? null,
      client_entity: clientEntity?.entity_id ?? null,
      start_date: DateUtil.parseDate(c.vigencia?.inicio),
      end_date: DateUtil.parseDate(c.vigencia?.fin),

      currency: c.moneda ?? 'MXN',
      payment_terms: c.condiciones_pago ?? null,

      auto_renewal: c.auto_renovacion ?? false,
      status: c.estado ?? 'unknown',

      // normalized financial value (important for risk later)
      monthly_value: this.resolveValue(c),

      raw_range_value: c.rango_valor ?? null,

      confidence_flags: {
        missing_supplier_rfc: !c.proveedor?.rfc,
        missing_client_rfc: !c.cliente?.rfc,
        weak_entity_name: this.isWeakName(c.proveedor?.nombre),
      }
    };
  }

  // =========================
  // VALUE NORMALIZATION
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

  // =========================
  // ENTITY CLEANING (CRITICAL)
  // =========================

  private clean(name?: string) {
    if (!name) return null;

    return name
      .toLowerCase()
      .replace(/\b(s\.a\.|s\.a\.p\.i\.|sa de cv|s de rl de cv|de cv)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }


  // =========================
  // BASIC QUALITY SIGNALS (VERY USEFUL FOR AML LATER)
  // =========================

  private isWeakName(name?: string): boolean {
    if (!name) return true;
    return name.length < 5;
  }
}