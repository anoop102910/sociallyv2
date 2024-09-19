import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LogoutDto, SigninDto } from './auth.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register') 
  async register(@Body() authDto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.register(authDto);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);
    return { user, accessToken, refreshToken };
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    return await this.authService.signin(signinDto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Body() token: string, @GetUser('id') userId: number, @Res() res: Response) {
    return await this.authService.logout(token, userId);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: string, @Res() res: Response) {
    res.set('Authorization', 'Bearer ' + await this.authService.refreshToken(refreshToken));
    return await this.authService.refreshToken(refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('reset-password')
  async resetPassword(@Body('id') id: number) {
    return await this.authService.resetPassword(id);
  } 

  @Post('confirm-reset-password')
  async confirmResetPassword(@Body() token: string, @Body() newPassword: string) {
    return await this.authService.confirmResetPassword(token, newPassword);
  }
}
