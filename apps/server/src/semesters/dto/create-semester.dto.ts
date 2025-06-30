import { IsString } from 'class-validator';

export class CreateSemesterDto {
  @IsString()
  title: string;
}
