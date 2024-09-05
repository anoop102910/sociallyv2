import {
    Controller,
    UseGuards,
    Post,
    Param,
    ParseIntPipe,
    Body,
  } from '@nestjs/common';
  import { AuthGuard } from 'src/guards/auth.guard';
  import { GenaiService } from './genai.service';
  import { CreateTextDto } from './genai.dto';
//   @UseGuards(AuthGuard)
  @Controller('api/genai')
  export class GenaiController {
    constructor(private readonly genaiService: GenaiService) {}
  
    @Post('content')
    async generateContent(@Body() createTextDto: CreateTextDto) {
      return await this.genaiService.generateContent(createTextDto.imageUrl);
    }
  }
  