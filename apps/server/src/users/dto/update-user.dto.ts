import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from 'src/auth/dto/create-auth.dto';

export class UpdateUserDto extends PartialType(CreateUserDTO) {}
