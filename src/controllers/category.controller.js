import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addCategory = asyncHandler(async (req, res) => {
    const { name, level, parentId, ancestors } = req.body;
    let slug;
    if (
        [name].some((field) => !field || field.trim() === "") ||
        [level].some((field) => field == null)
    ) {
        throw new ApiError(400, 'All feilds are required')
    }

    if (parentId === null) {
        slug = name.toLowerCase();
    } else {
        const parentCategory = await Category.findById(parentId);

        if (!parentCategory) {
            throw new ApiError(404, "Parent category not found");
        }

        let mainParent = null;

        if (parentCategory.parent !== null) {
            mainParent = await Category.findById(parentCategory.parent);
        }

        if (mainParent && mainParent.name) {
            slug = `${mainParent.name.toLowerCase()}-${parentCategory.name.toLowerCase()}-${name.toLowerCase()}`;
        } else {
            slug = `${parentCategory.name.toLowerCase()}-${name.toLowerCase()}`;
        }
    }


    const category = await Category.create({
        name: name.toLowerCase(), level, parent: parentId, ancestors,
        slug

    })



    return res.status(201).json(
        new ApiResponse(200, category, "Category added successfully!")
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

// const getProductsByCategory = asyncHandler(async (req, res) => {
//     const { categoryId } = req.params;
//     const { minPrice, maxPrice, sortBy, onSale } = req.query;


//     const category = await Category.findById(categoryId);
//     if (!category) {
//         throw new ApiError(404, 'Category not found')

//     }

//     const categoryIds = await getDescendantIds(categoryId);

//     let filter = {
//         category: { $in: categoryIds },
//     };


//     if (minPrice || maxPrice) {
//         filter.price = {};
//         if (minPrice) filter.price.$gte = Number(minPrice);
//         if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }
//     if (onSale === "true") {
//         filter.onsale = true;
//     }

//     let sortOptions = {};

//     if (sortBy === "latest") {
//         sortOptions.createdAt = -1;
//     } else if (sortBy === "price_low_high") {
//         sortOptions.price = 1;
//     } else if (sortBy === "price_high_low") {
//         sortOptions.price = -1;
//     }

//     const products = await
//         Product.find(filter)
//             .sort(sortOptions)
//             .populate('category', 'name level parent')
//     if (!products || products.length === 0) {
//         throw new ApiError(404, 'Products not found');
//     }

//     res.status(200).json(

//         new ApiResponse(200, products, "Product by category fetched successfully!")
//     );


// })
const getProductsByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { minPrice, maxPrice, sortBy, onSale } = req.query;


    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, 'Category not found')

    }

    const categoryIds = await getDescendantIds(categoryId);
    const objectIdCategoryIds = categoryIds.map(id => new mongoose.Types.ObjectId(id));
    let filter = {
        category: { $in: objectIdCategoryIds },
    };


    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (onSale === "true") {
        filter.onsale = true;
    }

   
    let sortStage = null;

    if (sortBy === "price_low_high") {
        sortStage = { discountedPrice: 1 };
    } else if (sortBy === "price_high_low") {
        sortStage = { discountedPrice: -1 };
    } else if (sortBy === "latest") {
        sortStage = { createdAt: -1 };
    }
    const products = await Product.aggregate([
        { $match: filter },
        {
            $addFields:
            {
                discountedPrice:
                {
                    $cond:
                    {
                        if:
                            { $gt: ["$discountPrice", 0] },
                        then: { $subtract: ["$price", { $multiply: ["$price", { $divide: ["$discountPrice", 100] }] }] },
                        else: "$price"
                    }
                }
            }
        },
        ...(sortStage ? [{ $sort: sortStage }] : []),
        { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } }, { $unwind: "$category" }]);
    if (!products || products.length === 0) {
        throw new ApiError(404, 'Products not found');
    }

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