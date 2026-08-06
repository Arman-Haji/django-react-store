// components/products/ProductPrice.jsx
export const ProductPrice=({product})=>{

const price=Number(product.price);
const final=Number(product.final_price);


return(

<div className="text-2xl font-bold text-brand-blue">

${final || price}

</div>

)

}