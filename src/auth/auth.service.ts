import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Token } from '../token/models/token.model';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Jwt } from './interfaces/jwt.interface';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from "@nestjs/sequelize";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/create.user.dto";
import { UserPayload } from "../user/interfaces/user.payload.interface";
import { User } from "../user/models/user.model";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token)
    private readonly tokenRepository: typeof Token,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: AuthDto): Promise<Jwt> {
    const user = await this.validateUser(dto);
    const refreshToken = await this.tokenRepository.findOne({
      where: { userId: user.id },
    });
    const tokens = await this.issueTokens({
      ...user,
    });

    refreshToken
      ? await this.tokenRepository.update(
          { refreshToken: tokens.refreshToken, userId: user.id },
        { where: { id : refreshToken.id }
        })
      : await this.tokenRepository.bulkCreate([{
          refreshToken: tokens.refreshToken,
          userId: user.id,
        }]);

    return {
      ...tokens,
    };
  }

  async registration(dto: CreateUserDto): Promise<Jwt> {
    const isEmailExist = await this.userService.getUserByLogin(dto.email);

    if (isEmailExist)
      throw new BadRequestException(
        'Пользователь с данным email уже зарегистрирован!',
      );

    const isUsernameExist = await this.userService.getUserByUsername(dto.username);

    if (isUsernameExist) {
      throw new BadRequestException(
        'Пользователь с данным username уже существует!',
      );
    }

    if (dto.phone) {
      const isPhoneExist = await this.userService.getUserByLogin(dto.phone);

      if (isPhoneExist)
        throw new BadRequestException(
          'Пользователь с данным номером уже зарегистрирован!',
        );
    }

    const user = await this.userService.createUser({
      ...dto,
    });
    const tokens = await this.issueTokens({ id: user.id, email: user.email, username: user.username });

    await this.tokenRepository.bulkCreate([{
      refreshToken: tokens.refreshToken,
      userId: user.id,
    }]);

    return {
      ...tokens,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const token = await this.tokenRepository.findOne({ where: { refreshToken } });

    if (!token)
      throw new UnauthorizedException({ message: 'Некорректный токен!' });

    await this.tokenRepository.destroy({ where: { refreshToken } });
  }

  async refresh(refreshToken: string): Promise<Jwt> {
    const token = await this.tokenRepository.findOne({ where: { refreshToken } });

    if (!token)
      throw new UnauthorizedException({ message: 'Некорректный токен!' });

    const user = await this.userService.getUserById(token.userId);
    const tokens = await this.issueTokens(user);

    token
      ? await this.tokenRepository.update(
          { refreshToken: tokens.refreshToken, userId: user.id },
        { where: { id: token.id } }
        )
      : await this.tokenRepository.bulkCreate([{
          refreshToken: tokens.refreshToken,
          userId: user.id,
        }]);

    return {
      ...tokens,
    };
  }

  private async issueTokens(payload: UserPayload): Promise<Jwt> {
    const jwtRefreshExpires = this.configService.get('JWT_REFRESH_EXPIRES');

    const accessToken = this.jwtService.sign({ ...payload });

    const refreshToken = this.jwtService.sign(
      { ...payload },
      {
        expiresIn: jwtRefreshExpires,
      },
    );

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto): Promise<User> {
    const user = await this.userService.getUserByLogin(dto.login);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Некорректные данные!',
      });
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({
      message: 'Некорректные данные!',
    });
  }
}
