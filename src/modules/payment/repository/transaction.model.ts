import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "transactions",
    timestamps: false,
})
export default class TransactionModel extends Model {
    
    @PrimaryKey
    @Column({allowNull: false})
    public id: string;

    @Column({allowNull: false})
    public amount: number;
    
    @Column({allowNull: false})
    public orderId: string;
    
    @Column({allowNull: false})
    public status: string;

    @Column({allowNull: false})
    public createdAt: Date;

    @Column({allowNull: false})
    public updatedAt: Date;
}