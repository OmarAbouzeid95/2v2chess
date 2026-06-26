import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateToken(
    name: string,
    uuid: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByNameAndUuid(uuid, name);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { name, uuid };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
