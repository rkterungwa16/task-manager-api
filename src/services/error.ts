export class CustomError extends Error {
    public statusCode: number;
    public message: string;
    public name: string;
    constructor() {
        super();
        this.statusCode = 500;
        this.message = "";
        this.name = "";
    }
}

export const errorDefinition = (Error: CustomError) => {
    return (statusCode: number, message: string, name: string): CustomError => {
        Error.message = message;
        Error.statusCode = statusCode;
        Error.name = name;
        return Error;
    };
};

export const error = errorDefinition(new CustomError());
