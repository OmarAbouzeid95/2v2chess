import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { GenerateTokenDto } from './dto/generate-token-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('generate-token')
  generateToken(@Body() generateTokenDto: GenerateTokenDto) {
    return this.authService.generateToken(
      generateTokenDto.name,
      generateTokenDto.uuid,
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify-token')
  verifyToken(@Request() req) {
    return 'successfully verified token';
  }
}
