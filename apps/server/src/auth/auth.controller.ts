import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
// import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-auth.dto';
import { UserTypeDTO } from './dto/user-type.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokenDTO } from './dto/token.dto';
import { GoogleOAuthGuard } from './google-oauth.guard';
// import { RoleGuard } from './role.guard';
// import { Role, Roles } from './roles';
// import { GoogleOAuthGuard } from './google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('signup')
  async signup(
    @Query(ValidationPipe) type: UserTypeDTO,
    @Body(ValidationPipe) body: CreateUserDTO,
  ) {
    return this.authSerivce.signUp(body, type);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authSerivce.login(req.user);
  }
  @Get('refresh')
  async refreshToken(@Body(ValidationPipe) body: TokenDTO) {
    return this.authSerivce.refreshAccessToken(body.refreshToken);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {
    return this.authSerivce.googleLogin(req);
  }

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authSerivce.googleLogin(req);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logoutRoute(@Request() req: any) {
    return this.authSerivce.logout(req.user.userId);
  }

  // @UseGuards(AuthenticatedGuard)
  // @Get('session')
  // async protectedRoute(@Request() req: any) {
  //   return req.user;
  // }

  // @Roles(Role.Enterprise)
  // @UseGuards(AuthenticatedGuard, RoleGuard)
  // @Get('pro')
  // async secondProtectedRoute(@Request() req: any) {
  //   return 'asd';
  // }

  @Get('hehe')
  @UseGuards(JwtAuthGuard)
  async notprotexted(@Request() req: any) {
    return req.user;
  }
}
