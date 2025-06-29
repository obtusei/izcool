import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SemestersService {
  constructor(private readonly db: PrismaService) {}
  create(createSemesterDto: CreateSemesterDto) {
    try {
      this.db.semester.create({
        data: {
          ...createSemesterDto,
        },
      });
      return {
        message: 'Semester created successfully',
        data: createSemesterDto,
      };
    } catch (error) {
      throw new BadRequestException('Could not create semester', {
        cause: error,
      });
    }
  }

  findAll() {
    return `This action returns all semesters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} semester`;
  }

  update(id: number, updateSemesterDto: UpdateSemesterDto) {
    return `This action updates a #${id} semester`;
  }

  remove(id: number) {
    return `This action removes a #${id} semester`;
  }
}
