// components/Navbar/index.jsx
import {useState,useRef} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import {FaShoppingCart,FaSearch} from 'react-icons/fa';
import {useAuth} from '../../contexts/AuthContext';
import {useClickOutside} from '../../hooks/useClickOutside';
import {DesktopMenu} from './DesktopMenu';
import {MobileMenu} from './MobileMenu';
import {ThemeToggle} from '../ThemeToggle';
import {useCart} from '../../contexts/CartContext';
import {useProducts} from '../../contexts/ProductContext';
import {CategoriesMenu} from './CategoriesMenu';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Icons={
 Logo:()=>(
  <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
   <span className="text-white font-bold text-lg">M</span>
  </div>
 ),
 Menu:({isOpen})=>(
  <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
   d={isOpen?"M6 18L18 6M6 6l12 12":"M4 6h16M4 12h16M4 18h16"}/>
  </svg>
 )
};


function Navbar(){

const navigate=useNavigate();
const location=useLocation();

const {user,logout}=useAuth();
const {getItemCount}=useCart();
const {updateFilters}=useProducts();

const [isOpen,setIsOpen]=useState(false);
const [isSearchOpen,setIsSearchOpen]=useState(false);
const [searchTerm,setSearchTerm]=useState('');

const dropdownRef=useRef(null);
const searchRef=useRef(null);

useClickOutside(dropdownRef,()=>setIsOpen(false));
useClickOutside(searchRef,()=>setIsSearchOpen(false));


const handleLogout=()=>{
 logout();
 setIsOpen(false);
 navigate('/');
};


const handleSearch=e=>{
 e.preventDefault();
 updateFilters({search:searchTerm});
 navigate('/category/all');
 setIsSearchOpen(false);
};


return(
<nav className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/50 sticky top-0 z-50 transition-colors">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<div className="flex justify-between items-center h-16">

<Link to="/" className="flex items-center space-x-2">
 <Icons.Logo/>
 <span className="text-xl font-bold text-gray-900 dark:text-white">
  MyShop
 </span>
</Link>


<div className="hidden md:flex items-center space-x-8">
  {/* Home */}
  <Link
    to="/"
    className={`text-gray-600 dark:text-gray-300 hover:text-brand-blue transition ${
      location.pathname === '/' ? 'text-brand-blue font-medium' : ''
    }`}
  >
    Home
  </Link>

  {/* Categories Mega Menu */}
  <CategoriesMenu />

  {/* About و Contact */}
  {NAV_LINKS.filter((link) => link.path !== '/').map((link) => (
    <Link
      key={link.path}
      to={link.path}
      className={`text-gray-600 dark:text-gray-300 hover:text-brand-blue transition ${
        location.pathname === link.path ? 'text-brand-blue font-medium' : ''
      }`}
    >
      {link.label}
    </Link>
  ))}
</div>


<div className="hidden md:flex items-center space-x-4">



<div className="relative" ref={searchRef}>

<button onClick={()=>setIsSearchOpen(!isSearchOpen)}
className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue">
<FaSearch size={18}/>
</button>


{isSearchOpen&&(
<form onSubmit={handleSearch}
className="absolute right-0 top-full mt-2 w-64">

<div className="flex bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 overflow-hidden">

<input
value={searchTerm}
onChange={e=>setSearchTerm(e.target.value)}
placeholder="Search products..."
className="flex-1 px-4 py-2 bg-transparent text-gray-900 dark:text-white outline-none"
/>

<button className="px-4 bg-brand-blue text-white">
<FaSearch size={14}/>
</button>

</div>

</form>
)}

</div>


<Link to="/cart"
className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue">

<FaShoppingCart size={20}/>

{getItemCount()>0&&(
<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center">
{getItemCount()}
</span>
)}

</Link>


<ThemeToggle/>

<DesktopMenu
user={user}
isOpen={isOpen}
toggleMenu={()=>setIsOpen(!isOpen)}
onLogout={handleLogout}
dropdownRef={dropdownRef}
/>

</div>


<button
onClick={()=>setIsOpen(!isOpen)}
className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">

<Icons.Menu isOpen={isOpen}/>

</button>

</div>


{isOpen&&(
<MobileMenu
user={user}
navLinks={NAV_LINKS}
location={location}
onClose={()=>setIsOpen(false)}
onLogout={handleLogout}
/>
)}

</div>
</nav>
);

}

export default Navbar;