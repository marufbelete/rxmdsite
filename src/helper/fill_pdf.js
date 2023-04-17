const {PDFDocument}=require('pdf-lib')
// const fs= require('fs')
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

module.exports = {
    fillPdf,
  };
  