// components/Navbar/DesktopMenu.jsx
import {Link} from 'react-router-dom';
import {Avatar} from './Avatar';
import {DropdownMenu} from './DropdownMenu';

export const DesktopMenu=({user,isOpen,toggleMenu,onLogout,dropdownRef})=>{

if(!user)
return(
<>
<Link to="/login"
className="px-4 py-2 text-brand-blue hover:bg-brand-blue/10 dark:hover:bg-brand-blue/20 font-medium rounded-lg transition">
Login
</Link>

<Link to="/signup"
className="px-4 py-2 bg-brand-blue hover:bg-brand-dark text-white font-medium rounded-lg transition">
Sign Up
</Link>
</>
);


return(
<div className="relative" ref={dropdownRef}>

<button
onClick={toggleMenu}
className="flex items-center space-x-2 focus:outline-none">

<Avatar user={user} size="md"/>

<svg
className={`w-4 h-4 text-gray-400 transition-transform ${isOpen?'rotate-180':''}`}
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">

<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M19 9l-7 7-7-7"
/>

</svg>

</button>

{isOpen&&(
<DropdownMenu
user={user}
onLogout={onLogout}
/>
)}

</div>
);

};