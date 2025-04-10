// Fungsi buat nampilin upload section
function showUploadSection() {
  document.getElementById("upload-section").style.display = "block";
}

// Fungsi buat munculin alert custom
function showAlert(message) {
  const alertBox = document.getElementById("alertBox");
  alertBox.innerHTML = `<div class="alert">${message}</div>`;
  setTimeout(() => {
    alertBox.innerHTML = "";
  }, 3000);
}

// Fungsi login manual
function loginManual() {
  const akun1 = document.querySelector("#akun1").value;
  const akun1_pass = document.querySelector("#akun1_pass").value;
  const akun2 = document.querySelector("#akun2").value;
  const akun2_pass = document.querySelector("#akun2_pass").value;

  fetch("http://127.0.0.1:5000/login/manual", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ akun1, akun1_pass, akun2, akun2_pass })
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        showAlert(result.message);
        showUploadSection();
      } else {
        showAlert(result.message);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      showAlert("❌ Terjadi kesalahan saat login manual.");
    });
}

// Fungsi login pakai cookie
function loginCookie() {
  const cookie = document.querySelector("#cookie").value;

  fetch("http://127.0.0.1:5000/login/cookie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cookie })
  })
    .then(response => response.json())
    .then(result => {
      showAlert(result.message);
    })
    .catch(error => {
      console.error("Error:", error);
      showAlert("❌ Terjadi kesalahan saat login dengan cookie.");
    });
}

// Fungsi upload post
function uploadPost() {
  const fileInput = document.getElementById("fileInput");
  const caption = document.getElementById("captionInput").value;
  const schedule = document.getElementById("scheduleInput").value;

  const file = fileInput.files[0];
  if (!file || !caption || !schedule) {
    showAlert("Isi semua field ya sayang 😥");
    return;
  }

  if (file.size > 50 * 1024 * 1024) {
    showAlert("File terlalu besar, max 50MB yaa 😥");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("caption", caption);
  formData.append("schedule", schedule);

  fetch("http://127.0.0.1:5000/upload", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      showAlert(data.message);
    })
    .catch(err => {
      showAlert("Gagal upload sayang 😢");
      console.error(err);
    });
}

// Event listener
document.addEventListener("DOMContentLoaded", function () {
  const manualForm = document.querySelector("#manualForm");
  const cookieForm = document.querySelector("#cookieForm");

  if (manualForm) {
    manualForm.addEventListener("submit", function (e) {
      e.preventDefault();
      loginManual();
    });
  }

  if (cookieForm) {
    cookieForm.addEventListener("submit", function (e) {
      e.preventDefault();
      loginCookie();
    });
  }
});
