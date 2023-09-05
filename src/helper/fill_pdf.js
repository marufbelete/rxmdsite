const path = require('path');
const filePath = path.join(__dirname,"..","..",'public', 'fonts');

const pdfMake = require('pdfmake');
 async function createMealPlanPDF(plan_format) {
  return new Promise((resolve, reject) => {
    const documentDefinition = {
      content: [
        { text: '30 - Days Meal Plan', style: 'header' },
        { text: '\n' },
        plan_format.map(day => [
          { text: day.day, style: 'subheader' },
          { text: '\n' },
          { text: 'Breakfast:', style: 'mealTitle' },
          { text: `Meal : ${day.Breakfast.meal}`} ,
          day.Breakfast.description.map(description=>({ text: `${description}` })),
          { text: 'Lunch:', style: 'mealTitle' },
          { text: `Meal : ${day.Lunch.meal}`}, 
          // { text: ` ${day.Lunch.description}` },
          day.Lunch.description.map(description=>({ text: `${description}` })),
          { text: 'Dinner:', style: 'mealTitle' },
          { text: `Meal : ${day.Dinner.meal}`},
          day.Dinner.description.map(description=>({ text: `${description}` })),
          // { text: `${day.Dinner.description}` },
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
  return new Promise((resolve, reject) => {
    const documentDefinition = {
      content: [
        { text: '30 - Day Fintess Plan', style: 'header' },
        { text: '\n' },
        plan_format.map(day => [
          { text: day.day, style: 'subheader' },
          { text: '\n' },
          { text: `Exercise :${day.fitness}` },
          { text: `Steps` },
          day.description.map(description=>({ text: `${description}` })),
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


 module.exports = {
    createMealPlanPDF,
    createFitnessPlanPDF
  };
  