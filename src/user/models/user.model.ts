import { Column, DataType, Model, Table, HasOne } from "sequelize-typescript";
import { Token } from "../../token/models/token.model";

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email: string

  @Column({
    type: DataType.STRING(1000),
    allowNull: false
  })
  password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  username: string

  @Column({
    type: DataType.STRING
  })
  firstName: string

  @Column({
    type: DataType.STRING
  })
  lastName: string

  @Column({
    type: DataType.STRING
  })
  middleName: string

  @Column({
    type: DataType.INTEGER,
  })
  age: number

  @Column({
    type: DataType.STRING,
    unique: true
  })
  phone: string

  @HasOne(() => Token)
  token: Token
}