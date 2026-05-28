/**
 * ==========================================================================
 * CORE NAVIGATION ENGINE FOR DYNAMIC TABS DISPLAY SHIFTS
 * ==========================================================================
 */
function switchTab(targetSlide) {
    // Hide all view panels inside container boundaries
    const slides = document.querySelectorAll('.page-slide');
    slides.forEach(slide => slide.classList.remove('active'));

    // Reset active indicator classes across header selectors
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    // Inject active visibility into chosen segment layer target element
    const target = document.getElementById('slide-' + targetSlide);
    if(target) target.classList.add('active');

    const activeNav = document.getElementById('nav-' + targetSlide);
    if(activeNav) activeNav.classList.add('active');
    
    // Smooth scroll boundary reset back to header viewpoint line tracking
    window.scrollTo({top: 0, behavior: 'smooth'});
}

/**
 * ==========================================================================
 * EXCLUSIVE PRIVILEGED LOGIN INTERFACE TRIGGERS
 * ==========================================================================
 */
function openLoginModal() {
    document.getElementById("login-modal").style.display = "flex";
}

function closeLoginModal() {
    document.getElementById("login-modal").style.display = "none";
}

/**
 * STRICT ACCESS VALIDATION MATRIX CONTROL RULES
 * Only User: @prashant | Pass: 12345678 can bypass verification
 */
function handleSystemLogin(e) {
    e.preventDefault();
    
    const enteredUser = document.getElementById("login-user-input").value.trim();
    const enteredPass = document.getElementById("login-pass-input").value;

    if (enteredUser === "@prashant" && enteredPass === "12345678") {
        // Dismiss active modal layout layer cleanly
        closeLoginModal();
        
        // Uncover private operator system layout engine module panel area 
        document.getElementById("private-admin-panel").style.display = "block";
        
        // Mutate navbar right indicator block elements directly to dynamic verified status text
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
