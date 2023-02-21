import Id from "../../../@shared/domain/entity/value-objects/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find.product.usecase";

const product = new Product({
    id: new Id( "1"),
    name: "Product 1",
    description: "Description 1",
    salesPrice: 10,
});

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product))
    }
};

describe("Find a product usecase unit test", () => {

    it("should find a product", async () => {
        const productRepository =  MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: "1"
        }

        const output = await usecase.execute(input);

        expect(productRepository.find).toHaveBeenCalled();
    
        expect(output.id).toBe("1");
        expect(output.name).toBe("Product 1");
        expect(output.description).toBe("Description 1");
        expect(output.salesPrice).toBe(10);

    } );

});