import { Module } from '@nestjs/common';
import { AuthModule } from './api-modules/auth/auth.module';
import { CloudinaryModule } from './core-modules/cloud-upload/cloud.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './core-modules/drizzle/drizzle.module';
import { PostModule } from './api-modules/post/post.module';
import { LikeModule } from './api-modules/like/like.module';
import { UserModule } from './api-modules/user/user.module';
import { ConnnectionModule } from './api-modules/connnection/connnection.module';
import { CommentModule } from './api-modules/comment/comment.module';
import { ChatModule } from './api-modules/chat/chat.module';
import { GenaiModule } from './api-modules/genai/genai.module';
@Module({
  imports: [
    AuthModule,
    CloudinaryModule,
    DrizzleModule,
    PostModule,
    LikeModule,
    UserModule,
    ConnnectionModule,
    CommentModule,
    GenaiModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
  ],
})
export class AppModule {}
