import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { UserTypeDTO } from 'src/auth/dto/user-type.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/auth/dto/create-auth.dto';
@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) {}

  async createUser(createUserDto: CreateUserDTO, userType: UserTypeDTO) {
    try {
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.db.user.create({
        data: {
          name: createUserDto.name,
          username: createUserDto.username,
          email: createUserDto.email,
          password: hash,
          userType: userType.type,
        },
      });
      if (!newUser) throw new Error("Couldn't create the profile for user");
      return newUser;
    } catch (err) {
      throw new BadRequestException(err && err.message);
    }
  }

  async findAll() {
    return await this.db.user.findMany({
      include: {
        oauth: true,
        // role: {
        //   select: {
        //     name: true,
        //   },
        // },
        // scopes: true,
        // profile: true,
        // orgProfile: true,
      },
    });
  }

  async findOne({
    id,
    username,
    email,
    oauth,
  }: {
    id?: string;
    username?: string;
    email?: string;
    oauth?: boolean;
  }) {
    const user = await this.db.user.findMany({
      where: {
        OR: [
          {
            id: id,
          },
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      },
      include: {
        // role: {
        //   select: {
        //     name: true,
        //   },
        // },
        // scopes: true,
        // profile: true,
        // orgProfile: true,
        oauth: oauth,
      },
    });
    if (user.length == 0) return null;
    return user[0];
  }

  updateRefreshToken(id: string, refreshToken: string | null) {
    return this.db.user.update({
      where: { id },
      data: { refresh_token: refreshToken },
    });
  }

  async createOauthProfile(
    data: {
      provider?: string;
      providerId?: string;
      accessToken?: string;
      refreshToken?: string;
      userId?: string;
    },
    mode: 'CREATE' | 'CONNECT',
    idToUpdate?: string,
  ) {
    try {
      if (mode == 'CREATE') {
        const oauth = await this.db.oauth.create({ data });
        return oauth;
      } else {
        const oauth = await this.db.oauth.update({
          where: {
            id: idToUpdate,
          },
          data: {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          },
        });
        return oauth;
      }
    } catch (err) {
      throw new BadRequestException("Couldn't create oauth for the user");
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
