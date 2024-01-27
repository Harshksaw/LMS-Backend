const { Mongoose } = require("mongoose");
const Category = require("../models/Category")


exports.createCategory = async (req, res) => {
	try {
		const {name, description } = req.body;
		if(!name){
			return res.status(400).json({ success: false, message: "All fields are required" });	 
		}
      // created entry in Category in DB;
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		 
		return res.status(400).json({ success: true, message: "Categorys Created Successfully" });	 
	}
   catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};


exports.showAllCategories = async (req, res) => {
	try {
        
		const allCategorys = await Category.find({});          // it find all Category from DB;

    return res.status(200).json({ success: true , data: allCategorys, });	 
	}
   catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};


exports.categoryPageDetails = async(req, res)=>{

    try {
        //get categoryId
        //get courses fo r specified categoryId
        //validation
        //get courses for top sellling courses
        const {categoryId} = req.body;

        const selectedCategory = await Category.findById(categoryId)
        .populate("courses")
        .exec()

        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Courses Not found",
            })
        }

        //get courses for diff categories

        const diffCategories  = await Category.find({
            _id: {$ne: categoryId}
        })
        .populate("courses")
        .exec()

       
         const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10)

        //top selling courses
        //return responses
        return res.status(200).json({
            success:true,
            message:"Retriving courses",
            data:{
                selectedCategory,
                diffCategories,
                mostSellingCourses,
            }
        })

        
    } catch (error) {
        return res.status(200).json({
            success:false,
            message:"Failed Category controller"
        })
    }
}