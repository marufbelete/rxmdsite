function showPassword() {
  var passwordInput = document.getElementById("login_password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
