import { Injectable } from '@nestjs/common';
import { GraphEntity } from '../types/graphentity';

@Injectable()
export class SatTransformer {

  transform(r: any): GraphEntity {
    return {
      type: 'ENTITY',

      entity_id: r.rfc ?? this.createNameSignature(r.razon_social, r.nombre_comercial),

      rfc: r.rfc ?? null,

      legal_name: this.clean(r.razon_social),

      trade_name: this.clean(r.nombre_comercial),

      location: {
        street: r.domicilio_fiscal?.calle ?? null,
        municipality: r.domicilio_fiscal?.municipio ?? null,
        state: r.domicilio_fiscal?.estado ?? null,
        postal_code: r.domicilio_fiscal?.codigo_postal ?? null,
        country: r.domicilio_fiscal?.pais ?? 'MX',
      },

      identity_signature: this.createNameSignature(
        r.razon_social,
        r.nombre_comercial
      ),

      source: 'SAT',
    };
  }

  // =========================

  private clean(name?: string) {
    if (!name) return null;

    return name
      .toLowerCase()
      .replace(/\b(s\.a\.|s\.a\.p\.i\.|s de rl de cv|sa de cv|de cv)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private createNameSignature(legal?: string, trade?: string) {
    const base = `${legal ?? ''} ${trade ?? ''}`
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^\w]/g, '');

    return base || null;
  }
}