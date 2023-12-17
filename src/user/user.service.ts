import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models/user.model";
import { CreateUserDto } from "./dto/create.user.dto";
import * as bcrypt from 'bcryptjs';
import { Op } from "sequelize";
import { UpdateUserDto } from "./dto/update.user.dto";
import { FindUserDto } from "./dto/find.user.dto";


@Injectable()
export class UserService {

  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User
  ) {}

  async getAllUsers(params?: FindUserDto): Promise<User[]> {
    const queryOptions: any = {
      attributes: ['id', 'email', 'username', 'firstName', 'lastName', 'middleName', 'age', 'phone']
    }

    if (params && (params.limit || params.offset)) {
      queryOptions.limit = params.limit || 10;
      queryOptions.offset = params.offset || 0;
    }

    const queryWhereOptions: any = {};

    if (params && (params?.email || params?.phone || params?.username || params?.firstName || params?.lastName || params?.middleName)) {
      queryWhereOptions[Op.and] = [];

      if (params.email) {
        queryWhereOptions[Op.and].push({ email: { [Op.iLike]: `%${params.email}%` } });
      }

      if (params.phone) {
        queryWhereOptions[Op.and].push({ phone: { [Op.iLike]: `%${params.phone}%` } });
      }

      if (params.username) {
        queryWhereOptions[Op.and].push({ username: { [Op.iLike]: `%${params.username}%` } });
      }

      if (params.firstName) {
        queryWhereOptions[Op.and].push({ firstName: { [Op.iLike]: `%${params.firstName}%` } });
      }

      if (params.lastName) {
        queryWhereOptions[Op.and].push({ lastName: { [Op.iLike]: `%${params.lastName}%` } });
      }

      if (params.middleName) {
        queryWhereOptions[Op.and].push({ middleName: { [Op.iLike]: `%${params.middleName}%` } });
      }
    }

    queryOptions.where = queryWhereOptions;

    return this.userRepository.findAll(queryOptions)
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getUserByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        [Op.or]: [
          { email: login },
          { phone: login },
        ]
      },
    });
  }


  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        username
      }
    });
  }

  async createUser(dto: CreateUserDto): Promise<Partial<User>> {
    const isEmailExist = await this.getUserByLogin(dto.email);

    if (isEmailExist) {
      throw new BadRequestException(
        'Пользователь с данным email уже существует!',
      );
    }

    const isUsernameExist = await this.getUserByUsername(dto.username);

    if (isUsernameExist) {
      throw new BadRequestException(
        'Пользователь с данным username уже существует!',
      );
    }

    if (dto.phone) {
      const isPhoneExist = await this.getUserByLogin(dto.phone);

      if (isPhoneExist) {
        throw new BadRequestException(
          'Пользователь с данным номером уже существует!',
        );
      }
    }

    const hashPassword = await bcrypt.hash(dto.password, 12);

    const newUser = await this.userRepository.create({
      ...dto,
      password: hashPassword
    });

    const { password, ...userWithoutPassword } = newUser.toJSON() as User;
    return userWithoutPassword;
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<void> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userRepository.update({ ...dto }, { where: { id } })
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userRepository.destroy({ where: { id } })
  }
}
