var GoNoGoAPI = (function () {
    'use strict';

    // --- INTERNAL HELPERS ------------------------------------------------------

    // For now, POST actions are disabled so the site does not break.
    // submitReview will just resolve with ok:false.
    function post(action, data) {
        if (action === "submitReview") {
            return Promise.resolve({ ok: false, error: "Reviews not yet wired up" });
        }
        return Promise.reject(new Error("Unknown action"));
    }

    // GET is not used for live backend right now; all reads are from BRAND_DATA/helpers.
    function get(action) {
        return Promise.reject(new Error("Live GET actions not implemented"));
    }

    // --- PUBLIC API ------------------------------------------------------------

    return {

        // Enable live backend
        isLive: function () {
            return false; // effectively “static only” for now
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

        // ---------------- REVIEWS (TEMP DISABLED) ----------------

        submitReview: function (reviewData) {
            // UI can call this; it just won’t save yet.
            return post("submitReview", reviewData);
        },

        moderateReview: function () {
            return Promise.reject(new Error("moderateReview not implemented"));
        },

        getAllReviews: function () {
            return Promise.resolve([]); // no reviews yet
        },

        getReviewsForBrand: function () {
            return Promise.resolve([]);
        }
    };

})();

console.log("GoNoGoAPI loaded safely (static mode)");
