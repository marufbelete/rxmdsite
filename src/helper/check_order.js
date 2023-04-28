const Product=require('../models/productModel')

const isLongtermTherapy=async(productId)=>{
    const product_info=await Product.findByPk(productId)
    return product_info.refill
}

module.exports={
    isLongtermTherapy
}