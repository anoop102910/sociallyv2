import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import * as q from 'drizzle-orm';
@Injectable()
export class SavePostService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async savePost(userId: number, postId: number) {
    const [post] = await this.db
      .select()
      .from(sc.savedPosts)
      .where(
        q.and(
          q.eq(sc.savedPosts.userId, userId),
          q.eq(sc.savedPosts.postId, postId),
        ),
      );

    if (post) {
      throw new BadRequestException('Post already saved');
    }
    const [savedPost] = await this.db
      .insert(sc.savedPosts)
      .values({ userId, postId })
      .returning();
    return savedPost;
  }

  async unsavePost(userId: number, postId: number) {
    const [post] = await this.db
      .select()
      .from(sc.savedPosts)
      .where(
        q.and(
          q.eq(sc.savedPosts.userId, userId),
          q.eq(sc.savedPosts.postId, postId),
        ),
      );
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.db
      .delete(sc.savedPosts)
      .where(
        q.and(
          q.eq(sc.savedPosts.userId, userId),
          q.eq(sc.savedPosts.postId, postId),
        ),
      );
  }
}
