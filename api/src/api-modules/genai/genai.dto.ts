import { IsString } from 'class-validator';

export class CreateTextDto {
  @IsString()
  imageUrl: string;
}
