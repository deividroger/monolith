import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export type InvoiceFacadeProps = {
    generateUseCase: GenerateInvoiceUseCase;
    findUseCase: FindInvoiceUseCase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface{

    constructor(private props: InvoiceFacadeProps) {
        
    }


   async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return this.props.generateUseCase.execute(input);
    }
   async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        return this.props.findUseCase.execute(input);
    }

}