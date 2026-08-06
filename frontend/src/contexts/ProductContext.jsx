// components/contexts/ProductContext.jsx
import {createContext,useState,useContext,useEffect} from 'react';
import {api} from '../utils/api';

const ProductContext=createContext();

export const ProductProvider=({children})=>{

const [products,setProducts]=useState([]);
const [categories,setCategories]=useState([]);
const [attributes, setAttributes] = useState([]);
const [loading,setLoading]=useState(false);
const [error,setError]=useState(null);

const [filters, setFilters] = useState({
  category: '',
  search: '',
  sort: '-created_at',
  min_price: 0,
  max_price: 10000,
  in_stock: false,
  has_discount: false,
  attrs: {},
});

const [pagination,setPagination]=useState({
 count:0,
 next:null,
 previous:null,
 page:1,
 pageSize:12
});


const fetchCategories=async()=>{
 try{
  const data=await api.get('/categories/');
  setCategories(data.results||data);
 }catch(err){
  console.error(err);
 }
};


const fetchProducts = async () => {
  setLoading(true);
  setError(null);

  try {
    const params = new URLSearchParams({
      page: pagination.page,
      page_size: pagination.pageSize,
      ordering: filters.sort,
    });

    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.min_price !== null) params.append('min_price', filters.min_price);
    if (filters.max_price !== null) params.append('max_price', filters.max_price);
    if (filters.in_stock) params.append('in_stock', 'true');
    if (filters.has_discount) params.append('has_discount', 'true');

    Object.entries(filters.attrs || {}).forEach(([slug, values]) => {
      if (values && values.length > 0) {
        params.append(`attr_${slug}`, values.join(','));
      }
    });

    const data = await api.get(`/products/?${params}`);

    setProducts(data.results || data);

    if (data.count !== undefined) {
      setPagination((prev) => ({
        ...prev,
        count: data.count,
        next: data.next,
        previous: data.previous,
      }));
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const fetchAttributes = async (categorySlug = '') => {
  try {
    const url = categorySlug
      ? `/attributes/?category=${categorySlug}`
      : '/attributes/';

    const data = await api.get(url);
    const list = data.results || data;

    setAttributes(list.filter((a) => a.values && a.values.length > 0));
  } catch (err) {
    console.error(err);
  }
};

const getProductById=id=>api.get(`/products/${id}/`);


const updateFilters=newFilters=>{
 setFilters(prev=>({...prev,...newFilters}));
 setPagination(prev=>({...prev,page:1}));
};


const changePage=page=>{
 setPagination(prev=>({...prev,page}));
};


useEffect(() => {
  fetchCategories();
  fetchAttributes(filters.category || '');
}, [filters.category]);


useEffect(()=>{
 fetchProducts();
},[filters,pagination.page,pagination.pageSize]);


return(
<ProductContext.Provider value={{
 products,
 categories,
 attributes,
 loading,
 error,
 filters,
 pagination,
 fetchProducts,
 getProductById,
 updateFilters,
 changePage
}}>
{children}
</ProductContext.Provider>
);

};


export const useProducts=()=>{
 const context=useContext(ProductContext);

 if(!context)
  throw new Error('useProducts must be used within ProductProvider');

 return context;
};