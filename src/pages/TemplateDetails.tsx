import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  PlayCircle,
  Upload,
  X,
} from 'lucide-react';
import { useTemplates, type Template } from '../context/TemplateContext';
import './TemplateDetails.css';

type MediaTab = 'gallery' | 'video' | 'pdf';
type PopupMedia = 'video' | 'pdf' | null;
type PackageType = 'pdf' | 'video';

const adminWhatsappNumber = (import.meta.env.VITE_ADMIN_WHATSAPP_NUMBER || '').replace(/\D/g, '');
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';


const parsePriceValue = (value: string) => {
  const numeric = Number(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatCurrency = (amount: number, fallback: string) => {
  if (!amount) {
    return fallback;
  }

  return `Rs ${amount}`;
};

const TemplateDetailsContent = ({ template }: { template: Template }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<MediaTab>('gallery');
  const [popupMedia, setPopupMedia] = useState<PopupMedia>(null);
  const [isCustomiseOpen, setIsCustomiseOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(template.videoPrice ? 'video' : 'pdf');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ceremonies, setCeremonies] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [instructions, setInstructions] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [referencePhotos, setReferencePhotos] = useState<File[]>([]);
  const [customiseError, setCustomiseError] = useState('');
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const availableTabs = useMemo<MediaTab[]>(() => {
    const tabs: MediaTab[] = ['gallery'];

    if (template.videoUrl) {
      tabs.push('video');
    }

    if (template.pdfUrl) {
      tabs.push('pdf');
    }

    return tabs;
  }, [template.pdfUrl, template.videoUrl]);

  const currentActiveTab = availableTabs.includes(activeTab) ? activeTab : 'gallery';
  const hasImages = template.images && template.images.length > 0;
  const isSingleImage = template.images.length === 1;
  const pdfPreviewUrl = template.pdfUrl ? `${API_BASE_URL}${template.pdfUrl}` : null;

  const selectedPrice = selectedPackage === 'video' ? template.videoPrice || template.price : template.price;
  const unitPrice = parsePriceValue(selectedPrice);
  const totalAmount = unitPrice * quantity;
  const totalPrice = formatCurrency(totalAmount, selectedPrice);
  const supportUrl = adminWhatsappNumber
    ? `https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(`Hi, I need help with the template "${template.name}".`)}`
    : undefined;

  useEffect(() => {
    if (currentActiveTab !== 'gallery' || isSingleImage) {
      return;
    }

    slideRefs.current[currentImageIndex]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [currentActiveTab, currentImageIndex, isSingleImage]);

  useEffect(() => {
    if (!popupMedia && !isCustomiseOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [popupMedia, isCustomiseOpen]);

  const showPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? template.images.length - 1 : prev - 1));
  };

  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev === template.images.length - 1 ? 0 : prev + 1));
  };

  const openPopup = (media: Exclude<PopupMedia, null>) => {
    setActiveTab(media);
    setPopupMedia(media);
  };

  const closePopup = () => {
    setPopupMedia(null);
  };

  const openSupport = () => {
    if (!supportUrl) {
      setCustomiseError('Set VITE_ADMIN_WHATSAPP_NUMBER in .env to enable WhatsApp.');
      return;
    }

    window.open(supportUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCustomiseSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!adminWhatsappNumber) {
      setCustomiseError('Set VITE_ADMIN_WHATSAPP_NUMBER in .env to enable WhatsApp orders.');
      return;
    }

    if (!customerName.trim() || !phone.trim() || !groomName.trim() || !brideName.trim()) {
      setCustomiseError('Please fill customer name, phone number, groom name, and bride name.');
      return;
    }

    if (quantity < 1) {
      setCustomiseError('Quantity must be at least 1.');
      return;
    }

    const referencePhotoNames = referencePhotos.map((file) => file.name);
    const messageLines = [
      'New Wedding Card Enquiry',
      '',
      `Template: ${template.name}`,
      `Selected Package: ${selectedPackage.toUpperCase()}`,
      `Unit Price: ${selectedPrice}`,
      `Quantity: ${quantity}`,
      `Total Price: ${totalPrice}`,
      '',
      'Customer Details',
      `Name: ${customerName.trim()}`,
      `Phone: ${phone.trim()}`,
      `Email: ${email.trim() || 'Not provided'}`,
      '',
      'Card Content Details',
      `Groom Name: ${groomName.trim()}`,
      `Bride Name: ${brideName.trim()}`,
      `Event Date: ${eventDate || 'Not provided'}`,
      `Functions / Ceremonies: ${ceremonies.trim() || 'Not provided'}`,
      `Venue: ${venue.trim() || 'Not provided'}`,
      `City: ${city.trim() || 'Not provided'}`,
      `Card Instructions: ${instructions.trim() || 'Not provided'}`,
      `Additional Instructions: ${additionalInstructions.trim() || 'Not provided'}`,
      `Reference Photos: ${referencePhotoNames.length > 0 ? `${referencePhotoNames.length} selected (${referencePhotoNames.join(', ')})` : 'None attached in browser form'}`,
    ];

    const whatsappUrl = `https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`;

    setCustomiseError('');
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <main className="template-details-page">
        <div className="container">
          <Link to="/templates" className="back-link">
            <ArrowLeft size={20} /> Back to Templates
          </Link>

          <div className="template-details-grid">
            <div className="template-showcase-panel">
              <div className="template-visual-container">
                <div className="media-tabs">
                  <button
                    className={`media-tab ${currentActiveTab === 'gallery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gallery')}
                    type="button"
                  >
                    <ImageIcon size={16} /> Photos
                  </button>
                  {template.videoUrl && (
                    <button
                      className={`media-tab ${currentActiveTab === 'video' ? 'active' : ''}`}
                      onClick={() => openPopup('video')}
                      type="button"
                    >
                      <PlayCircle size={16} /> Video
                    </button>
                  )}
                  {template.pdfUrl && (
                    <button
                      className={`media-tab ${currentActiveTab === 'pdf' ? 'active' : ''}`}
                      onClick={() => openPopup('pdf')}
                      type="button"
                    >
                      <FileText size={16} /> PDF
                    </button>
                  )}
                </div>

                <div className="media-stage">
                  {hasImages ? (
                    <div className={`gallery-stage compact-gallery-stage ${isSingleImage ? 'single-gallery-mode' : ''}`}>
                      {isSingleImage ? (
                        <div className="single-gallery-frame">
                          <img
                            src={template.images[0]}
                            alt={`${template.name} preview`}
                            className="template-main-image template-single-image"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="gallery-preview-shell compact-gallery-shell">
                            <div className="gallery-preview-strip compact-gallery-strip">
                              {template.images.map((image, index) => (
                                <button
                                  key={`${image}-${index}`}
                                  ref={(element) => {
                                    slideRefs.current[index] = element;
                                  }}
                                  type="button"
                                  className={`gallery-preview-card compact-gallery-card ${index === currentImageIndex ? 'active' : ''}`}
                                  onClick={() => setCurrentImageIndex(index)}
                                >
                                  <img
                                    src={image}
                                    alt={`${template.name} preview ${index + 1}`}
                                    className="template-main-image"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <button className="gallery-nav-btn prev compact-gallery-nav" onClick={showPreviousImage} type="button" aria-label="Previous image">
                            <ChevronLeft size={20} />
                          </button>
                          <button className="gallery-nav-btn next compact-gallery-nav" onClick={showNextImage} type="button" aria-label="Next image">
                            <ChevronRight size={20} />
                          </button>
                          <div className="gallery-dots compact-gallery-dots">
                            {template.images.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                className={`gallery-dot ${index === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="empty-media-state">
                      <ImageIcon size={28} />
                      <span>No images uploaded for this template yet.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="template-info-panel">
              <div className="template-card-section template-primary-section">
                <div className="template-meta mb-4">
                  <span className="template-badge-large">{template.religion.charAt(0).toUpperCase() + template.religion.slice(1)}</span>
                  <span className="template-type-large">{template.type}</span>
                </div>

                <h1 className="template-title">{template.name}</h1>
                <p className="template-description">{template.description || 'Premium designer invitation with editable details and polished media delivery.'}</p>

                <div className="template-price-table">
                  <div className="pricing-row border-bottom">
                    <span className="format-label">PDF</span>
                    <span className="price-value">{template.price}</span>
                    <button
                      type="button"
                      className="action-link action-link-button"
                      onClick={() => openPopup('pdf')}
                      disabled={!template.pdfUrl}
                    >
                      {template.pdfUrl ? 'Open PDF' : 'No PDF'}
                    </button>
                  </div>

                  <div className="pricing-row border-bottom" style={{ marginBottom: '1.5rem' }}>
                    <span className="format-label">Video</span>
                    <span className="price-value">{template.videoPrice || template.price}</span>
                    <button
                      type="button"
                      className="action-link action-link-button"
                      onClick={() => openPopup('video')}
                      disabled={!template.videoUrl}
                    >
                      {template.videoUrl ? 'Play Video' : 'No Video'}
                    </button>
                  </div>

                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Browse portrait previews in a slider, and open video or PDF in focused popups without leaving the page.
                  </p>
                </div>

                <button className="btn btn-primary customise-btn" type="button" onClick={() => setIsCustomiseOpen(true)}>
                  Customise This Card
                </button>

                <button className="whatsapp-support-btn" type="button" onClick={openSupport}>
                  <MessageCircle size={20} fill="white" /> Invitation Support? WhatsApp
                </button>

                {customiseError && (
                  <p className="template-inline-error">{customiseError}</p>
                )}

                <p style={{ textAlign: 'center', margin: '1rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Offer ends at midnight. Free revisions included.
                </p>
              </div>

              <div className="template-secondary-grid">
                <div className="template-card-section template-secondary-section">
                  <h3 className="section-heading">Your Card Your Way</h3>
                  <ul className="feature-list">
                    <li><CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} /> Personalize names, dates, ceremonies, venue, and instructions</li>
                    <li><CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} /> Add more than one couple or family reference photo in the customise form</li>
                    <li><CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} /> Open video and PDF in the same page with focused popups</li>
                    <li><CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} /> Draft the full order directly into WhatsApp for the admin</li>
                  </ul>
                </div>

                <div className="template-card-section template-secondary-section">
                  <h3 className="section-heading">What You Get</h3>
                  <ul className="feature-list">
                    <li><CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} /> Share your invitation instantly on WhatsApp, Email, or SMS</li>
                    <li><CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} /> A beautiful video invitation with music</li>
                    <li><CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} /> A digital PDF invitation ready for review and quick sharing</li>
                    <li><CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} /> Smooth image gallery slider for all uploaded previews</li>
                    <li><CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} /> 3 free revisions to make sure everything feels perfect</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {popupMedia && (
        <div className="media-modal-overlay" role="dialog" aria-modal="true" onClick={closePopup}>
          <div className={`media-modal-card ${popupMedia === 'video' ? 'video-modal-card' : ''}`} onClick={(event) => event.stopPropagation()}>
            <div className="media-modal-header">
              <div>
                <p className="media-modal-label">{popupMedia === 'video' ? 'Video Preview' : 'PDF Preview'}</p>
                <h2>{template.name}</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={closePopup} aria-label="Close preview">
                <X size={18} />
              </button>
            </div>

            <div className="media-modal-body">
              {popupMedia === 'video' && template.videoUrl && (
                <div className="modal-video-shell">
                  <video controls autoPlay playsInline preload="metadata" className="template-video-player modal-media-player portrait-video-player" poster={template.images?.[0]}>
                    <source src={template.videoUrl} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {popupMedia === 'pdf' && template.pdfUrl && (
                <div className="modal-pdf-shell">
                  <object
                    data={pdfPreviewUrl || undefined}
                    type="application/pdf"
                    className="template-pdf-frame modal-pdf-frame"
                    aria-label={`${template.name} sample PDF popup`}
                  >
                    <div className="pdf-fallback-card">
                      <FileText size={28} />
                      <p>This browser could not render the PDF preview inline.</p>
                      <a href={pdfPreviewUrl || undefined} target="_blank" rel="noreferrer" className="btn btn-primary">
                        Open PDF In New Tab
                      </a>
                    </div>
                  </object>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isCustomiseOpen && (
        <div className="media-modal-overlay" role="dialog" aria-modal="true" onClick={() => setIsCustomiseOpen(false)}>
          <div className="customise-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="media-modal-header">
              <div>
                <p className="media-modal-label">Customise Card</p>
                <h2>{template.name}</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsCustomiseOpen(false)} aria-label="Close customise form">
                <X size={18} />
              </button>
            </div>

            <form className="customise-form" onSubmit={handleCustomiseSubmit}>
              <div className="package-selector">
                <button
                  type="button"
                  className={`package-option ${selectedPackage === 'pdf' ? 'active' : ''}`}
                  onClick={() => setSelectedPackage('pdf')}
                >
                  PDF Package
                  <span>{template.price}</span>
                </button>
                <button
                  type="button"
                  className={`package-option ${selectedPackage === 'video' ? 'active' : ''}`}
                  onClick={() => setSelectedPackage('video')}
                  disabled={!template.videoPrice && !template.videoUrl}
                >
                  Video Package
                  <span>{template.videoPrice || template.price}</span>
                </button>
              </div>

              <div className="customise-grid">
                <label>
                  <span>Your Name</span>
                  <input type="text" value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
                </label>
                <label>
                  <span>Phone Number</span>
                  <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
                <label>
                  <span>Event Date</span>
                  <input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} />
                </label>
                <label>
                  <span>Groom Name</span>
                  <input type="text" value={groomName} onChange={(event) => setGroomName(event.target.value)} required />
                </label>
                <label>
                  <span>Bride Name</span>
                  <input type="text" value={brideName} onChange={(event) => setBrideName(event.target.value)} required />
                </label>
                <label>
                  <span>Quantity</span>
                  <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} required />
                </label>
                <label>
                  <span>City</span>
                  <input type="text" value={city} onChange={(event) => setCity(event.target.value)} />
                </label>
                <label>
                  <span>Ceremonies / Functions</span>
                  <input type="text" value={ceremonies} onChange={(event) => setCeremonies(event.target.value)} placeholder="Haldi, Mehendi, Nikah, Reception" />
                </label>
              </div>

              <label>
                <span>Venue / Address</span>
                <textarea value={venue} onChange={(event) => setVenue(event.target.value)} rows={2} placeholder="Full venue details to print on the card" />
              </label>

              <label>
                <span>Card Instructions</span>
                <textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows={4} placeholder="Spellings, custom wording, family members, time format, RSVP details, etc." />
              </label>

              <label>
                <span>Additional Instructions</span>
                <textarea value={additionalInstructions} onChange={(event) => setAdditionalInstructions(event.target.value)} rows={3} placeholder="Any extra notes for the admin or designer" />
              </label>

              <label className="photo-upload-field">
                <span>Reference Photos</span>
                <div className="photo-upload-box">
                  <Upload size={18} />
                  <strong>Add one or more photos</strong>
                  <small>These file names will be included in the WhatsApp draft. Direct file auto-send is not supported by WhatsApp web links.</small>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setReferencePhotos(Array.from(event.target.files || []))}
                />
              </label>

              {referencePhotos.length > 0 && (
                <div className="selected-file-list">
                  {referencePhotos.map((file) => (
                    <span key={`${file.name}-${file.lastModified}`} className="selected-file-chip">{file.name}</span>
                  ))}
                </div>
              )}

              <div className="customise-summary">
                <div>
                  <span>Template</span>
                  <strong>{template.name}</strong>
                </div>
                <div>
                  <span>Selected Package</span>
                  <strong>{selectedPackage === 'video' ? 'Video' : 'PDF'}</strong>
                </div>
                <div>
                  <span>Unit Price</span>
                  <strong>{selectedPrice}</strong>
                </div>
                <div>
                  <span>Quantity</span>
                  <strong>{quantity}</strong>
                </div>
                <div>
                  <span>Total Price</span>
                  <strong>{totalPrice}</strong>
                </div>
              </div>

              {customiseError && <p className="template-inline-error form-error">{customiseError}</p>}

              <button type="submit" className="btn btn-primary customise-submit-btn">
                Send Details On WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const TemplateDetails = () => {
  const { id } = useParams();
  const { templates } = useTemplates();
  const template = templates.find((entry) => entry.id.toString() === id);

  if (!template) {
    return (
      <main className="template-details-page pt-32 pb-20 bg-[var(--color-background)]" style={{ minHeight: '100vh' }}>
        <div className="container text-center">
          <h1 className="text-3xl text-[var(--color-secondary)] mb-4">Template Not Found</h1>
          <Link to="/templates" className="btn btn-primary">Back to Templates</Link>
        </div>
      </main>
    );
  }

  return <TemplateDetailsContent key={template.id.toString()} template={template} />;
};

export default TemplateDetails;







