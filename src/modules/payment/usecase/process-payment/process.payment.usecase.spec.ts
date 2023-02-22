import Id from "../../../@shared/domain/entity/value-objects/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
    id: new Id('123'),
    amount: 100,
    orderId: '1',
    status: "approved",
});

const MockRepository = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(transaction))
    }
}

describe("Process payment usecase unit test",()=>{
    
    it("should approve a transaction", async ()=>{
        const paymentRepository = MockRepository();
        const usecase = new ProcessPaymentUseCase(paymentRepository);
        const input = {
            amount: 100,
            orderId: '1'
        }
        const result = await usecase.execute(input);
        
        expect(result.transactionId).toBe(transaction.id.id); 
        expect(paymentRepository.save).toHaveBeenCalled();
        expect(result.status).toBe('approved');
        expect(result.amount).toBe(100);
        expect(result.orderId).toBe('1');
        expect(result.createdAt).toBe(transaction.createdAt);
        expect(result.updatedAt).toBe(transaction.updatedAt);

    });

    it("should declined a transaction", async ()=>{
        
        const paymentRepository = MockRepository();

        const declinedTransaction =new Transaction({
            id: new Id('123'),
            amount: 90,
            orderId: '1',
            status: "declined",
        });

        paymentRepository.save.mockReturnValue(Promise.resolve(declinedTransaction));

        const usecase = new ProcessPaymentUseCase(paymentRepository);

        const input = {
            amount: 90,
            orderId: '1'
        }

        const result = await usecase.execute(input);

        expect(result.transactionId).toBe(declinedTransaction.id.id);
        expect(paymentRepository.save).toHaveBeenCalled();
        expect(result.status).toBe('declined');
        expect(result.amount).toBe(90);
        expect(result.orderId).toBe('1');
        expect(result.createdAt).toEqual(declinedTransaction.createdAt);
        expect(result.updatedAt).toEqual(declinedTransaction.updatedAt);


    });


});