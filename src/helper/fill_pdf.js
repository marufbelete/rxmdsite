const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const fillPdf=async(pdf_form)=>{
    const pdfDoc = await PDFDocument.load(pdf_form)
    const form = pdfDoc.getForm()
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
     const fitnessListSize = 12;
    mealList.forEach((meal) => {
      page.drawText(`${meal.name}\n`, {
        x: textX + 20,
        y: textY,
        size: fitnessListSize,
        font: font,
        color: rgb(0, 0, 0.5),
      });
      textY -= 20;

      page.drawText(`- ${meal.items.meal} (${meal.items.description})\n`, {
          x: textX + 40,
          y: textY,
          size: fitnessListSize,
          font: font,
          color: rgb(0, 0, 0),
        });
        textY -= 15;
  
      textY -= 5;
    });
    textY -= 10;
  });
   const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('meal-plan.pdf', pdfBytes);
  return pdfBytes
}



function wrapText(text, maxWidth, fontSize, font) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine.trim());
      currentLine = word;
    }
  });

  lines.push(currentLine.trim());
  return lines;
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

  fitnessPlanData.forEach((day) => {
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

    const fitnessList = day.exercises;
    const fitnessListSize = 12;

    fitnessList.forEach((fitness) => {
      const fitnessText = `${fitness.name}: ${fitness.description}`;
      const fitnessWidth = page.getWidth() - textX - 40;

      const wrappedLines = wrapText(fitnessText, fitnessWidth, fitnessListSize, font);

      wrappedLines.forEach((line) => {
        page.drawText(line, {
          x: textX + 20,
          y: textY,
          size: fitnessListSize,
          font: font,
          color: rgb(0, 0, 0),
          lineHeight: 15, // Adjust the line height as needed
        });
        textY -= 15;
      });

      textY -= 10;
    });

    textY -= 10;
  });

  const pdfBytes = await pdfDoc.save();
  // fs.writeFileSync('fitness-plan.pdf', pdfBytes);
  return pdfBytes;
}

 module.exports = {
    fillPdf,
    createMealPlanPDF,
    createFitnessPlanPDF
  };
  