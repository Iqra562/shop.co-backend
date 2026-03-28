import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addCategory = asyncHandler(async (req, res) => {
    const { name, slug, level, parentId, ancestors } = req.body;
    if (
        [name, slug,].some((field) => !field || field.trim() === "") ||
        [level].some((field) => field == null)
    ) {
        throw new ApiError(400, 'All feilds are required')
    }

    const category = await Category.create({
        name: name.toLowerCase(),
        slug, level, parent: parentId, ancestors

    })

    const createdCategory = await Category.findById(category._id);
    if (!createdCategory) {
        throw new ApiError(500, 'There is an error while adding a category')

    }

    return res.status(201).json(
        new ApiResponse(200, createdCategory, "Category added successfully!")
    )
})

const fetchParentCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ parent: null });
    return res.status(200).json(
        new ApiResponse(200, categories, "Parent categories fetched successfully!")
    )
})
const fetchSubCategories = asyncHandler(async (req, res) => {
    // console.log("CategoryId:", req.params.parentId);
    const { parentId } = req.params;
   const parent = parentId === "null" ? null : parentId;

    const subCategories = await Category.find({ parent: parent });
    return res.status(200).json(
        new ApiResponse(200, subCategories, "Subcategories fetched successfully!")
    )
})

const getDescendantIds = async (categoryId) => {
    const categories = await Category.find().select('_id parent').lean();

    const map = {};
    categories.forEach(cat => {
        const parentId = cat.parent ? cat.parent.toString() : null;
        if (!map[parentId]) map[parentId] = [];
        map[parentId].push(cat._id.toString());
    });

    const result = [];
    const stack = [categoryId.toString()];

    while (stack.length) {
        const current = stack.pop();
        result.push(current);

        if (map[current]) {
            stack.push(...map[current]);
        }
    }

    return result;
};

const getProductsByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;


    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, 'Category not found')

    }

    const categoryIds = await getDescendantIds(categoryId);

    const filter = {
        category: { $in: categoryIds },
    };



    const products = await
        Product.find(filter)
            .populate('category', 'name slug level parent')


    res.status(200).json(

        new ApiResponse(200, products, "Product by category fetched successfully!")
    );


})

export {
    addCategory,
    fetchParentCategories,
    fetchSubCategories,
    getProductsByCategory
}