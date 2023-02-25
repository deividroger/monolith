import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/basic.entity";
import Id from "../../@shared/domain/entity/value-objects/id.value-object";
import Product from "./product";
import Address from "./value-objects/address";

type InvoiceProps = {
    id?: Id 
    name: string
    document: string
    address: Address
    items: Product[]
    createdAt?: Date
    updatedAt?: Date
};


export default class Invoice extends BaseEntity implements AggregateRoot {

    private _name: string;
    private _document: string;
    private _address: Address;
    private _items: Product[];
    private _total: number;
    
    constructor(invoiceProps: InvoiceProps) {
        super(invoiceProps.id, invoiceProps.createdAt, invoiceProps.updatedAt);
        this._name = invoiceProps.name;
        this._document = invoiceProps.document;
        this._address = invoiceProps.address;
        this._items = invoiceProps.items;
        this._total = this.calculateTotal();
    }

    get name(): string {    
        return this._name;
    }
    get document(): string {    
        return this._document;
    }
    get address(): Address {    
        return this._address;
    }

    get items(): Product[] {    
        return this._items;
    }
    get total(): number {
        return this._total;
    }

    calculateTotal() {
        return this._items.reduce((total, item) => total + item.price, 0);
    }
}