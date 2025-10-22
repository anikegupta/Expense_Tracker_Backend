import mongoose from 'mongoose'

const expenseSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        
            description:{
                type:String,
                required:true,
            },
            rs:{
                type:Number,
                required:true,
                min:0,
            },
            
                hidden:{
                    type:Boolean,
                    default:false,
                },

                createdAt:{
                    type:Date,
                    default:Date.now,
                },

                paymentMethod:{
                    type:String,
                    default:"cash",
                    required:true,
                },
                screenshot:{
                    type:String,
                },
                userId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User",
                    required:true,
                }
    }
)

const Expense=mongoose.model("Expense",expenseSchema)
export default Expense