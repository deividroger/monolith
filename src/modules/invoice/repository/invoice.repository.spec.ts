import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/entity/value-objects/id.value-object";
import Invoice from "../domain/invoice";
import Product from "../domain/product";
import Address from "../domain/value-objects/address";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import ProductModel from "./product.model";

describe("Invoice Repository test",  ()=>{
    
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

    it("should save a invoice", async ()=>{

        const invoice = new Invoice({
            id: new Id('1'),
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

        const repository = new InvoiceRepository();

        await repository.add(invoice);
        
        const invoiceFromDb = await InvoiceModel
                .findOne(
                        {
                            where: {
                            id: invoice.id.id
                        }, 
                        include: ["items"],

                    });
                    
        expect(invoiceFromDb).toBeDefined();
        expect(invoiceFromDb.id).toBe(invoice.id.id);
        expect(invoiceFromDb.name).toBe(invoice.name);
        expect(invoiceFromDb.document).toBe(invoice.document);
        expect(invoiceFromDb.street).toBe(invoice.address.street);
        expect(invoiceFromDb.number).toBe(invoice.address.number);
        expect(invoiceFromDb.complement).toBe(invoice.address.complement);
        expect(invoiceFromDb.city).toBe(invoice.address.city);
        expect(invoiceFromDb.state).toBe(invoice.address.state);
        expect(invoiceFromDb.zipCode).toBe(invoice.address.zipCode);
        expect(invoiceFromDb.items[0].id).toBe(invoice.items[0].id.id);
        expect(invoiceFromDb.items[0].name).toBe(invoice.items[0].name);
        expect(invoiceFromDb.items[0].price).toBe(invoice.items[0].price);
        expect(invoiceFromDb.items[1].id).toBe(invoice.items[1].id.id);
        expect(invoiceFromDb.items[1].name).toBe(invoice.items[1].name);
        expect(invoiceFromDb.items[1].price).toBe(invoice.items[1].price);
    
    });

    it("should find a invoice", async ()=>{
        
        await InvoiceModel.create({
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

        const repository = new InvoiceRepository();

        const invoice = await repository.find("1");

        expect(invoice).toBeDefined();
        expect(invoice.id.id).toBe("1");
        expect(invoice.name).toBe("invoice.name");
        expect(invoice.document).toBe("invoice.document");
        expect(invoice.address.street).toBe("invoice.address.street");
        expect(invoice.address.number).toBe("invoice.address.number");
        expect(invoice.address.complement).toBe("invoice.address.complement");
        expect(invoice.address.city).toBe("invoice.address.city");
        expect(invoice.address.state).toBe("invoice.address.state");
        expect(invoice.address.zipCode).toBe("invoice.address.zipCode");
        expect(invoice.items[0].id.id).toBe("1");
        expect(invoice.items[0].name).toBe("item.name");
        expect(invoice.items[0].price).toBe(10);
        expect(invoice.items[1].id.id).toBe("2");
        expect(invoice.items[1].name).toBe("item.name");
        expect(invoice.items[1].price).toBe(20);
        expect(invoice.total).toBe(30);

    });
    
});