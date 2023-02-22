import ClientAdmFacade from "../facade/client-adm.facade";
import ClientAdmFacadeInterface from "../facade/client-adm.facade.interface";
import { ClientRepository } from "../repository/client.repository";
import AddClientUseCase from "../use-case/add-client/add-client.usecase";
import FindClientUseCase from "../use-case/find-client/find-client.usecase";

export default class ClientAdmFacadeFactory {
    static create(): ClientAdmFacadeInterface {
        const repository = new ClientRepository();
        const findUseCase = new FindClientUseCase(repository);
        const addUseCase = new AddClientUseCase(repository);
        
        return  new ClientAdmFacade({
            addUseCase: addUseCase,
            findUseCase: findUseCase
        });       
    }
}