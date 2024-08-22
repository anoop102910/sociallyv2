import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@UseGuards(AuthGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@GetUser('id') userId: number) {
    return this.userService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @GetUser('id') userId: number) {
    return this.userService.findOne(id, userId);
  }s
}
