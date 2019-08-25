class ServiceHelper {
    static die(resp, payload, statusCode) {
        var statusCode = (typeof statusCode === 'undefined') ? 200 : statusCode;
        return resp.status(statusCode).json(payload);
    }
}

module.exports = ServiceHelper;