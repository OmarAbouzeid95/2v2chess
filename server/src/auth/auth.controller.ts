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
import { Public } from './auth.metadata.config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('generate-token')
  async generateToken(
    @Body() generateTokenDto: GenerateTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.generateToken(
      generateTokenDto.name,
      generateTokenDto.uuid,
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken, refreshToken };
  }

  @UseGuards(AuthGuard)
  @Get('verify-token')
  verifyToken(@Request() req) {
    return 'successfully verified token';
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.generateToken(payload.name, payload.uuid);

      res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
