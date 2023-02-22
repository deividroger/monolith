import Id from "../../../@shared/domain/entity/value-objects/id.value-object";
import Client from "../../domain/client.entity"
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
    id: new Id("1"),
    name: "John Doe",
    email: "teste@teste.com",
    address: "Rua teste"
});
const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(client))
    }
}

describe("Find Client usecase unit test", () => {
    it("should find a client", async () => {
        const repository = MockRepository();
        const usecase = new FindClientUseCase(repository);
        const input = {
            id: "1"

        }
        const result = await usecase.execute(input);

        expect(repository.find).toBeCalled();
        expect(result.id).toBe(input.id);
        expect(result.name).toBe(client.name);
        expect(result.email).toBe(client.email);
        expect(result.address).toBe(client.address);
    });
})