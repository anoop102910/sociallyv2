import { Module } from '@nestjs/common';
import { ConnnectionService } from './connnection.service';
import { ConnnectionController } from './connnection.controller';
import { DrizzleModule } from 'src/core-modules/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [ConnnectionController],
  providers: [ConnnectionService],
})
export class ConnnectionModule {}
