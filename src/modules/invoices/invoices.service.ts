import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { QueryInvoiceDto } from './dto/query-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly neo4j: Neo4jService) {}

  async create(dto: CreateInvoiceDto) {
    const session = this.neo4j.getWriteSession();
    try {
      await session.run(
        `MERGE (inv:Invoice {folio: $folio})
         SET inv += $props
         WITH inv
         MERGE (em:Entity  {id: $emisorRfc})
         SET em.name = $emisorName, em.rfc = $emisorRfc
         MERGE (re:Entity  {id: $receptorRfc})
         SET re.name = $receptorName, re.rfc = $receptorRfc
         MERGE (em)-[r:INVOICED_BY]->(re)
         SET r.total    = $total,
             r.type     = $type,
             r.issuedAt = $issuedAt,
             r.weight   = $weight`,
        {
          folio:         dto.folio,
          props:         { ...dto },
          emisorRfc:     dto.emisorRfc,
          emisorName:    dto.emisorName,
          receptorRfc:   dto.receptorRfc,
          receptorName:  dto.receptorName,
          total:         dto.total,
          type:          dto.type,
          issuedAt:      dto.issuedAt,
          weight:        this.calcWeight(dto.total),
        },
      );
      return { ok: true, folio: dto.folio };
    } finally {
      await session.close();
    }
  }

  async createBulk(invoices: CreateInvoiceDto[]) {
    return Promise.all(invoices.map(inv => this.create(inv)));
  }

  async findByRfc(query: QueryInvoiceDto) {
    const result = await this.neo4j.read(
      `MATCH (em:Entity)-[r:INVOICED_BY]->(re:Entity)
       WHERE ($emisorRfc   IS NULL OR em.rfc = $emisorRfc)
         AND ($receptorRfc IS NULL OR re.rfc = $receptorRfc)
         AND ($status      IS NULL OR r.status = $status)
       RETURN em, r, re
       ORDER BY r.issuedAt DESC
       LIMIT 100`,
      {
        emisorRfc:   query.emisorRfc   ?? null,
        receptorRfc: query.receptorRfc ?? null,
        status:      query.status      ?? null,
      },
    );
    return result.records.map(r => ({
      emisor:    r.get('em').properties,
      receptor:  r.get('re').properties,
      invoice:   r.get('r').properties,
    }));
  }

  // detecta triángulos de facturación: A factura B, B factura C, C factura A
  async detectTriangulation() {
    const result = await this.neo4j.read(
      `MATCH (a:Entity)-[:INVOICED_BY]->(b:Entity)
             -[:INVOICED_BY]->(c:Entity)
             -[:INVOICED_BY]->(a)
       WHERE a <> b AND b <> c AND a <> c
       RETURN a.id AS nodeA, b.id AS nodeB, c.id AS nodeC`,
    );
    return result.records.map(r => ({
      nodeA: r.get('nodeA'),
      nodeB: r.get('nodeB'),
      nodeC: r.get('nodeC'),
    }));
  }

  private calcWeight(total: number): number {
    return Number(Math.min(total / 5_000_000, 1).toFixed(3));
  }
}