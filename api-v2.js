// force vercel redeploy// GoNoGo SA - API Client (LIVE + STATIC HYBRID)
var SUPABASE_URL = "https://kkpbzttwljxvyjbvggqr.supabase.co";
var SUPABASE_ANON_KEY = "sb_publishable_y5JnEvpF37HMKB2rcWbrog_6Oe0KYJW";

var GoNoGoAPI = (function () {
    'use strict';

    // ---- Supabase setup ----
    var SUPABASE_URL = "https://kkpbzttwljxvyjbvggqr.supabase.co";
    var SUPABASE_ANON_KEY = "sb_publishable_y5JnEvpF37HMKB2rcWbrog_6Oe";

    var supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- INTERNAL HELPERS ------------------------------------------------------

    function post(action, data) {
        if (action === "submitReview") {
            return supabaseClient
                .from("reviews")
                .insert([
                    {
                        brand_id: data.brandId || null,
                        brand_name: data.brandName,
                        category: data.category || null,
                        reviewer_name: data.reviewerName,
                        review_text: data.reviewText,
                        verdict: data.verdict || null
                    }
                ])
                .then(function (result) {
                    if (result.error) {
                        throw result.error;
                    }
                    var inserted = result.data && result.data[0];
                    return { ok: true, review: inserted };
                });
        }

        // For now, other actions are not implemented
        return Promise.reject(new Error("Unknown action"));
    }

    function get(action) {
        // Not used right now; left here so the rest of the API shape stays intact.
        return Promise.reject(new Error("GET actions not implemented with Supabase yet"));
    }

    // --- PUBLIC API ------------------------------------------------------------

    return {

        // Enable live backend
        isLive: function () {
            return true;
        },

        // ---------------- BRAND DATA (STATIC) ----------------

        getCategoriesWithBrands: function () {
            return new Promise(function (resolve, reject) {
                try {
                    var fn = window.getCategoriesWithBrands;
                    if (typeof fn !== "function") return reject(new Error("getCategoriesWithBrands not available"));
                    resolve(fn());
                } catch (e) { reject(e); }
            });
        },

        getCategories: function () {
            return this.getCategoriesWithBrands();
        },

        getTopBrands: function (count) {
            return new Promise(function (resolve, reject) {
                try {
                    var fn = window.getTopBrands;
                    if (typeof fn !== "function") return reject(new Error("getTopBrands not available"));
                    resolve(fn(count || 6));
                } catch (e) { reject(e); }
            });
        },

        getAllBrands: function () {
            return new Promise(function (resolve, reject) {
                try {
                    var fn = window.getAllBrands;
                    if (typeof fn !== "function") return reject(new Error("getAllBrands not available"));
                    resolve(fn());
                } catch (e) { reject(e); }
            });
        },

        getBrandsByCategory: function (slug) {
            return new Promise(function (resolve, reject) {
                try {
                    var fn = window.getBrandsByCategory;
                    if (typeof fn !== "function") return reject(new Error("getBrandsByCategory not available"));
                    resolve(fn(slug));
                } catch (e) { reject(e); }
            });
        },

        getBrandById: function (id) {
            return new Promise(function (resolve, reject) {
                try {
                    var fn = window.getBrandById;
                    if (typeof fn !== "function") return reject(new Error("getBrandById not available"));
                    resolve(fn(id));
                } catch (e) { reject(e); }
            });
        },

        getStats: function () {
            return new Promise(function (resolve, reject) {
                try {
                    if (typeof BRAND_DATA === 'undefined') return reject(new Error("BRAND_DATA not available"));

                    var totalBrands = 0;
                    var totalScore = 0;

                    BRAND_DATA.forEach(function (c) {
                        if (c.brands) {
                            c.brands.forEach(function (b) {
                                totalBrands++;
                                totalScore += b.gonogo_score || 0;
                            });
                        }
                    });

                    resolve({
                        totalCategories: BRAND_DATA.length,
                        totalBrands: totalBrands,
                        averageScore: totalBrands > 0 ? Math.round((totalScore / totalBrands) * 10) / 10 : 0
                    });

                } catch (e) { reject(e); }
            });
        },

        // ---------------- REVIEWS (LIVE) ----------------

        submitReview: function (reviewData) {
            return post("submitReview", reviewData);
        },

        moderateReview: function (ReviewID, status, moderatedBy) {
            // Not implemented yet with Supabase; placeholder to keep API shape.
            return Promise.reject(new Error("moderateReview not implemented"));
        },

        getAllReviews: function () {
            // Not implemented yet with Supabase; placeholder.
            return Promise.reject(new Error("getAllReviews not implemented"));
        },

        getReviewsForBrand: function (brandName) {
            // Not implemented yet with Supabase; placeholder.
            return Promise.reject(new Error("getReviewsForBrand not implemented"));
        }
    };

})();

console.log("GoNoGoAPI loaded successfully");
