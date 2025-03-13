function getErrorExplanation(errorCode) {
    const errorMessages = {
        400: "Bad Request - The server could not understand the request due to invalid syntax.",
        401: "Unauthorized - Authentication is required to access this resource.",
        403: "Forbidden - You do not have permission to access this resource.",
        404: "Not Found - The requested resource could not be found.",
        408: "Request Timeout - The server timed out waiting for the request.",
        500: "Internal Server Error - The server encountered an unexpected condition.",
        502: "Bad Gateway - The server received an invalid response from the upstream server.",
        503: "Service Unavailable - The server is not ready to handle the request.",
        504: "Gateway Timeout - The server did not receive a timely response from the upstream server."
    }
    return errorMessages[errorCode] || "Unknown Error - No explanation available for this error code."
}
module.exports = getErrorExplanation