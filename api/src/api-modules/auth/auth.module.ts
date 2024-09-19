import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleModule } from 'src/core-modules/drizzle/drizzle.module';
import { CommonService } from 'src/core-modules/common/common.service';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, 
      signOptions: { expiresIn: '10d' },
    }),
    ,
    DrizzleModule,
    CommonService
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
