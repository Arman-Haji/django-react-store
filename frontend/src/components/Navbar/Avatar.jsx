// components/Navbar/Avatar.jsx
const sizes={
 sm:'w-8 h-8 text-sm',
 md:'w-10 h-10 text-lg',
 lg:'w-12 h-12 text-xl'
};


export const Avatar=({user={},size='md'})=>{

const image=user.profile_image_url||user.profile_image;
const initial=user.username?.charAt(0).toUpperCase()||'?';


return(
<div className={`${sizes[size]} rounded-full overflow-hidden border-2 border-brand-blue/20 dark:border-brand-blue/40 group-hover:border-brand-blue transition bg-gray-100 dark:bg-gray-800 flex-shrink-0`}>

{image?

<img
src={image}
alt={user.username||'avatar'}
className="w-full h-full object-cover"
/>

:

<div className="w-full h-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center">
<span className="text-brand-blue font-semibold">
{initial}
</span>
</div>

}

</div>
);

};