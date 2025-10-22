let products=[
    {
        id: 1,
        title:"this is lunch",
        description:"first expense"
    },
    {
        id: 2,
        title:"this is lunch 2",
        description:"second expense"
    },
    {
        id: 3,
        title:"this is lunch 3",
        description:"third expense"
    },
]

export const allProducts=(req,resp)=>
{
    resp.json(products)
    
}

export const singleProduct=(req,resp)=>
{
const {productId}=req.params
const ex=products.find((item)=>item.id==productId)
resp.json(ex)

}

export const createProduct=(req,resp)=>
{
 const{id,title,description}=req.body
 products.push(
    {
        id,title,description,
    }
    

 )
 resp.json(products)
 resp.send("product Created")
 
}

export const updateProduct=(req,resp)=>
{
    const{productId}=req.params
    const{title,description}=req.body
    products=products.map((product)=>
    {
      if(
        product.id==productId
      )
      {
       {product.title=title,product.description=description}
        return product
      }
      else{
        return product
      }
    })
    resp.json(products)
}

export const deleteProduct=(req,resp)=>
{
    const{productId}=req.params
    products=products.filter((item)=>
    item.id!=productId
)
resp.json(products)
}
