import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../utils/api';

const fieldClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-blue/30';

export default function AdminCategoryForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', slug: '', parent: '', is_active: true });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories/').then((d) => setCategories(d.results || d)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    api
      .get(`/categories/${slug}/`)
      .then((c) =>
        setForm({
          name: c.name || '',
          slug: c.slug || '',
          parent: c.parent || '',
          is_active: c.is_active ?? true,
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [slug, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      name: form.name,
      is_active: form.is_active,
      parent: form.parent || null,
    };
    if (form.slug) payload.slug = form.slug;
    try {
      if (isEdit) await api.patch(`/categories/${slug}/`, payload);
      else await api.post('/categories/', payload);
      navigate('/admin/categories');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parentOptions = categories.filter((c) => c.slug !== slug);

  if (fetching) {
    return (
      <AdminLayout title={isEdit ? 'Edit category' : 'Add category'}>
        <p className="text-gray-500">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Edit category' : 'Add category'}>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Name *
            </label>
            <input name="name" value={form.name} onChange={handleChange} required className={fieldClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Slug
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="Auto-generated if empty"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Parent
            </label>
            <select name="parent" value={form.parent} onChange={handleChange} className={fieldClass}>
              <option value="">None (top level)</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <label className="inline-flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-brand-blue"
            />
            Active
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update category' : 'Create category'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}