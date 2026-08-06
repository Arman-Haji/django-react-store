import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const SECTIONS = [
  {
    title: 'Products',
    description: 'Manage inventory, prices and stock',
    links: [
      { to: '/admin/products', label: 'All products', primary: true },
      { to: '/admin/products/new', label: 'Add product' },
    ],
    accent: 'from-blue-500/10 to-blue-500/5 border-blue-200/50 dark:border-blue-800/40',
    iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    ),
  },
  {
    title: 'Categories',
    description: 'Organize the store hierarchy',
    links: [
      { to: '/admin/categories', label: 'All categories', primary: true },
      { to: '/admin/categories/new', label: 'Add category' },
    ],
    accent: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-800/40',
    iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    ),
  },
  {
    title: 'Attributes',
    description: 'Colors, sizes, brands and more',
    links: [
      { to: '/admin/attributes', label: 'All attributes', primary: true },
      { to: '/admin/attributes/new', label: 'Add attribute' },
    ],
    accent: 'from-violet-500/10 to-violet-500/5 border-violet-200/50 dark:border-violet-800/40',
    iconBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    ),
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="mb-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl">
          Welcome to the admin area. Manage products, categories and attributes from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className={`
              relative overflow-hidden rounded-2xl border
              bg-gradient-to-br ${section.accent}
              bg-white dark:bg-gray-900
              p-6 flex flex-col
              shadow-sm hover:shadow-md transition-shadow duration-200
            `}
          >
            <div className="flex items-start gap-4 mb-5">
              <div
                className={`
                  w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                  ${section.iconBg}
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {section.icon}
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {section.description}
                </p>
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-2">
              {section.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-3.5 py-2 rounded-lg text-sm font-medium transition
                    ${
                      link.primary
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                        : 'bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}