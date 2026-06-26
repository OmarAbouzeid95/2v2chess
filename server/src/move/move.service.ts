import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';

@Injectable()
export class MoveService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMoveDto: CreateMoveDto) {
    return this.prisma.move.create({ data: createMoveDto });
  }

  findAll() {
    return this.prisma.move.findMany();
  }

  findOne(id: number) {
    return this.prisma.move.findUnique({ where: { id } });
  }

  update(id: number, updateMoveDto: UpdateMoveDto) {
    return this.prisma.move.update({ where: { id }, data: updateMoveDto });
  }

  remove(id: number) {
    return this.prisma.move.delete({ where: { id } });
  }
}
