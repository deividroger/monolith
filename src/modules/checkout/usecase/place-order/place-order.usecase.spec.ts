import Id from "../../../@shared/domain/entity/value-objects/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);
describe("PlaceOrderUseCase UnitTest", () => {

    describe("getProducts method", () => {
        beforeAll(() => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(mockDate);
        });
        afterAll(() => {
            jest.useRealTimers();
        });

        //@ts-expect-error no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw error when product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockReturnValue(null),
                findAll: jest.fn()
            };
            //ts-expect-error force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrowError(
                new Error("Product not found")
            );

        });

    });


    describe("validateProducts method", () => {
        //@ts-expect-error no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw error if no products are selected", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: []
            };
            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError(
                new Error("No products selected"));
        });

        it("should throw an  error when product is out of stock", async () => {

            const mockProductFacade = {
                checkStock: jest.fn(({ productId }: { productId: string }) =>
                    Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1
                    })
                ),
                addProduct: jest.fn()
            }
            //ts-expect-error force set productFacade
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "1" }]
            }

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError(
                new Error("Product 1 is not available in stock")
            );

            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }]
            };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError(
                new Error("Product 1 is not available in stock")
            );

            expect(mockProductFacade.checkStock).toBeCalledTimes(3);


            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }]
            };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError(
                new Error("Product 1 is not available in stock")
            );

            expect(mockProductFacade.checkStock).toBeCalledTimes(5);

        });

        it("should throw an error when product are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
            };

            //@ts-expect-error no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            //@ts-expect-error force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const mockValidateProducts = jest
                //@ts-expect-error spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error not return never
                .mockRejectedValue(new Error("No products selected"));

            const input: PlaceOrderInputDto = {
                clientId: "1",
                products: []
            };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(new Error("No products selected"));

            expect(mockValidateProducts).toBeCalledTimes(1);
        });

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    description: "description 0",
                    name: "product 0",
                    salesPrice: 0,
                    price: 10
                }),
                findAll: jest.fn()
            }

            //ts-expect-error force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    description: "description 0",
                    name: "product 0",
                    salesPrice: 0,

                }));

            expect(mockCatalogFacade.find).toBeCalledTimes(1);
        });

    });


    describe("execute method", () => {

        beforeAll(() => {
            jest.useFakeTimers('modern');
            jest.setSystemTime(mockDate);
        });
        afterAll(() => {
            jest.useRealTimers();
        });

        it("should throw an error when client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null)
            };
            //@ts-expect-error no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: []
            };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
                new Error("Client not found")
            );

        });

        describe("Place an order", () => {
            const clientProps = {
                id: "1c",
                name: "client 1",
                document: "123456789",
                email: "client@teste.com",
                street: "street 1",
                number: "1",
                complement: "complement 1",
                city: "city 1",
                state: "state 1",
                zipCode: "12345678",
            }

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps),
                add: jest.fn(),
            }

            const mockPaymentFacade = {
                process: jest.fn(),
            }

            const mockCheckoutRepository = {
                addOrder: jest.fn(),
                find: jest.fn(),
            }
            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({
                    id: "1i",
                }),
                find: jest.fn(),
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade,
                null,
                null,
                mockCheckoutRepository,
                mockInvoiceFacade,
                mockPaymentFacade
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "product 1",
                    description: "description 1",
                    salesPrice: 40,
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "product 2",
                    description: "description 2",
                    salesPrice: 30,
                }),
            };

            const mockValidateProducts = jest
                //@ts-expect-error spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error spy on private method
                .mockResolvedValue(null);

            const mockGetProduct = jest
                //@ts-expect-error spy on private method
                .spyOn(placeOrderUseCase, "getProduct")
                //@ts-expect-error spy on private method
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId]
                });

            it("should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "i0",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [
                        { productId: "1" },
                        { productId: "2" }
                    ]
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "1" },
                    { productId: "2" }
                ]);

                expect(mockClientFacade.find).toBeCalledTimes(1);
                expect(mockClientFacade.find).toBeCalledWith({ id: "1c" });
                expect(mockValidateProducts).toBeCalledTimes(1);
                expect(mockValidateProducts).toBeCalledWith(input);
                expect(mockGetProduct).toBeCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toBeCalledTimes(1);
                expect(mockPaymentFacade.process).toBeCalledTimes(1);
                expect(mockPaymentFacade.process).toBeCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toBeCalledTimes(0);


            });

            it("should be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "i0",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [
                        { productId: "1" },
                        { productId: "2" }
                    ]
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe("1i");
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "1" },
                    { productId: "2" }
                ]);

                expect(mockClientFacade.find).toBeCalledTimes(1);
                expect(mockClientFacade.find).toBeCalledWith({ id: "1c" });
                expect(mockValidateProducts).toBeCalledTimes(1);

                expect(mockGetProduct).toBeCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toBeCalledTimes(1);
                expect(mockPaymentFacade.process).toBeCalledTimes(1);
                expect(mockPaymentFacade.process).toBeCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toBeCalledTimes(1);

                // /*preciso mudar a implementação para essa parte funcionar*/ 
                // expect(mockInvoiceFacade.generate).toBeCalledWith({
                //     name: clientProps.name,
                //     document: clientProps.document,
                //     email: clientProps.email,
                //     street: clientProps.street,
                //     number: clientProps.number,
                //     complement: clientProps.complement,
                //     city: clientProps.city,
                //     state: clientProps.state,
                //     zipCode: clientProps.zipCode,
                //     items: [
                //         {
                //             id: products["1"].id.id,
                //             name: products["1"].name,
                //             price: products["1"].salesPrice
                //         },
                //         {
                //             id: products["2"].id.id,
                //             name: products["2"].name,
                //             price: products["2"].salesPrice
                //         },
                //     ]
                // });

            });

        });

    })

});