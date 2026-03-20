import { useMemo, useState } from 'react';
import { useTemplates } from '../context/TemplateContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, LogOut, PlusCircle, Trash2, Upload } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { templates, addTemplate, removeTemplate, isLoading } = useTemplates();
  const { logout, adminPassword } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [videoPrice, setVideoPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [religion, setReligion] = useState('all');
  const [type, setType] = useState('digital');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);

  const dashboardTemplates = useMemo(
    () => templates.filter((template) => template.id !== 'demo-slider-template'),
    [templates]
  );

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const formatPrice = (value: string) => (value.startsWith('₹') ? value : `₹${value}`);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (images.length === 0) {
      setErrorMsg('Select at least one image from your device.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addTemplate({
        name,
        description,
        price: formatPrice(price),
        videoPrice: videoPrice ? formatPrice(videoPrice) : undefined,
        images,
        video,
        pdf,
        type,
        religion,
        adminPassword,
      });

      setSuccessMsg('Template uploaded and saved successfully.');
      setName('');
      setDescription('');
      setPrice('');
      setVideoPrice('');
      setImages([]);
      setVideo(null);
      setPdf(null);
      e.currentTarget.reset();
      window.setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Failed to add template.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number | string, title: string) => {
    const confirmed = window.confirm(`Delete "${title}" permanently?`);

    if (!confirmed) {
      return;
    }

    setSuccessMsg('');
    setErrorMsg('');
    setDeletingId(id);

    try {
      await removeTemplate(id, adminPassword);
      setSuccessMsg('Template deleted successfully.');
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Failed to delete template.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="admin-dashboard-page">
      <div className="container admin-dashboard-container">
        <div className="admin-dashboard-header">
          <div>
            <h1 className="admin-dashboard-title">Dashboard</h1>
            <p className="admin-dashboard-subtitle">Manage your template inventory</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary admin-logout-btn" type="button">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="card admin-card">
          <div className="admin-card-header">
            <PlusCircle size={24} color="var(--color-primary)" />
            <h2>Add New Template</h2>
          </div>

          {successMsg && (
            <div className="admin-message success">
              <CheckCircle size={20} /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="admin-message error">
              <AlertCircle size={20} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form-grid">
            <div className="admin-two-col">
              <div>
                <label className="admin-label">Template Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Emerald Invite"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Base Price (PDF) (₹)</label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 499"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Video Price (₹) (Optional)</label>
                <input
                  type="text"
                  value={videoPrice}
                  onChange={(e) => setVideoPrice(e.target.value)}
                  placeholder="e.g. 699"
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the card design, ideal use case..."
                rows={3}
                className="admin-input admin-textarea"
              />
            </div>

            <div className="admin-two-col">
              <div>
                <label className="admin-label">Ethnicity / Religion</label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="admin-input"
                >
                  <option value="all">Any</option>
                  <option value="hindu">Hindu</option>
                  <option value="muslim">Islamic</option>
                  <option value="sikh">Sikh</option>
                  <option value="christian">Christian</option>
                </select>
              </div>

              <div>
                <label className="admin-label">Format Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="admin-input"
                >
                  <option value="digital">Digital Image</option>
                  <option value="printed">Printed Card</option>
                  <option value="video">Video Animation</option>
                </select>
              </div>
            </div>

            <div className="admin-media-box">
              <p className="admin-media-title">
                <Upload size={18} /> Upload Media From Device
              </p>

              <div>
                <label className="admin-label">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  onChange={(e) => setImages(Array.from(e.target.files || []))}
                  className="admin-input admin-file-input"
                />
                <p className="admin-help-text">
                  {images.length > 0 ? `${images.length} image file(s) selected.` : 'Select one or more preview images.'}
                </p>
              </div>

              <div className="admin-two-col">
                <div>
                  <label className="admin-label">Video File (Optional)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideo(e.target.files?.[0] || null)}
                    className="admin-input admin-file-input"
                  />
                  <p className="admin-help-text">
                    {video ? video.name : 'Upload an MP4 or other supported video format.'}
                  </p>
                </div>

                <div>
                  <label className="admin-label">Sample PDF (Optional)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdf(e.target.files?.[0] || null)}
                    className="admin-input admin-file-input"
                  />
                  <p className="admin-help-text">
                    {pdf ? pdf.name : 'Upload a sample PDF for download or preview.'}
                  </p>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary admin-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading template...' : 'Add Template'}
            </button>
          </form>
        </div>

        <div className="card admin-card admin-list-card">
          <div className="admin-card-header">
            <h2>Existing Templates</h2>
          </div>

          {isLoading ? (
            <p className="admin-empty-state">Loading templates...</p>
          ) : dashboardTemplates.length === 0 ? (
            <p className="admin-empty-state">No templates available yet.</p>
          ) : (
            <div className="admin-template-list">
              {dashboardTemplates.map((template) => (
                <div key={template.id} className="admin-template-row">
                  <div className="admin-template-meta">
                    <strong>{template.name}</strong>
                    <span>{template.type} � {template.religion} � {template.price}</span>
                  </div>
                  <button
                    type="button"
                    className="admin-delete-btn"
                    onClick={() => handleDelete(template.id, template.name)}
                    disabled={deletingId === template.id}
                  >
                    <Trash2 size={16} /> {deletingId === template.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
