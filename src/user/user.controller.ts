import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create.user.dto";
import { User } from "./models/user.model";
import { UpdateUserDto } from "./dto/update.user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { PaginationDto } from "../common/dto/pagination.dto";
import { FindUserDto } from "./dto/find.user.dto";

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получить список пользователей!' })
  @HttpCode(200)
  @Get()
  async getUsers(@Query() params: FindUserDto): Promise<User[]> {
    return await this.userService.getAllUsers(params);
  }

  @ApiOperation({ summary: 'Получить пользователя по ID!' })
  @HttpCode(200)
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Создать пользователя!' })
  @HttpCode(201)
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<Partial<User>> {
    return await this.userService.createUser(dto);
  }

  @ApiOperation({ summary: 'Обновить пользователя!' })
  @HttpCode(200)
  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<void> {
    return await this.userService.updateUser(id, dto);
  }

  @ApiOperation({ summary: 'Удалить пользователя!' })
  @HttpCode(200)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return await this.userService.deleteUser(id);
  }
}
