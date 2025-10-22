export const notFound=(req,resp,err)=>
{
    req.status(400).json({Message:"Route not found"})
}

export const errorHandler=(err,req,resp,next)=>
{
    const status=err.status|| 500
    const message=err.message|| "Internal server error"
    resp.status(status).json({message:message})
}