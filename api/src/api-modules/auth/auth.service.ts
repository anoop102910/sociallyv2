import { Injectable } from '@nestjs/common';
import { SigninDto, SignUpDto } from './auth.dto';
import * as argon from 'argon2';
import * as sc from '../../schema';
import * as q from 'drizzle-orm';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import { CommonService } from 'src/core-modules/common/common.service';
import { UserService } from '../user/user.service';
import { MailerService } from 'src/core-modules/mailer/mailer.service';
import { TokenTypeEnum } from 'src/enums/token.enum';
import { JwtService } from 'src/core-modules/jwt/jwt.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUserWithCredentials } from 'src/interface';
import { ConfigService } from '@nestjs/config';
import { IRefreshPayload } from 'src/interface/refresh-token.interface';
import { IEmailPayload } from 'src/interface/email-token.interface';

@Injectable({})
export class AuthService {
  private readonly domain;
  constructor(
    private commonService: CommonService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async register(signupDto: SignUpDto, ) {
    const { email, name, password } = signupDto;
    const user = await this.userService.create(email, name, password);

    const confirmationToken = await this.jwtService.generateToken(
      user,
      TokenTypeEnum.CONFIRMATION,
    );

    this.mailerService.sendConfirmationEmail(email, name, confirmationToken);

    const { accessToken, refreshToken } = await this.generateTokenPair(user);
    return { user, accessToken, refreshToken };
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    const user = await this.userService.findOneByEmail(email);

    await this.verifyPassword(password, user.password);

    if (!user.confirmed) {
      const confirmationToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.CONFIRMATION,
      );
      this.mailerService.sendConfirmationEmail(
        email,
        user.name,
        confirmationToken,
      );
      return this.commonService.generateMessage(
        'Please check your email for a confirmation link',
      );
    }

    const { accessToken, refreshToken } = await this.generateTokenPair(user);
    return { user, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const payload  = await this.jwtService.verifyToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    ) as IRefreshPayload;
    const { userId, tokenId, version } = payload;

    await this.checkIfTokenIsBlacklisted(
      userId,
      tokenId,
    );

    const user = await this.userService.findOneById(userId);

    return await this.jwtService.generateToken(
      user,
      TokenTypeEnum.ACCESS,
    );
    
  }

  async logout(tokenId: string, userId: number) {
    await this.blacklistToken(tokenId, userId);
    return this.commonService.generateMessage('Logout successful');
  }

  async resetPassword(id: number) {
    const user = await this.userService.findOneById(id);
  
    const resetPasswordToken = await this.jwtService.generateToken(
      user,
      TokenTypeEnum.RESET_PASSWORD,
    );
    this.mailerService.sendResetPasswordEmail(
      user.email,
      user.name,
      resetPasswordToken,
    );
  }

  async confirmResetPassword(token: string, newPassword: string) {
    const payload = await this.jwtService.verifyToken(
      token,
      TokenTypeEnum.RESET_PASSWORD,
    ) as IEmailPayload;
    const hashedPassword = await argon.hash(newPassword);
    await this.userService.update(payload.userId, { password: hashedPassword });
  }

  async changePassword(userId: number, newPassword: string) {
    const hashedPassword = await argon.hash(newPassword);
    const user = await this.userService.update(userId, {
      password: hashedPassword,
    });
    const { accessToken, refreshToken } = await this.generateTokenPair(user);
    return { accessToken, refreshToken };
  }

  async generateTokenPair(user: IUserWithCredentials) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.generateToken(user, TokenTypeEnum.ACCESS),
      this.jwtService.generateToken(user, TokenTypeEnum.REFRESH),
    ]);
    return { accessToken, refreshToken };
  }

  async blacklistToken(tokenId: string, userId: number) {
    await this.db.insert(sc.blacklistedTokens).values({ tokenId, userId });
  }

  async checkIfTokenIsBlacklisted(userId: number, tokenId: string) {
    const blacklistedToken = await this.db
      .select()
      .from(sc.blacklistedTokens)
      .where(
        q.or(
          q.eq(sc.blacklistedTokens.tokenId, tokenId),
          q.eq(sc.blacklistedTokens.userId, userId),
        ),
      );
    if (blacklistedToken.length > 0) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async verifyPassword(password: string, hashedPassword: string) {
    const passwordMatch = await argon.verify(hashedPassword, password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
