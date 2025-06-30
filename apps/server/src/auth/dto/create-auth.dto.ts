import { Prisma } from '@izcool/db';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDTO implements Prisma.UserCreateInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])[a-zA-Z\d\W]{8,}$/, {
    message: 'WEAK PASSWORD',
  })
  password?: string;
}
