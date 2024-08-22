import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { DrizzleModule } from 'src/core-modules/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
