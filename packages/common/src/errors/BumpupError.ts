export class BumpupError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export class WrappedBumpupError extends BumpupError {
    constructor(message?: string, public originalError?: Error) {
        super(message);
    }
}

