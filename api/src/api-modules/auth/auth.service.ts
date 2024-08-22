import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthDto, SigninDto } from './auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as schema from '../../schema';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';

@Injectable({})
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  private async signToken(
    userId: number,
    name: string,
    email: string,
    role: string,
  ): Promise<string> {
    const secret = this.config.get('JWT_SECRET_KEY');
    return await this.jwt.signAsync(
      { id: userId, email, role, name },
      { secret: secret, expiresIn: '10d' },
    );
  }

  async register(authDto: AuthDto) {
    const hash = await argon.hash(authDto.password);

    const [existingUser] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, authDto.email));

    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    const [user] = await this.db
      .insert(schema.users)
      .values({
        name: authDto.name,
        email: authDto.email,
        password: hash,
      })
      .returning({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
      });

    const token: string = await this.signToken(
      user.id,
      user.name,
      user.email,
      user.role,
    );
    return { msg: 'Signup success', token };
  }

  async login(authDto: SigninDto) {
    const [existingUser] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, authDto.email));

    if (!existingUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isPasswordCorrect = await argon.verify(
      existingUser.password,
      authDto.password,
    );

    if (!isPasswordCorrect)
      throw new HttpException('Password is not correct', HttpStatus.FORBIDDEN);

    const token: string = await this.signToken(
      existingUser.id,
      existingUser.name,
      existingUser.email,
      existingUser.role,
    );
    return { msg: 'Signin success', token };
  }
}
