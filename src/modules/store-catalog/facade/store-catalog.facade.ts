import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find.product.usecase";
import StoreCatalogFacadeInterface, { FindAllStoreCatalogOutputDto, FindStoreCatalogInputDto, FindStoreCatalogOutputDto } from "./store-catalog.interface";

export interface UseCaseProps {
    findUseCase: FindProductUseCase;
    findAllUseCase: FindAllProductsUseCase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {

    constructor(private props: UseCaseProps) {

    }

    async find(id: FindStoreCatalogInputDto): Promise<FindStoreCatalogOutputDto> {

        return await this.props.findUseCase.execute(id);
    }

    async findAll(): Promise<FindAllStoreCatalogOutputDto> {
        return await this.props.findAllUseCase.execute();
    }

}