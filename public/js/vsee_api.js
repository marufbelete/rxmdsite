$(document).ready(function () {

  let formData = {}
  $("#apptSubmit").on('click', function (e) {
    e.preventDefault()
    formData.date = $('#apptDate').val();
    formData.time = $('#apptTime').val();
    formData.firstname = $('#patient-form-firstname').val();
    formData.lastname = $('#patient-form-lastname').val();
    formData.email = $('#patient-form-email').val();
    formData.phone = $('#patient-form-phone').val();
    for (const [key, value] of Object.entries(formData)) {
      console.log(`${key}: ${value}`);
    }
  });


  // Import the VSee API client library
  // const VSee = require("vsee-client");

  // Initialize the VSee API client
  // const vsee = new VSee({
  //   apiKey: "YOUR_API_KEY",
  //   apiSecret: "YOUR_API_SECRET",
  // });

  // Set the clinic ID
  // const clinicId = "YOUR_CLINIC_ID";

  // $.ajax({
  //   url: `${base_url}/vsee`,
  //   method: "POST",
  //   data: { firstName, lastName, email, phoneNumber },
  //   success: function (data) {
  //     // Set the patient information
  //     const patient = {
  //       firstName: data.firstName,
  //       lastName: data.lastName,
  //       email: data.email,
  //       phoneNumber: data.phoneNumber
  //     };
  //     // Set the appointment information
  //     const appointment = {
  //       startTime: '',
  //       duration: 60,
  //       type: 'follow_up'
  //     };
  //     location.href = "/registered";
  //   },
  //   error: function (data) {
  //     $("#register_text").removeClass("d-none");
  //     $("#register_text_spin").addClass("d-none");
  //     $("#register_error").removeClass("d-none");
  //     $("#register_error").text(data.responseJSON.message);
  //   },
  // });




  // Set the appointment information
  // const appointment = {
  //   startTime: "2022-01-01T09:00:00Z",
  //   duration: 60,
  //   type: "follow_up",
  // };

  // Schedule the appointment for the patient
  // vsee
  //   .scheduleAppointment(clinicId, patient, appointment)
  //   .then((response) => {
  //     // Handle the response
  //     console.log(response);
  //   })
  //   .catch((error) => {
  //     // Handle the error
  //     console.error(error);
  //   });
});
