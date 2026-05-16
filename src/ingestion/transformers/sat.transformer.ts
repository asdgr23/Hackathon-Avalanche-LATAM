import { Injectable } from '@nestjs/common';
import { DateUtil } from '../utils/date.util';

@Injectable()
export class SatTransformer {

  transform(r: any) {
    return {
      type: 'SAT_ENTITY',

      rfc: r.rfc ?? null,

      // canonical identity (VERY IMPORTANT FOR GRAPH MERGING)
      legal_name: this.clean(r.razon_social),
      trade_name: this.clean(r.nombre_comercial),

      fiscal_regime: r.regimen_fiscal ?? null,

      economic_activity: r.actividad_economica ?? null,
      sector: r.sector ?? null,

      status: r.estatus ?? 'unknown',

      registration_date:DateUtil.parseDate(r.fecha_alta),
      last_update: DateUtil.parseDate(r.ultima_actualizacion),

      location: {
        street: r.domicilio_fiscal?.calle ?? null,
        municipality: r.domicilio_fiscal?.municipio ?? null,
        state: r.domicilio_fiscal?.estado ?? null,
        postal_code: r.domicilio_fiscal?.codigo_postal ?? null,
        country: r.domicilio_fiscal?.pais ?? 'MX',
      },

      //  ENTITY MATCHING
      identity_keys: {
        rfc_normalized: r.rfc?.toUpperCase() ?? null,
        name_signature: this.createNameSignature(r.razon_social, r.nombre_comercial),
      },

      confidence_flags: {
        missing_rfc: !r.rfc,
        weak_trade_name: !r.nombre_comercial,
      }
    };
  }

  // =========================
  // NAME CLEANING (GRAPH)
  // =========================

  private clean(name?: string) {
    if (!name) return null;

    return name
      .toLowerCase()
      .replace(/\b(s\.a\.|s\.a\.p\.i\.|s de rl de cv|sa de cv|de cv)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // =========================
  // NAME SIGNATURE (ENTITY RESOLUTION CORE)
  // =========================

  private createNameSignature(legal?: string, trade?: string) {
    const base = `${legal ?? ''} ${trade ?? ''}`
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^\w]/g, '');

    return base || null;
  }
}