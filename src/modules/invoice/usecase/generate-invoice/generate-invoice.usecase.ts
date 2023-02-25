import Id from "../../../@shared/domain/entity/value-objects/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice";
import Product from "../../domain/product";
import Address from "../../domain/value-objects/address";
import InvoiceGateway from "../../gateway/InvoiceGateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {

    constructor(private _invoiceRepository: InvoiceGateway) {

    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

        const props = {
            id: new Id(),
            name: input.name,
            document: input.document,
            address: new Address(input.street, input.number, input.complement, input.city, input.state, input.zipCode),
            items: input.items.map((product) => {
                return new Product({
                    id: new Id(product.id),
                    name: product.name,
                    price: product.price
                })
            }),
            createdAt: new Date(),
            updatedAt: new Date()

        };

        const invoice = new Invoice(props);

        await this._invoiceRepository.add(invoice);

        return {
            city: invoice.address.city,
            complement: invoice.address.complement,
            document: invoice.document,
            id: invoice.id.id,
            items: invoice.items.map((item) => {
                return {
                    id: item.id.id,
                    name: item.name,
                    price: item.price
                }
            }),
            name: invoice.name,
            number: invoice.address.number,
            state: invoice.address.state,
            street: invoice.address.street,
            total: invoice.total,
            zipCode: invoice.address.zipCode
        }
    }

}