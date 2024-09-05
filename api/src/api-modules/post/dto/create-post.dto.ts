import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @Length(1, 5000) 
  content?: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
