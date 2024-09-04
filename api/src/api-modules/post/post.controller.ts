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
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SavePostService } from './save.service';

@Controller('api')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService, private readonly savePostService: SavePostService) {}

  @Post('posts')
  @UseInterceptors(FileInterceptor('mediaFile')) 
  async create(
    @GetUser('id') userId: number,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const imageUrl = await this.postService.uploadImage(file);
      createPostDto.mediaUrl = imageUrl; 
    }
    return this.postService.create(userId, createPostDto);
  }

  @Get('my-feed')
  async getUserFeed(@GetUser('id') userId: number, @Query('cursor') cursor?: number) {
    return this.postService.getUserFeed(userId, cursor);
  }

  @Get('my-posts')
  async getMyPosts(@GetUser('id') userId: number) {
    return this.postService.getUserPosts(userId);
  }

  @Get('users/:userId/posts')
  async getUserPosts(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.getUserPosts(userId);
  }

  @Get('saved-posts')
  async getSavedPosts(@GetUser('id') userId: number) {
    return this.postService.getSavedPosts(userId);
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

  @Post('posts/:postId/save')
  async savePost(@Param('postId', ParseIntPipe) postId: number, @GetUser('id') userId: number) {
    return this.savePostService.savePost(userId, postId);
  }

  @Delete('posts/:postId/unsave')
  async unsavePost(@Param('postId', ParseIntPipe) postId: number, @GetUser('id') userId: number) {
    return this.savePostService.unsavePost(userId, postId);
  }


}
