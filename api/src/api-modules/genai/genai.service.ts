import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../schema';
import { DrizzleAsyncProvider } from 'src/core-modules/drizzle/drizzle.provider';
import { GeminiService } from './gemini.service';

@Injectable()
export class GenaiService {
  constructor(
    private readonly geminiService: GeminiService,
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof sc>,
  ) {}

  async generateContent(imageUrl: string) {
    return await this.geminiService.createContent(imageUrl);

  }
}
