import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from './dto/create-auth.dto';
import { UserTypeDTO } from './dto/user-type.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { stat } from 'fs';
import { jwtConstants } from './contants';

interface GoogleUser {
  providerId: string;
  email: string;
  emailVerified: boolean;
  fullName: string;
  image: any;
  provider: any;
  accessToken: string;
  refreshToken: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** Sign up
   * @param {CreateUserDTO} body object of name, username, email and password
   */
  async signUp(body: CreateUserDTO, userType: UserTypeDTO) {
    const isUsernameTaken = await this.usersService.findOne({
      username: body.username,
    });
    if (isUsernameTaken)
      throw new HttpException('Username is already taken', 404);
    const isEmailTaken = await this.usersService.findOne({ email: body.email });
    if (isEmailTaken) throw new HttpException('Email is already taken', 404);
    await this.usersService.createUser(body, userType);
    return {
      message: 'User created successfully',
      statusCode: 201,
    };
  }

  /** Validate User
   * @param {string} username username of the user
   * @param {string} password password of the user
   * @description It's use to validate the user
   * @returns {Promise<any>} user | null
   */
  async validateUser(username: string, userPassword: string): Promise<any> {
    const user = await this.usersService.findOne({ username });

    // console.log(user.password)
    if (user) {
      const isMatch = await bcrypt.compare(userPassword, user.password);
      if (!isMatch) throw new BadRequestException('Invalid credentials');
      const { password, semesterTitle, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      name: user.name,
      username: user.username,
      sub: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '30d',
    });

    // 🔐 Hash the refresh token before storing
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);
    // Update the user's refresh token in DB (assume Prisma)
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });

      const user = await this.usersService.findOne({ id: payload.sub });

      if (!user || !user.refresh_token) {
        throw new UnauthorizedException('No refresh token stored');
      }

      const tokenMatches = await bcrypt.compare(
        refreshToken,
        user.refresh_token,
      );
      if (!tokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const newAccessToken = this.jwtService.sign(
        {
          name: user.name,
          username: user.username,
          sub: user.id,
          email: user.email,
        },
        {
          secret: jwtConstants.secret,
          expiresIn: '15m',
        },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUserGoogle(googleUser: GoogleUser) {
    const user = await this.usersService.findOne({
      email: googleUser.email,
      oauth: true,
    });
    if (user) {
      const authWithGoogle = user.oauth.find(
        (user) => user.provider == googleUser.provider,
      );
      if (!authWithGoogle) {
        const createOauth = await this.usersService.createOauthProfile(
          {
            provider: googleUser.provider,
            providerId: googleUser.providerId,
            accessToken: googleUser.accessToken,
            refreshToken: googleUser.refreshToken,
            userId: user.id,
          },
          'CREATE',
        );
      } else {
        const createOauth = await this.usersService.createOauthProfile(
          {
            provider: googleUser.provider,
            providerId: googleUser.providerId,
            accessToken: googleUser.accessToken,
            refreshToken: googleUser.refreshToken,
            userId: user.id,
          },
          'CONNECT',
          authWithGoogle.id,
        );
      }
      const { password, ...rest } = user;
      return rest;
    } else {
      const newUser = await this.usersService.createUser(
        {
          name: googleUser.fullName,
          email: googleUser.email,
          username: 'google_' + googleUser.providerId,
        },
        {
          type: 'STUDENT',
        },
      );

      const createOauth = await this.usersService.createOauthProfile(
        {
          provider: googleUser.provider,
          providerId: googleUser.providerId,
          accessToken: googleUser.accessToken,
          refreshToken: googleUser.refreshToken,
          userId: newUser.id,
        },
        'CREATE',
      );
    }
    return null;
  }

  async logout(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Clear the refresh token in the database
    await this.usersService.updateRefreshToken(userId, null);
    return {
      message: 'User logged out successfully',
      statusCode: 200,
    };
  }
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    const user = await this.usersService.findOne({
      email: req.user.email,
      oauth: true,
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return await this.login({
      name: user.name,
      username: user.username,
      id: user.id,
      email: user.email,
    });
    // return {
    //   message: 'User information from google',
    //   user,
    //   google_user: req.user,
    // };
  }
}
