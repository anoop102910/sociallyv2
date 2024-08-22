import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import * as q from 'drizzle-orm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    const [post] = await this.db
      .insert(sc.posts)
      .values({ authorId: userId, ...createPostDto })
      .returning();
    return post;
  }

  async getUserFeed(userId: number) {
    const userCons = this.db
      .select()
      .from(sc.connections)
      .where(q.eq(sc.connections.userId, userId))
      .as('userCons');

    return await this.selectPostsWithAuthor(userId).where(
      q.or(
        q.eq(sc.posts.authorId, userId),
        q.eq(sc.posts.authorId, userCons.id),
      ),
    );
  }

  async getUserPosts(userId: number) {
    return await this.selectPostsWithAuthor(userId)
      .where(q.eq(sc.posts.authorId, userId))
      .orderBy(q.desc(sc.posts.id));
  }

  async update(id: number, updatePostDto: any) {
    const [post] = await this.db
      .update(sc.posts)
      .set(updatePostDto)
      .where(q.eq(sc.posts.id, id))
      .returning();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
  async delete(id: number) {
    const [post] = await this.db
      .delete(sc.posts)
      .where(q.eq(sc.posts.id, id))
      .returning();
    return post;
  }

  selectPostsWithAuthor(userId: number) {
    return this.db
      .select({
        id: sc.posts.id,
        author: {
          id: sc.users.id,
          name: sc.users.name,
        },
        content: sc.posts.content,
        mediaUrl: sc.posts.mediaUrl,
        createdAt: sc.posts.createdAt,
        updatedAt: sc.posts.updatedAt,
        likes: q.count(sc.likes.userId).as('likes'),
        comments: q.count(sc.comments.id).as('comments'),
        isLiked: q.sql<number>`
          EXISTS (
            SELECT * FROM likes
            WHERE likes.user_id = ${userId}
            AND likes.post_id = ${sc.posts.id}
          )`,
      })
      .from(sc.posts)
      .leftJoin(sc.users, q.eq(sc.users.id, sc.posts.authorId))
      .leftJoin(sc.likes, q.eq(sc.likes.postId, sc.posts.id))
      .leftJoin(sc.comments, q.eq(sc.comments.authorId, sc.posts.authorId))
      .groupBy(sc.posts.id, sc.users.id);
  }
}
