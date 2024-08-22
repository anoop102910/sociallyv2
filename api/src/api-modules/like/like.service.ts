import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import * as q from 'drizzle-orm';

@Injectable()
export class LikeService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async likePost(userId: number, postId: number) {
    const [isLiked] = await this.db
      .select()
      .from(sc.likes)
      .where(
        q.and(q.eq(sc.likes.userId, userId), q.eq(sc.likes.postId, postId)),
      );

    if (isLiked) {
      return this.db
        .delete(sc.likes)
        .where(
          q.and(q.eq(sc.likes.userId, userId), q.eq(sc.likes.postId, postId)),
        )
        .returning();
    } else {
      return this.db.insert(sc.likes).values({ userId, postId }).returning();
    }
  }
}
