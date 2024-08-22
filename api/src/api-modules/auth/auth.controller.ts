import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SigninDto } from './auth.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: AuthDto, @Res() res: Response) {
    const result = await this.authService.register(dto);
    res.setHeader('Authorization', `Bearer ${result.token}`);
    res.set('Access-Control-Expose-Headers', 'Authorization');
    res.cookie('Authorization', result.token, { httpOnly: true });
    return res
      .status(HttpStatus.CREATED)
      .json({ msg: result.msg, token: result.token });
  }

  @Post('login')
  async login(@Body() dto: SigninDto, @Res() res: Response) {
    const result = await this.authService.login(dto);
    res.setHeader('Authorization', `Bearer ${result.token}`);
    res.set('Access-Control-Expose-Headers', 'Authorization');
    res.cookie('Authorization', result.token, { httpOnly: true });
    return res
      .status(HttpStatus.OK)
      .json({ msg: result.msg, token: result.token });
  }
}
