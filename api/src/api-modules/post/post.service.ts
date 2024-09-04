import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import * as q from 'drizzle-orm';
import { CreatePostDto } from './dto/create-post.dto';
import { CloudinaryService } from 'src/core-modules/cloud-upload/cloud.service';
@Injectable()
export class PostService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    const [post] = await this.db
      .insert(sc.posts)
      .values({ authorId: userId, ...createPostDto })
      .returning();
    const [newpost] = await this.selectPostsWithAuthor(userId).where(
      q.eq(sc.posts.id, post.id),
    );
    return newpost;
  }

  async getUserFeed(userId: number, cursor?: number) {
    const userCons = await this.db
      .select()
      .from(sc.connections)
      .where(q.eq(sc.connections.userId, userId));

    const userConsIds = userCons.map((c) => c.connectionId);
    userConsIds.push(userId);

    return await this.selectPostsWithAuthor(userId)
      .where(
        q.or(
          q.eq(sc.posts.authorId, userId),
          q.inArray(sc.posts.authorId, userConsIds),
          q.gt(sc.posts.id, cursor ?? 0),
        ),
      )
      .orderBy(q.desc(sc.posts.id))
      // .limit(10);
  }

  async getUserPosts(userId: number) {
    return await this.selectPostsWithAuthor(userId)
      .where(q.eq(sc.posts.authorId, userId))
      .orderBy(q.desc(sc.posts.id));
  }

  async getSavedPosts(userId: number) {
    const savedPosts = await this.db
      .select()
      .from(sc.savedPosts)
      .where(q.eq(sc.savedPosts.userId, userId))
      .orderBy(q.desc(sc.savedPosts.createdAt));

    const posts = await this.selectPostsWithAuthor(userId).where(
      q.inArray(
        sc.posts.id,
        savedPosts.map((p) => p.postId),
      ),
    );
    return posts;
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

  async uploadImage(file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file.buffer);
    return result.secure_url;
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
        likes: q.countDistinct(sc.likes.userId).as('likes'),
        comments: q.count(sc.comments.id).as('comments'),
        isLiked: q.sql<number>`
          EXISTS (
            SELECT * FROM likes
            WHERE likes.user_id = ${userId}
            AND likes.post_id = ${sc.posts.id}
          )`,
        isSaved: q.sql<number>`
          EXISTS (
            SELECT * FROM saved_posts
            WHERE saved_posts.user_id = ${userId}
            AND saved_posts.post_id = ${sc.posts.id}
          )`,
      })
      .from(sc.posts)
      .leftJoin(sc.users, q.eq(sc.users.id, sc.posts.authorId))
      .leftJoin(sc.likes, q.eq(sc.likes.postId, sc.posts.id))
      .leftJoin(sc.comments, q.eq(sc.posts.id, sc.comments.postId))
      .groupBy(sc.posts.id, sc.users.id);
  }
}
