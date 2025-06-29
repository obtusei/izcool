import { Module } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { SemestersController } from './semesters.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SemestersController],
  providers: [SemestersService, PrismaService],
})
export class SemestersModule {}
