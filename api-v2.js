// force vercel redeploy// GoNoGo SA - API Client (LIVE + STATIC HYBRID)
var GoNoGoAPI = (function () {
    'use strict';

    // Your Google Apps Script Web App URL (EXACT from deployment panel)
    var API_BASE = "https://script.google.com/macros/s/AKfycbxS_aGR8urDRsJwkdrAR1wASn4K07EZcDlWjcC7NVgNGEXmtC17HqrgUOpYraweyRkg/exec";

    // --- INTERNAL HELPERS ------------------------------------------------------

    function post(action, data) {
        return fetch(API_BASE, {
            method: "POST",
            body: JSON.stringify(Object.assign({ action: action }, data))
        }).then(r => r.json());
    }

    function get(action) {
        return fetch(API_BASE + "?action=" + action)
            .then(r => r.json());
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
            return post("moderateReview", {
                ReviewID: ReviewID,
                status: status,
                moderatedBy: moderatedBy || "Admin"
            });
        },

        getAllReviews: function () {
            return get("getAllReviews").then(function (res) {
                return res.reviews || [];
            });
        },

        getReviewsForBrand: function (brandName) {
            return this.getAllReviews().then(function (all) {
                return all.filter(function (r) {
                    return r.BrandName === brandName && r.Status === "approved";
                });
            });
        }
    };

})();

console.log("GoNoGoAPI loaded successfully");
