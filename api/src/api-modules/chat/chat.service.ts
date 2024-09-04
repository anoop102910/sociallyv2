import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import * as q from 'drizzle-orm';
import { CreateMessageDto, CreateConversationDto } from './chat.dto';
@Injectable()
export class ChatService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async createConversation(userId1: number, createConversationDto: CreateConversationDto) {
    const [conversation] = await this.db
      .insert(sc.conversations)
      .values({ user1Id: userId1, user2Id: createConversationDto.user2Id })
      .returning();
    return conversation;
  }

  async getMyConvs(userId: number) {
    return await this.db
      .select()
      .from(sc.conversations)
      .where(
        q.or(
          q.eq(sc.conversations.user1Id, userId),
          q.eq(sc.conversations.user2Id, userId),
        ),
      );
  }

  async getConvMsgs(conversationId: number) {
    return await this.db
      .select()
      .from(sc.messages)
      .where(q.eq(sc.messages.conversationId, conversationId));
  }

  async createMessage(userId: number, createMessageDto: CreateMessageDto) {
    const [message] = await this.db
      .insert(sc.messages)
      .values({...createMessageDto, senderId: userId})
      .returning();
    return message;
  }
}
