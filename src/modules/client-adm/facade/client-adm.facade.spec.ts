import { Sequelize } from "sequelize-typescript";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import { ClientModel } from "../repository/client.model";

describe("ClientAdmFacade test", () => {

    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a client", async () => {

        const facade = ClientAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "John Doe",
            email: "email@email.com",
            address: "Rua teste",
        }

        await facade.add(input);

        const client = await ClientModel.findOne({ where: { id: "1" } });

        expect(client).toBeDefined();
        expect(client.id).toBe(input.id);
        expect(client.name).toBe(input.name);
        expect(client.email).toBe(input.email);
        expect(client.address).toBe(input.address);

    });

    it("should find a client", async () => {

        const facade = ClientAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "John Doe",
            email: "email@email.com",
            address: "Rua teste",
        };

        await facade.add(input);

        const result = await facade.find({ id: input.id });

        expect(result).toBeDefined();
        expect(result.id).toBe(input.id);
        expect(result.name).toBe(input.name);
        expect(result.email).toBe(input.email);
        expect(result.address).toBe(input.address);

    });

});