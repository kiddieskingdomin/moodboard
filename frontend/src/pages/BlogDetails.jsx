import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Changed to async version// Import the entire module
import postsData from '../data/blog.json';
import CTAWithPopup from './BlogCtaPopup';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = postsData.posts.find((p) => p.slug === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

 console.log('Post meta:', post.meta);
  console.log('Post excerpt:', post.excerpt);

  const metaTitle = post.meta?.metaTitle || `${post.title} - Kiddies Kingdom`;
  const metaDescription = post.meta?.metaDescription || post.excerpt || 'Default description';
  const canonicalUrl = post.meta?.canonicalUrl || `https://localhost:5173/blog/${post.slug}`;
  const ogImage = post.meta?.ogImage || post.coverImage;

  return (
    <main className="bg-white text-slate-900">
      <Helmet>
        {/* Meta Title */}
        <title>{metaTitle}</title>

        {/* Meta Description */}
        <meta name="description" content={metaDescription} />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      {/* Blog Post Content */}
      <article className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] text-slate-500">
            {post.author?.toUpperCase() || 'KIDDIES KINGDOM'}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            {post.readingTime && (
              <span>· {post.readingTime} min read</span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags?.map((t) => (
              <span
                key={t}
                className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="mb-8 w-full rounded-xl object-cover"
          />
        )}

        {/* Blog Content */}
        <div
          className="
            max-w-none space-y-6 leading-relaxed text-slate-800
            [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-medium
            [&_h3]:mt-8 [&_h3]:font-semibold
            [&_p]:mt-4
            [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6
            [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6
            [&_li]:mt-2
            [&_em]:italic
            [&_strong]:font-semibold
            /* tables */
            [&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse
            [&_th]:bg-slate-50 [&_th]:text-left [&_th]:font-semibold
            [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2
            [&_td]:align-top [&_tr]:border-b [&_tr]:border-slate-200
            /* images */
            [&_img]:my-6 [&_img]:rounded-xl [&_img]:w-full
          "
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
      <CTAWithPopup/>
    </main>
  );
}
