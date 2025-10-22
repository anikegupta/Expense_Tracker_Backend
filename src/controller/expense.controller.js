import Expense from "../models/expense.js"
import { parsePrice } from "../utils/parseFilters.js"
import { parseDate } from "../utils/parseFilters.js"
export const allExpenses= async (req,resp)=>
{
    const userId = req.userId
    if(!userId)
    {
        return resp.status(403).json({
            message:"invalid request"
        })
    }
    const{minPrice,maxPrice,fromDate,toDate}=req.query
    let filter={
        hidden:false,
        userId:userId,
    }
    if(minPrice&&maxPrice)
    {
        const minPriceParsed=parsePrice(minPrice)
        const maxPriceParsed=parsePrice(maxPrice)
        filter.rs=
        {
            $gte:minPriceParsed,
            $lte:maxPriceParsed,
        }
    }
if(minPrice&&!maxPrice)
{
    const minPriceParsed=parsePrice(minPrice)
    filter.rs={
        $gte:minPriceParsed
    }
}
if(maxPrice&&!minPrice)
{
    const maxPriceParsed=parsePrice(maxPrice)
    filter.rs={
        $lte:maxPriceParsed,
    }
}

if (fromDate && toDate) {
    const fromDateParsed = parseDate(fromDate);
    const toDateParsed = parseDate(toDate);
    filter.createdAt = {
      $gte: fromDateParsed,
      $lte: toDateParsed,
    };
  }

  if (fromDate && !toDate) {
    const fromDateParsed = parseDate(fromDate);
    filter.createdAt = {
      $gte: fromDateParsed,
    };
  }

  if (toDate && !fromDate) {
    const toDateParsed = parseDate(toDate);
    filter.createdAt = {
      $lte: toDateParsed,
    };
  }

const expenses = await Expense.find(filter).sort("-createdAt")
resp.status(200)
resp.json(expenses)
}

export const singleExpense= async (req,resp)=>
{
const {expenseId}=req.params
const expense = await Expense.findOne({
    _id:expenseId,

})
resp.status(200)
resp.json(expense)
}

export const createExpense=async (req,resp)=>
{
    if(!req.userId)
    {
        return resp.status(403).json({
            message:"invalid request"
        })
    }
 const {rs,hidden,paymentMethod,title,description}=req.body
//  expenses.push(
//     {
//         id,
//         title,
//         description,
//     }
    

//  )
//  resp.json(expenses)
//  resp.send("Expense Created")
 const ob=await Expense.create({
    title,
    description,
    paymentMethod,
    rs,
    hidden,
    userId:req.userId,
 })

 resp.status(201)
 resp.json(ob)
}

export const updateExpense=async(req,resp)=>
{
    const{expenseId}=req.params
    const{title,description,rs,hidden,paymentMethod}=req.body
    await Expense.updateOne(
        {
            _id:expenseId,
        },
        {
            title,description,rs,hidden,paymentMethod,
        }
    )

    const updatedExpense = await Expense.findOne({
        _id:expenseId,
    })
    resp.status(201).json(updatedExpense)
}

export const deleteExpense=async (req,resp)=>
{
const{expenseId}=req.params
await Expense.findByIdAndDelete(expenseId)
resp.json(
    {
        message:"expense deleted",
    }
)
}

export const searchByTitle=async(req,resp)=>{
    const {title}=req.query
    console.log(title)
    const exp=await Expense.find({
        title:{
            $regex: title,
            $options:"i"
        }
    })

    resp.send(exp)
}