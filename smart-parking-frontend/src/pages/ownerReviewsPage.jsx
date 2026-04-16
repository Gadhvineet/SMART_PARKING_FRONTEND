import React, { useEffect, useState } from "react";
import { getOwnerReviews } from "../services/ownerServices";

function OwnerReviewsPage() {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCH REVIEWS
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOwnerReviews();
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // RENDER STAR RATING (supports half-star ratings)
  const renderStars = (rating) => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fillLevel =
            rating >= starIndex + 1
              ? "full"
              : rating >= starIndex + 0.5
              ? "half"
              : "empty";

          return (
            <div
              key={starIndex}
              style={{
                position: "relative",
                width: "24px",
                height: "24px",
                fontSize: "22px",
                lineHeight: "24px",
              }}
            >
              {/* Empty star background */}
              <span style={{
                position: "absolute",
                top: 0,
                left: 0,
                color: "#e2e8f0",
              }}>
                ★
              </span>
              {/* Filled portion */}
              <span style={{
                position: "absolute",
                top: 0,
                left: 0,
                overflow: "hidden",
                width: fillLevel === "full" ? "100%" : fillLevel === "half" ? "50%" : "0%",
                color: "#f59e0b",
              }}>
                ★
              </span>
            </div>
          );
        })}
        <span style={{
          marginLeft: "8px",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          color: "white",
          fontWeight: 800,
          fontSize: "12px",
          padding: "2px 10px",
          borderRadius: "12px",
        }}>
          {Number(rating).toFixed(1)}/5
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <div className="max-w-6xl mx-auto p-6 md:p-12">

        <header className="mb-10">
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">
            Customer Reviews
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
            Reviews from users about your parking lots
          </p>
        </header>

        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center">
            <p className="text-slate-600">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-8 rounded-3xl border border-red-200">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchReviews}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
            <p className="text-slate-500 text-lg">
              No reviews yet. Keep improving your parking lot! 🚗
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      {review.user?.name || "Anonymous User"}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {review.parkingLot?.name || "Parking Lot"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* RATING */}
                <div className="mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* COMMENT */}
                {review.comment && (
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-700 leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* SUMMARY STATS */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-200 mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-blue-600 text-xs font-black uppercase tracking-widest">
                    Total Reviews
                  </p>
                  <p className="text-3xl font-[1000] text-blue-900 mt-2">
                    {reviews.length}
                  </p>
                </div>

                <div>
                  <p className="text-blue-600 text-xs font-black uppercase tracking-widest">
                    Avg Rating
                  </p>
                  <p className="text-3xl font-[1000] text-blue-900 mt-2">
                    {(
                      reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)}
                  </p>
                </div>

                <div>
                  <p className="text-blue-600 text-xs font-black uppercase tracking-widest">
                    5 Star
                  </p>
                  <p className="text-3xl font-[1000] text-blue-900 mt-2">
                    {reviews.filter((r) => r.rating === 5).length}
                  </p>
                </div>

                <div>
                  <p className="text-blue-600 text-xs font-black uppercase tracking-widest">
                    Satisfaction Rate
                  </p>
                  <p className="text-3xl font-[1000] text-blue-900 mt-2">
                    {Math.round(
                      (reviews.filter((r) => r.rating >= 4).length /
                        reviews.length) *
                        100
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default OwnerReviewsPage;
