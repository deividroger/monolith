import Id from "./value-objects/id.value-object";

export default class BaseEntity {
    
    private _id: Id;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(id?: Id, createdAt?: Date, updatedAt?: Date) {
        this._id = id || new Id();
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt || new Date();
        
    }

    get id(): Id {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    set UpdatedAt(value: Date) {
        this._updatedAt = value;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }

}