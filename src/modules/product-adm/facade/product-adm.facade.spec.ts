import { Sequelize } from "sequelize-typescript";
import ProductAdmFacadeFactory from "../factory/facade.factory";
import { ProductModel } from "../repository/product.model";

describe("ProductAdmFacade test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([ProductModel]);

        await sequelize.sync();

    });

    it("should create product", async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        }

        await productFacade.addProduct(input);

        const product = await ProductModel.findOne({ where: { id: input.id } });

        expect(product).toBeDefined();
        expect(product.id).toEqual(input.id);
        expect(product.name).toEqual(input.name);
        expect(product.description).toEqual(input.description);
        expect(product.purchasePrice).toEqual(input.purchasePrice);
        expect(product.stock).toEqual(input.stock);

    });

    it("should check product stock", async () => {

        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10
        }

        await productFacade.addProduct(input);

        const result = await productFacade.checkStock({productId:"1"});

        expect(result.productId).toBe(input.id);
        expect(result.stock).toBe(input.stock);       

    });

});