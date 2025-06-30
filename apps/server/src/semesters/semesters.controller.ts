import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Post()
  create(
    @Body(ValidationPipe) createSemesterDto: CreateSemesterDto,
    @Req() req: any,
  ) {
    return this.semestersService.create(createSemesterDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.semestersService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semestersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return this.semestersService.update(id, updateSemesterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.semestersService.remove(id, req.user.userId);
  }
}
