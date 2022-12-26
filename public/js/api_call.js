$(document).ready(function(){
    $.ajax({
        url:"http://localhost:7000/checkauth",
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
      $.ajax({
          url:"http://localhost:7000/register",
          method:"POST",
          data:{first_name, last_name, email, password},
          // dataType : "JSON",
          success:function(data)
          {
           location.href = "/registered"
          },
          error:function(data){
            console.log(data.responseJSON)
            $('#register_error').removeClass('d-none')
            $('#register_error').text(data.responseJSON.message)
          }
      });
  })
  
//custom login api call
    $('#login_user').on("click",
    function(event){
    event.preventDefault();
    $('#login_error').addClass('d-none');
    const login_email=$('#login_email').val()
    const login_password=$('#login_password').val()
    const rememberme=$('#rememberme').is(":checked")
      $.ajax({
          url:"http://localhost:7000/login",
          method:"POST",
          data:{login_email,login_password,rememberme},
          success:function(data)
          {
            localStorage.setItem("isLoged","true");
            location.href = "/"
          },
          error:function(data){
            $('#login_error').removeClass('d-none')
            $('#login_error').text(data.responseJSON.message)
          }
      });
  })

//logout
  $('#logout_link').on("click",function(){
    $.ajax({
        url:"http://localhost:7000/logout",
        method:"GET",
        success:function(data)
        {
          localStorage.setItem("isLoged","false");
          location.href = "/login"
        },
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
        url:"http://localhost:7000/contactform",
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
});
  