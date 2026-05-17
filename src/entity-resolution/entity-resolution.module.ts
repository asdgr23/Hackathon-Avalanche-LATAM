import { Module } from '@nestjs/common';
import { EntityResolutionService } from './entity-resolution.service';
import { EntityStoreService } from './entity-store.service';

@Module({
  providers: [
    EntityResolutionService,
    EntityStoreService,
  ],
  exports: [
    EntityResolutionService,
    EntityStoreService
  ],
})
export class EntityResolutionModule {}
