const notFoundHandler =(req , res ,next) => {
    return next(new Error("invalid url!", {cause: 404}))
}

export default notFoundHandler;