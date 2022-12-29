$(document).ready(function(){
  // const base_url="http://localhost:7000"
  const base_url="https://rxmdsite-production.up.railway.app"
    $.ajax({
        url:`${base_url}/checkauth`,
        method:"GET",
        success:function(data)
        {
            console.log("success")
            localStorage.setItem("isLoged","true");
            checkLogin()
        },
        error:function(data){
            localStorage.setItem("isLoged","false");
            checkLogin()
        }
    });
    
    const checkLogin=()=>{
        const isLoged=localStorage.getItem("isLoged");
        isLoged==="true"&&$('#login_link').addClass('d-none');
        isLoged==="true"&&$('#logout_link').removeClass('d-none');
        isLoged!=="true"&&$('#login_link').removeClass('d-none');
        isLoged!=="true"&&$('#logout_link').addClass('d-none');
    }
    checkLogin()

//register api call
    $('#register_user').on("click",
    function(event){
    event.preventDefault();
    $('#register_error').addClass('d-none');
    const first_name=$('#first_name').val()
    const last_name=$('#last_name').val()
    const email=$('#email').val()
    const password=$('#password').val()
    const verify_password=$('#verify_password').val()
    if(password!==verify_password)
    {
        $('#register_error').removeClass('d-none')
        $('#register_error').text("password must match")
        return
    }
    $('#register_text').addClass('d-none');
    $('#register_text_spin').removeClass('d-none');
      $.ajax({
          url:`${base_url}/register`,
          method:"POST",
          data:{first_name, last_name, email, password},
          // dataType : "JSON",
          success:function(data)
          {
           location.href = "/registered"
          },
          error:function(data){
            $('#register_text').removeClass('d-none');
            $('#register_text_spin').addClass('d-none');
            $('#register_error').removeClass('d-none')
            $('#register_error').text(data.responseJSON.message)
          }
      });
  })
  
//login api call
    $('#login_user').on("click",
    function(event){
    event.preventDefault();
    $('#login_error').addClass('d-none');
    const login_email=$('#login_email').val()
    const login_password=$('#login_password').val()
    const rememberme=$('#rememberme').is(":checked")
    $('#login_text').addClass('d-none');
    $('#login_text_spin').removeClass('d-none');
      $.ajax({
          url:`${base_url}/login`,
          method:"POST",
          data:{login_email,login_password,rememberme},
          success:function(data)
          {
            localStorage.setItem("isLoged","true");
            location.href = "/"
          },
          error:function(data){
            $('#login_error').removeClass('d-none')
            $('#login_text').removeClass('d-none');
            $('#login_text_spin').addClass('d-none');
            $('#login_error').text(data.responseJSON.message)
          }
      });
  })

//logout
  $('#logout_link').on("click",function(){
    $.ajax({
        url:`${base_url}/logout`,
        method:"GET",
        success:function(data)
        {
          localStorage.setItem("isLoged","false");
          location.href = "/login"
        },
    });
  })
//forgot password
$('#forgot_password').on("click",function(event){
    event.preventDefault();
    const email=$('#resetPasswordEmail').val()
    $('#invalid_forgotpassword_email').addClass('d-none')
    const isEmailValid=ValidateEmail(email)
    if(!email||!isEmailValid){
        !email&&$('#invalid_forgotpassword_email').removeClass('d-none')
        !isEmailValid&&email&&$('#invalid_forgotpassword_email').removeClass('d-none')
        !isEmailValid&&email&&$('#invalid_forgotpassword_email').text('Invalid Email')
        return
    }
    $('#resetpassword_text_spin').removeClass('d-none');
    $('#resetpassword_text').addClass('d-none');
    $('#forgot_message').addClass('d-none');
  $.ajax({
      url:`${base_url}/forgotpassword`,
      method:"POST",
      data:{email},
      success:function(data)
      {
        $('#resetpassword_text').removeClass('d-none');
        $('#resetpassword_text_spin').addClass('d-none');
        $('#forgot_message').text(data.message)
        $('#forgot_message').removeClass('d-none');
      },
      error:function(data){
        $('#resetpassword_text').removeClass('d-none');
        $('#resetpassword_text_spin').addClass('d-none');
      }
  });
})
//reset password
$('#reset_button').on("click",function(event){
  event.preventDefault();
  console.log('reset')
  const newPassword=$('#npassword').val()
  const confirmNewPassword=$('#cpassword').val()
  $('#reset_error').addClass('d-none')
  if(!newPassword||!confirmNewPassword){
    $('#reset_error').removeClass('d-none')
    $('#reset_error').text('please fill all field')
    return
  }
  if(newPassword!==confirmNewPassword){
      $('#reset_error').removeClass('d-none')
      $('#reset_error').text('password not match')
      return
  }
  $('#reset_button').val("Loading...")
$.ajax({
    url:window.location.href,
    method:"POST",
    data:{password:newPassword},
    success:function(data)
    {
      $('#resetpassword_text').removeClass('d-none');
      $('#resetpassword_text_spin').addClass('d-none');
      $('#forgot_message').text(data.message)
      $('#forgot_message').removeClass('d-none');
      $('#reset_button').val("Submit")
      location.href = "/login"
    },
    error:function(data){
      $('#reset_error').removeClass('d-none')
      $('#reset_error').text("invalid or expired link, please try again")
      $('#resetpassword_text').removeClass('d-none');
      $('#resetpassword_text_spin').addClass('d-none');
      $('#reset_button').val("Submit")
    }
});
})
  //contact form
  $('#submit_contact_form').on("click",function(event){
    event.preventDefault();
    $('#contact_form_email')
    const name=$('#contact_form_name').val()
    const email=$('#contact_form_email').val()
    const message=$('#contact_form_message').val()
    const phone=$('#contact_form_phone').val()
    const subject=$('#contact_form_subject').val()

    $('#invalid_email').addClass('d-none')
    $('#invalid_subject').addClass('d-none')
    $('#invalid_message').addClass('d-none')
    console.log(subject)
    const isEmailValid=ValidateEmail(email)
    if(!email||!subject||!message||!isEmailValid){
        !email&&$('#invalid_email').removeClass('d-none')
        !isEmailValid&&email&&$('#invalid_email').removeClass('d-none')
        !isEmailValid&&email&&$('#invalid_email').text('Invalid Email')
        !subject&&$('#invalid_subject').removeClass('d-none')
        !message&&$('#invalid_message').removeClass('d-none')
        return
    }
    $('#contact_text_spin').removeClass('d-none');
    $('#contact_text').addClass('d-none');
    $.ajax({
        url:`${base_url}/contactform`,
        method:"POST",
        data:{ name, email, phone, subject,message },
        success:function(data)
        {
        $('#contact_form_toast').toast('show');
        $('#contact_text').removeClass('d-none');
        $('#contact_text_spin').addClass('d-none');
        },
        error:function(data){
            alert("email not sent")
            $('#contact_text').removeClass('d-none');
            $('#contact_text_spin').addClass('d-none');
          }
    });
  })
function ValidateEmail(email)
{
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
if(email?.match(mailformat)){
    return true;
}
else{
return false;
}
}
//check google auth if not exist
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('error');
if(myParam == "Google-Auth-Not-Exist") {
    $('#login_error').removeClass('d-none')
    $('#login_error').text("This account not associated with google please use your email and password to login")
  }
if(myParam == "No-Auth-Redirect") {
    location.href = "/login"
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
$('input[id="telehealth-appt-checkbox"]').on("click",function () {
  let total_price=0
  $('#telehealth-appt-checkbox:checked').parent('td').siblings('#product-price').each(function(){
    let product_price=Number($(this).children('span').text())
       total_price=total_price+product_price
  })
  $('#cart-total-price').text(total_price)

});
  

});
  