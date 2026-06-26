import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  create(createGameDto: CreateGameDto) {
    return this.prisma.game.create({
      data: {
        users: createGameDto.userIds
          ? { connect: createGameDto.userIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { users: true },
    });
  }

  findAll() {
    return this.prisma.game.findMany({ include: { users: true } });
  }

  findOne(id: number) {
    return this.prisma.game.findUnique({
      where: { id },
      include: { users: true },
    });
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return this.prisma.game.update({
      where: { id },
      data: {
        users: updateGameDto.userIds
          ? { set: updateGameDto.userIds.map((userId) => ({ id: userId })) }
          : undefined,
      },
      include: { users: true },
    });
  }

  remove(id: number) {
    return this.prisma.game.delete({ where: { id } });
  }
}
