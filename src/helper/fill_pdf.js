const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const fillPdf=async(pdf_form)=>{
    const pdfDoc = await PDFDocument.load(pdf_form)
    const form = pdfDoc.getForm()
    // const fields = form.getFields()
    // console.log(fields.map(field => field.getName()));
    const patient=form.getTextField('Age')
    patient.setText("Test")
    const filled_data= await pdfDoc.save();
    form.flatten()
    const flatten_filled_data=await pdfDoc.save();
    const buffer_data={
       filled_buffer:Buffer.from(filled_data),
       flatten_filled_data:Buffer.from(flatten_filled_data)
    }
    return buffer_data
}
// pdf_template_path
// const ENUM_SAMPLE_PDF={
//     FEMALE_CONTROL_ORDER:
//     FEMAL_HRT_ORDER:
//     FROZEN_IV_PRODUCTS:
//     GARZA_INFO:
//     GENERAL_ORDER:
//     INJECTABLE_VITAMIN_ORDER:
//     MALE_HRT_CONTROLLED_5ML:
//     MALE_HRT_CONTROLLED_10ML:
//     SERM9_MG:
//     SERM15_MG:
//     DERM_ORDER:
//     INJECTABLE_VITAMIN_LIPOC:
//     MALE_COMPOUND_ORDER:
//     MALE_CONTROL_HORMONE_ORDER:
//     MALE_THERAPIES_GONADORELIN:
//     MALE_THERAPIES_TADALAFIL_UPDATED:
//     NEW_MALE_COMPOUND_ORDER:
//     PEPTIDE_RODER:
//     SEMAGLUTIDE_B6:
//     WEIGHT_LOSS_CONTROL_ORDER:
//     WEIGHT_LOSS_PRODUCT_ORDER:
//     FACT_BOOK_THERAPIST_TESTRXMD:
// }

//  const mealPlanData = [
//   {
//     day: 'Day 1',
//     breakfast: [
//       { name: 'Oatmeal', servings: '1 cup' },
//       { name: 'Almond milk', servings: '1 cup' },
//       { name: 'Berries', servings: '1/2 cup' },
//     ],
//     lunch: [
//       { name: 'Grilled chicken breast', servings: '4 oz' },
//       { name: 'Brown rice', servings: '1 cup' },
//       { name: 'Steamed vegetables', servings: '1 cup' },
//     ],
//     snack: [
//       { name: 'Smoothie with berries', servings: '1 cup' },
//       { name: 'Almond milk', servings: '1 cup' },
//     ],
//     dinner: [
//       { name: 'Grilled salmon', servings: '4 oz' },
//       { name: 'Steamed vegetables', servings: '1 cup' },
//       { name: 'Brown rice', servings: '1 cup' },
//     ],
//   },
//   {
//     day: 'Day 2',
//     breakfast: [
//       { name: 'Oatmeal', servings: '1 cup' },
//       { name: 'Almond milk', servings: '1 cup' },
//       { name: 'Berries', servings: '1/2 cup' },
//     ],
//     lunch: [
//       { name: 'Grilled chicken breast', servings: '4 oz' },
//       { name: 'Brown rice', servings: '1 cup' },
//       { name: 'Steamed vegetables', servings: '1 cup' },
//     ],
//     snack: [
//       { name: 'Smoothie with berries', servings: '1 cup' },
//       { name: 'Almond milk', servings: '1 cup' },
//     ],
//     dinner: [
//       { name: 'Grilled salmon', servings: '4 oz' },
//       { name: 'Steamed vegetables', servings: '1 cup' },
//       { name: 'Brown rice', servings: '1 cup' },
//     ],
//   },
//   // ... rest of the meal plan data
// ];

async function createMealPlanPDF(mealPlanData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const title = 'TestRxMD 30 Day Meal Plan';
  const titleSize = 24;
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (page.getWidth() - titleWidth) / 2,
    y: page.getHeight() - 50,
    size: titleSize,
    font: font,
    color: rgb(0, 0, 0),
  });
   let textX = 50;
  let textY = page.getHeight() - 120;
   mealPlanData.forEach((day) => {
    const dayTitle = `${day.day}\n`;
    const dayTitleSize = 18;
    page.drawText(dayTitle, {
      x: textX,
      y: textY,
      size: dayTitleSize,
      font: font,
      color: rgb(0, 0, 0.5),
    });
    textY -= 30;
     const mealList = [
      { name: 'Breakfast', items: day.breakfast },
      { name: 'Lunch', items: day.lunch },
      { name: 'Snack', items: day.snack },
      { name: 'Dinner', items: day.dinner },
    ];
     const mealListSize = 12;
    mealList.forEach((meal) => {
      page.drawText(`${meal.name}\n`, {
        x: textX + 20,
        y: textY,
        size: mealListSize,
        font: font,
        color: rgb(0, 0, 0.5),
      });
      textY -= 20;
      meal.items.forEach((item) => {
        page.drawText(`- ${item.meal} (${item.servings})\n`, {
          x: textX + 40,
          y: textY,
          size: mealListSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        textY -= 15;
      });
      textY -= 5;
    });
    textY -= 10;
  });
   const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('meal-plan.pdf', pdfBytes);
  return pdfBytes
}
async function createFitnessPlanPDF(fitnessPlanData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const title = 'TestRxMD 30 Day Fitness Plan';
  const titleSize = 24;
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (page.getWidth() - titleWidth) / 2,
    y: page.getHeight() - 50,
    size: titleSize,
    font: font,
    color: rgb(0, 0, 0),
  });
   let textX = 50;
  let textY = page.getHeight() - 120;
   mealPlanData.forEach((day) => {
    const dayTitle = `${day.day}\n`;
    const dayTitleSize = 18;
    page.drawText(dayTitle, {
      x: textX,
      y: textY,
      size: dayTitleSize,
      font: font,
      color: rgb(0, 0, 0.5),
    });
    textY -= 30;
     const mealList = [
      { name: 'Breakfast', items: day.breakfast },
      { name: 'Lunch', items: day.lunch },
      { name: 'Snack', items: day.snack },
      { name: 'Dinner', items: day.dinner },
    ];
     const mealListSize = 12;
    mealList.forEach((meal) => {
      page.drawText(`${meal.name}\n`, {
        x: textX + 20,
        y: textY,
        size: mealListSize,
        font: font,
        color: rgb(0, 0, 0.5),
      });
      textY -= 20;
      meal.items.forEach((item) => {
        page.drawText(`- ${item.meal} (${item.servings})\n`, {
          x: textX + 40,
          y: textY,
          size: mealListSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        textY -= 15;
      });
      textY -= 5;
    });
    textY -= 10;
  });
   const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('meal-plan.pdf', pdfBytes);
  return pdfBytes
}

 module.exports = {
    fillPdf,
    createMealPlanPDF,
    createFitnessPlanPDF
  };
  