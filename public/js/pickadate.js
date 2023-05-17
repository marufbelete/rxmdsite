$(document).ready(function () {
  // const base_url = "http://localhost:7000";
  const base_url = "https://shielded-citadel-34904.herokuapp.com"
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
          const date = appointment.appointmentDateTime.split('T')[0]; // Extract the date portion
          if (result[date]) {
            result[date].push(appointment?.appointmentDateTime);
          } else {
            result[date] = [appointment?.appointmentDateTime];
          }
          return result;
        }, {});
     
      },
    
    })
}
$("#appt_doctor").on('change',function(){
  providerSchedule()
})

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
