document.addEventListener("DOMContentLoaded", function () {
    const manualForm = document.querySelector("#manualForm");
    const cookieForm = document.querySelector("#cookieForm");
  
    manualForm.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const akun1 = document.querySelector("#akun1").value;
      const akun1_pass = document.querySelector("#akun1_pass").value;
      const akun2 = document.querySelector("#akun2").value;
      const akun2_pass = document.querySelector("#akun2_pass").value;
  
      const response = await fetch("http://127.0.0.1:5000/login/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ akun1, akun1_pass, akun2, akun2_pass }),
      });
  
      const result = await response.json();
      alert(result.message);
    });
  
    cookieForm.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const cookie = document.querySelector("#cookie").value;
  
      const response = await fetch("http://127.0.0.1:5000/login/cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookie }),
      });
  
      const result = await response.json();
      alert(result.message);
    });
  });
