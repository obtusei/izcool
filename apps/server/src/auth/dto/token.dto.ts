import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class TokenDTO {
  // @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
