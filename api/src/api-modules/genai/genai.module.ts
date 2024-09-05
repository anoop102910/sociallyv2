import { Module } from '@nestjs/common';
import { GenaiService } from './genai.service';
import { GenaiController } from './genai.controller';
import { DrizzleModule } from 'src/core-modules/drizzle/drizzle.module';
import { GeminiService } from './gemini.service';
@Module({
  imports: [DrizzleModule],
  controllers: [GenaiController],
  providers: [GenaiService, GeminiService],
})
export class GenaiModule {}
