import { Router } from "express";
import { allExpenses,singleExpense,createExpense, updateExpense, deleteExpense,searchByTitle} from "../controller/expense.controller.js";


const expenseRouter=Router()

expenseRouter.get("/expenses",allExpenses)
expenseRouter.get("/expenses/search",searchByTitle)
expenseRouter.get("/expenses/:expenseId",singleExpense)
expenseRouter.post("/expenses",createExpense)
expenseRouter.put("/expenses/:expenseId",updateExpense)
expenseRouter.delete("/expenses/:expenseId",deleteExpense)

export default expenseRouter