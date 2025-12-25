import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

   const addressSchema = new mongoose.Schema({
   fullName: { type: String, required: true },
   phone: { type: String, required: true },
   street: { type: String, required: true },
   city: { type: String, required: true },
   state: { type: String },
   postalCode: { type: String, required: true },
   });

   const userSchema = new Schema({ 
      name:{
         type:String,
         required:true,
         lowercase:true,
         trim:true,
         index:true,

      },
      email:{
         type:String,
         required:true,
         unique:true,
         lowercase:true,
         trim:true,

      },
      avatar:{
         type:String,
      },
      
      password:{
         type:String,
         required:[true,"Password is required"]
      },
 address: {
      type: [addressSchema],
      validate: {
        validator: function (value) {
          return value.length <= 3;
        },
        message: "You can add a maximum of 3 addresses",
      },
    },         
      refreshToken:{
         type:String
      },
         role: {
         type: String,
         enum: ["customer", "admin"],
         default: "customer",
      },
   },{timestamps:true})

userSchema.pre("save",async function(next){
   if(!this.isModified("password")) return next();
  this.password=await bcrypt.hash(this.password,10)
  next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
 return  jwt.sign(
      {
         _id : this._id,
         email:this.email,
         username:this.username,
         fullName:this.fullName,

      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }
   )
}

userSchema.methods.generateRefreshToken = function(){
 return  jwt.sign(
      { 
         _id : this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
      }
   )
}
export const User = mongoose.model("User",userSchema)