import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../utils/api';

const emptyForm = {
  name: '',
  slug: '',
  category: '',
  description: '',
  price: '',
  discount_price: '',
  stock: '0',
  is_active: true,
  is_featured: false,
};

const field =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/30';

const Section = ({ title, children, action }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
    {children}
  </label>
);

export default function AdminProductForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attrRows, setAttrRows] = useState([{ attribute: '', value: '' }]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  useEffect(() => {
    Promise.all([api.get('/categories/'), api.get('/attributes/')])
      .then(([cats, attrs]) => {
        setCategories(cats.results || cats);
        setAttributes(attrs.results || attrs);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    api
      .get(`/products/${slug}/`)
      .then((p) => {
        setForm({
          name: p.name || '',
          slug: p.slug || '',
          category: p.category?.id || p.category || '',
          description: p.description || '',
          price: p.price ?? '',
          discount_price: p.discount_price ?? '',
          stock: p.stock ?? '0',
          is_active: p.is_active ?? true,
          is_featured: p.is_featured ?? false,
        });
        if (p.image) setPreview(p.image);
        if (p.attributes?.length) {
          setAttrRows(
            p.attributes.map((a) => ({
              attribute: a.attribute?.id || '',
              value: a.value || '',
            }))
          );
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [slug, isEdit]);

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const setAttr = (i, key, val) =>
    setAttrRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', form.name);
    if (form.slug) fd.append('slug', form.slug);
    if (form.category) fd.append('category', form.category);
    fd.append('description', form.description || '');
    fd.append('price', form.price);
    if (form.discount_price !== '' && form.discount_price != null) {
      fd.append('discount_price', form.discount_price);
    }
    fd.append('stock', form.stock || '0');
    fd.append('is_active', form.is_active ? 'true' : 'false');
    fd.append('is_featured', form.is_featured ? 'true' : 'false');
    if (image) fd.append('image', image);

    attrRows
      .filter((r) => r.attribute && r.value)
      .forEach((r, i) => {
        fd.append(`attributes[${i}]attribute`, r.attribute);
        fd.append(`attributes[${i}]value`, r.value);
      });

    return fd;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = buildFormData();
      if (isEdit) await api.patch(`/products/${slug}/`, fd);
      else await api.post('/products/', fd);
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout title={isEdit ? 'Edit product' : 'Add product'}>
        <p className="text-gray-500">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Edit product' : 'Add product'}>
      <form onSubmit={onSubmit} className="max-w-3xl space-y-5">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
            {error}
          </div>
        )}

        <Section title="Basic info">
          <div>
            <Label>Name *</Label>
            <input name="name" value={form.name} onChange={set} required className={field} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Slug</Label>
              <input
                name="slug"
                value={form.slug}
                onChange={set}
                placeholder="Auto if empty"
                className={field}
              />
            </div>
            <div>
              <Label>Category</Label>
              <select name="category" value={form.category} onChange={set} className={field}>
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              value={form.description}
              onChange={set}
              rows={3}
              className={field}
            />
          </div>
        </Section>

        <Section title="Pricing & stock">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Price *</Label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={set}
                required
                className={field}
              />
            </div>
            <div>
              <Label>Discount</Label>
              <input
                name="discount_price"
                type="number"
                step="0.01"
                min="0"
                value={form.discount_price}
                onChange={set}
                className={field}
              />
            </div>
            <div>
              <Label>Stock</Label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={set}
                className={field}
              />
            </div>
          </div>
          <div className="flex gap-6">
            {['is_active', 'is_featured'].map((key) => (
              <label
                key={key}
                className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={form[key]}
                  onChange={set}
                  className="rounded border-gray-300 text-brand-blue"
                />
                {key === 'is_active' ? 'Active' : 'Featured'}
              </label>
            ))}
          </div>
        </Section>

        <Section title="Image">
          {preview && (
            <img
              src={preview}
              alt=""
              className="w-28 h-28 object-cover rounded-xl ring-1 ring-gray-200 dark:ring-gray-700"
            />
          )}
          <input type="file" accept="image/*" onChange={onImage} className="text-sm" />
        </Section>

        <Section
          title="Attributes"
          action={
            <button
              type="button"
              onClick={() => setAttrRows((r) => [...r, { attribute: '', value: '' }])}
              className="text-sm text-brand-blue hover:underline"
            >
              + Add
            </button>
          }
        >
          {attrRows.map((row, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-2">
              <select
                value={row.attribute}
                onChange={(e) => setAttr(i, 'attribute', e.target.value)}
                className={`flex-1 ${field}`}
              >
                <option value="">Attribute</option>
                {attributes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <input
                value={row.value}
                onChange={(e) => setAttr(i, 'value', e.target.value)}
                placeholder="Value"
                className={`flex-1 ${field}`}
              />
              <button
                type="button"
                onClick={() => setAttrRows((rows) => rows.filter((_, idx) => idx !== i))}
                className="px-3 text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </Section>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update product' : 'Create product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
} 