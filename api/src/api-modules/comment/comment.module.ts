import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { DrizzleModule } from 'src/core-modules/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
