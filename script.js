function loadReviewsFromStorage() {

    const reviewContainer =
        document.getElementById("dynamic-reviews-grid");

    if (!reviewContainer) return;

    let defaultHTML = `
        <div class="review-box-p">

            <div class="r-top">

                <span class="r-user">
                    <i class="fa-solid fa-circle-user"></i>
                    AlphaX
                </span>

                <span class="r-stars">
                    ⭐⭐⭐⭐⭐
                </span>

            </div>

            <p>
                "Trusted middleman and secure marketplace."
            </p>

            <span class="r-date">
                <i class="fa-solid fa-clock"></i>
                Verified Review
            </span>

        </div>
    `;

    let globalReviews =
        JSON.parse(localStorage.getItem("publicReviewsArray")) || [];

    globalReviews.forEach(rev => {

        let author = rev.author || "Unknown User";

        let stars = rev.stars || "⭐⭐⭐⭐⭐";

        let text = rev.text || "No review text";

        defaultHTML = `

        <div class="review-box-p custom-user-review">

            <div class="r-top">

                <span class="r-user" style="color:#3b82f6;">

                    <i class="fa-solid fa-circle-user text-blue"></i>

                    ${author}

                </span>

                <span class="r-stars">

                    ${stars}

                </span>

            </div>

            <p>

                "${text}"

            </p>

            <span class="r-date">

                <i class="fa-solid fa-circle-nodes"></i>

                Live Public Contribution

            </span>

        </div>

        ` + defaultHTML;

    });

    reviewContainer.innerHTML = defaultHTML;
}


function submitLiveReview(e) {

    e.preventDefault();

    const starsSelection =
        document.getElementById("review-stars-select").value;

    const reviewTextContent =
        document.getElementById("review-text-input").value.trim();

    if (!reviewTextContent) {

        alert("Please enter a review.");

        return;
    }

    let globalReviews =
        JSON.parse(localStorage.getItem("publicReviewsArray")) || [];

    const newReviewPacket = {

        author: currentUser || "Anonymous",

        stars: starsSelection || "⭐⭐⭐⭐⭐",

        text: reviewTextContent || "No review"

    };

    globalReviews.push(newReviewPacket);

    localStorage.setItem(
        "publicReviewsArray",
        JSON.stringify(globalReviews)
    );

    document.getElementById("review-text-input").value = "";

    loadReviewsFromStorage();
}
