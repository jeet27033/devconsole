export class ApiError extends Error {
    responseStatus: number; 
    internalStatus: number; 
    constructor(obj:any) {
        super(obj.message || 'Some error occurred');
        this.responseStatus = obj.responseStatus || 500;
        this.internalStatus = obj.internalStatus || obj.responseStatus;
    }
}

export const SuccessResponse = (res: any, result: any, responseStatus: number = 200, internalStatus?: number) => {
    const response = {
        success: true,
        status: internalStatus || responseStatus,
        result: result
    };
    return res.status(responseStatus).json(response);
};

export const ErrorResponse = (res:any, error:any) => {
    if (error instanceof ApiError) {
        const response = {
            success: false,
            status: error.internalStatus || 500,
            error: error.message || 'An error occurred'
        };
        return res.status(error.responseStatus || 500).json(response);
    } else {
        // For unexpected errors (e.g., system/database errors), return a generic message
        const response = {
            success: false,
            status: 500,
            error: 'Something went wrong. Please try again later.'  // Generic message for the client
        };
        return res.status(500).json(response);
    }
};
