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
        slug = name;
    } else {
        const parentCategory = await Category.findById(parentId);
        const mainParent = parentCategory.parent
    ? await Category.findById(parentCategory.parent)
    : null;
            if (!parentCategory) {
            throw new ApiError(404, "Parent category not found");
        }

        slug = mainParent.name ? mainParent.name + "-" + parentCategory.name + "-" + name : parentCategory.name + "-" +    name;
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
            .populate('category', 'name level parent')


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