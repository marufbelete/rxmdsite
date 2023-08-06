// const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
// const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname,"..","..",'public', 'fonts');

const pdfMake = require('pdfmake');
 async function createMealPlanPDF(plan_format) {
  console.log(plan_format)
  return new Promise((resolve, reject) => {
    const documentDefinition = {
      content: [
        { text: '30 - Days Meal Plan', style: 'header' },
        { text: '\n' },
        plan_format.map(day => [
          { text: day.day, style: 'subheader' },
          { text: '\n' },
          { text: 'Breakfast:', style: 'mealTitle' },
          { text: `${day.Breakfast.meal} :- ${day.Breakfast.description}` },
          { text: 'Lunch:', style: 'mealTitle' },
          { text: `${day.Lunch.meal} :- ${day.Lunch.description}` },
          { text: 'Dinner:', style: 'mealTitle' },
          { text: `${day.Dinner.meal} :- ${day.Dinner.description}` },
          { text: '\n' }
        ]),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 14,
          bold: true
        },
        mealTitle: {
          fontSize: 12,
          bold: true,
          decoration: 'underline'
        }
      },
      defaultStyle: {
        font: 'Roboto'
      },
      fonts: {
        Roboto: {
          normal: 'node_modules/pdfmake/build/vfs_fonts.js',
          bold: 'node_modules/pdfmake/build/vfs_fonts.js',
          italics: 'node_modules/pdfmake/build/vfs_fonts.js',
          bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js'
        }
      }
    };
     const printer = new pdfMake({
            Roboto: {
                normal: `${filePath}/Roboto-Regular.ttf`,
                bold: `${filePath}/Roboto-Bold.ttf`,
              },
           });
    const pdfDoc = printer.createPdfKitDocument(documentDefinition);
     const buffers = [];
    pdfDoc.on('data', buffer => buffers.push(buffer));
    pdfDoc.on('end', () => resolve(Buffer.concat(buffers)));
    pdfDoc.end();
  });
}

 async function createFitnessPlanPDF(plan_format) {
  console.log(plan_format)
  return new Promise((resolve, reject) => {
    const documentDefinition = {
      content: [
        { text: '30 - Day Fintess Plan', style: 'header' },
        { text: '\n' },
        plan_format.map(day => [
          { text: day.day, style: 'subheader' },
          { text: '\n' },
          { text: 'Exercise :', style: 'fitnessTitle' },
          { text: `${day.fitness} :- ${day.description}` },
          { text: '\n' }
        ]),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 14,
          bold: true
        },
        mealTitle: {
          fontSize: 12,
          bold: true,
          decoration: 'underline'
        }
      },
      defaultStyle: {
        font: 'Roboto'
      },
      fonts: {
        Roboto: {
          normal: 'node_modules/pdfmake/build/vfs_fonts.js',
          bold: 'node_modules/pdfmake/build/vfs_fonts.js',
          italics: 'node_modules/pdfmake/build/vfs_fonts.js',
          bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js'
        }
      }
    };
     const printer = new pdfMake({
            Roboto: {
              normal: `${filePath}/Roboto-Regular.ttf`,
              bold: `${filePath}/Roboto-Bold.ttf`,
              },
           });
    const pdfDoc = printer.createPdfKitDocument(documentDefinition);
     const buffers = [];
    pdfDoc.on('data', buffer => buffers.push(buffer));
    pdfDoc.on('end', () => resolve(Buffer.concat(buffers)));
    pdfDoc.end();
  });
}


// function wrapText(text, maxWidth, fontSize, font) {
//   const words = text.split(' ');
//   const lines = [];
//   let currentLine = '';

//   words.forEach((word) => {
//     const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
//     if (width < maxWidth) {
//       currentLine += ' ' + word;
//     } else {
//       lines.push(currentLine.trim());
//       currentLine = word;
//     }
//   });

//   lines.push(currentLine.trim());
//   return lines;
// }


// const fillPdf=async(pdf_form)=>{
//   const pdfDoc = await PDFDocument.load(pdf_form)
//   const form = pdfDoc.getForm()
//   const patient=form.getTextField('Age')
//   patient.setText("Test")
//   const filled_data= await pdfDoc.save();
//   form.flatten()
//   const flatten_filled_data=await pdfDoc.save();
//   const buffer_data={
//      filled_buffer:Buffer.from(filled_data),
//      flatten_filled_data:Buffer.from(flatten_filled_data)
//   }
//   return buffer_data
// }

// async function createFitnessPlanPDF(fitnessPlanData) {
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   const title = 'TestRxMD 30 Day Fitness Plan';
//   const titleSize = 24;
//   const titleWidth = font.widthOfTextAtSize(title, titleSize);
//   page.drawText(title, {
//     x: (page.getWidth() - titleWidth) / 2,
//     y: page.getHeight() - 50,
//     size: titleSize,
//     font: font,
//     color: rgb(0, 0, 0),
//   });

//   let textX = 50;
//   let textY = page.getHeight() - 120;

//   fitnessPlanData.forEach((day) => {
//     const dayTitle = `${day.day}\n`;
//     const dayTitleSize = 18;
//     page.drawText(dayTitle, {
//       x: textX,
//       y: textY,
//       size: dayTitleSize,
//       font: font,
//       color: rgb(0, 0, 0.5),
//     });
//     textY -= 30;

//     const fitnessList = day.exercises;
//     const fitnessListSize = 12;

//     fitnessList.forEach((fitness) => {
//       const fitnessText = `${fitness.name}: ${fitness.description}`;
//       const fitnessWidth = page.getWidth() - textX - 40;

//       const wrappedLines = wrapText(fitnessText, fitnessWidth, fitnessListSize, font);

//       wrappedLines.forEach((line) => {
//         page.drawText(line, {
//           x: textX + 20,
//           y: textY,
//           size: fitnessListSize,
//           font: font,
//           color: rgb(0, 0, 0),
//           lineHeight: 15, // Adjust the line height as needed
//         });
//         textY -= 15;
//       });

//       textY -= 10;
//     });

//     textY -= 10;
//   });

//   const pdfBytes = await pdfDoc.save();
//   // fs.writeFileSync('fitness-plan.pdf', pdfBytes);
//   return pdfBytes;
// }

 module.exports = {
    createMealPlanPDF,
    createFitnessPlanPDF
  };
  