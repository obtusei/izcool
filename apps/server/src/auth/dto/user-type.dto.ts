import { UserType } from '@izcool/db';
import { IsEnum, IsOptional, IsUppercase } from 'class-validator';

export class UserTypeDTO {
  // @IsOptional()
  @IsEnum(['STUDENT', 'SCHOOL', 'ADMIN'], {
    message: 'Type of the user should be mention in order to create the user',
  })
  type: UserType;
}
