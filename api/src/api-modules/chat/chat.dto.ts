import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  conversationId: number;

  @IsNumber()
  receiverId: number;

  @IsString()
  content: string;
}

export class CreateConversationDto {
  @IsNumber()
  user2Id: number;
}   