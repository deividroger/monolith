import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ProductGateway from "../../gateway/product.gateway";

export default class FindAllProductsUseCase implements UseCaseInterface {

    constructor(private productRepository: ProductGateway){

    }

   async execute(): Promise<any> {
        const product = await this.productRepository.findAll();

        return  {
            products: product.map((product) => {
                return {
                    id: product.id.id,
                    name: product.name,
                    description: product.description,
                    salesPrice: product.salesPrice,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                }
            })
        }

    }
}