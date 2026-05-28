// 1. SYSTEM CONFIGURATION PARAMETERS
const firebaseDatabaseURL = "https://g2g1-31e7d-default-rtdb.firebaseio.com";

// Run automatic sync tasks when the framework loads
window.addEventListener("DOMContentLoaded", () => {
    initRealtimeSyncing();
});

/**
 * ==========================================================================
 * REAL-TIME DATA TRACKING & DATABASE SYNC ENGINE
 * ==========================================================================
 */
function initRealtimeSyncing() {
    // Run live counter updates and review pool tracks instantly
    syncLiveMetrics();
    syncLiveReviews();

    // Setup active loop tickers to keep data fresh every 4 seconds
    setInterval(() => {
        syncLiveMetrics();
        syncLiveReviews();
    }, 4000);
}

// Fetches live membership tallies and metrics directly from Firebase
function syncLiveMetrics() {
    fetch(`${firebaseDatabaseURL}/metrics.json`)
        .then(res => res.json())
        .then(data => {
            if (!data) return;
            
            // Dynamic Home Elements Sync
            if (data.membersCount) document.getElementById("dom-members-count").innerText = data.membersCount;
            if (data.dealsCount) document.getElementById("dom-deals-count").innerText = data.dealsCount;
            
            // Dynamic Admin Area Dashboard Panel Elements Sync
            if (data.joinedToday) {
                document.getElementById("admin-joined-today").innerText = `${data.joinedToday} Members`;
            }
            if (data.activeTickets) {
                document.getElementById("admin-active-tickets").innerText = `${data.activeTickets} Deals Running`;
            }
        })
        .catch(err => console.error("Database connection interrupted:", err));
}

// Pulls open public record feedback directly out of database strings
function syncLiveReviews() {
    const mainFeed = document.getElementById("live-reviews-feed");
    const layoutGrid = document.getElementById("expanded-reviews-grid");

    fetch(`${firebaseDatabaseURL}/reviews.json`)
        .then(res => res.json())
        .then(reviews => {
            if (!reviews) return;

            let sharedHtml = "";
            Object.keys(reviews).reverse().forEach(id => {
                let rev = reviews[id];
                sharedHtml += `
                    <div class="review-feed-item">
                        <div class="review-feed-header">
                            <span class="review-feed-user">${rev.author || 'Anonymous'}</span>
                            <span class="review-feed-stars">${rev.stars || '⭐⭐⭐⭐⭐'}</span>
                        </div>
                        <p class="review-feed-text">"${rev.text || ''}"</p>
                    </div>
                `;
            });

            // Feed data seamlessly into both standard display columns across layout slides
            if (mainFeed) mainFeed.innerHTML = sharedHtml;
            if (layoutGrid) layoutGrid.innerHTML = sharedHtml;
        })
        .catch(err => console.error("Error pulling live reviews ledger:", err));
}

/**
 * ==========================================================================
 * NAVIGATION ENGINE FOR TABS DISPLAY SHIFTS
 * ==========================================================================
 */
function switchTab(targetSlide) {
    const slides = document.querySelectorAll('.page-slide');
    slides.forEach(slide => slide.classList.remove('active'));

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    const target = document.getElementById('slide-' + targetSlide);
    if(target) target.classList.add('active');

    const activeNav = document.getElementById('nav-' + targetSlide);
    if(activeNav) activeNav.classList.add('active');
    
    window.scrollTo({top: 0, behavior: 'smooth'});
}

/**
 * ==========================================================================
 * EXCLUSIVE PRIVILEGED LOGIN INTERFACE
 * ==========================================================================
 */
function openLoginModal() {
    document.getElementById("login-modal").style.display = "flex";
}

function closeLoginModal() {
    document.getElementById("login-modal").style.display = "none";
}

function handleSystemLogin(e) {
    e.preventDefault();
    const enteredUser = document.getElementById("login-user-input").value.trim();
    const enteredPass = document.getElementById("login-pass-input").value;

    if (enteredUser === "@prashant" && enteredPass === "12345678") {
        closeLoginModal();
        document.getElementById("private-admin-panel").style.display = "block";
        document.getElementById("auth-action-area").innerHTML = `
            <span class="user-pill" style="background: rgba(234, 179, 8, 0.1); border: 1px solid #eab308; color: #eab308; padding: 8px 14px; font-weight: bold; font-size: 0.85rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-crown"></i> Admin Account Active
            </span>
        `;
        alert("Authorization confirmed. Operator Dashboard mounted successfully.");
    } else {
        alert("Security Error: Invalid credentials or unknown administrator role.");
    }
}
