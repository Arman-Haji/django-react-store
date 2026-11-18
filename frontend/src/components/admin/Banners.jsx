import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../utils/api';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/banners/')
      .then((d) => setBanners(d.results || d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete banner "${title || id}"?`)) return;
    try {
      await api.delete(`/banners/${id}/`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <AdminLayout title="Banners">
      <div className="flex justify-end mb-6">
        <Link
          to="/admin/banners/new"
          className="px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium"
        >
          + Add banner
        </Link>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs uppercase text-gray-500">
              <th className="px-5 py-3.5">Preview</th>
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Group</th>
              <th className="px-5 py-3.5">Order</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  No banners
                </td>
              </tr>
            ) : (
              banners.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                  <td className="px-5 py-3">
                    {(b.image_url || b.image) ? (
                      <img
                        src={b.image_url || b.image}
                        alt=""
                        className="w-20 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-12 rounded-lg bg-gray-100 dark:bg-gray-800" />
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                    {b.title || '—'}
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">{b.group}</td>
                  <td className="px-5 py-3">{b.order}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        b.is_active
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {b.is_active ? 'Active' : 'Off'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/admin/banners/${b.id}/edit`}
                      className="text-xs text-brand-blue hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(b.id, b.title)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
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