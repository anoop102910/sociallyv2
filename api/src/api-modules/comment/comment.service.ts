import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import * as q from 'drizzle-orm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async create(
    userId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const [comment] = await this.db
      .insert(sc.comments)
      .values({ authorId: userId, postId, ...createCommentDto })
      .returning();
    return comment;
  }

  async findByPostId(postId: number) {
    return await this.db
      .select()
      .from(sc.comments)
      .where(q.eq(sc.comments.postId, postId));
  }

  async update(id: number, updateCommentDto: any) {
    const [comment] = await this.db
      .update(sc.comments)
      .set(updateCommentDto)
      .where(q.eq(sc.comments.id, id));
    return comment;
  }

  delete(id: number) {
    return this.db.delete(sc.comments).where(q.eq(sc.comments.id, id));
  }
}
