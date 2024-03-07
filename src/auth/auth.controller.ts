import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import SignInDto from './dto/signIn.dto';
import SignUpDto from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(signInDto);

    response.cookie('refresh-token', refreshToken, {
      path: '/v1/auth/refresh-token',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return { accessToken, user };
  }

  @Get('refresh-token')
  async refreshToken(@Req() request: Request) {
    const refreshToken = request.cookies['refresh-token'];

    return this.authService.refreshToken(refreshToken);
  }

  @Get('sign-out')
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refresh-token', { path: '/v1/auth/refresh-token' });
  }
}
