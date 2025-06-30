import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SemestersService {
  constructor(private readonly db: PrismaService) {}
  async create(createSemesterDto: CreateSemesterDto, userId: string) {
    try {
      const newSem = await this.db.semester.create({
        data: {
          ...createSemesterDto,
          userId: userId,
        },
      });
      return {
        message: 'Semester created successfully',
        data: newSem,
      };
    } catch (error) {
      throw new BadRequestException('Could not create semester', {
        cause: error,
      });
    }
  }

  async findAll(userId: string) {
    try {
      const semesters = await this.db.semester.findMany({
        where: {
          userId: userId,
        },
      });
      return semesters;
    } catch (error) {
      throw new BadRequestException('Could not find semesters', {
        cause: error,
      });
    }
  }

  async findOne(id: string) {
    try {
      const sem = await this.db.semester.findUnique({
        where: {
          id: id,
        },
        include: {
          courses: true,
        },
      });
      if (!sem) {
        throw new BadRequestException('Semester not found');
      }
      return {
        message: 'Semester found successfully',
        statusCode: 200,
        data: sem,
      };
    } catch (error) {
      throw new BadRequestException(error.response, {
        cause: error,
      });
    }
  }

  async update(id: string, updateSemesterDto: UpdateSemesterDto) {
    try {
      await this.db.semester.update({
        where: {
          id: id,
        },
        data: {
          ...updateSemesterDto,
        },
      });
      return {
        message: 'Semester updated successfully',
        statusCode: 200,
      };
    } catch (error) {
      throw new BadRequestException('Could not update semesters', {
        cause: error,
      });
    }
  }

  async remove(id: string, userId: string) {
    try {
      await this.db.semester.delete({
        where: {
          id: id,
          userId: userId,
        },
      });
      return {
        message: 'Semester deleted successfully',
        statusCode: 200,
      };
    } catch (error) {
      throw new BadRequestException('Could not delete semesters', {
        cause: error,
      });
    }
  }
}
