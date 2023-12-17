import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from "@nestjs/config";

const sequelizeConfigFactory = (configService: ConfigService): SequelizeModuleOptions => ({
  logging: false,
  dialect: 'postgres',
  host: 'localhost',
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  autoLoadModels: true,
  synchronize: true,
});

export default sequelizeConfigFactory;