module.exports = {
    serviceDie: function(resp, payload, statusCode) {
        var statusCode = (typeof statusCode === 'undefined') ? 200 : statusCode;
        return resp.status(statusCode).json(payload);
    }
};