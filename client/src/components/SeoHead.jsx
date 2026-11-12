import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

const DEFAULT_TITLE = 'TechBlog — Technology Publication, Tutorials & Insights'
const DEFAULT_DESC =
  'In-depth technical articles, developer guides, system design tutorials, and software engineering insights for modern technology teams.'
const DEFAULT_SITE_NAME = 'TechBlog'

export const SeoHead = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  keywords,
  article,
}) => {
  const pageTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_TITLE
  const metaDescription =
    description || article?.shortDescription || article?.metaDescription || DEFAULT_DESC
  const currentUrl =
    canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '')
  const image =
    ogImage ||
    article?.featuredImage ||
    (typeof window !== 'undefined' ? `${window.location.origin}/hero.png` : '')

  useEffect(() => {
    document.title = pageTitle

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: window.location.pathname,
      })
    }
  }, [pageTitle])

  // Build JSON-LD structured data for article pages
  let structuredData = null
  if (article || ogType === 'article') {
    const authorName =
      typeof article?.author === 'object' && article?.author?.name
        ? article.author.name
        : typeof article?.author === 'string'
          ? article.author
          : 'TechBlog Editorial'

    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article?.title || title || '',
      description: metaDescription,
      image: image ? [image] : [],
      datePublished:
        article?.publishAt ||
        article?.scheduledAt ||
        article?.createdAt ||
        new Date().toISOString(),
      dateModified: article?.updatedAt || article?.createdAt || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: authorName,
      },
      publisher: {
        '@type': 'Organization',
        name: DEFAULT_SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url:
            typeof window !== 'undefined'
              ? `${window.location.origin}/favicon.svg`
              : '',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl,
      },
      articleSection:
        typeof article?.category === 'object'
          ? article.category?.name
          : article?.category || 'Technology',
    }
  }

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={article ? 'article' : ogType} />
      <meta property="og:title" content={title || DEFAULT_TITLE} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || DEFAULT_TITLE} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD Schema for BlogPosting */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}

export default SeoHead
