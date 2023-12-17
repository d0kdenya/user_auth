import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";

@Table({ tableName: 'tokens' })
export class Token extends Model<Token> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number

  @Column({
    type: DataType.STRING(10000),
    allowNull: false,
    unique: true,
  })
  refreshToken: string

  @ForeignKey(() => User)
  @Column
  userId: number

  @BelongsTo(() => User)
  user: User
}
