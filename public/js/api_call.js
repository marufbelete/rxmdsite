$(document).ready(function () {
  const base_url = "http://localhost:7000";
  // const base_url="https://rxmdsite-production.up.railway.app"

  $("#populate").on("click", function () {
    loadTable();
  });

  $.ajax({
    url: `${base_url}/checkauth`,
    method: "GET",
    success: function (data) {

      data?.user?.role?.toLowerCase() !== "admin" &&
        localStorage.setItem("isAdmin", "false");
      data?.user?.role?.toLowerCase() === "admin" &&
        localStorage.setItem("isAdmin", "true");
      localStorage.setItem("isLoged", "true");
      checkLogin();
    },
    error: function (data) {
      localStorage.setItem("isLoged", "false");
      localStorage.setItem("isAdmin", "false");
    },
  });

  const checkLogin = () => {
    const isLoged = localStorage.getItem("isLoged");
    const isAdmin = localStorage.getItem("isAdmin");
    isLoged === "true" && $("#login_link").addClass("d-none");
    isLoged === "true" && $("#logout_link").removeClass("d-none");
    isLoged !== "true" && $("#login_link").removeClass("d-none");
    isLoged !== "true" && $("#logout_link").addClass("d-none");
    (isAdmin !== "true" || isLoged !== "true") &&
      $("#admin_link").addClass("d-none");
    isLoged === "true" &&
      isAdmin === "true" &&
      $("#admin_link").removeClass("d-none");
  };
  checkLogin();

  //register api call
  $("#register_user").on("click", function (event) {
    event.preventDefault();
    $("#register_error").addClass("d-none");
    const first_name = $("#first_name").val();
    const last_name = $("#last_name").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const verify_password = $("#verify_password").val();
    if (password !== verify_password) {
      $("#register_error").removeClass("d-none");
      $("#register_error").text("password must match");
      return;
    }
    $("#register_text").addClass("d-none");
    $("#register_text_spin").removeClass("d-none");
    $.ajax({
      url: `${base_url}/register`,
      method: "POST",
      data: { first_name, last_name, email, password },
      // dataType : "JSON",
      success: function (data) {
        location.href = "/registered";
      },
      error: function (data) {
        $("#register_text").removeClass("d-none");
        $("#register_text_spin").addClass("d-none");
        $("#register_error").removeClass("d-none");
        $("#register_error").text(data.responseJSON.message);
      },
    });
  });

  //login api call
  $("#login_user").on("click", function (event) {
    event.preventDefault();
    $("#login_error").addClass("d-none");
    const login_email = $("#login_email").val();
    const login_password = $("#login_password").val();
    const rememberme = $("#rememberme").is(":checked");
    $("#login_text").addClass("d-none");
    $("#login_text_spin").removeClass("d-none");
    $.ajax({
      url: `${base_url}/login`,
      method: "POST",
      data: { login_email, login_password, rememberme },
      success: function (data) {
        localStorage.setItem("isLoged", "true");
        data?.info?.role?.role?.toLowerCase() !== "admin" &&
          localStorage.setItem("isAdmin", "false");
        data?.info?.role?.role?.toLowerCase() === "admin" &&
          localStorage.setItem("isAdmin", "true");
        location.href = "/";
      },
      error: function (data) {
        $("#login_error").removeClass("d-none");
        $("#login_text").removeClass("d-none");
        $("#login_text_spin").addClass("d-none");
        $("#login_error").text(data.responseJSON.message);
      },
    });
  });

  //logout
  $(document).on("click", "#logout_link", function (event) {
    event.preventDefault();
    $.ajax({
      url: `${base_url}/logout`,
      method: "GET",
      success: function (data) {
        localStorage.setItem("isLoged", "false");
        location.href = "/login";
      },
    });
  });
  //forgot password
  $("#forgot_password").on("click", function (event) {
    event.preventDefault();
    const email = $("#resetPasswordEmail").val();
    $("#invalid_forgotpassword_email").addClass("d-none");
    const isEmailValid = ValidateEmail(email);
    if (!email || !isEmailValid) {
      !email && $("#invalid_forgotpassword_email").removeClass("d-none");
      !isEmailValid &&
        email &&
        $("#invalid_forgotpassword_email").removeClass("d-none");
      !isEmailValid &&
        email &&
        $("#invalid_forgotpassword_email").text("Invalid Email");
      return;
    }
    $("#resetpassword_text_spin").removeClass("d-none");
    $("#resetpassword_text").addClass("d-none");
    $("#forgot_message").addClass("d-none");
    $.ajax({
      url: `${base_url}/forgotpassword`,
      method: "POST",
      data: { email },
      success: function (data) {
        $("#resetpassword_text").removeClass("d-none");
        $("#resetpassword_text_spin").addClass("d-none");
        $("#forgot_message").text(data.message);
        $("#forgot_message").removeClass("d-none");
      },
      error: function (data) {
        $("#resetpassword_text").removeClass("d-none");
        $("#resetpassword_text_spin").addClass("d-none");
      },
    });
  });
  //reset password
  $("#reset_button").on("click", function (event) {
    event.preventDefault();
    const newPassword = $("#npassword").val();
    const confirmNewPassword = $("#cpassword").val();
    $("#reset_error").addClass("d-none");
    if (!newPassword || !confirmNewPassword) {
      $("#reset_error").removeClass("d-none");
      $("#reset_error").text("please fill all field");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      $("#reset_error").removeClass("d-none");
      $("#reset_error").text("password not match");
      return;
    }
    $("#reset_button").val("Loading...");
    $.ajax({
      url: window.location.href,
      method: "POST",
      data: { password: newPassword },
      success: function (data) {
        $("#resetpassword_text").removeClass("d-none");
        $("#resetpassword_text_spin").addClass("d-none");
        $("#forgot_message").text(data.message);
        $("#forgot_message").removeClass("d-none");
        $("#reset_button").val("Submit");
        location.href = "/login";
      },
      error: function (data) {
        $("#reset_error").removeClass("d-none");
        $("#reset_error").text("invalid or expired link, please try again");
        $("#resetpassword_text").removeClass("d-none");
        $("#resetpassword_text_spin").addClass("d-none");
        $("#reset_button").val("Submit");
      },
    });
  });
  //contact form
  $("#submit_contact_form").on("click", function (event) {
    event.preventDefault();
    $("#contact_form_email");
    const name = $("#contact_form_name").val();
    const email = $("#contact_form_email").val();
    const message = $("#contact_form_message").val();
    const phone = $("#contact_form_phone").val();
    const subject = $("#contact_form_subject").val();

    $("#invalid_email").addClass("d-none");
    $("#invalid_subject").addClass("d-none");
    $("#invalid_message").addClass("d-none");
    const isEmailValid = ValidateEmail(email);
    if (!email || !subject || !message || !isEmailValid) {
      !email && $("#invalid_email").removeClass("d-none");
      !isEmailValid && email && $("#invalid_email").removeClass("d-none");
      !isEmailValid && email && $("#invalid_email").text("Invalid Email");
      !subject && $("#invalid_subject").removeClass("d-none");
      !message && $("#invalid_message").removeClass("d-none");
      return;
    }
    $("#contact_text_spin").removeClass("d-none");
    $("#contact_text").addClass("d-none");
    $.ajax({
      url: `${base_url}/contactform`,
      method: "POST",
      data: { name, email, phone, subject, message },
      success: function (data) {
        $("#contact_form_toast").toast("show");
        $("#contact_text").removeClass("d-none");
        $("#contact_text_spin").addClass("d-none");
      },
      error: function (data) {
        alert("email not sent");
        $("#contact_text").removeClass("d-none");
        $("#contact_text_spin").addClass("d-none");
      },
    });
  });
  function ValidateEmail(email) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email?.match(mailformat)) {
      return true;
    } else {
      return false;
    }
  }
  //check google auth if not exist
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get("error");
  if (myParam == "Google-Auth-Not-Exist") {
    $("#login_error").removeClass("d-none");
    $("#login_error").text(
      "This account not associated with google please use your email and password to login"
    );
  }
  if (myParam == "Google-Account-Not-Active") {
    $("#login_error").removeClass("d-none");
    $("#login_error").text(
      "This account is deactivated, please contact our customer service"
    );
  }
  if (myParam == "No-Auth-Redirect") {
    location.href = "/login";
  }
  //get all selected product for order
  //on order complete buton click

  // $('#pp-id').on('click',function(){
  //   const product_ordered=[]
  //   $('#telehealth-appt-checkbox:checked').parent('[id=tel-product]').each(function(){
  //     product_ordered.push({productId:$(this).data('productid')})
  //   })
  //   console.log(product_ordered)
  //   //here make ajax call to compelete the order
  // })
  $('input[id="telehealth-appt-checkbox"]').on("click", function () {
    let total_price = 0;
    $("#telehealth-appt-checkbox:checked")
      .parent("td")
      .siblings("#product-price")
      .each(function () {
        let product_price = Number($(this).children("span").text());
        total_price = total_price + product_price;
      });
    $("#cart-total-price").text(total_price);
  });

  $("#product-select").on("change", function () {
    const id = this.value;
    fetcheProductDetail(id);
  });

  const fetcheProductDetail = (id) => {
    $.ajax({
      url: `${base_url}/getproductbyid/${id}`,
      method: "GET",
      success: function (data) {
        $("div").children("#product-name").val(data.product_name);
        $("div").children("#product-description").val(data.description);
        $("div").children("#product-price").val(data.price);
      },
    });
  };
  $("#product-select")
    .children()
    .on("load", function () {
      const first_product_id = $(this).val();
      fetcheProductDetail(first_product_id);
    });
  $("#product-select").children().first().trigger("load");

  //update product
  $("#update-product-button").on("click", function () {
    let selected_id = $("#product-select").find(":selected").val();
    const product_name = $("div").children("#product-name").val();
    const description = $("div").children("#product-description").val();
    const price = $("div").children("#product-price").val();
    $("#update_product_text").addClass("d-none");
    $("#update_product_text_spin").removeClass("d-none");
    $.ajax({
      url: `${base_url}/editproduct/${selected_id}`,
      data: { product_name, price, description },
      method: "PUT",
      success: function () {
        $("#product_notify")
          .text("product updated successfully")
          .removeClass("d-none alert alert-danger")
          .addClass("alert alert-primary");
        setTimeout(function () {
          $("#product_notify").addClass("d-none");
        }, 3000);
        $("#update_product_text").removeClass("d-none");
        $("#update_product_text_spin").addClass("d-none");
      },
      error: function (data) {
        $("#product_notify")
          .text("something went wrong, please try again")
          .removeClass("d-none alert alert-primary")
          .addClass("alert alert-danger");
        setTimeout(function () {
          $("#product_notify").addClass("d-none");
        }, 3000);
        $("#update_product_text").removeClass("d-none");
        $("#update_product_text_spin").addClass("d-none");
      },
    });
  });
  
  // show add new product
  $("#add-product-button").on("click", function () {
    $("#add_new_product").modal("show");
  });

  // save new product
  $("#add-product-confirmation").on("click", function () {
    $("#add_product_text").addClass("d-none");
    $("#add_product_text_spin").removeClass("d-none");
    const product_name=$("#new-product-name").val()
    const price=$("#new-product-price").val()
    const description=$("#new-product-description").val()
    $("#add-new-product-error").addClass("d-none");
    if(!product_name||!price){ 
      $("#add_product_text").removeClass("d-none");
      $("#add_product_text_spin").addClass("d-none");
      !price&&$("#add-new-product-error").text("please add product price").removeClass("d-none");
      !product_name&&$("#add-new-product-error").text("please add product name").removeClass("d-none");
      return
    }
    $.ajax({
      url: `${base_url}/addproduct`,
      method: "POST",
      data: { product_name,price,description },
      success: function (data) {
        $("#add_product_text").removeClass("d-none");
        $("#add_product_text_spin").addClass("d-none");
        $("#add_new_product").modal("hide");
        $("#delete_user_success").modal("show");
        $("#new-product-name").val('')
        $("#new-product-price").val('')
        $("#new-product-description").val('')
        $("#delete-user-success-icon")
          .empty()
          .append(
            ` <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
          `
          );
        $("#delete-user-msg").text("New product added successfully");
      },
      error: function (data) {
        $("#add_product_text").removeClass("d-none");
        $("#add_product_text_spin").addClass("d-none");
        $("#add_new_product").modal("hide");
        $("#delete_user_success").modal("show");
        $("#delete-user-success-icon")
          .empty()
          .append(
            `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>`
          );
        $("#delete-user-msg").text("something went wrong. please try again");
      },
    });
  });

  //seacrh user
  $("#user_search").on("click", function (event) {
    event.preventDefault();
    const user_name = $("div").children("#edit-name").val();
    const email = $("div").children("#edit-email").val();

    let searchString;
    if (!email && !user_name) {
      $("#user_search_notify")
        .text("please fill atleast one query for usersearch")
        .removeClass("d-none alert alert-danger")
        .addClass("alert alert-primary");
      return;
    }
    user_name ? (searchString = `name=${user_name}`) : searchString;
    email ? (searchString = `email=${email}`) : searchString;
    $("#user_search_notify").addClass("d-none");
    $("#search_user_text").addClass("d-none");
    $("#search_user_text_spin").removeClass("d-none");
    $("#user-table-body").empty();
    $.ajax({
      url: `${base_url}/getuserbystate?${searchString}`,
      method: "GET",
      success: function (data) {
        if (data?.length == 0) {
          $("#user_search_notify")
            .text("user not found")
            .removeClass("d-none alert alert-danger")
            .addClass("alert alert-primary");
        }
        if (data?.length > 0) {
          data?.forEach((user) => {
            $("#user-table-body").append(`
            <tr>
          <td>${user.first_name || ""}</td>
          <td>${user.last_name || ""}</td>
          <td id="user-state" data-active=${user.isActive}>${
              user.isActive ? "Active" : "Blocked"
            }</td>
          <td>${user.roleId === 1 ? "Admin" : "User"}</td>
          <td>${user.email || ""}</td>
          <td>${user.isEmailConfirmed}</td>
          <td>${user.address || ""}</td>
          <td>${user.apt || ""}</td>
          <td>${user.city || ""}</td>
          <td>${user.state || ""}</td>
          <td>${user.zip_code || ""}</td>
          <td>${user.phone_number || ""}</td>
          <td>${user.intake}</td>
          <td>${new Date(user.createdAt).toLocaleDateString() || ""}</td>
          <td>
          <span class="edit-user-icon" data-bs-toggle="modal" data-bs-target="#update_user"
          data-id="${user.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
           <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
          </svg>
          </span>
        </td>
          <td>
          ${
            !user.isActive
              ? `<span class="delete-user-icon" data-bs-toggle="modal" data-bs-target="#delete_user"
          data-id="${user.id}">
          <span style="color: #5C636A;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-unlock-fill" viewBox="0 0 16 16">
          <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z"/>
        </svg>
         </span>
         </span>`
              : `<span class="delete-user-icon" data-bs-toggle="modal" data-bs-target="#delete_user"
             data-id="${user.id}">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
             <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
           </svg>
          </span>`
          }
          </td>
      </tr>
          `);
          });
        }
        // children('#edit-name').
        // val(`${data?.first_name||''} ${data?.last_name||''}`)
        $("#search_user_text").removeClass("d-none");
        $("#search_user_text_spin").addClass("d-none");
      },
      error: function (data) {
        $("#user_search_notify")
          .text(data?.responseJSON?.message)
          .removeClass("d-none alert alert-primary")
          .addClass("alert alert-danger");
        $("#search_user_text").removeClass("d-none");
        $("#search_user_text_spin").addClass("d-none");
      },
    });
  });

  //update user
  $(document).on("click", ".edit-user-icon", function () {
    const id = $(this).data("id");
    $("#update-confirmation").data("id", id);
    $("#update-user-phone").css('border-color','rgb(206, 212, 218)')

    $.ajax({
      url: `${base_url}/getuserbyid/${id}`,
      type: "GET",
      success: (user) => {
        $("#update-first-name").val(user?.first_name);
        $("#update-last-name").val(user?.last_name);
        $("#update-user-email").val(user?.email);
        $("#update-user-address").val(user?.address);
        $("#update-user-city").val(user?.city);
        $("#update-user-state").val(user?.state );
        $("#update-user-addressline2").val(user?.apt );
        $("#update-user-zip").val(user?.zip_code );
        $("#update-user-phone").val(formatPhoneNumber(user?.phone_number));

        // $("#update-user-fotformfilled").val(user?.intake)
      },
    });
  });

  $("#update-confirmation").on("click", function () {
    const id = $(this).data("id");
    const first_name = $("#update-first-name").val();
    const last_name = $("#update-last-name").val();
    const email = $("#update-user-email").val();
    const address = $("#update-user-address").val();
    const address_line_two = $("#update-user-addressline2").val();
    const zip_code = $("#update-user-zip").val();
    const phone_number = $("#update-user-phone").val();
    const city = $("#update-user-city").val();
    const state = $("#update-user-state").val();
    $("#update_user_text").addClass("d-none");
    $("#update_user_text_spin").removeClass("d-none");
    if(!(formatPhoneNumber(phone_number)))
    {
      $("#update-user-phone").css('border-color','red')
      $("#update_user_text").removeClass("d-none");
      $("#update_user_text_spin").addClass("d-none");
      return
    }

    $.ajax({
      url: `${base_url}/updateuser/${id}`,
      method: "PUT",
      data: {
        first_name,
        last_name,
        email,
        zip_code,
        phone_number:phone_number.replace(/-/g, ""),

        address,
        address_line_two,
        state,
        city,
      },
      success: function (data) {
        $("#delete_user").modal("hide");
        $("#update_user").modal("hide");
        $("#delete_user_success").modal("show");
        $("#delete-user-success-icon")
          .empty()
          .append(
            ` <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
          `
          );
        $("#delete-user-msg").text("User Updated successfully");
        $("#update_user_text").removeClass("d-none");
        $("#update_user_text_spin").addClass("d-none");

        loadTable();
      },
      error: function (data) {
        $("#delete_user").modal("hide");
        $("#update_user").modal("hide");
        $("#delete_user_success").modal("show");
        $("#delete-user-success-icon")
          .empty()
          .append(
            `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>`
          );
        $("#delete-user-msg").text("something went wrong. please try again");
        $("#update_user_text").removeClass("d-none");
        $("#update_user_text_spin").addClass("d-none");

      },
    });
  });

  //delete user
  $("#delete-confirmation").on("click", function () {
    const id = $(this).data("id");
    const state = $(this).data("state");
    $("#delete_user_text").addClass("d-none");
    $("#delete_user_text_spin").removeClass("d-none");
    $.ajax({
      url: `${base_url}/updateuserstate/${id}`,
      method: "PUT",
      data: { state: !state },
      success: function (data) {
        $("#delete_user").modal("hide");
        $("#update_user").modal("hide");
        $("#delete_user_success").modal("show");
        $("#delete-user-success-icon")
          .empty()
          .append(
            ` <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
          `
          );
        state
          ? $("#delete-user-msg").text("User deactivated successfully")
          : $("#delete-user-msg").text("User Activated successfully");
        $("#delete_user_text").removeClass("d-none");
        $("#delete_user_text_spin").addClass("d-none");
        loadTable();
      },
      error: function (data) {
        $("#delete_user").modal("hide");
        $("#update_user").modal("hide");
        $("#delete_user_success").modal("show");
        $("#delete-user-success-icon")
          .empty()
          .append(
            `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>`
          );
        $("#delete-user-msg").text("something went wrong. please try again");
        $("#delete_user_text").removeClass("d-none");
        $("#delete_user_text_spin").addClass("d-none");
      },
    });
  });

  $(document).on("click", ".delete-user-icon", function () {
    const id = $(this).data("id");
    const active = $(this).parent("td").siblings("#user-state").data("active");
    active
      ? $("#user-delete-detail").text(
          "Are you sure you want to deactivate this user?"
        )
      : $("#user-delete-detail").text(
          "Are you sure you want to Activate this user?"
        );
    active
      ? $("#delete-user-title").text("Deactivate User")
      : $("#delete-user-title").text("Activate User");
    $("#delete-confirmation").data("id", id);
    $("#delete-confirmation").data("state", active);
  });


  $("#cancel-edit-user").on("click", function () {
    $("div").children("#edit-email").val("");
    $("div").children("#edit-name").val("");
  });

  const loadTable = () => {
    $("#user-table-body").empty();
    $.ajax({
      url: `${base_url}/getusers`,
      type: "GET",
      success: (users) => {
        users?.forEach((user) => {
          $("#user-table-body").append(`
          <tr>
          <td>${user.first_name || ""}</td>
          <td>${user.last_name || ""}</td>
          <td id="user-state" data-active=${user.isActive}>${
            user.isActive ? "Active" : "Blocked"
          }</td>
          <td>${user.roleId === 1 ? "Admin" : "User"}</td>
          <td>${user.email || ""}</td>
          <td>${user.isEmailConfirmed}</td>
          <td>${user.address || ""}</td>
          <td>${user.apt || ""}</td>
          <td>${user.city || ""}</td>
          <td>${user.state || ""}</td>
          <td>${user.zip_code || ""}</td>
          <td>${user.phone_number || ""}</td>
          <td>${user.intake}</td>
          <td>${new Date(user.createdAt).toLocaleDateString() || ""}</td>
          <td>
          <span class="edit-user-icon" data-bs-toggle="modal" data-bs-target="#update_user"
          data-id="${user.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
           <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
          </svg>
          </span>
        </td>
          <td>
          ${
            !user.isActive
              ? `<span class="delete-user-icon" data-bs-toggle="modal" data-bs-target="#delete_user"
          data-id="${user.id}">
          <span style="color: #5C636A;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-unlock-fill" viewBox="0 0 16 16">
          <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z"/>
        </svg>
         </span>
         </span>`
              : `<span class="delete-user-icon" data-bs-toggle="modal" data-bs-target="#delete_user"
             data-id="${user.id}">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
             <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
           </svg>
          </span>`

          }
          </td>
      </tr>
          `);
        });
      },
      error: (error) => {
        console.error(error);
        alert(
          "Error retrieving users from database, please tell Jacob this isn't working!"
        );
      },
    });
  };
  const formatPhoneNumber=(phoneNumberString) =>{
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return  match[1] + '-' + match[2] + '-' + match[3];
    }
    return null;
  }
  //copmlete order
   $('#complete-order').on('click',function(event){
    event.preventDefault()
    const product_ordered=[]
    $('#telehealth-appt-checkbox:checked').parent('[id=tel-product]').each(function(){
      product_ordered.push({productId:$(this).data('productid')})
    })
    alert(product_ordered)
    console.log(product_ordered)
    //here make ajax call to compelete the order
  })

});
