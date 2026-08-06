import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../utils/api';

export default function AdminAttributes() {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await api.get('/attributes/');
        setAttributes(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Delete attribute "${name}"?`)) return;
    try {
      await api.delete(`/attributes/${slug}/`);
      setAttributes((prev) => prev.filter((a) => a.slug !== slug));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout title="Attributes">
      <div className="flex justify-end mb-6">
        <Link
          to="/admin/attributes/new"
          className="inline-flex px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition"
        >
          + Add attribute
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
              <th className="px-5 py-3.5 font-medium">Sample values</th>
              <th className="px-5 py-3.5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : attributes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center text-gray-500">
                  No attributes
                </td>
              </tr>
            ) : (
              attributes.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition">
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{a.name}</td>
                  <td className="px-5 py-4 text-gray-500 font-mono text-xs">{a.slug}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-md">
                      {(a.values || []).slice(0, 6).map((v) => (
                        <span
                          key={v}
                          className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300"
                        >
                          {v}
                        </span>
                      ))}
                      {(a.values || []).length > 6 && (
                        <span className="text-xs text-gray-400">+{a.values.length - 6}</span>
                      )}
                      {!(a.values || []).length && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/attributes/${a.slug}/edit`}
                        className="text-xs font-medium text-brand-blue hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(a.slug, a.name)}
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