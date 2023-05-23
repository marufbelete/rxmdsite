$(document).ready(function () {
  const base_url = "http://localhost:7000";
  // const base_url = "https://shielded-citadel-34904.herokuapp.com"
  // const base_url = "https://www.testrxmd.com"
  // const base_url = "https://rxmdsite-production.up.railway.app";
  let disableTime
  function providerSchedule(){
    const providerId= $("#appt_doctor").val();
    $.ajax({
      url: `${base_url}/provider/schedule/${providerId}`,
      type: "GET",
      success: ({providerSchedule}) => {
          disableTime = providerSchedule.reduce((result, appointment) => {
            const utcDateTime = new Date(appointment.appointmentDateTime);
            const formattedUtcDateTime = moment(utcDateTime).format("YYYY-MM-DDTHH:mm:ss");

            console.log(appointment.appointmentDateTime)
            console.log(formattedUtcDateTime)
          const date = formattedUtcDateTime.split('T')[0]; // Extract the date portion
          if (result[date]) {
            result[date].push(formattedUtcDateTime);
          } else {
            result[date] = [formattedUtcDateTime];
          }
          return result;
        }, {});
     
      },
    
    })
}
$("#appt_doctor").on('change',function(){
  providerSchedule()
})

function getAvailableProvider(){
  $("#appt_doctor").empty();
  $.ajax({
    url: `${base_url}/provider/available`,
    type: "GET",
    success: ({providers,appt}) => {  
      $("#appt_doctor").append(`
      <option value="">Select Doctor*</option>
      `)
      $("#appt_first_name").val(appt?.patientFirstName);
      $("#appt_last_name").val(appt?.patientLastName);
      $("#appt_email").val(appt?.patientEmail);
      $("#appt_phone").val(appt?.patientPhoneNumber);
      // $("#appt_doctor").val(appt?.doctorId);
      // $("#appt_appointment_date").val(appt?.appointmentDateTime);
      // $("#appt_appointment_time").val(appt?.appointmentDateTime);
      const localDateTime = new Date(appt?.appointmentDateTime).toLocaleString();
      console.log(localDateTime)
      $("#appt_appointment_date").pickadate('set', localDateTime);
      $("#appt_appointment_time").pickatime('set', localDateTime);
      $("#appt_appointment_message").val(appt?.message);
      providers?.forEach((provider) => {
        $("#appt_doctor").append(`
        <option value=${provider?.id}>${provider?.first_name+' '+ provider?.last_name}</option>
        `)
      })
      if(appt?.doctorId){
        $("#appt_appointment_date").prop("disabled", false)
        $("#appt_appointment_time").prop("disabled", false)
        $("#appt_appointment_date").css("background-color", "white")
        $("#appt_appointment_time").css("background-color", "white")
      }
      $(`#appt_doctor [value=${appt?.doctorId}]`).prop('selected', true);
    },
  })
}

getAvailableProvider()

$('#appt_appointment_date').on('change', () => {
  const appointmentDateTime = new Date($('#appt_appointment_date').val());
  const year = appointmentDateTime.getFullYear().toString();
  const month = (appointmentDateTime.getMonth() + 1).toString().padStart(2, '0');
  const day = appointmentDateTime.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const disable = disableTime[formattedDate] || null;
  $('#appt_appointment_time').pickatime('picker').set('disable', disable ? disable.map(e => new Date(e)) : false);
});

$('#appt_appointment_time').pickatime({
  disable: []
})

$('#appt_appointment_date').pickadate({
    weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    showMonthsShort: true,
    // min: new Date(),
  
  });
    $('#appt_doctor').change(function() {
      const selectedValue = $(this).val();
      if (selectedValue !== '') {
   $("#appt_appointment_date").prop("disabled", false)
   $("#appt_appointment_time").prop("disabled", false)
   $("#appt_appointment_date").css("background-color", "white")
   $("#appt_appointment_time").css("background-color", "white")
     }
     else{
        $("#appt_appointment_date").prop("disabled", true)
        $("#appt_appointment_time").prop("disabled", true)
        $("#appt_appointment_date").css("background-color", "")
        $("#appt_appointment_time").css("background-color", "")
     }
  });
})
