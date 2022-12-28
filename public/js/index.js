$("#letter").hide();
$("#capital").hide();
$("#number").hide();
$("#length").hide();
$("#nomatch").hide();
$("#contain").hide();
let loginPassword = $("#login_password");
let password = $("#password");
let verify = $("#verify_password");
let lowerCaseLetters = /[a-z]/g;
let upperCaseLetters = /[A-Z]/g;
let numbers = /[0-9]/g;

// When the user clicks outside the password field, validate
password.on("blur", function (e) {
  let pw = password.val();
  if (pw.length > 1) {
    if (!pw.match(lowerCaseLetters)) {
      $("#contain").show();
      $("#letter").show();
    }
    if (!pw.match(upperCaseLetters)) {
      $("#contain").show();
      $("#capital").show();
    }
    if (!pw.match(numbers)) {
      $("#contain").show();
      $("#number").show();
    }
    if (pw.length < 8) {
      $("#contain").show();
      $("#length").show();
    }
  }
});

password.on("keyup", function () {
  let pw = password.val();
  if (pw.match(lowerCaseLetters)) $("#letter").hide();
  if (pw.match(upperCaseLetters)) $("#capital").hide();
  if (pw.match(numbers)) $("#number").hide();
  if (pw.length >= 8) $("#length").hide();
  if (
    pw.match(lowerCaseLetters) &&
    pw.match(upperCaseLetters) &&
    pw.match(numbers) &&
    pw.length >= 8
  )
    $("#contain").hide();
});

//When the user starts typing the verify password, verify they match
verify.on("keyup", function () {
  let pw = password.val();
  let verifypw = verify.val();
  if (verifypw.length > 3) {
    if (verifypw !== pw) $("#nomatch").show();
    if (verifypw === pw) $("#nomatch").hide();
  }
});

// show password on login page
function showPassword() {
  if (loginPassword.attr("type") === "password") {
    loginPassword.attr("type", "text");
  } else {
    loginPassword.attr("type", "password");
  }
}

// show passwords on login page
function showPasswords() {
  if (password.attr("type") === "password") {
    password.attr("type", "text");
    verify.attr("type", "text");
  } else {
    password.attr("type", "password");
    verify.attr("type", "password");
  }
}
