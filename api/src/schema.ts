import {
  pgTable,
  pgEnum,
  serial,
  timestamp,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const role = pgEnum('role', ['user', 'admin']);
export const conStatus = pgEnum('connection_status', ['pending', 'accepted']);
const messageStatus = pgEnum('message_status', [
  'pending',
  'sent',
  'delivered',
  'read',
]);

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

export const savedPosts = pgTable(
  'saved_posts',
  {
    userId: integer('user_id')
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
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => {
    return {
      uniqueIndex: primaryKey({ columns: [t.userId, t.postId] }),
    };
  },
);

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id')
    .notNull()
    .references(() => conversations.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  senderId: integer('sender_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  receiverId: integer('receiver_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  content: text('content'),
  status: messageStatus('status'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  deliveredAt: timestamp('delivered_at'),
  readAt: timestamp('read_at'),
  sentAt: timestamp('sent_at'),
});

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  user1Id: integer('user1_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  user2Id: integer('user2_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
