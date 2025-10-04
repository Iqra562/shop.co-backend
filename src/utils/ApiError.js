class ApiError extends  Error{
    constructor(
        statusCode,
        message =  "Something went wrong",
        code ="",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode = statusCode,
        this.data =  null,
        this.message = message,
        this.code = code,
        this.success  = false,
        this.errors = errors
    }
}

export {ApiError}