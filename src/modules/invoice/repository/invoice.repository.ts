import Id from "../../@shared/domain/entity/value-objects/id.value-object";
import Invoice from "../domain/invoice";
import Product from "../domain/product";
import Address from "../domain/value-objects/address";
import InvoiceGateway from "../gateway/InvoiceGateway";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";

export default class InvoiceRepository implements InvoiceGateway {
    async add(invoice: Invoice): Promise<void> {
        
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            total: invoice.total,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
            items: invoice.items.map((item) => {
                return {
                    id: item.id.id,
                    name: item.name,
                    price: item.price
                }
            })
        },{
            include: [{ model: ProductModel }]
        });

    }
   async find(id: string): Promise<Invoice> {

    const invoiceFromDb = await InvoiceModel
    .findOne(
            {
                where: {
                id: id
            }, 
            include: ["items"],

        });

        return new Invoice({
            id: new Id( invoiceFromDb.id),
            name: invoiceFromDb.name,
            document: invoiceFromDb.document,
            address: new Address( 
                invoiceFromDb.street,
                invoiceFromDb.number,
                invoiceFromDb.complement,
                invoiceFromDb.city,
                invoiceFromDb.state,
                invoiceFromDb.zipCode
            ),
            items: invoiceFromDb.items.map((item) => {
                return new Product({
                    id: new Id( item.id),
                    name:item.name,
                    price: item.price
                })
            }),
            createdAt: invoiceFromDb.createdAt,
            updatedAt: invoiceFromDb.updatedAt
        });
    }
}