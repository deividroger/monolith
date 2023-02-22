import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientGateway from "../../gateway/client.gateway";
import { FindClientInputDto, FindClientOutputDto } from "./find-client.usecase.dto";

export default class FindClientUseCase implements UseCaseInterface {
    
    private _clientRepository: ClientGateway;
    
    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository;
        
    }
   async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {

    const result = await this._clientRepository.find(input.id);
    return {
        address: result.address,
        createdAt: result.createdAt,
        email: result.email,
        id: result.id.id,
        name: result.name,
        updatedAt: result.updatedAt
    }

    }
}