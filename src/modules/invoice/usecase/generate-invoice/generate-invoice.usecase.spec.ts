import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn()
    }
}


describe("Generate invoice use case unit test", () => {

    it("should register a invoice", async () => {
        const repository = MockRepository();

        const usecase = new GenerateInvoiceUseCase(repository);

        const input = {
            name: "John Doe",
            document: "123456789",
            street: "Rua teste",
            number: "123",
            complement: "Casa",
            city: "São Paulo",
            state: "SP",
            zipCode: "12345678",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 10
                },
                {
                    id: "2",
                    name: "Item 2",
                    price: 20
                }
            ]
        }

        const result = await usecase.execute(input);

        expect(repository.add).toBeCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);
        expect(result.total).toBe(30);
    });

});