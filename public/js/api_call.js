$(document).ready(function () {
  const base_url = "http://localhost:7000";
  // const base_url="https://rxmdsite-production.up.railway.app"

  $("#populate").on("click", function () {
    $("#user-table-body").empty()
    $.ajax({
      url: `${base_url}/getusers`,
      type: "GET",
      success: (users) => {
        console.log("success on click");
        users.docs.forEach((user) => {
          console.log(user);
          $("#user-table-body").append(`
            <tr>
              <td>${user.first_name||''}</td>
              <td>${user.last_name||''}</td>
              <td>${user.email||''}</td>
              <td>${user.isEmailConfirmed||''}</td>
              <td>${user.address||''}</td>
              <td>${user.apt||''}</td>
              <td>${user.city||''}</td>
              <td>${user.state||''}</td>
              <td>${user.zip_code||''}</td>
              <td>${user.phone_number||''}</td>
              <td>${user.intake||''}</td>
              <td>${new Date(user.createdAt).toLocaleDateString()||''}</td>
              <td>
                <span class="delete-user"  data-id="${user.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </span>
                <span class="edit-user" data-id="${user.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                 <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                </svg>
                </span>
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
    console.log(this.value);
    const id = this.value;
    fetcheProductDetail(id);
  });
  
const fetcheProductDetail=(id)=>{
  $.ajax({
    url: `${base_url}/getproductbyid/${id}`,
    method: "GET",
    success: function (data) {
      console.log(data.product_name)
      $('div').children('#product-name').val(data.product_name)
      $('div').children('#product-description').val(data.description)
      $('div').children('#product-price').val(data.price)
    },
  });
}
$('#product-select').children().on('load',function(){
  const first_product_id = $(this).val();
  fetcheProductDetail(first_product_id);
})
$('#product-select').children().first().trigger('load')

//update product
$('#update-product-button').on("click", function () {
  let selected_id = $('#product-select').find(":selected").val();
  const product_name=  $('div').children('#product-name').val()
  const description=$('div').children('#product-description').val()
  const price=$('div').children('#product-price').val()
  console.log(selected_id)
  $("#update_product_text").addClass("d-none");
  $("#update_product_text_spin").removeClass("d-none");
  $.ajax({
    url: `${base_url}/editproduct/${selected_id}`,
    data: {product_name, price, description},
    method: "PUT",
    success: function () {
      $('#product_notify').text("product updated successfully").
      removeClass('d-none alert alert-danger').addClass('alert alert-primary');
      setTimeout(function() {
        $('#product_notify').
        addClass('d-none');
    },3000);
      $("#update_product_text").removeClass("d-none");
      $("#update_product_text_spin").addClass("d-none");
    },
    error: function (data) {
      $('#product_notify').text("something went wrong, please try again").
      removeClass('d-none alert alert-primary').
      addClass('alert alert-danger');
      setTimeout(function() {
        $('#product_notify').
        addClass('d-none');
    },3000);
      $("#update_product_text").removeClass("d-none");
      $("#update_product_text_spin").addClass("d-none");
    },

  });
});
//seacrh user
$('#user_search').on("click", function (event) {
  event.preventDefault();
  const user_name= $('div').children('#edit-name').val() 
  const email=$('div').children('#edit-email').val()
  // const loged_at= $('#loged_at').val() 
  // const loged_out= $('#loged_out_at').val() 
  // const price=$('div').children('#product-price').val()
  // console.log(selected_id)
 let searchString
  if(!email&&!user_name){
    $('#user_search_notify').text("please fill atleast one query for usersearch")
      .removeClass('d-none alert alert-danger').
      addClass('alert alert-primary');
    return 
  }
  user_name?searchString=`name=${user_name}`:searchString
  email?searchString=`email=${email}`:searchString
  $('#user_search_notify').addClass('d-none');
  $("#search_user_text").addClass("d-none");
  $("#search_user_text_spin").removeClass("d-none");
  $("#user-table-body").empty()
  $.ajax({
    url: `${base_url}/getuserbystate?${searchString}`,
    method: "GET",
    success: function (data) {
      if(data?.length==0){
        $('#user_search_notify').text('user not found')
        .removeClass('d-none alert alert-danger').
        addClass('alert alert-primary');
      }
      if(data?.length>0){
        data?.forEach((user) => {
          $("#user-table-body").append(`
          <tr>
            <td>${user.first_name||''}</td>
            <td>${user.last_name||''}</td>
            <td>${user.email||''}</td>
            <td>${user.isEmailConfirmed||''}</td>
            <td>${user.address||''}</td>
            <td>${user.apt||''}</td>
            <td>${user.city||''}</td>
            <td>${user.state||''}</td>
            <td>${user.zip_code||''}</td>
            <td>${user.phone_number||''}</td>
            <td>${user.intake||''}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()||''}</td>
            <td>
              <span class="delete-user"  data-id="${user.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </span>
              <span class="edit-user" data-id="${user.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
               <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
              </svg>
              </span>
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
      $('#user_search_notify').text(data?.responseJSON?.message).
      removeClass('d-none alert alert-primary').addClass('alert alert-danger');   
      $("#search_user_text").removeClass("d-none");
      $("#search_user_text_spin").addClass("d-none");
    },
  });
});

$('#cancel-edit-user').on('click',function(){
  $('div').children('#edit-email').val('')
  $('div').children('#edit-name').val('')
})

});
