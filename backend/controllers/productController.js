const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
//Get all products - /api/v1/products
exports.getProducts =  catchAsyncErrors(async (req, res, next)=>{
    const resPerPage = 2;
    const apiFeatures =  new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
    
    const products = await apiFeatures.query;
    res.status(200).json({
        success : true,
        count: products.length,
        products
    });
})

//Create new product 
exports.newProduct = catchAsyncErrors(async (req, res, next)=>{
    const product = await  Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
});

//Get single product - /api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async(req, res, next) =>{
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 400));
    }
    
    res.status(201).json({
        success: true,
        product
    })
});

exports.updateProduct = catchAsyncErrors(async(req, res, next)=>{
    let product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        product
    })

})

exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

   await product.remove();
    res.status(200).json({
        success: true,
        message: "Product deleted!"
    })
});