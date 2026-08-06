import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../utils/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/categories/');
      setCategories(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${slug}/`);
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
    } catch (err) {
      alert(err.message);
    }
  };

  const parentName = (parentId) => {
    if (!parentId) return '—';
    return categories.find((c) => c.id === parentId)?.name || parentId;
  };

  return (
    <AdminLayout title="Categories">
      <div className="flex justify-end mb-6">
        <Link
          to="/admin/categories/new"
          className="inline-flex px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition"
        >
          + Add category
        </Link>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3.5 font-medium">Name</th>
              <th className="px-5 py-3.5 font-medium">Slug</th>
              <th className="px-5 py-3.5 font-medium">Parent</th>
              <th className="px-5 py-3.5 font-medium">Products</th>
              <th className="px-5 py-3.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-gray-500">
                  No categories
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition">
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{c.name}</td>
                  <td className="px-5 py-4 text-gray-500 font-mono text-xs">{c.slug}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{parentName(c.parent)}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex min-w-[2rem] justify-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300">
                      {c.products_count ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/categories/${c.slug}/edit`}
                        className="text-xs font-medium text-brand-blue hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(c.slug, c.name)}
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}