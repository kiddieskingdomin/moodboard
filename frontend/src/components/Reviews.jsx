function Reviews({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Customer Reviews</h2>
      <div className="flex flex-col gap-4">
        {reviews.map((r, i) => (
          <div key={i} className="border-b border-slate-200 pb-4 last:border-b-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-800">{r.user}</span>
              <Stars value={r.rating} />
            </div>
            <p className="mt-2 text-slate-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
