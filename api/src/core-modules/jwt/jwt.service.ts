import * as jwt from 'jsonwebtoken';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommonService } from '../common/common.service';
import { IJwt } from '../../config/jwt-config.interface';
import { IAccessPayload } from 'src/interface/access-token.interface';
import { IEmailPayload } from 'src/interface/email-token.interface';
import { IRefreshPayload } from 'src/interface/refresh-token.interface';
import { TokenTypeEnum } from 'src/enums/token.enum';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import { ICredentials } from 'src/interface/credentials.interface';
import { SLUG_REGEX } from 'src/constants/regex.const';
import { IUserWithCredentials } from 'src/interface';

@Injectable()
export class JwtService {
  private readonly jwtConfig: IJwt;
  private readonly issuer: string;
  private readonly domain: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {
    this.jwtConfig = this.configService.get<IJwt>('jwt');
    this.issuer = this.configService.get<string>('id');
    this.domain = this.configService.get<string>('domain');
  }

  private static async generateTokenAsync(
    payload: IAccessPayload | IEmailPayload | IRefreshPayload,
    secret: string,
    options: jwt.SignOptions,
  ): Promise<string> {
    return new Promise((resolve, rejects) => {
      jwt.sign(payload, secret, options, (error, token) => {
        if (error) {
          rejects(error);
          return;
        }
        resolve(token);
      });
    });
  }

  async verifyTokenAsync<T>(
    token: string,
    secret: string,
    options: jwt.VerifyOptions,
  ): Promise<T> {
    return new Promise((resolve, rejects) => {
      jwt.verify(token, secret, options, (error, payload: T) => {
        if (error) {
          rejects(error);
          return;
        }
        resolve(payload);
      });
    });
  }

  async verifyToken(
    token: string,
    tokenType: TokenTypeEnum,
  ): Promise<IAccessPayload | IEmailPayload | IRefreshPayload> {
    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        const { publicKey } = this.jwtConfig.access;
        return this.verifyTokenAsync<IAccessPayload>(token, publicKey, {
          algorithms: ['RS256'],
        });
      case TokenTypeEnum.REFRESH:
        const { secret: refreshSecret } = this.jwtConfig.refresh;
        return this.verifyTokenAsync<IRefreshPayload>(token, refreshSecret, {
          algorithms: ['HS256'],
        });
      case TokenTypeEnum.CONFIRMATION:
        const { secret: confirmationSecret } = this.jwtConfig.confirmation;
        return this.verifyTokenAsync<IEmailPayload>(token, confirmationSecret, {
          algorithms: ['HS256'],
        });
      case TokenTypeEnum.RESET_PASSWORD:
        const { secret: resetPasswordSecret } = this.jwtConfig.resetPassword;
        return this.verifyTokenAsync<IEmailPayload>(token, resetPasswordSecret, {
          algorithms: ['HS256'],
        });
    }
  }

  async generateToken(
    user: IUserWithCredentials,
    tokenType: TokenTypeEnum,
    tokenId?: string,
  ): Promise<string> {
    const jwtOptions: jwt.SignOptions = {
      issuer: this.issuer,
      subject: user.email,
      audience: this.domain,
      algorithm: 'HS256',
    };

    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        const { privateKey, time: accessTime } = this.jwtConfig.access;
        return this.commonService.throwInternalError(
          JwtService.generateTokenAsync({ userId: user.id }, privateKey, {
            ...jwtOptions,
            expiresIn: accessTime,
            algorithm: 'RS256',
          }),
        );
      case TokenTypeEnum.REFRESH:
        const { secret: refreshSecret, time: refreshTime } =
          this.jwtConfig.refresh;
        return this.commonService.throwInternalError(
          JwtService.generateTokenAsync(
            {
              userId: user.id,
              version: user.credentials.version,
              tokenId: tokenId ?? v4(),
            },
            refreshSecret,
            {
              ...jwtOptions,
              expiresIn: refreshTime,
            },
          ),
        );
      case TokenTypeEnum.CONFIRMATION:
      case TokenTypeEnum.RESET_PASSWORD:
        const { secret, time } = this.jwtConfig[tokenType];
        return this.commonService.throwInternalError(
          JwtService.generateTokenAsync(
            { userId: user.id, version: user.credentials.version },
            secret,
            {
              ...jwtOptions,
              expiresIn: time,
            },
          ),
        );
    }
  }
}
