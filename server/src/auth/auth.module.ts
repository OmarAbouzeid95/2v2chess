import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@/auth/auth.controller';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'qtQ01!)b2gSV$KBVO0cQ_9gHE(n0qA6N4^}ql2q4T3e',
      signOptions: { expiresIn: '5mins' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
