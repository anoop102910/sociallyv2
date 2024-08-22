import {
  pgTable,
  pgEnum,
  serial,
  timestamp,
  text,
  integer,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const role = pgEnum('role', ['user', 'admin']);
export const conStatus = pgEnum('connection_status', ['pending', 'accepted']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: role('role').default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  content: text('content'),
  mediaUrl: text('media_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const likes = pgTable(
  'likes',
  {
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
    postId: integer('post_id').references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => {
    return {
      uniqueIndex: primaryKey({ columns: [t.userId, t.postId] }),
    };
  },
);

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  postId: integer('post_id')
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  content: text('content'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const connections = pgTable('connections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  connectionId: integer('connection_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type UserSelect = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
export type PostSelect = InferSelectModel<typeof posts>;
export type PostInsert = InferInsertModel<typeof posts>;
export type LikeSelect = InferSelectModel<typeof likes>;
export type LikeInsert = InferInsertModel<typeof likes>;
export type CommentSelect = InferSelectModel<typeof comments>;
export type CommentInsert = InferInsertModel<typeof comments>;
export type ConnectionSelect = InferSelectModel<typeof connections>;
export type ConnectionInsert = InferInsertModel<typeof connections>;
