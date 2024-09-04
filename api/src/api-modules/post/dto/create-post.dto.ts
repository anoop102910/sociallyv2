import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 5000) 
  content: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
