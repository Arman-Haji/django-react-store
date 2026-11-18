import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../utils/api';

const GROUPS = [
  { value: 'home_main', label: 'Home — main slider' },
  { value: 'home_secondary', label: 'Home — secondary slider' },
];

const field =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/30';

export default function AdminBannerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    link: '',
    group: 'home_main',
    order: 0,
    is_active: true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    api
      .get(`/banners/${id}/`)
      .then((b) => {
        setForm({
          title: b.title || '',
          link: b.link || '',
          group: b.group || 'home_main',
          order: b.order ?? 0,
          is_active: b.is_active ?? true,
        });
        if (b.image_url || b.image) setPreview(b.image_url || b.image);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('link', form.link);
      fd.append('group', form.group);
      fd.append('order', String(form.order));
      fd.append('is_active', form.is_active ? 'true' : 'false');
      if (image) fd.append('image', image);

      if (isEdit) {
        await api.patch(`/banners/${id}/`, fd);
      } else {
        if (!image) {
          setError('Image is required');
          setLoading(false);
          return;
        }
        await api.post('/banners/', fd);
      }
      navigate('/admin/banners');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title={isEdit ? 'Edit banner' : 'Add banner'}>
        <p className="text-gray-500">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Edit banner' : 'Add banner'}>
      <form onSubmit={onSubmit} className="max-w-xl space-y-5">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm mb-1.5 text-gray-600 dark:text-gray-300">Title</label>
            <input name="title" value={form.title} onChange={onChange} className={field} />
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-gray-600 dark:text-gray-300">
              Link (e.g. /category/all or https://...)
            </label>
            <input name="link" value={form.link} onChange={onChange} className={field} />
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-gray-600 dark:text-gray-300">Group</label>
            <select name="group" value={form.group} onChange={onChange} className={field}>
              {GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Same group = same slider. Slide count = number of banners in that group.
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-gray-600 dark:text-gray-300">Order</label>
            <input
              name="order"
              type="number"
              min="0"
              value={form.order}
              onChange={onChange}
              className={field}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5 text-gray-600 dark:text-gray-300">
              Image {isEdit ? '' : '*'}
            </label>
            {preview && (
              <img
                src={preview}
                alt=""
                className="w-full max-h-48 object-cover rounded-xl mb-3 ring-1 ring-gray-200 dark:ring-gray-700"
              />
            )}
            <input type="file" accept="image/*" onChange={onImage} className="text-sm" />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={onChange}
              className="rounded"
            />
            Active
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update banner' : 'Create banner'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/banners')}
            className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}