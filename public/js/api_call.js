$(document).ready(function () {
  // const base_url = "http://localhost:7000";
  const base_url = "https://shielded-citadel-34904.herokuapp.com"
  // const base_url = "https://www.testrxmd.com"
  // const base_url = "https://rxmdsite-production.up.railway.app";
  const new_url = window?.location?.search;

  if (new_url.includes('checkout')) {
    localStorage.setItem("toCheckout", "true");
  }  
  $("#populate").on("click", function () {
    loadTable();
  });
  $("#populate-order").on("click", function () {
    loadOrderTable();
  });
  $("#populate-order-subscription").on("click", function () {
    loadOrderSubscriptionTable();
  });
  $("#populate-affiliate").on("click", function () {
    loadAffiliateRelationTable();
  });

  const currentDate = new Date().toISOString().split('T')[0];
  $('#appt_appointment_date').attr('min', currentDate);
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
  $('#appt_appointment_time').attr('min', currentTime);

  // const showJotForm= localStorage.getItem("showJotForm")
  // const isAffiliate=localStorage.getItem("isAffiliate")
// if(showJotForm=== "true" && isAffiliate!=="true")
// {
//   localStorage.removeItem("showJotForm")
//   let $ajaxload_popup = $(".ajaxload-popup");
//         if ($ajaxload_popup.length > 0) {
//           $ajaxload_popup.magnificPopup({
//             items: [
//               {
//                 src: $ajaxload_popup.prop('href'),
//                 type: "iframe", 
//               },
//             ],
//             mainClass: "registrationForm",
//             alignTop: true,
//             overflowY: "scroll", 
//           }).magnificPopup('open'); 
//         }
// }

  $.ajax({
    url: `${base_url}/checkauth`,
    method: "GET",
    success: function (data) {
      const check_url = window?.location?.href;
      if (check_url == `${base_url}/` && localStorage.getItem("toCheckout") === "true") {
        localStorage.removeItem("toCheckout")
        location.href = "/checkout"
      }
      // if(localStorage.getItem("showJotFormCheckout")=== "true"){
      //   localStorage.removeItem("showJotFormCheckout")
      //   localStorage.setItem("showJotForm", "true");
      //   location.href = "/checkout"
      // }
      data?.user?.affiliateLink?
        localStorage.setItem("isAffiliate", "true"):
        localStorage.setItem("isAffiliate", "false");
      data?.user?.role?.toLowerCase() !== "admin" &&
        localStorage.setItem("isAdmin", "false");
      data?.user?.role?.toLowerCase() === "admin" &&
        localStorage.setItem("isAdmin", "true");
      localStorage.setItem("isLoged", "true");
      // data?.user?.appointment&&$('#payment_info_pay').removeClass('d-none')&&
      // $('#payment_info_next').addClass('d-none');
      checkLogin();
    },
    error: function (data) {
      localStorage.setItem("isLoged", "false");
      localStorage.setItem("isAdmin", "false");
      checkLogin();
    },
  });

  const checkLogin = () => {
    const isLoged = localStorage.getItem("isLoged");
    const isAdmin = localStorage.getItem("isAdmin");
    const isAffiliate=localStorage.getItem("isAffiliate")
    isLoged === "true" && $("#login_link").addClass("d-none");
    isLoged === "true" && $("#logout_link").removeClass("d-none");
    isLoged !== "true" && $("#login_link").removeClass("d-none");
    isLoged !== "true" && $("#logout_link").addClass("d-none");
    isLoged === "true" && isAffiliate!=="true" && $("#voltage_btn_title").text("Start Now");
    isLoged !== "true" && $("#voltage_btn_link").attr("href","/register?to=affiliate");
    isLoged === "true" && isAffiliate==="true" && $("#voltage_btn_title").text("My Link");
    
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
    const urlParams = new URLSearchParams(window.location.search);
    const affiliatedBy = urlParams.get('affiliatedBy');
    const url=affiliatedBy?`${base_url}/register?affiliatedBy=${affiliatedBy}`:`${base_url}/register`
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
      url: url,
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
      url: window.location.href,
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify({ login_email, login_password, rememberme }),
      success: function (data) {
        // if(!data.intakeFilled)localStorage.setItem("showJotFormCheckout", "true");
        localStorage.setItem("isLoged", "true");
        data?.info?.role?.role?.toLowerCase() !== "admin" &&
          localStorage.setItem("isAdmin", "false");
        data?.info?.role?.role?.toLowerCase() === "admin" &&
          localStorage.setItem("isAdmin", "true");
        location.href = '/';
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
        $("#forgot_message").text(data.responseJSON.message);
        $("#forgot_message").removeClass("d-none");
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
    const bot_val = $("#form_botcheck").val()
    if (bot_val) {
      location.href = "/"
      return
    }
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
  //use new_payment
  $('#otherPaymentCheckbox').change(function() {
    if ($(this).is(':checked')) {
      $('#use_new_payment').removeClass('d-none')
    } else {
      $('#use_new_payment').addClass('d-none')
    }
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
  // const intakeParam = urlParams.get("intakeFilled");
  // if (intakeParam === "false") localStorage.setItem("showJotFormCheckout", "true");
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
  

  $("#product-select").on("change", function () {
    const id = this.value;
    fetcheProductDetail(id);
  });

  const fetcheProductDetail = (id) => {
    $.ajax({
      url: `${base_url}/getproductbyid/${id}`,
      method: "GET",
      success: function (data) {
        $("div").children("#product-name").val(data?.product_name);
        // $("div").children("#product-description").val(data.description);
        $("div").children("#product-price").val(data?.price);
        // $("div").children("#product-type").val(data.type);
        $("div").children("#product-catagory-select").val(data?.productCatagory).change();

        $("div").children("#product-type-select").val(data?.type).change();
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
    // const description = $("div").children("#product-description").val();
    const price = $("div").children("#product-price").val();
    const type = $("div").children("#product-type-select").val();
    const productCatagory = $("div").children("#product-catagory-select").val();
    $("#update_product_text").addClass("d-none");
    $("#update_product_text_spin").removeClass("d-none");
    $.ajax({
      url: `${base_url}/editproduct/${selected_id}`,
      data: { product_name, price, type, productCatagory },
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
      error: function (err) {
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
    const product_name = $("#new-product-name").val()
    const price = $("#new-product-price").val()
    // const description = $("#new-product-description").val()
    // const type = $("#new-product-type-select").text()
    const type = $("#new-product-type-select option:selected").text().trim();
    const productCatagory = $("#new-product-catagory-select").val()
    $("#add-new-product-error").addClass("d-none");
    if (!product_name || !price) {
      $("#add_product_text").removeClass("d-none");
      $("#add_product_text_spin").addClass("d-none");
      !price && $("#add-new-product-error").text("please add product price").removeClass("d-none");
      !product_name && $("#add-new-product-error").text("please add product name").removeClass("d-none");
      return
    }
    console.log( product_name, price, type, productCatagory)
    $.ajax({
      url: `${base_url}/addproduct`,
      method: "POST",
      data: { product_name, price, type, productCatagory },
      success: function (data) {
        $("#add_product_text").removeClass("d-none");
        $("#add_product_text_spin").addClass("d-none");
        $("#add_new_product").modal("hide");
        $("#delete_user_success").modal("show");
        $("#new-product-name").val('')
        $("#new-product-price").val('')
        // $("#new-product-description").val('')
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
//user-affiliate
$("#user_affiliate_search").on("click", function (event) {
  const email=$('#search-user-affiliate-email').val()
  if (!email) {
    $("#user_affiliate_search_notify")
      .text("please fill the search query")
      .removeClass("d-none alert alert-danger")
      .addClass("alert alert-primary");
    return;
  }
  $("#user_affiliate_search_notify").addClass("d-none");
  $("#search_user_affiliate_text").addClass("d-none");
  $("#search_user_affiliate_text_spin").removeClass("d-none");
  loadAffiliateRelationTable(email)
})
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
          <td id="user-state" data-active=${user.isActive}>${user.isActive ? "Active" : "Blocked"
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
          ${!user.isActive
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
    $("#update-user-phone").css('border-color', 'rgb(206, 212, 218)')

    $.ajax({
      url: `${base_url}/getuserbyid/${id}`,
      type: "GET",
      success: (user) => {
        $("#update-first-name").val(user?.first_name);
        $("#update-last-name").val(user?.last_name);
        $("#update-user-email").val(user?.email);
        $("#update-user-address").val(user?.address);
        $("#update-user-city").val(user?.city);
        $("#update-user-state").val(user?.state);
        $("#update-user-addressline2").val(user?.apt);
        $("#update-user-zip").val(user?.zip_code);
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
    if (!(formatPhoneNumber(phone_number))) {
      $("#update-user-phone").css('border-color', 'red')
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
        phone_number: phone_number.replace(/-/g, ""),

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
          <td id="user-state" data-active=${user.isActive}>${user.isActive ? "Active" : "Blocked"
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
          ${!user.isActive
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
        alert(
          "Error retrieving users from database, please tell Jacob this isn't working!"
        );
      },
    });
  };
  $('#order_success_modal').modal({
    backdrop: 'static',
    keyboard: false
  })

  const loadOrderTable = () => {
    $("#order-table-body").empty();
    $.ajax({
      url: `${base_url}/getorders`,
      type: "GET",
      success: (orders) => {
        orders?.forEach((order) => {
          $("#order-table-body").append(`
          <tr>
          <td>${order?.user?.first_name + ' ' + order?.user?.last_name || ""}</td>
          <td>${order?.user?.phone || ""}</td>
          <td>${order?.user?.email || ""}</td>
          <td>${order?.user?.address || ""}</td>
          <td>${order?.user?.city || ""}</td>
          <td>${order?.user?.state || ""}</td>
          <td>${order?.user?.country || ""}</td>
          <td>
          <ul>
          ${order?.order_products?.map((product) => {
            return `<li id="product-li" class="product-li-name">${product.product_name}</li>`
          }).join('')
            }
          </ul>
          </td>
          <td>
          <ul>
          ${order?.order_products?.map((product) => {
              return `<li id="product-li" class="product-li-quantity">${product.quantity}</li>`
            }).join('')
            }
          </ul>
          </td>
          <td>
          <ul>
          ${order?.order_products?.map((product) => {
              return `<li id="product-li" class="product-li-price">${product.price}</li>`
            }).join('')
            }
          </ul>
          </td>
          <td>${order?.total_paid_amount || ""}</td>
          <td>${order?.transId || ""}</td>
          <td>${new Date(order?.order_date).toLocaleDateString() || ""}</td>
      </tr>`);
        });
      },
      error: (error) => {
      
      },
    });
  };

  const loadOrderSubscriptionTable = () => {
    $("#order-subscription-table-body").empty();
    $.ajax({
      url: `${base_url}/subscriptionOrder`,
      type: "GET",
      success: (orders) => {
        orders?.forEach((order) => {
          $("#order-subscription-table-body").append(`
          <tr>
          <td>${order?.user?.first_name + ' ' + order?.user?.last_name || ""}</td>
          <td>${order?.user?.email || ""}</td>
          <td>${order?.period || ""}</td>
          <td>${order?.status || ""}</td>
          <td>$${order?.paymentAmount || ""}</td>
          <td>${order?.currentPeriod || ""}</td>
          <td>$${Number(order?.paymentAmount)*Number(order?.currentPeriod) || ""}</td>          
      </tr>`);
        });
      },
      error: (error) => {
      
      },
    });
  };

  const loadAffiliateRelationTable = (option='') => {
    $("#user-affiliate-table-body").empty();
    $.ajax({
      url: `${base_url}/affiliaterelation?affiliator_email=${option}`,
      type: "GET",
      success: (affiliates) => {       
        affiliates?.forEach((affiliate) => {
          let affiliateRows = "";
          if (affiliate?.affiliate?.length) {
            affiliateRows = `<tr>
              <td rowspan="${affiliate.affiliate.length + 1}">${affiliate.first_name} ${affiliate.last_name}</td>
              <td rowspan="${affiliate.affiliate.length + 1}">${affiliate.email}</td>
              <td rowspan="${affiliate.affiliate.length + 1}">${affiliate.affiliate.length}</td>

            </tr>`;
            affiliate.affiliate.forEach((aff) => {
              affiliateRows += `<tr>
                <td>${aff.first_name} ${aff.last_name}</td>
                <td>${aff.email}</td>
              </tr>`;
            });
          } else {
            affiliateRows = `<tr>
              <td>${affiliate.first_name} ${affiliate.last_name}</td>
              <td>${affiliate.email}</td>
              <td>0</td>
              <td>-</td>
              <td>-</td>
            </tr>`;
          }
          $("#user-affiliate-table-body").append(`
            ${affiliateRows}
          `);
        });
        $("#search_user_affiliate_text").removeClass("d-none");
        $("#search_user_affiliate_text_spin").addClass("d-none");
      },
      error: function (data) {
          $("#user_affiliate_search_notify")
            .text(data?.responseJSON?.message)
            .removeClass("d-none alert alert-primary")
            .addClass("alert alert-danger");
          $("#search_user_affiliate_text").removeClass("d-none");
          $("#search_user_affiliate_text_spin").addClass("d-none");
      }
    });
  };
  // const loadAffiliateRelationTable = () => {
  //   $("#user-affiliate-table-body").empty();
  //   $.ajax({
  //     url: `${base_url}/affiliaterelation`,
  //     type: "GET",
  //     success: (affiliates) => {
  //       affiliates?.forEach((affiliate) => {
  //         $("#user-affiliate-table-body").append(`
  //         <tr>
  //         <td colspan=${affiliate?.affiliate?.length||1}>${affiliate?.first_name + ' ' + affiliate?.last_name || "-"}</td>
  //         <td colspan=${affiliate?.affiliate?.length||1}>${affiliate?.email || "-"}</td>
  //         ${affiliate?.affiliate.map(e=>
  //           `<td>${e?.first_name + ' ' +e?.last_name || "-"}</td>
  //           <td>${e?.email || "-"}</td>`
  //         )}
  //         <td colspan=${affiliate?.affiliate?.length}</td>
  //         </tr>`);
  //       });
  //     },
  //   });
  // };
  const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return null;
  }
const loadUserPaymentMethod=()=>{
  $.ajax({
    url: `${base_url}/getmypaymentmethod`,
    method: "GET",
    success: function (data) {
    if(data.length>0){
      $("#payment_card_list").empty()
      $("#check_exist_payment").removeClass('d-none')
      $('#otherPaymentCheckbox').prop('checked', false);
      $("#use_new_payment").addClass('d-none')
      data?.forEach(payment => {
        $("#payment_card_list").append(`
        <div id="each_card">
        <input type="radio" class="card_selector" id=${payment.id} name="card" value=${payment.userProfilePaymentId}>
        <label for=${payment.id}>Card Number: ${payment.cardLastDigit}</label>
        </div>
        `)
      })
    }
    $('.card_selector').first().prop('checked', true);

    $('.card_selector').on('change', function() {
      var selectedValue = $('input[name="card"]:checked').val();
    });
    },
    error: (error) => {
    },
  })
}

// $('#schedule-appointment-order').on('click', function (event) {
//   event.preventDefault()
//   const product_ordered =$('#telehealth-appt-checkbox:checked').parent('[id=tel-product]').data('productid')
//   $("#schedule_appointment_text").addClass("d-none");
//   $("#schedule_appointment_text_spin").removeClass("d-none");
//   if (!product_ordered) {
//   $("#select-product-error").removeClass("d-none").text("Please select service for the appointment")
//    return
//   }
//   $.ajax({
//     url: `${base_url}/appointment`,
//     type: "POST",
//     contentType: 'application/json',
//     data: JSON.stringify({ productId:product_ordered }),
//     success: () => {
//       location.href='/appointment'
//     },
//     error: (error) => {
//       $("#select-product-error").removeClass("d-none").text(error.responseJSON.message)
//       $("#schedule_appointment_text").removeClass("d-none");
//       $("#schedule_appointment_text_spin").addClass("d-none");
//     },

//   })
// })
  //copmlete order
  $('#complete-order').on('click', function (event) {
    event.preventDefault()
    let product_ordered = []
    $('#telehealth-appt-checkbox:checked').parent('[id=tel-product]').each(function () {
      product_ordered.push({ productId: $(this).data('productid') })
    })
    if (product_ordered.length === 0) {

      $("#select-product-error").removeClass("d-none")
      $('body').scrollTo('.tbl-shopping-cart');
      return
    }
    //please select one or more product
    !($("#checkout-form-ccNumber").val()) ? $("#checkout-form-ccNumber").css('border-color', 'red') :
      $("#checkout-form-ccNumber").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-ccExpiry").val() ? $("#checkout-form-ccExpiry").css('border-color', 'red') :
      $("#checkout-form-ccExpiry").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-cvc").val() ? $("#checkout-form-cvc").css('border-color', 'red') :
      $("#checkout-form-cvc").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-firstname-on-cc").val() ? $("#checkout-form-firstname-on-cc").css('border-color', 'red') :
      $("#checkout-form-firstname-on-cc").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-lastname-on-cc").val() ? $("#checkout-form-lastname-on-cc").css('border-color', 'red') :
      $("#checkout-form-lastname-on-cc").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-firstname").val() ? $("#checkout-form-firstname").css('border-color', 'red') :
      $("#checkout-form-firstname").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-lastname").val() ? $("#checkout-form-lastname").css('border-color', 'red') :
      $("#checkout-form-lastname").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-email").val() ? $("#checkout-form-email").css('border-color', 'red') :
      $("#checkout-form-email").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-address").val() ? $("#checkout-form-address").css('border-color', 'red') :
      $("#checkout-form-address").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-city").val() ? $("#checkout-form-city").css('border-color', 'red') :
      $("#checkout-form-city").css('border-color', 'rgb(206, 212, 218)')
    !$('#checkout-form-state').val() ? $("#checkout-form-state").css('border-color', 'red') :
      $("#checkout-form-state").css('border-color', 'rgb(206, 212, 218)')
    !$("#checkout-form-zip").val() ? $("#checkout-form-zip").css('border-color', 'red') :
      $("#checkout-form-zip").css('border-color', 'rgb(206, 212, 218)')
    $("#select-product-error").addClass("d-none")
    $('#spinner-div').show();
    $('#complete-order-error').addClass('d-none')
    // $(this).prop('disabled', true);
    const payment_detail = {
      cardNumber: $("#checkout-form-ccNumber").val(),
      expirtationDate: $("#checkout-form-ccExpiry").val(),
      cardCode: $("#checkout-form-cvc").val(),
      ownerFirstName: $("#checkout-form-firstname-on-cc").val(),
      ownerLastName: $("#checkout-form-lastname-on-cc").val(),

      //billing info
      billingFirstName: $("#checkout-form-firstname").val(),
      billingLastName: $("#checkout-form-lastname").val(),
      email: $("#checkout-form-email").val(),
      address: $("#checkout-form-address").val(),
      city: $("#checkout-form-city").val(),
      state: $('#checkout-form-state').val(),
      zip: $("#checkout-form-zip").val(),
      customer_payment_profile_id: $('input[type="radio"].card_selector:checked').val(),
      use_exist_payment: !($("#otherPaymentCheckbox").is(':checked')),
      save_payment_info: $("#saveCardCheckbox").is(':checked')
    } 
    const apply_discount=$("#applyDiscountCheckbox").is(':checked')
    //subscription
    const payment_type=$('input[name="subscriptionType"]:checked').val()
    let payment_type_object={}

      if (payment_type === "subscription") {
        const selectedDuration = $('#duration').val();
        payment_type_object={
          subscription:true,
          subscriptionPeriod:Number(selectedDuration)
        }
        product_ordered=product_ordered[0]
        $.ajax({
          url: `${base_url}/addordersubscription`,
          method: "POST",
          contentType: 'application/json',
          data: JSON.stringify({  payment_detail, product_ordered,...payment_type_object }),
          success: function ({is_fitness_plan_exist,is_meal_plan_exist}) {
            $('#spinner-div').hide();
            $('input[id="telehealth-appt-checkbox"]').prop('checked', false);
            if (is_fitness_plan_exist) {
             return location.href = '/fitness-plan'
            }
            if (is_meal_plan_exist) {
              return location.href = '/meal-plan'
            }
          
            $("#cart-total-price").text(0);
            loadUserPaymentMethod()
          },
          error: function (data) {
            $('#spinner-div').hide();
            $('#complete-order-error').removeClass('d-none').
              text(data.responseJSON.message)
          },
        });
      }
      
    //here make ajax call to compelete the order
    else{
    $.ajax({
      url: `${base_url}/addorder`,
      method: "POST",
      contentType: 'application/json',
      data: JSON.stringify({  payment_detail, product_ordered,apply_discount,...payment_type_object }),
      success: function ({is_appointment_exist,product_names,is_fitness_plan_exist,is_meal_plan_exist}) {
        $('#spinner-div').hide();
        $('input[id="telehealth-appt-checkbox"]').prop('checked', false);
        if (is_fitness_plan_exist) {
         return location.href = '/fitness-plan'
        }
        if (is_meal_plan_exist) {
          return location.href = '/meal-plan'
        }
        if (is_appointment_exist) {
          return location.href = '/success'
          }
        else {
          $("#order_success_text").text("Close")
          $("#order-confirmation").addClass("btn-secondary").removeClass("btn-primary")
          $('#order_success_text').attr('data-bs-dismiss', 'modal');
          $("#order-confirmation").removeClass("procced-to-checkout")
          $('#close-mod-btn').removeClass('d-none');
          $("#order-success-message").html(function () {
            return `
            Thank you for renewing  ${product_names.slice(0, -1).join(', ')}${product_names.length > 1 ?
                ' and ' : ''}${product_names[product_names.length - 1]} with TestRxMD.
            We will begin working on your order immediately. If you have any questions or concerns, please call (812) 296-6499.
            `;
          });
          $("#order_success_modal").modal('show')
          $("#checkout-form-firstname-on-cc").val('')
          $("#checkout-form-lastname-on-cc").val('')
          $("#checkout-form-cvc").val('')
          $("#checkout-form-ccNumber").val('')
          $("#checkout-form-ccExpiry").val('')
        }
        $("#cart-total-price").text(0);
        loadUserPaymentMethod()
      },
      error: function (data) {
        console.log(data.responseJSON)
        $('#spinner-div').hide();
        $('#complete-order-error').removeClass('d-none').
          text(data.responseJSON.message)
      },
    });
  }
  })

  //copmlete appt order
  // $('#complete-appt-order').on('click', function (event) {
  //   event.preventDefault()
  //   const product_ordered = []
  //   const product_id=$('#appt-product').data('productid')
  //   product_ordered.push({productId:product_id})
  //   if (product_ordered.length === 0) {
  //     return
  //   }
  //   //please select one or more product
  //   !($("#checkout-form-ccNumber").val()) ? $("#checkout-form-ccNumber").css('border-color', 'red') :
  //     $("#checkout-form-ccNumber").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-ccExpiry").val() ? $("#checkout-form-ccExpiry").css('border-color', 'red') :
  //     $("#checkout-form-ccExpiry").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-cvc").val() ? $("#checkout-form-cvc").css('border-color', 'red') :
  //     $("#checkout-form-cvc").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-firstname-on-cc").val() ? $("#checkout-form-firstname-on-cc").css('border-color', 'red') :
  //     $("#checkout-form-firstname-on-cc").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-lastname-on-cc").val() ? $("#checkout-form-lastname-on-cc").css('border-color', 'red') :
  //     $("#checkout-form-lastname-on-cc").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-firstname").val() ? $("#checkout-form-firstname").css('border-color', 'red') :
  //     $("#checkout-form-firstname").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-lastname").val() ? $("#checkout-form-lastname").css('border-color', 'red') :
  //     $("#checkout-form-lastname").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-email").val() ? $("#checkout-form-email").css('border-color', 'red') :
  //     $("#checkout-form-email").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-address").val() ? $("#checkout-form-address").css('border-color', 'red') :
  //     $("#checkout-form-address").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-city").val() ? $("#checkout-form-city").css('border-color', 'red') :
  //     $("#checkout-form-city").css('border-color', 'rgb(206, 212, 218)')
  //   !$('#checkout-form-state').val() ? $("#checkout-form-state").css('border-color', 'red') :
  //     $("#checkout-form-state").css('border-color', 'rgb(206, 212, 218)')
  //   !$("#checkout-form-zip").val() ? $("#checkout-form-zip").css('border-color', 'red') :
  //     $("#checkout-form-zip").css('border-color', 'rgb(206, 212, 218)')
  //   $("#select-product-error").addClass("d-none")
  //   $('#spinner-div').show();
  //   $('#complete-order-error').addClass('d-none')
  //   // $(this).prop('disabled', true);
  //   const payment_detail = {
  //     cardNumber: $("#checkout-form-ccNumber").val(),
  //     expirtationDate: $("#checkout-form-ccExpiry").val(),
  //     cardCode: $("#checkout-form-cvc").val(),
  //     ownerFirstName: $("#checkout-form-firstname-on-cc").val(),
  //     ownerLastName: $("#checkout-form-lastname-on-cc").val(),

  //     //billing info
  //     billingFirstName: $("#checkout-form-firstname").val(),
  //     billingLastName: $("#checkout-form-lastname").val(),
  //     email: $("#checkout-form-email").val(),
  //     address: $("#checkout-form-address").val(),
  //     city: $("#checkout-form-city").val(),
  //     state: $('#checkout-form-state').val(),
  //     zip: $("#checkout-form-zip").val(),
  //     customer_payment_profile_id: $('input[type="radio"].card_selector:checked').val(),
  //     use_exist_payment: !($("#otherPaymentCheckbox").is(':checked')),
  //     save_payment_info: $("#saveCardCheckbox").is(':checked')
  //   } 
  //   const apply_discount=$("#applyDiscountCheckboxAppt").is(':checked')
  //   //here make ajax call to compelete the order
  //   $.ajax({
  //     url: `${base_url}/addorder`,
  //     method: "POST",
  //     contentType: 'application/json',
  //     data: JSON.stringify({  payment_detail, product_ordered,apply_discount }),
  //     success: function (data) {
  //       $('#spinner-div').hide();
  //       $('input[id="telehealth-appt-checkbox"]').prop('checked', false);
  //         location.href = '/account'
  //     },
  //     error: function (data) {
  //       $('#spinner-div').hide();
  //       $('#complete-order-error').removeClass('d-none').
  //         text(data.responseJSON.message)
  //     },
  //   });
  // })

//change password
$('#success_toast_page .close').on('click', function() {
  $(this).closest('#success_toast_page').removeClass('show');
});
$('#change_password_btn').on('click',function(event){
  event.preventDefault();
  $("#change_password_text_spin").removeClass("d-none");
  $("#change_password_text").addClass("d-none");

  $('#change_password_error').addClass('d-none')
  const old_password=$('#account_form_old_password').val()
  const new_password= $('#account_form_new_password').val()
  const confirm_password=$('#account_form_confirm_password').val()
  if(!old_password||!new_password||!confirm_password){ 
    $("#change_password_text_spin").addClass("d-none");
    $("#change_password_text").removeClass("d-none");   
    $('#change_password_error').text("please fill all field").removeClass('d-none')
    return
  }
  if(new_password!=confirm_password){
    $("#change_password_text_spin").addClass("d-none");
    $("#change_password_text").removeClass("d-none");
    $('#change_password_error').text("new password must match").removeClass('d-none')
    return 
  }
$.ajax({
  url: `${base_url}/changemypassword`,
  method: "PUT",
  contentType: 'application/json',
  data: JSON.stringify({ old_password,new_password,confirm_password }),
  success: function (data) {
    $('#account_form_old_password').val('')
    $('#account_form_new_password').val('')
    $('#account_form_confirm_password').val('')

    $("#change_password_text_spin").addClass("d-none");
    $("#change_password_text").removeClass("d-none");

    $("#success_toast_title").text("password changed")
    $('#success_toast_page').addClass('show');
    setTimeout(function() {
      $('#success_toast_page').removeClass('show');
    }, 5000);

  },
  error: function (data) {
    $("#change_password_text_spin").addClass("d-none");
    $("#change_password_text").removeClass("d-none");
    $('#change_password_error').text(data.responseJSON.message).removeClass('d-none')
  },
});
});
let is_payable_exist=false
let payable_amount=0
function getAffiliateTotalAmount(){
  is_payable_exist=false
  $.ajax({
    url: `${base_url}/affiliate/amount`,
    method: "GET",
    contentType: 'application/json',
    success: function (data) {
      if((Number(data?.amount))>0){
        payable_amount=Number(data?.amount)  
      }
      // Number(data?.amount)<=0?$("#apply_discount_p").addClass("d-none"):
      // $("#apply_discount_p").removeClass("d-none")
      let cash_payable=0
      if(data?.amount&&data?.amount>20){
        $('#get_code_btn').prop('disabled', false);
        $("#get_paid_con").removeClass('d-none')
        is_payable_exist=true  
      }
      //show 70% for cashout
      cash_payable=data?.amount
      $('#total_paid_amount').text(`Total Payable Amount= $${cash_payable||0}`)
    },
    error: function (data) {
      $('#total_paid_amount').text(`Total Payable Amount= $0/E`)
    },
  });
  
}
$('[data-toggle="tooltip"]').tooltip()
//get_paid

$('#get_paid_check').change(function() {
  if ($(this).is(':checked')&&is_payable_exist) {
    $('#get_paid_part').removeClass('d-none')
  } else {
    $('#get_paid_part').addClass('d-none')
  }
});

$('input[id="telehealth-appt-checkbox"]').on("click", function () {
  let total_price = 0;
  $("#telehealth-appt-checkbox:checked")
    .parent("td")
    .siblings("#product-price")
    .each(function () {
      let product_price = Number($(this).children("span").text());
      total_price = total_price + product_price;
    });
    const apply_discount=$("#applyDiscountCheckbox").is(':checked')
    if(apply_discount){
      //you will atleast pay 10% of it
    if((total_price*0.9)<Number(payable_amount)){
      const discountedPrice=Number(total_price)*0.1
      $("#cart-total-price").text(discountedPrice);
    }
    else{
      const discountedPrice=Number(total_price)-Number(payable_amount)
      $("#cart-total-price").text(discountedPrice);
    }
  }
else{
  $("#cart-total-price").text(total_price);
}
});

$('#applyDiscountCheckboxAppt').change(function() {
  if ($(this).is(':checked')) {
  const appt_price= Number($("#appt_pay_price").text())
  if((appt_price*0.9)<Number(payable_amount)){
    const discountedPrice=Number(total_price)*0.1
    $("#appt-total-price").text(discountedPrice);
  }
  else{
    const discountedPrice=Number(appt_price)-Number(payable_amount)
    $("#appt-total-price").text(discountedPrice);
  }
}
else{
  const appt_price= Number($("#appt_pay_price").text())
  $("#appt-total-price").text(appt_price);

}
})

//apply discount
$('#applyDiscountCheckbox').change(function() {
  if ($(this).is(':checked')) {
    let total_price = 0;
      $("#telehealth-appt-checkbox:checked")
      .parent("td")
      .siblings("#product-price")
      .each(function () {
        let product_price = Number($(this).children("span").text());
        total_price = total_price + product_price;
      });
      if((total_price*0.9)<Number(payable_amount)){
        const discountedPrice=Number(total_price)*0.1
        $("#cart-total-price").text(discountedPrice);
      }
      else{
        const discountedPrice=Number(total_price)-Number(payable_amount)
        $("#cart-total-price").text(discountedPrice);
      }
  } else {
    let total_price = 0;
      $("#telehealth-appt-checkbox:checked")
      .parent("td")
      .siblings("#product-price")
      .each(function () {
        let product_price = Number($(this).children("span").text());
        total_price = total_price + product_price;
      });
      $("#cart-total-price").text(total_price);
  }
});

function getQrCode(route){
  $.ajax({
    url: `${base_url}/affiliatecode`,
    method: "GET",
    success: function (data) {
      // $('#generateQR').addClass('d-none')
      // $('#copy_url_div').removeClass('d-none')
      $('#QRcode_image').attr('src', data.src);
      if(route){
          location.href = '/affiliate'
      }
      // $('#qr_url_input').val(data.url)
    },
  });
}
function getOtp(){
  $('#get_paid_error').addClass('d-none')
  console.log("hello")
  $.ajax({
    url: `${base_url}/otp`,
    method: "GET",
    success: function (data) {
      console.log(data)
      $('#get_code_btn').prop('disabled',true)
      $("#success_toast_title").text("otp sent to your email")
      $('#success_toast_page').addClass('show');
    setTimeout(function() {
      $('#success_toast_page').removeClass('show');
    }, 5000);
    setTimeout(()=>{
      $('#get_code_btn').prop('disabled',false)
    },60000)
    $("#get_code_text_spin").addClass("d-none");
    $("#get_code_text").removeClass("d-none");
    },
    error:function(error){
      $('#get_code_btn').prop('disabled',false)
      $("#get_code_text_spin").addClass("d-none");
      $("#get_code_text").removeClass("d-none");
      $('#get_paid_error').removeClass('d-none').text(err.responseJSON.message)

    }
  });
 
}

$('#get_code_btn').on("click",async()=>{
  $("#get_code_text_spin").removeClass("d-none");
  $("#get_code_text").addClass("d-none");
  getOtp()

})
$('#otp_code_input').on('input', function() {
  if ($(this).val().length > 4) {
    $('#confirm_otp_btn').prop('disabled', false);
  }
  else{
    $('#confirm_otp_btn').prop('disabled', true);
  }
});
const loadAffiliateTable = () => {
  $("#affiliate_table_body").empty();
  $.ajax({
    url: `${base_url}/affiliate/detail`,
    type: "GET",
    success: ({affilate_detail}) => {
      affilate_detail?.forEach((affilate) => {
        $("#affiliate_table_body").append(`
      <tr>
        <td>${affilate?.buyer?.first_name + ' ' + affilate?.buyer?.last_name || ""}</td>
        <td>${new Date(affilate?.createdAt).toLocaleDateString()}</td>
        <td>$${affilate?.amount}</td>
        <td>${affilate?.status}</td>
      </tr>`);
      });
    },
    error: (error) => {
    
    },
  });
};

// const loadAppointmentTable = () => {
//   $("#appts_table_body").empty();
//   $.ajax({
//     url: `${base_url}/appointment/detail`,
//     type: "GET",
//     success: ({appointments}) => {
//       appointments?.forEach((appointment) => {
//         let timeString='-'
//         let dateString='-'
//         if(appointment?.appointmentDateTime){
//           const datetime = new Date(appointment?.appointmentDateTime);
//            timeString = datetime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
//            dateString=new Date(appointment?.appointmentDateTime).toLocaleDateString()
//         }
     
//         $("#appts_table_body").append(`
//       <tr>
//         <td>${dateString}</td>
//         <td>${timeString}</td>
//         <td>${appointment?.doctor?appointment?.doctor?.first_name+' '+appointment?.doctor?.last_name:'-'}</td>
//         <td>
//         ${appointment.joinUrl ?
//           `<a href="${appointment.joinUrl}" target="_blank" class="btn btn-primary m-0 p-0 ${((new Date(appointment.appointmentDateTime) > new Date())||!appointment?.paymentStatus) ? 'disabled' : ''}">Zoom Link</a>`
//           : '-'
//         }
//        </td>
      
//         <td>${appointment?.paymentStatus?'Paid':'unpaid'}</td>
//         <td>${appointment?.appointmentStatus} ${((appointment?.appointmentStatus==="in progress"||appointment?.appointmentStatus==="pending")&&!appointment?.paymentStatus)?"<a href='/appointment'>(compelete schedule)</a>":''}</td>
//       </tr>`);
//       });
//     },
//     error: (error) => {
    
//     },
//   });
// };

function confirmOtp(){
  const otp=$('#otp_code_input').val()
  $('#get_paid_error').addClass('d-none')
  if(otp){
  $.ajax({
    url: `${base_url}/otp`,
    method: "POST",
    data:{otp},
    success: function (data) {
     $("#success_toast_title").text("payment is pending, we will notify you with email as soon as it succeed")
     $('#success_toast_page').addClass('show');
   setTimeout(function() {
     $('#success_toast_page').removeClass('show');
   }, 5000);
   $("#confirm_code_text_spin").addClass("d-none");
   $("#confirm_code_text").removeClass("d-none");
   $('#get_paid_part').addClass('d-none')
   getAffiliateTotalAmount()
   loadAffiliateTable()
    },
    error:function(err){
      $("#confirm_code_text_spin").addClass("d-none");
      $("#confirm_code_text").removeClass("d-none");
      $('#get_paid_error').removeClass('d-none').text(err.responseJSON.message)
    }
  });
 }
}

$('#confirm_otp_btn').on("click",()=>{
  $("#confirm_code_text_spin").removeClass("d-none");
  $("#confirm_code_text").addClass("d-none");
  confirmOtp()
})



//get affiliate
$('#generateQR').on('click',function(event){
  getQrCode(true)
});
if(window?.location?.href==`${base_url}/affiliate` && 
localStorage.getItem("isAffiliate")==="true"){
getQrCode()
}

if(window?.location?.href==`${base_url}/account` && 
localStorage.getItem("isAffiliate")==="true"){
  loadAffiliateTable()
  getAffiliateTotalAmount()
}
// if(window?.location?.href==`${base_url}/account`){
//   loadAppointmentTable()
// }
if((window?.location?.href==`${base_url}/checkout`||
window?.location?.href==`${base_url}/price-plan`||
window?.location?.href==`${base_url}/appointment-checkout`) && 
localStorage.getItem("isAffiliate")==="true"){
  getAffiliateTotalAmount()
}
if(window?.location?.href==`${base_url}/checkout`||
window?.location?.href==`${base_url}/price-plan`||
window?.location?.href==`${base_url}/appointment-checkout`){
  loadUserPaymentMethod()
}


// if(localStorage.getItem("isAffiliate")!=="true"||payable_amount==0){
//   $("#apply_discount_p").addClass("d-none")
// }
$('#copy_url_btn').click(function() {
      const url=$('#qr_url_input').val()
      navigator.clipboard.writeText(url)
});

  $(document).on("click", ".procced-to-checkout", function () {
    location.href = '/success'
  })
  setTimeout(() => { $('#continue-schedule').attr("disabled", false) }, 30000)
  // $('#continue-schedule').on('click', () => {
  //   $('#appointment-form').removeClass('d-none')
  //   $('#continue-schedule').addClass('d-none')
  // })
  // $('#continue-schedule').on('click', () => {
  //   const product_ordered =$('#telehealth-appt-checkbox:checked').parent('[id=tel-product]').data('productid')
  //   console.log(product_ordered)
  //   if (product_ordered.length === 0) {

  //     $("#select-product-error").removeClass("d-none")
  //     $('body').scrollTo('.tbl-shopping-cart');
  //     return
  //   }
  //   $.ajax({
  //     url: `${base_url}/appointment`,
  //     type: "POST",
  //     success: ({providers}) => {
  //       $("#appt_doctor").append(`
  //       <option value="">Select Doctor*</option>
  //       `)
  //       providers?.forEach((provider) => {
  //         $("#appt_doctor").append(`
  //         <option value=${provider?.id}>${provider?.first_name+' '+ provider?.last_name}</option>
  //         `)
  //       })
  //       location.href='/appointment'

  //     },
  //   })
  // })
  //doctor dashboard
  $('#therapy_category').change(function() {
  if ($(this).val() !== '') {
    $('#therapy_sub_category').prop('disabled', false);
  } else {
    $('#therapy_sub_category').prop('disabled', true);
  }

  if ($(this).val() === "WL") {
    $('#therapy_sub_category').empty().append(`
    <option value="Stim-Free">Stim-Free</option>
    <option value="Stimulant-Based">Stimulant-Based</option>`);
  }
  if ($(this).val() === "Peptides") {
    $('#therapy_sub_category').empty().append(`
    GH Therapy/Nootropics/Weight-Loss/Rejuvination
      <optgroup label="GH_Therapy">
      <option value="Sermorelin">Sermorelin</option>
      <option value="Ipamorelin">Ipamorelin </option>
      <option value="Sermorelin/Ipamorelin">Sermorelin/Ipamorelin</option>
      <option value="GRF 1-29"> Ipamorelin+Mod GRF 1-29 (CJC 1295 without DAC)</option>
      <option value="MK-677">MK-677</option>
      </optgroup>
      <optgroup label="Nootropics">
      Dihexa, Semax, Selank, 1-Amino-MQ
      <option value="Dihexa">Dihexa</option>
      <option value="Semax">Semax </option>
      <option value="Selank">Selank</option>
      <option value="1-Amino-MQ">1-Amino-MQ</option>
      </optgroup>
      <optgroup label="Weight_Loss">
      <option value="AOD-9604">AOD-9604</option>
      </optgroup>
      <optgroup label="Rejuvination"></optgroup>
      <optgroup label="Anti-Aging/Longevity">
      <option value="BPC-157">BPC-157</option>
      <option value="GHK-Cu">GHK-Cu</option>
      </optgroup>
      <optgroup label="Sexual_Dysfunction">
      <option value="PT-141">PT-141</option>
      <option value="Kisspeptin-10">Kisspeptin-10</option>
      </optgroup>

    `);
  }
});
// $("#appt_appointment_date, #appt_appointment_time").on("change", function() {
//     if ($("#appt_appointment_date").val() && $("#appt_appointment_time").val()) {
//       getAvailableProvider()
//     } else {
//       // Disable the select element if either input is empty
//       $("#appt_doctor").prop("disabled", true);
//     }
//   });

//create appt
//  $("#create_appointment").on("click", function (event) {
//   event.preventDefault();
//   $("#login_error").addClass("d-none");

//   const patientFirstName = $("#appt_first_name").val();
//   const patientLastName = $("#appt_last_name").val();
//   const patientEmail = $("#appt_email").val();
//   const patientPhoneNumber = $("#appt_phone").val();
//   const date= $("#appt_appointment_date").val();
//   const time = $("#appt_appointment_time").val();
//   const doctorId= $("#appt_doctor").val();
//   const formattedTime = moment(time, 'hh:mm A').format('HH:mm');
//   const appointmentDateTime = moment(date).format('YYYY-MM-DD') + 'T' + formattedTime;
  
//   const message=$("#appt_appointment_message").val()
//   $("#appointment_error_message").addClass("d-none")
//   const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   if(!patientEmail
//     ||!patientFirstName
//     ||!patientLastName
//     ||!patientPhoneNumber
//     ||!doctorId){
//     $("#appointment_error_message").removeClass("d-none").text("plase fill all field")
//     return
//     }
//   $("#create_appointment_text").addClass("d-none");
//   $("#create_appointment_text_spin").removeClass("d-none");
//   $.ajax({
//     url: `${base_url}/appointment`,
//     method: "PUT",
//     contentType: 'application/json',
//     data: JSON.stringify({patientEmail,patientFirstName,doctorId,
//     patientLastName,patientPhoneNumber,appointmentDateTime,
//     message,userTimezone}),
//     success: function (data) {
//     //redirect to the next page
//      location.href='/appointment-checkout'
//     },
//     error: function (data) {
//       $('#appointment_error_message').removeClass('d-none').text(data.responseJSON.message)
//       $("#create_appointment_text").removeClass("d-none");
//       $("#create_appointment_text_spin").addClass("d-none");
//     },
//   });
// });

//meal-plan
$("#meal_plan_form").submit(function(event){
  event.preventDefault();
   // prevent the form from submitting normally
   $("#create_meal_text").addClass("d-none");
   $("#create_meal_text_spin").removeClass("d-none");
  const formData = $(this).serializeArray();
  var formDataObj = {};
$.each(formData, function(index, field) {
  formDataObj[field.name] = field.value;
});
$.ajax({
  url: `${base_url}/mealplan`,
  method: "POST",
  contentType: 'application/json',
  data: JSON.stringify(formDataObj),
  success: function (data) {
  //redirect to the next page
   location.href='/account'
  },
  error: function (data) {
    $("#create_meal_text").removeClass("d-none");
    $("#create_meal_text_spin").addClass("d-none");
  },
});

})
//fitness-plan
$("#fitness_plan_form").submit(function(event){
  event.preventDefault();
   // prevent the form from submitting normally
   $("#create_fitness_text").addClass("d-none");
   $("#create_fitness_text_spin").removeClass("d-none");
  const formData = $(this).serializeArray();
  var formDataObj = {};
$.each(formData, function(index, field) {
  formDataObj[field.name] = field.value;
});
$.ajax({
  url: `${base_url}/fitnessplan`,
  method: "POST",
  contentType: 'application/json',
  data: JSON.stringify(formDataObj),
  success: function (data) {
   location.href='/account'
  },
  error: function (data) {
    $("#create_fitness_text").removeClass("d-none");
    $("#create_fitness_text_spin").addClass("d-none");
  },
});

})

$("#continue-schedule").click(function(event){
  event.preventDefault(); // prevent the form from submitting normally
  $("#continue-schedule_text").addClass("d-none");
  $("#continue-schedule_text_spin").removeClass("d-none");
$.ajax({
  url: `${base_url}/checkappt`,
  method: "GET",
  contentType: 'application/json',
  success: function (data) {
    //redirect to given url
    if(data.isApptExist){
      window.location.href = 'https://novelhealth.ai/practice/testrx-md-202981';
    }  
   else{
    location.href='/checkout'
   }
  },
  error: function (data) {
  $("#continue-schedule_text").removeClass("d-none");
  $("#continue-schedule_text_spin").addClass("d-none");
  },
});

})

  // Show subscription options when subscription is selected
  $('input[name="subscriptionType"]').change(function() {
    if ($(this).val() === "subscription") {
      $('#subscriptionOptions').show();
      $('#apply_discount_plan').addClass('d-none');
      $('#applyDiscountCheckbox').prop('checked', false);
      $('#applyDiscountCheckbox').trigger('change');
    } else {
      $('#subscriptionOptions').hide();
      $('#apply_discount_plan').removeClass('d-none');
    }
  });
  

//bot
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const d = new Date();
  const day = days[d.getDay()];
  let hour = d.getHours();
  let minutes = d.getMinutes();
  const ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  hour = hour ? hour : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let time = day + ', ' + hour + ':' + minutes + ' '+ ampm;
  $("#current-date-time").text(time);

//   const base_url = "https://shielded-citadel-34904.herokuapp.com"


  // const base_url = "https://www.testrxmd.com"
 //Toggle fullscreen
        $(".chat-bot-icon").click(function (e) {
            $(this).children('img').toggleClass('hide');
            $(this).children('svg').toggleClass('animate');
            $('.chat-screen').toggleClass('show-chat');
        });
        $('.chat-mail button').click(function () {
            $('.chat-mail').addClass('hide');
            $('.chat-body').removeClass('hide');
            $('.chat-input').removeClass('hide');
            $('.chat-header-option').removeClass('hide');
        });
        $('.end-chat').click(function () {
            $('.chat-body').addClass('hide');
            $('.chat-input').addClass('hide');
            $('.chat-session-end').removeClass('hide');
            $('.chat-header-option').addClass('hide');
        });

        $('.chat-input input').keypress(function (e) {
            const message=$('.chat-input input').val()
            const isNotBotTyping=$('#bot-typing').hasClass('hide')
            const key = e.which;
            if(key == 13 && message.trim() && isNotBotTyping){
                $(`<div class="chat-bubble me">${message}</div>`).insertBefore('.chat-body #bot-typing');
                $('.chat-input input').val('')
                $('#bot-typing').removeClass('hide')
                scrollBottom()
                sendMessageToBot(message)
            }
        }); 
        $('#send-message-bot').click(function () {
            const message=$('.chat-input input').val()
            const isNotBotTyping=$('#bot-typing').hasClass('hide')
            if(message.trim() && isNotBotTyping){
                $(`<div class="chat-bubble me">${message}</div>`).insertBefore('.chat-body #bot-typing');
                $('.chat-input input').val('')
                $('#bot-typing').removeClass('hide')
                scrollBottom()
                sendMessageToBot(message)
            }
         
        });
function sendMessageToBot(message){
    $.ajax({
        url: `${base_url}/chatcompliation`,
        method: "POST",
        data: {message},
        success: function (data) {
        $('#bot-typing').addClass('hide')
        $(`<div class="chat-bubble you">${data.message}</div>`).insertBefore('.chat-body #bot-typing');
        },
        error: function (data) {
            $('#bot-typing').addClass('hide')
            $(`<div class="chat-bubble you">system is busy</div>`).insertBefore('.chat-body #bot-typing');
        },
    });
}
function scrollBottom(){
  const chatBody = $('.chat-body');
if (chatBody.length > 0) {
    chatBody.animate({
        scrollTop: chatBody.get(0).scrollHeight
    }, 1000);
}
}
   scrollBottom()

});


$(window).on('load', function () {
  $('#loading').hide();
})
