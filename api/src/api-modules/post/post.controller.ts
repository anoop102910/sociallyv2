import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('api')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('posts')
  async create(
    @GetUser('id') userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(userId, createPostDto);
  }

  @Get('my-feed')
  async getUserFeed(@GetUser('id') userId: number) {
    return this.postService.getUserPosts(userId);
  }

  @Get('my-posts')
  async getMyPosts(@GetUser('id') userId: number) {
    return this.postService.getUserPosts(userId);
  }

  @Get('users/:userId/posts')
  async getUserPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.getUserPosts(userId);
  }

  @Put('posts/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete('posts/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }
}
