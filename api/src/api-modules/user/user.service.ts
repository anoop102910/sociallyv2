import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import * as q from 'drizzle-orm';
import { CommonService } from 'src/core-modules/common/common.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUserWithCredentials } from 'src/interface';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private commonService: CommonService,
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async create(email: string, name: string, password: string) : Promise<IUserWithCredentials> {
    const username = this.commonService.generatePointSlug(name);
    const passwordHash = await argon.hash(password);
    const [user] = await this.db
      .insert(sc.users)
      .values({ email, name, password : passwordHash, username })
      .returning();

    return await this.findOneById(user.id);
  }

  async update(id: number, userData: { name?: string; email?: string; password?: string }) {
    const [user] = await this.db
      .update(sc.users)
      .set(userData)
      .where(q.eq(sc.users.id, id))
      .returning();

    return await this.findOneById(user.id);
  }

  async findAll(userId: number) {
    const users = await this.selectUser(userId);
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

  async findOneById(id: number) : Promise<IUserWithCredentials> {
    const [user] = await this.db
      .select({
        id: sc.users.id,
        name: sc.users.name,
        email: sc.users.email,
        username: sc.users.username,
        password: sc.users.password,
        confirmed: sc.users.confirmed,
        createdAt: sc.users.createdAt,
        updatedAt: sc.users.updatedAt,
        role: sc.users.role,
        credentials: {
          id: sc.credentials.id,
          userId: sc.credentials.userId,
          version: sc.credentials.version,
          lastPassword: sc.credentials.lastPassword,
          passwordUpdatedAt: sc.credentials.passwordUpdatedAt,
          updatedAt: sc.credentials.updatedAt,
        },
      })
      .from(sc.users)
      .leftJoin(sc.credentials, q.eq(sc.users.id, sc.credentials.userId))
      .where(q.eq(sc.users.id, id));

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<IUserWithCredentials> {
    const [user] = await this.db
      .select({
        id: sc.users.id,
        name: sc.users.name,
        email: sc.users.email,
        username: sc.users.username,
        password: sc.users.password,
        confirmed: sc.users.confirmed,
        createdAt: sc.users.createdAt,
        updatedAt: sc.users.updatedAt,
        role: sc.users.role,
        credentials: {
          id: sc.credentials.id,
          userId: sc.credentials.userId,
          version: sc.credentials.version,
          lastPassword: sc.credentials.lastPassword,
          passwordUpdatedAt: sc.credentials.passwordUpdatedAt,
          updatedAt: sc.credentials.updatedAt,
        },
      })
      .from(sc.users)
      .leftJoin(sc.credentials, q.eq(sc.users.id, sc.credentials.userId))
      .where(q.eq(sc.users.email, email));

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    return user;
  }

  async checkEmailUniqueness(email: string): Promise<void> {
    const [user] = await this.db
      .select()
      .from(sc.users)
      .where(q.eq(sc.users.email, email));

    if (user) {
      throw new ConflictException('Email already in use');
    }
  }

  async generateUsername(name: string): Promise<string> {
    const pointSlug = this.commonService.generatePointSlug(name);
    const [user] = await this.db
      .select({ count: q.count() })
      .from(sc.users)
      .where(q.ilike(sc.users.name, `${pointSlug}%`))
      .limit(1);

    if (user.count > 0) {
      return `${pointSlug}${user.count}`;
    }

    return pointSlug;
  }
}
