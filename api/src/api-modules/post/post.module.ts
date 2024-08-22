import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { DrizzleModule } from 'src/core-modules/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
