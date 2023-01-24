const Product = require("../models/productModel");

const initial_products=[
    {
    product_name:'Labwork & Telehealth Consult',
    price:125,
    type:"product"
    },
    {
    product_name:'TRT/Base',
    price:200,
    type:"treatment"
    },
    {
    product_name:'TRT/Fertility',
    price:250,
    type:"treatment"
    },
    {
    product_name:'Sermorelin 9mg',
    price:200,
    type:"treatment"
    },
    {
    product_name:'Sermorelin 15mg',
    price:225,
    type:"treatment"
    },
    {
    product_name:'Ipamorelin 9mg',
    price:275,
    type:"treatment"
    },
    {
    product_name:'Ipamorelin 15mg',
    price:300,
    type:"treatment"
    },
    {
    product_name:'TRT/Base + Sermorelin 9mg',
    price:350,
    type:"treatment"
    },
    {
    product_name:'TRT/Base + Sermorelin 15mg',
    price:375,
    type:"treatment"
    },
    {
    product_name:'TRT/Fertility + Sermorelin 9mg',
    price:400,
    type:"treatment"
    },
    {
    product_name:'TRT/Fertility + Sermorelin 15mg',
    price:425,
    type:"treatment"
    },
    {
    product_name:'Tadalafil (5mg/#50) - ALONE',
    price:120,
    type:"treatment"
    },
    {
    product_name:'Tadalafil (5mg/#50) - ADD ON',
    price:100,
    type:"treatment"
    }
    ]
    const addInitialProduct=async()=>{
        for await (const product of initial_products) {
            await Product.findOrCreate({
                where: {product_name:product.product_name},
                defaults:product,
              });
        }
    }

    module.exports={
        addInitialProduct
    }