import AddClientUseCase from "../use-case/add-client/add-client.usecase";
import FindClientUseCase from "../use-case/find-client/find-client.usecase";
import ClientAdmFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";


export interface UseCaseProps  {
    findUseCase: FindClientUseCase;
    addUseCase: AddClientUseCase;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {

    private _findUseCase: FindClientUseCase;
    private _addUseCase: AddClientUseCase;
    
    constructor(usecaseProps: UseCaseProps) {
        this._findUseCase = usecaseProps.findUseCase;
        this._addUseCase = usecaseProps.addUseCase; 
    }

  async  add(input: AddClientFacadeInputDto): Promise<void> {
        await this._addUseCase.execute(input);
    }
  async  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
        return this._findUseCase.execute(input);
    }
}