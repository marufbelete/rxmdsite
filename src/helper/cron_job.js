const medicationSurveyJob= async() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const endOfSevenDaysAgo = new Date(sevenDaysAgo.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    const patients = await db.Patient.findAll({
      where: {
        createdAt: {
          [Op.between]: [sevenDaysAgo, endOfSevenDaysAgo],
        },
        emailSent: {
          [Op.not]: true,
        },
      },
    });
    for (const patient of patients) {
      // send email code here
      patient.emailSent = true;
      await patient.save();
    }
    console.log(`Sent emails to ${patients.length} patients`);
  };

const runJob=(time,job)=>{
    // time='0 12 * * *'
 cron.schedule(time, job)
}