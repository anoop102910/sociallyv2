import {
  Controller,
  UseGuards,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ConnnectionService } from './connnection.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@UseGuards(AuthGuard)
@Controller('api/followers')
export class ConnnectionController {
  constructor(private readonly connnectionService: ConnnectionService) {}

  @Post('follow/:connectionId')
  async followUser(
    @GetUser('id') userId: number,
    @Param('connectionId', ParseIntPipe) connectionId: number,
  ) {
    return this.connnectionService.followUser(userId, connectionId);
  }

  @Post('unfollow/:connectionId')
  async unfollowUser(
    @GetUser('id') userId: number,
    @Param('connectionId', ParseIntPipe) connectionId: number,
  ) {
    return this.connnectionService.unfollowUser(userId, connectionId);
  }
}
