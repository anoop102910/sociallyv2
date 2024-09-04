import { Controller, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Body, Post, Get, Query, Param } from '@nestjs/common';
import { CreateConversationDto, CreateMessageDto } from './chat.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {
    this.chatService = chatService;
  }

  @Post('create-conversation')
  async createConversation(
    @GetUser('id') userId: number,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.chatService.createConversation(userId, createConversationDto);
  }

  @Post('create-message')
  async createMessage(@GetUser('id') userId: number, @Body() createMessageDto: CreateMessageDto) {
    return this.chatService.createMessage(userId, createMessageDto);
  }

  @Get('get-my-conversations')
  async getMyConversation(@Query('userId') userId: number) {
    return this.chatService.getMyConvs(userId);
  }

  @Get('conv/:convId/messages')
  async getConversationMessages(@Param('convId') convId: number) {
    return this.chatService.getConvMsgs(convId);
  }
}
