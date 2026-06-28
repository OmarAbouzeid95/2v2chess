import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { GenerateTokenDto } from './dto/generate-token-dto';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
