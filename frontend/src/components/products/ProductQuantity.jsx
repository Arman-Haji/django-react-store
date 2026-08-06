// components/products/ProductQuantity.jsx
export const ProductQuantity=({quantity,setQuantity,stock})=>(

<div className="flex border rounded-lg">

<button
onClick={()=>setQuantity(Math.max(1,quantity-1))}
className="px-3"
>
-
</button>


<span className="px-4">
{quantity}
</span>


<button
disabled={quantity>=stock}
onClick={()=>setQuantity(quantity+1)}
className="px-3"
>
+
</button>


</div>

)