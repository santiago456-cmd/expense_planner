import { useReducer, createContext, ReactNode, useMemo } from "react"
import { budgetReducer, BudgetState, initialState, BudgetActions } from "../reducers/budgetReducers"

type BudgetContextProps = {
    state: BudgetState
    dispatch: React.ActionDispatch<[action: BudgetActions]> 
    totalExpense: number
    remainingBudget: number
}

type BudgetProviderProps = {
    children: ReactNode
}

export const BudgetContext = createContext<BudgetContextProps>(null!)

export const BudgetProvider = ({children}:BudgetProviderProps) => {

    const [state, dispatch] = useReducer(budgetReducer, initialState)
    
    const totalExpense = useMemo( () => state.expenses.reduce((total, expense) => expense.amount + total, 0 ),[state.expenses])
    
    const remainingBudget = state.budget - totalExpense


    return (
        <BudgetContext.Provider
            value={{
                state,
                dispatch,
                totalExpense,
                remainingBudget
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}