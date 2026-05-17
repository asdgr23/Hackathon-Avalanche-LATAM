import { Injectable } from '@nestjs/common';
import { Entity } from './entity.model';

@Injectable()
export class EntityStoreService {
  private entities = new Map<string, Entity>();

  getAll() {
    return Array.from(this.entities.values());
  }

  getById(id: string) {
    return this.entities.get(id);
  }

  save(entity: Entity) {
    this.entities.set(entity.entity_id, entity);
  }
}