import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('api')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post('posts/:postId/comments')
  create(
    @GetUser('id') userId: number,
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(userId, postId, createCommentDto);
  }

  @Get('posts/:postId/comments')
  findByPostId(@Param('postId') postId: number) {
    return this.commentService.findByPostId(postId);
  }

  @Put('comments/:id')
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete('comments/:id')
  delete(@Param('id') id: number) {
    return this.commentService.delete(id);
  }
}
