module.exports = class RestError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status ?? 500;
    }
}