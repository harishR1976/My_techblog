import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import api, { uploadImage } from '../../services/api'
import {
  Save,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Video,
  Code,
  Table as TableIcon,
  Heading2,
  Heading3,
  Pilcrow,
  Bold,
  Italic,
  Quote,
  List,
  Eye,
  Edit,
  Columns,
  X,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react'

const DEFAULT_CATEGORIES = [
  'Technology',
  'Web Development',
  'Design & UI',
  'Tutorials',
  'Artificial Intelligence',
  'Productivity',
  'General',
]

const PostEditor = () => {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Main article form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugCustomized, setIsSlugCustomized] = useState(false)
  const [shortDescription, setShortDescription] = useState('')
  const [content, setContent] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [category, setCategory] = useState('')
  const [author, setAuthor] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [status, setStatus] = useState('draft')
  const [scheduledAt, setScheduledAt] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  // UI state
  const [categoriesList, setCategoriesList] = useState([])
  const [authorsList, setAuthorsList] = useState([])
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [uploadingFeatured, setUploadingFeatured] = useState(false)
  const [uploadingInline, setUploadingInline] = useState(false)
  const [error, setError] = useState('')
  const [editorViewMode, setEditorViewMode] = useState('split') // 'edit' | 'split' | 'preview'

  const contentRef = useRef(null)
  const inlineFileInputRef = useRef(null)
  const featuredFileInputRef = useRef(null)

  // Generate URL slug from title
  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-alphanumeric chars
      .replace(/[\s_-]+/g, '-') // collapse whitespace and replace by -
      .replace(/^-+|-+$/g, '') // trim - from start and end
  }

  // Handle title change and auto-generate slug unless manually customized
  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!isSlugCustomized) {
      setSlug(generateSlug(newTitle))
    }
  }

  // Force slug regeneration from current title
  const handleRegenerateSlug = () => {
    setSlug(generateSlug(title))
    setIsSlugCustomized(false)
  }

  // Load existing article if in edit mode
  useEffect(() => {
    if (!id) return

    let isMounted = true

    api
      .get(`/api/articles/${id}`)
      .then((res) => {
        if (!isMounted) return
        const article = res.data?.article || res.data

        if (article) {
          setTitle(article.title || '')
          setSlug(article.slug || '')
          setIsSlugCustomized(Boolean(article.slug))
          setShortDescription(
            article.shortDescription || article.summary || article.description || ''
          )
          setContent(article.content || '')
          setFeaturedImage(article.featuredImage || article.coverImage || '')

          const catVal =
            typeof article.category === 'object'
              ? article.category?._id || article.category?.name
              : article.category || ''
          setCategory(catVal)

          const authorVal =
            typeof article.author === 'object'
              ? article.author?._id || article.author?.name
              : article.author || ''
          setAuthor(authorVal)

          if (Array.isArray(article.tags)) {
            setTagsInput(
              article.tags
                .map((t) => (typeof t === 'object' ? t.name : t))
                .filter(Boolean)
                .join(', ')
            )
          } else if (typeof article.tags === 'string') {
            setTagsInput(article.tags)
          }

          setStatus(article.status || 'draft')

          if (article.scheduledAt || article.publishAt) {
            const dateObj = new Date(article.scheduledAt || article.publishAt)
            const localIso = new Date(
              dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16)
            setScheduledAt(localIso)
          }

          setIsFeatured(Boolean(article.isFeatured))
          setMetaTitle(article.metaTitle || article.seo?.metaTitle || '')
          setMetaDescription(
            article.metaDescription || article.seo?.metaDescription || ''
          )
        }
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to load article data.'
        )
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  // Fetch categories and authors
  useEffect(() => {
    let isMounted = true

    Promise.all([
      api.get('/api/categories').catch(() => null),
      api.get('/api/users').catch(() => null),
    ]).then(([catRes, userRes]) => {
      if (!isMounted) return

      if (catRes?.data) {
        const cats =
          catRes.data?.categories ||
          (Array.isArray(catRes.data) ? catRes.data : [])
        if (cats.length > 0) {
          setCategoriesList(cats)
          setCategory((prev) => prev || cats[0]._id || cats[0].name)
        } else {
          setCategoriesList(DEFAULT_CATEGORIES.map((name) => ({ name })))
          setCategory((prev) => prev || DEFAULT_CATEGORIES[0])
        }
      } else {
        setCategoriesList(DEFAULT_CATEGORIES.map((name) => ({ name })))
        setCategory((prev) => prev || DEFAULT_CATEGORIES[0])
      }

      if (userRes?.data) {
        const users =
          userRes.data?.users ||
          (Array.isArray(userRes.data) ? userRes.data : [])
        if (users.length > 0) {
          setAuthorsList(users)
          setAuthor((prev) => prev || users[0]._id || users[0].name)
        }
      } else if (user) {
        setAuthorsList([
          {
            name: user.name || user.email,
            _id: user.id || user._id || 'admin',
          },
        ])
        setAuthor((prev) => prev || user.name || user.email)
      }
    })

    return () => {
      isMounted = false
    }
  }, [user])

  // Quick insert snippet into content at cursor position
  const insertSnippet = (snippet, wrap = false) => {
    const textarea = contentRef.current
    if (!textarea) {
      setContent((prev) => prev + snippet)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)
    let replacement = snippet

    if (wrap && selected) {
      replacement = snippet.replace('{{selected}}', selected)
    } else {
      replacement = snippet.replace('{{selected}}', '')
    }

    const updated =
      content.substring(0, start) + replacement + content.substring(end)
    setContent(updated)

    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = start + replacement.length
      textarea.selectionEnd = start + replacement.length
    }, 0)
  }

  // Toolbar action helpers
  const handleInsertH2 = () => insertSnippet('<h2>{{selected}}Subheading</h2>', true)
  const handleInsertH3 = () => insertSnippet('<h3>{{selected}}Section Title</h3>', true)
  const handleInsertParagraph = () =>
    insertSnippet('<p>{{selected}}Write your paragraph content here.</p>\n', true)
  const handleInsertBold = () => insertSnippet('<strong>{{selected}}bold text</strong>', true)
  const handleInsertItalic = () => insertSnippet('<em>{{selected}}italic text</em>', true)
  const handleInsertQuote = () =>
    insertSnippet('<blockquote>{{selected}}Notable quote goes here.</blockquote>\n', true)
  const handleInsertList = () =>
    insertSnippet('<ul>\n  <li>First point</li>\n  <li>Second point</li>\n  <li>Third point</li>\n</ul>\n')

  const handleInsertCodeBlock = () => {
    insertSnippet(
      '<pre><code>// Write or paste code snippet here\nfunction calculate() {\n  return 42;\n}</code></pre>\n'
    )
  }

  const handleInsertTable = () => {
    const tableTemplate = `<table class="content-table">
  <thead>
    <tr>
      <th>Feature</th>
      <th>Description</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Item 1</td>
      <td>Detailed explanation 1</td>
      <td>Active</td>
    </tr>
    <tr>
      <td>Item 2</td>
      <td>Detailed explanation 2</td>
      <td>Pending</td>
    </tr>
  </tbody>
</table>\n`
    insertSnippet(tableTemplate)
  }

  const handleInsertVideo = () => {
    const url = window.prompt(
      'Enter Video URL (YouTube, Vimeo, or direct MP4 link):'
    )
    if (!url) return

    let embedHtml
    const ytMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    )
    if (ytMatch && ytMatch[1]) {
      embedHtml = `<div class="video-container"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n`
    } else {
      embedHtml = `<div class="video-container"><iframe src="${url}" title="Embedded video" frameborder="0" allowfullscreen></iframe></div>\n`
    }

    insertSnippet(embedHtml)
  }

  // Handle inline image upload to /api/upload and insert <img> into editor
  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingInline(true)
    setError('')
    try {
      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        const imageHtml = `<figure class="article-img-wrapper">\n  <img src="${imageUrl}" alt="${file.name.replace(/\.[^/.]+$/, '')}" />\n  <figcaption>Caption for ${file.name}</figcaption>\n</figure>\n`
        insertSnippet(imageHtml)
      } else {
        throw new Error('Image URL was not returned by server.')
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Inline image upload failed.')
    } finally {
      setUploadingInline(false)
      if (inlineFileInputRef.current) {
        inlineFileInputRef.current.value = ''
      }
    }
  }

  // Handle featured image upload to /api/upload
  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFeatured(true)
    setError('')
    try {
      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        setFeaturedImage(imageUrl)
      } else {
        throw new Error('Image URL was not returned by server.')
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.message ||
        'Featured image upload failed.'
      )
    } finally {
      setUploadingFeatured(false)
      if (featuredFileInputRef.current) {
        featuredFileInputRef.current.value = ''
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Article title is required.')
      return
    }

    if (!slug.trim()) {
      setError('Article slug is required.')
      return
    }

    if (status === 'scheduled' && !scheduledAt) {
      setError('Please specify a scheduled publication date and time.')
      return
    }

    setSaving(true)

    // Parse comma-separated tags into array
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      shortDescription: shortDescription.trim(),
      summary: shortDescription.trim(), // alias for compatibility
      content,
      featuredImage,
      category,
      author: author || user?.name || user?.email || 'Admin',
      tags: parsedTags,
      status,
      scheduledAt: status === 'scheduled' ? new Date(scheduledAt).toISOString() : null,
      publishAt: status === 'scheduled' ? new Date(scheduledAt).toISOString() : null, // alias
      isFeatured,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || shortDescription.trim(),
    }

    try {
      if (isEditMode) {
        await api.put(`/api/articles/${id}`, payload)
      } else {
        await api.post('/api/articles', payload)
      }

      navigate('/admin/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to save article. Please check all fields and try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="editor-loading-state">
        <Loader2 size={36} className="spin-icon" />
        <p>Loading article details...</p>
      </div>
    )
  }

  return (
    <div className="editor-page-container">
      {/* Top Header */}
      <div className="editor-topbar">
        <div className="editor-topbar-left">
          <Link to="/admin/dashboard" className="btn btn-secondary btn-icon-only" title="Back to Dashboard">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="editor-title">
              {isEditMode ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="editor-subtitle">
              {isEditMode ? `Updating ID: ${id}` : 'Draft and publish high quality content'}
            </p>
          </div>
        </div>

        <div className="editor-topbar-right">
          <Link to="/admin/dashboard" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEditMode ? 'Update Article' : 'Save & Publish'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-box alert-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main 2-Column Editor Layout */}
      <form onSubmit={handleSubmit} className="editor-grid">
        {/* Left Column: Title, Slug, Rich Editor, Content */}
        <div className="editor-main-col">
          {/* Title */}
          <div className="form-card">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Article Title <span className="required-star">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="form-input form-input-lg"
                placeholder="Enter an engaging article headline..."
                value={title}
                onChange={handleTitleChange}
                required
              />
            </div>

            {/* Slug */}
            <div className="form-group">
              <div className="label-with-action">
                <label htmlFor="slug" className="form-label">
                  URL Slug <span className="required-star">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateSlug}
                  className="btn-text-action"
                  title="Regenerate slug from title"
                >
                  <Sparkles size={14} />
                  <span>Regenerate from Title</span>
                </button>
              </div>
              <div className="slug-input-wrapper">
                <span className="slug-prefix">/articles/</span>
                <input
                  id="slug"
                  type="text"
                  className="form-input slug-field"
                  placeholder="article-headline-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setIsSlugCustomized(true)
                  }}
                  required
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="form-group">
              <label htmlFor="shortDescription" className="form-label">
                Short Description / Excerpt
              </label>
              <textarea
                id="shortDescription"
                className="form-textarea"
                rows={3}
                placeholder="Brief summary to display in article cards and previews (1-2 sentences)..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Rich HTML Content Editor Card */}
          <div className="form-card editor-content-card">
            <div className="editor-card-header">
              <div className="editor-toolbar-title">
                <label className="form-label">Rich HTML Content</label>
              </div>

              {/* View Mode Toggle: Edit / Split / Preview */}
              <div className="editor-view-tabs">
                <button
                  type="button"
                  onClick={() => setEditorViewMode('edit')}
                  className={`view-tab-btn ${editorViewMode === 'edit' ? 'active' : ''}`}
                  title="Editor Only"
                >
                  <Edit size={14} />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorViewMode('split')}
                  className={`view-tab-btn ${editorViewMode === 'split' ? 'active' : ''}`}
                  title="Side-by-side Live Preview"
                >
                  <Columns size={14} />
                  <span>Split</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorViewMode('preview')}
                  className={`view-tab-btn ${editorViewMode === 'preview' ? 'active' : ''}`}
                  title="Full Preview"
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Rich Editor Quick-Insert Toolbar */}
            <div className="editor-toolbar">
              <div className="toolbar-btn-group">
                <button
                  type="button"
                  onClick={handleInsertH2}
                  className="toolbar-btn"
                  title="Heading 2 (<h2>)"
                >
                  <Heading2 size={16} />
                  <span>H2</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertH3}
                  className="toolbar-btn"
                  title="Heading 3 (<h3>)"
                >
                  <Heading3 size={16} />
                  <span>H3</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertParagraph}
                  className="toolbar-btn"
                  title="Paragraph (<p>)"
                >
                  <Pilcrow size={16} />
                  <span>P</span>
                </button>
              </div>

              <div className="toolbar-divider" />

              <div className="toolbar-btn-group">
                <button
                  type="button"
                  onClick={handleInsertBold}
                  className="toolbar-btn"
                  title="Bold (<strong>)"
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleInsertItalic}
                  className="toolbar-btn"
                  title="Italic (<em>)"
                >
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleInsertQuote}
                  className="toolbar-btn"
                  title="Blockquote (<blockquote>)"
                >
                  <Quote size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleInsertList}
                  className="toolbar-btn"
                  title="Bullet List (<ul>)"
                >
                  <List size={16} />
                </button>
              </div>

              <div className="toolbar-divider" />

              <div className="toolbar-btn-group">
                <button
                  type="button"
                  onClick={handleInsertCodeBlock}
                  className="toolbar-btn"
                  title="Code Block (<pre><code>)"
                >
                  <Code size={16} />
                  <span>Code</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertTable}
                  className="toolbar-btn"
                  title="Table (<table>)"
                >
                  <TableIcon size={16} />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertVideo}
                  className="toolbar-btn"
                  title="Video Embed (YouTube / Vimeo)"
                >
                  <Video size={16} />
                  <span>Video</span>
                </button>
              </div>

              <div className="toolbar-divider" />

              {/* Inline Image Upload Button */}
              <div className="toolbar-btn-group">
                <button
                  type="button"
                  onClick={() => inlineFileInputRef.current?.click()}
                  className="toolbar-btn btn-upload-inline"
                  disabled={uploadingInline}
                  title="Upload inline image to /api/upload and insert"
                >
                  {uploadingInline ? (
                    <Loader2 size={16} className="spin-icon" />
                  ) : (
                    <ImageIcon size={16} />
                  )}
                  <span>{uploadingInline ? 'Uploading...' : 'Insert Image'}</span>
                </button>
                <input
                  type="file"
                  ref={inlineFileInputRef}
                  onChange={handleInlineImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Split / Editor / Preview Workspace */}
            <div className={`editor-workspace mode-${editorViewMode}`}>
              {editorViewMode !== 'preview' && (
                <div className="editor-pane">
                  <textarea
                    ref={contentRef}
                    className="html-textarea"
                    placeholder="Write your article in HTML or use the quick toolbar above..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                  />
                </div>
              )}

              {editorViewMode !== 'edit' && (
                <div className="preview-pane">
                  <div className="preview-header">
                    <span>Live Rendered Preview</span>
                  </div>
                  <div
                    className="preview-content article-rendered-html"
                    dangerouslySetInnerHTML={{
                      __html: content || '<p class="placeholder-text">Live HTML preview will appear here...</p>',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="form-card">
            <h2 className="card-section-title">Search Engine Optimization (SEO)</h2>
            <p className="card-section-desc">
              Optimize how this post appears in Google search and social media shares.
            </p>

            <div className="form-group">
              <div className="label-with-action">
                <label htmlFor="metaTitle" className="form-label">
                  SEO Meta Title
                </label>
                <span className={`char-counter ${metaTitle.length > 60 ? 'counter-warning' : ''}`}>
                  {metaTitle.length} / 60 chars
                </span>
              </div>
              <input
                id="metaTitle"
                type="text"
                className="form-input"
                placeholder={title || 'Primary title tag for search engines'}
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="label-with-action">
                <label htmlFor="metaDescription" className="form-label">
                  SEO Meta Description
                </label>
                <span className={`char-counter ${metaDescription.length > 160 ? 'counter-warning' : ''}`}>
                  {metaDescription.length} / 160 chars
                </span>
              </div>
              <textarea
                id="metaDescription"
                className="form-textarea"
                rows={3}
                placeholder={shortDescription || 'Search snippet summary (150-160 characters recommended)'}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Publishing Settings, Image, Categories, Author, Tags */}
        <div className="editor-sidebar-col">
          {/* Publication Card */}
          <div className="form-card sidebar-card">
            <h3 className="sidebar-card-title">Publishing Settings</h3>

            {/* Status Selector */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>

            {/* Scheduled Datetime-Local Picker (Displayed when status is scheduled) */}
            {status === 'scheduled' && (
              <div className="form-group scheduled-picker-group">
                <label htmlFor="scheduledAt" className="form-label">
                  Schedule Date & Time <span className="required-star">*</span>
                </label>
                <input
                  id="scheduledAt"
                  type="datetime-local"
                  className="form-input"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required={status === 'scheduled'}
                />
                <small className="help-text">
                  The article will automatically go live at this time.
                </small>
              </div>
            )}

            {/* Featured Checkbox */}
            <div className="form-checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <span className="checkbox-text">Feature this article</span>
              </label>
              <small className="help-text">
                Highlights this post on the homepage and featured banners.
              </small>
            </div>

            <div className="sidebar-actions">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEditMode ? 'Update Article' : 'Save Article'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="form-card sidebar-card">
            <h3 className="sidebar-card-title">Featured Image</h3>
            <p className="card-section-desc">
              Primary cover image for cards and social share previews.
            </p>

            {featuredImage ? (
              <div className="featured-image-preview">
                <img src={featuredImage} alt="Featured Preview" />
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  className="remove-image-btn"
                  title="Remove Featured Image"
                >
                  <X size={14} />
                  <span>Remove</span>
                </button>
              </div>
            ) : (
              <div
                className="image-upload-dropzone"
                onClick={() => featuredFileInputRef.current?.click()}
              >
                {uploadingFeatured ? (
                  <div className="upload-indicator">
                    <Loader2 size={24} className="spin-icon" />
                    <span>Uploading image to /api/upload...</span>
                  </div>
                ) : (
                  <>
                    <Upload size={28} className="upload-icon" />
                    <span className="upload-prompt">Click to upload cover image</span>
                    <span className="upload-formats">PNG, JPG, WebP up to 5MB</span>
                  </>
                )}
              </div>
            )}

            <input
              type="file"
              ref={featuredFileInputRef}
              onChange={handleFeaturedImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Fallback direct image URL input */}
            <div className="form-group" style={{ marginTop: '12px' }}>
              <label htmlFor="featuredImageUrl" className="form-label-sm">
                Or Image URL
              </label>
              <input
                id="featuredImageUrl"
                type="url"
                className="form-input form-input-sm"
                placeholder="https://example.com/cover.jpg"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
              />
            </div>
          </div>

          {/* Category & Author Card */}
          <div className="form-card sidebar-card">
            <h3 className="sidebar-card-title">Taxonomy & Attribution</h3>

            {/* Category Dropdown */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoriesList.map((cat) => {
                  const catId = cat._id || cat.name
                  const catName = cat.name || cat.title || catId
                  return (
                    <option key={catId} value={catId}>
                      {catName}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Author Dropdown */}
            <div className="form-group">
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <select
                id="author"
                className="form-select"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              >
                {authorsList.length > 0 ? (
                  authorsList.map((auth) => {
                    const authId = auth._id || auth.name || auth.email
                    const authName = auth.name || auth.email || authId
                    return (
                      <option key={authId} value={authId}>
                        {authName}
                      </option>
                    )
                  })
                ) : (
                  <option value={user?.name || user?.email || 'Admin'}>
                    {user?.name || user?.email || 'Admin'}
                  </option>
                )}
              </select>
            </div>

            {/* Comma-Separated Tags */}
            <div className="form-group">
              <label htmlFor="tags" className="form-label">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                className="form-input"
                placeholder="react, web development, css, design"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
              {tagsInput.trim() && (
                <div className="tags-preview-cloud">
                  {tagsInput
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag, idx) => (
                      <span key={idx} className="tag-pill">
                        #{tag}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PostEditor
