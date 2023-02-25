import Id from "../../../@shared/domain/entity/value-objects/id.value-object";
import Invoice from "../../domain/invoice";
import Product from "../../domain/product";
import Address from "../../domain/value-objects/address";
import FindInvoiceUseCase from "./find-invoice.usecase";


const invoice = new Invoice({
    id: new Id( "1"),
    name: "John Doe",
    document: "123456789",
    address: new Address( 
        "Rua teste",
        "123",
        "Casa",
        "São Paulo",
        "SP",
        "12345678"
    ),
    items: [
       new Product( {
            id: new Id( "1"),
            name: "Item 1",
            price: 10
        }),
        new Product({
            id: new Id( "2"),
            name: "Item 2",
            price: 20
        })
    ],
    createdAt: new Date(),
    updatedAt: new Date()
    
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    }
}

describe("Find invoice use case unit test", () => {

    it("should find a invoice", async () => {
        const repository = MockRepository();

        const usecase = new FindInvoiceUseCase(repository);

        const input = {
            id: "1"
        }

        const result = await usecase.execute(input);

        expect(repository.find).toBeCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe("John Doe");
        expect(result.document).toBe("123456789");
        expect(result.address.street).toBe("Rua teste");
        expect(result.address.number).toBe("123");
        expect(result.address.complement).toBe("Casa");
        expect(result.address.city).toBe("São Paulo");
        expect(result.address.state).toBe("SP");
        expect(result.address.zipCode).toBe("12345678");
        expect(result.items.length).toBe(2);
        expect(result.items[0].name).toBe("Item 1");
        expect(result.items[0].price).toBe(10);
        expect(result.items[1].name).toBe("Item 2");
        expect(result.items[1].price).toBe(20);
        expect(result.total).toBe(30);
    });

});