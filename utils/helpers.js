export const Response = {
    error(error, message = "error") {
        return {success: false, message, error}
    },
    success(data, message = "success") {
        return {success: true, message, data}
    },
    pagination(data, page, limit, total, message = "success") {
        return {
            success: true,
            message,
            data: {
                data,
                page,
                limit,
                total,
            },
        }
    },
}


export function generateSlug(slug){
    return String(slug).toLowerCase().replaceAll(" ", "_")
}


export function validationError(array){
    return array.map((err) => err.message)
}
