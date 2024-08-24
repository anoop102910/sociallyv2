import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import * as q from 'drizzle-orm';
import { FindAllQuery } from './dto/query.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async findAll(userId: number, query: FindAllQuery) {
    const users = await this.selectUser(userId);
    // .where(z
    //   q.like(sc.users.name, `%${query.query}%`),
    // );
    return users.filter((user) => user.id != userId);
  }

  async findOne(id: number, userId: number) {
    const [user] = await this.selectUser(userId).where(q.eq(sc.users.id, id));
    return user;
  }

  selectUser(userId: number) {
    return this.db
      .select({
        id: sc.users.id,
        name: sc.users.name,
        followers: q.count(sc.connections.userId).as('followers'),
        followee: q.count(sc.connections.connectionId).as('follows'),
        isFollowed: q.sql<boolean>`
        EXISTS (
          SELECT * FROM connections
          WHERE connections.user_id = ${userId}
          AND connections.connection_id = ${sc.users.id}
        )`,
      })
      .from(sc.users)
      .leftJoin(sc.connections, q.eq(sc.users.id, sc.connections.userId))
      .groupBy(sc.users.id)
      .orderBy(q.asc(sc.users.id));
  }
}
