import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addCategory = asyncHandler(async (req, res) => {
    const { name, slug, level, parentId ,ancestors} = req.body;
    if (
        [name, slug,].some((field) => !field || field.trim() === "") ||
        [level].some((field) => field == null)
    ) {
        throw new ApiError(400, 'All feilds are required')
    }

    const category = await Category.create({
        name: name.toLowerCase(),
        slug, level, parent: parentId,ancestors

    })

    const createdCategory = await Category.findById(category._id);
    if (!createdCategory) {
        throw new ApiError(500, 'There is an error while adding a category')

    }

    return res.status(201).json(
        new ApiResponse(200, createdCategory, "Category added successfully!")
    )
})

const fetchParentCategories =asyncHandler(async (req,res)=>{
         const categories = await Category.find({parent:null});
         return res.status(200).json(
            new ApiResponse(200, categories,"Parent categories fetched successfully!")
         )
})
const fetchSubCategories =asyncHandler(async (req,res)=>{
    console.log("CategoryId:", req.params.parentId);
    const { parentId } = req.params;

         const subCategories = await Category.find({parent:parentId});
         return res.status(200).json(
            new ApiResponse(200, subCategories,"Subcategories fetched successfully!")
         )
})



export {
    addCategory,
fetchParentCategories,
fetchSubCategories
}