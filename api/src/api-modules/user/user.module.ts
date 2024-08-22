import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DrizzleModule } from 'src/core-modules/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
