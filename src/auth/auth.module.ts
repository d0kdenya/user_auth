import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from './config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SequelizeModule } from "@nestjs/sequelize";
import { Token } from "../token/models/token.model";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    SequelizeModule.forFeature([Token]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    UserModule,
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
