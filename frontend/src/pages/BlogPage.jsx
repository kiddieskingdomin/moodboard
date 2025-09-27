import { Link } from 'react-router-dom';
import postsData from '../data/blog.json'; // Import JSON as a default import

export default function BlogPage() {
  const posts = postsData.posts; // Access the posts data

  return (
    <main className="bg-white text-slate-900">
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <h1 className="font-serif text-4xl font-semibold">Blog</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Insights on strategy, growth, and performance marketing.
          </p>

          <div className="mt-10 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {post.coverImage ? (
                  <div className="overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <div className="mt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    {post.readingTime ? (
                      <span>· {post.readingTime} min read</span>
                    ) : null}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-slate-600">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
