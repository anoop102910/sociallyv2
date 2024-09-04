import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DrizzleModule } from 'src/core-modules/drizzle/drizzle.module';
@Module({
  imports: [DrizzleModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
