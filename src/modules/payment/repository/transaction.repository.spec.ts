import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/entity/value-objects/id.value-object";
import Transaction from "../domain/transaction";
import TransactionModel from "./transaction.model";
import TransactionRepository from "./transaction.repository";

describe("Transaction Repository test",  ()=>{
    let sequelize: Sequelize;

    beforeEach(async ()=>{
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        });
        sequelize.addModels([TransactionModel]);
        await sequelize.sync();
    });

    afterEach(async ()=>{
        await sequelize.close();
    });

    it("should save a transaction", async ()=>{

        const transaction = new Transaction({
            id: new Id('1'),
            amount: 100,
            orderId: '1'
        });

        transaction.approve();

        const repository = new TransactionRepository();

        const result = await repository.save(transaction);

        expect(result.id).toBeDefined();
        expect(result.id.id).toBe(transaction.id.id);
        expect(result.amount).toBe(transaction.amount);
        expect(result.orderId).toBe(transaction.orderId);
        expect(result.status).toBe("approved");

    });

});