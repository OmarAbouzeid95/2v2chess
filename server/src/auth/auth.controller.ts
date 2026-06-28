import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { GenerateTokenDto } from './dto/generate-token-dto';
import { type Response } from 'express';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('generate-token')
  async generateToken(
    @Body() generateTokenDto: GenerateTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.generateToken(
        generateTokenDto.name,
        generateTokenDto.uuid,
      );

    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    return { access_token, refresh_token };
  }

  @UseGuards(AuthGuard)
  @Get('verify-token')
  verifyToken(@Request() req) {
    return 'successfully verified token';
  }

  @Post('refresh-token')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refresh_token);

      const { access_token, refresh_token: newRefreshToken } =
        await this.authService.generateToken(payload.name, payload.uuid);

      res.cookie('refresh_token', newRefreshToken, { httpOnly: true });
      return { access_token, refresh_token: newRefreshToken };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
