$(document).ready(function () {
  const sdk = require('api')('@vcita-developers-hub/v1.0#rkid1g1gblbxt9qzv');

  let formData = {};
  $("#apptSubmit").on('click', function (e) {
    e.preventDefault();
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



  sdk.auth(process.env.VCITA_API_TOKEN);
  sdk.postSchedulingBookings()
    .then(({ data }) => console.log(data))
    .catch(err => console.error(err));
});
