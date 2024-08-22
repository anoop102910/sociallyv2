import {
  Controller,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('api')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Post('posts/:postId/like')
  likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser('id') userId: number,
  ) {
    return this.likeService.likePost(userId, postId);
  }
}
