import { ConflictException, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import * as q from 'drizzle-orm';
@Injectable()
export class ConnnectionService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async followUser(userId: number, connectionId: number) {
    if (connectionId === userId)
      throw new ConflictException('Cannot follow yourself');
    const [connection] = await this.db
      .select()
      .from(sc.connections)
      .where(
        q.and(
          q.eq(sc.connections.userId, userId),
          q.eq(sc.connections.connectionId, connectionId),
        ),
      );

    if (connection) throw new ConflictException('Connection already exists');

    const [newCon] = await this.db
      .insert(sc.connections)
      .values({ userId, connectionId })
      .returning();
    return newCon;
  }

  async unfollowUser(userId: number, connectionId: number) {
    if (connectionId === userId)
      throw new ConflictException('Cannot unfollow yourself');
    const [connection] = await this.db
      .delete(sc.connections)
      .where(
        q.and(
          q.eq(sc.connections.userId, userId),
          q.eq(sc.connections.connectionId, connectionId),
        ),
      )
      .returning();
    return connection;
  }
}
