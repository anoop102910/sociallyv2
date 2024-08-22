import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleModule } from 'src/core-modules/drizzle/drizzle.module';
@Module({
  imports: [JwtModule.register({ global: true }), DrizzleModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
