'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
    NOCONTENT: 204
}

const ReasonStatusCode = {
    CREATED: 'Created',
    OK: 'Success',
    NOCONTENT: 'No Content'
}

class SuccessResponse {
    constructor({ message, metadata }) {
        this.status = 200;
        this.message = message;
        this.metadata = metadata;
    }
    send(res) {
        res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
        this.status = StatusCode.OK;
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
        this.status = StatusCode.CREATED;
    }
}

class NOCONTENT extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
        this.status = StatusCode.NOCONTENT;
    }
}

module.exports = {
    OK, CREATED, SuccessResponse, NOCONTENT
}