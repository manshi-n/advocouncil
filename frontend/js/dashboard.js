// ================= DASHBOARD INITIALIZATION =================

document.addEventListener("DOMContentLoaded", () => {

    loadUserProfile();
    setupResumeUpload();
});


// ================= LOAD USER PROFILE =================

function loadUserProfile() {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) return;

    const nameEl = document.getElementById("userName");
    const emailEl = document.getElementById("userEmail");
    const bioEl = document.getElementById("userBio");

    if (nameEl) nameEl.textContent = user.fullName || "User";
    if (emailEl) emailEl.textContent = user.email || "";
    if (bioEl) bioEl.textContent = user.bio || "No bio available";
}


// ================= RESUME UPLOAD =================

function setupResumeUpload() {

    const uploadBtn = document.getElementById("uploadResumeBtn");

    if (!uploadBtn) return;

    uploadBtn.addEventListener("click", async () => {

        const fileInput = document.getElementById("resumeFile");
        const token = localStorage.getItem("token");

        if (!fileInput) {
            alert("File input not found");
            return;
        }

        if (!fileInput.files || !fileInput.files[0]) {
            alert("Please select a resume file");
            return;
        }

        if (!token) {
            alert("You are not logged in");
            return;
        }

        const formData = new FormData();
        formData.append("resume", fileInput.files[0]);

        try {

            const response = await fetch(
                "http://localhost:5000/api/student/upload-resume",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Resume uploaded successfully");

                // Optional UI update
                console.log("Uploaded resume:", data);

                // update local storage if backend returns updated user
                if (data.user) {
                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(data.user)
                    );
                }

            } else {
                alert(data.message || "Upload failed");
            }

        } catch (error) {
            console.error(error);
            alert("Server error while uploading resume");
        }
    });
}


// ================= OPTIONAL: LOGOUT =================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    window.location.href = "signin.html";
}