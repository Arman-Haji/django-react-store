import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../utils/api';

const fieldClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-blue/30';

export default function AdminAttributeForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', slug: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    api
      .get(`/attributes/${slug}/`)
      .then((a) => setForm({ name: a.name || '', slug: a.slug || '' }))
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [slug, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = { name: form.name };
    if (form.slug) payload.slug = form.slug;
    try {
      if (isEdit) await api.patch(`/attributes/${slug}/`, payload);
      else await api.post('/attributes/', payload);
      navigate('/admin/attributes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title={isEdit ? 'Edit attribute' : 'Add attribute'}>
        <p className="text-gray-500">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Edit attribute' : 'Add attribute'}>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Values like Red or XL are assigned on each product. Here you only define the attribute type.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="e.g. Color, Size, Brand"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Slug
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="Auto-generated if empty"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update attribute' : 'Create attribute'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/attributes')}
            className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}