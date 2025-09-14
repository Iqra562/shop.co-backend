import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getProduct = asyncHandler(async(req,res)=>{
    const products =  await Product.find();
    if(!products || products.length === 0){
throw new ApiError(404,"No products found");
    }
    return res.status(200).json(
        new ApiResponse(200,products,"Products fetched successfully")
    )
})
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully")
    );
});


const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, discountPrice, stock } = req.body;
    if (
        [name, description].some((field) => !field || field.trim() === "") ||
        [price, stock].some((field) => field == null)
    ) {
        throw new ApiError(400, 'All feilds are required')
    }
  // Upload thumbnail to Cloudinary

     let thumbnail = null;
     if(req.files?.thumbnail?.[0]){
const uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);
thumbnail = { url : uploadedThumbnail.secure_url, public_id : uploadedThumbnail.public_id}
     }

     if(!thumbnail){
        throw new ApiError(400, "thumbnail file is required")
      }
 // Upload multiple images (array of promises)
  let imageUrls = [];
  if (req.files?.galleryImages) {
    // console.log(req.files?.galleryImages )
    imageUrls = await Promise.all(
      req.files.galleryImages.map(async (file) =>{

       const uploaded  =   await uploadOnCloudinary(file.path);
       if (!uploaded) {
        throw new ApiError(500, "Failed to upload one of the images");
      }
       return { url : uploaded.secure_url, public_id : uploaded.public_id  }
        }
      )
    );
  }
  console.log("Images:", imageUrls);


    const product = await Product.create({
        name, description, price, discountPrice, stock,
        thumbnail,
         galleryImages: imageUrls

    })
    const createdProduct = await Product.findById(product._id)
    if (!createdProduct) {
        throw new ApiError(500, "Something went wrong")

    }

    return res.status(201).json(
        new ApiResponse(200, createdProduct, "Product added successfully  ")
    )

})


const updateProduct = asyncHandler(async(req,res)=>{

  const { id } = req.params; 
    const product = await Product.findById(id);
    if(!product){
  throw new ApiError(404,"Product not found")
    }
   const { name, description, price, discountPrice, stock } = req.body;
    if (
        [name, description].some((field) => !field || field.trim() === "") ||
        [price, stock].some((field) => field == null)
    ) {
        throw new ApiError(400, 'All feilds are required')
    }
     product.name = name;
     product.description = description;
     product.price = price;
     product.discountPrice=discountPrice;
     product.stock =stock;


  if(req.files?.thumbnail?.[0]){
const  uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);
if (product.thumbnail?.public_id) {
      await removeFromCloudinary(product.thumbnail.public_id);
    }

product.thumbnail = {
    url:uploadedThumbnail.secure_url,
    public_id:uploadedThumbnail.public_id
}

  }

    // ✅ Handle new images (add to existing array)
  if (req.files?.galleryImages) {
    const uploadedImages = await Promise.all(
      req.files.galleryImages.map(async (file) => {
        const uploaded = await uploadOnCloudinary(file.path);
        return { url: uploaded.secure_url, public_id: uploaded.public_id };
      })
    );
    product.galleryImages.push(...uploadedImages);
  }

  await product.save();

  return res.status(200).json(
    new ApiResponse(200, product, "Product updated successfully")
  );

   

})



const removeGalleryImage = asyncHandler(async (req, res) => {
  const { id, publicId } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // check if image exists
  const image = product.galleryImages.find(img => img.public_id === publicId);
  if (!image) {
    throw new ApiError(404, "Image not found in product");
  }

  // 1. remove from Cloudinary
  await removeFromCloudinary(publicId);

  // 2. remove from product.images array
  product.galleryImages = product.galleryImages.filter(img => img.public_id !== publicId);

  await product.save();

  return res.status(200).json(
    new ApiResponse(200, product, "Image removed successfully")
  );
});

const deleteProduct = asyncHandler(async(req,res)=>{
   const {id} = req.params;
    const product = await Product.findById(id);
   if(!product) {
    throw new ApiError(404,"Product nt found");

   }
    if (product.thumbnail?.public_id) {
    await removeFromCloudinary(product.thumbnail.public_id);
  }
  if (product.galleryImages?.length) {
  await Promise.all(
    product.galleryImages
      .filter(img => img.public_id)
      .map(img => removeFromCloudinary(img.public_id))
  );
}

await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
})


export {
    getProduct,
    getProductById,
    addProduct,
    updateProduct,
    removeGalleryImage,
    deleteProduct
}