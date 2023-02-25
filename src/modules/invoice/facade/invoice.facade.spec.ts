import { Sequelize } from "sequelize-typescript";
import InvoiceFactory from "../factory/invoice.facade.factory";
import InvoiceModel from "../repository/invoice.model";
import ProductModel from "../repository/product.model";

describe("InvoiceFacade unit tests", () => {

    let sequelize: Sequelize;

    beforeEach(async ()=>{
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });
        await sequelize.addModels([InvoiceModel, ProductModel])
        await sequelize.sync();
    });

    afterEach(async ()=>{
        await sequelize.close();
    });


    it("should generate invoice", async () => {
        // Arrange
        
        const facade = InvoiceFactory.create();

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

        // Act
        const result = await facade.generate(input);

        // Assert
        expect(result).toBeDefined();

        expect(result.id).toBeDefined();

        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items).toBeDefined();
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(input.items[0].id);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].id).toBe(input.items[1].id);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);



    });

    it("should find invoice", async () => {
        
        // Arrange
        
      const facade = InvoiceFactory.create();

      const invoiceDb =  await InvoiceModel.create({
            id: "1",
            name: "invoice.name",
            document: "invoice.document",
            street: "invoice.address.street",
            number: "invoice.address.number",
            complement: "invoice.address.complement",
            city: "invoice.address.city",
            state: "invoice.address.state",
            zipCode: "invoice.address.zipCode",
            total: "invoice.total",
            createdAt: new Date(),
            updatedAt: new Date(),
            items: [
                {
                    id: "1",
                    name: "item.name",
                    price: 10
                },
                {
                    id: "2",
                    name: "item.name",
                    price: 20
                }
            ]
            },{
                include: [{ model: ProductModel }]
            });

        const input = {id: "1"}


        // Act
        const result = await facade.find(input);

        // Assert
        expect(result).toBeDefined();

        expect(result.id).toBe(invoiceDb.id);
        expect(result.name).toBe(invoiceDb.name);
        expect(result.document).toBe(invoiceDb.document);
        expect(result.address.street).toBe(invoiceDb.street);
        expect(result.address.number).toBe(invoiceDb.number);
        expect(result.address.complement).toBe(invoiceDb.complement);
        expect(result.address.city).toBe(invoiceDb.city);
        expect(result.address.state).toBe(invoiceDb.state);
        expect(result.address.zipCode).toBe(invoiceDb.zipCode);
        expect(result.items).toBeDefined();
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(invoiceDb.items[0].id);
        expect(result.items[0].name).toBe(invoiceDb.items[0].name);
        expect(result.items[0].price).toBe(invoiceDb.items[0].price);
        expect(result.items[1].id).toBe(invoiceDb.items[1].id);
        expect(result.items[1].name).toBe(invoiceDb.items[1].name);
        expect(result.items[1].price).toBe(invoiceDb.items[1].price);

    });

});