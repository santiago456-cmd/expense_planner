import { useEffect, useState } from "react";
import { categories } from "../data/categories"
import type { DraftExpense, Value } from "../types";
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css';
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hook/useBudget";

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        expenseName: '',
        amount: 0,
        category: '',
        date: new Date()
    })

    const [error, setError] = useState('')
    const [previusAmount, setPreviusAmount] = useState(0)
    const {dispatch, state, remainingBudget} = useBudget()

    useEffect(() => {
        if (state.editingId) {
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviusAmount(editingExpense.amount)
        }
    }, [state.editingId])

    const handleChange = (e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target
        const isAmountField = ['amount'].includes(name)
        setExpense({
            ...expense,
            [name]: isAmountField ? +value : value
        })
    }

    const handleChangeDate =(value: Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        //validar
        if (Object.values(expense).includes('')) {
            setError('todos los campos son obligatorios')
            return
        } 

        //validar que no me pase del limite
        if ((expense.amount - previusAmount) > remainingBudget) {
            setError('ese gasto se sale del presupuesto')
            return
        }
        
        //Agregar o actualizar un nuevo gasto
        if (state.editingId) {
            dispatch({type: 'update-expense', payload: {expense: {id: state.editingId, ...expense}}})
        } else {
            dispatch({type: 'add-expense', payload: {expense}})
        }
        

        //Reiniciar el state
        setExpense({
            expenseName: '',
            amount: 0,
            category: '',
            date: new Date()
        })
        setPreviusAmount(0)
    }

  return (
    <form action="" className="space-y-5 " onSubmit={handleSubmit}>
        <legend className="uppercase text-center text-2xl font-black border-b-4 py-2 border-blue-500">
            {state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
        </legend>

        {error && <ErrorMessage> 
                {error} 
            </ErrorMessage>} 

        <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-xl">
                Nombre Gasto:
            </label>

            <input type="text" id="expenseName" placeholder="Añade el nombre del gasto"
                    className="bg-slate-100 p-2" name="expenseName" 
                    onChange={handleChange} value={expense.expenseName}/>
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-xl">
                Cantidad:
            </label>

            <input type="number" id="amount" placeholder="Añade la cantidad del gasto: ej. 300"
                    className="bg-slate-100 p-2" name="amount"  onChange={handleChange}
                    value={expense.amount}/> 
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xl">
                Categoria:
            </label>

            <select id="category" className="bg-slate-100 p-2" name="category" onChange={handleChange} 
                        value={expense.category}> 
                <option value=''>
                    --Seleccione--
                </option>
                {categories.map(category => (
                        <option value={category.id} key={category.id}>
                            {category.name}
                        </option>
                    ))}
            </select>
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-xl">
                Fecha Gasto:
            </label>

            <DatePicker
                className='bg-slate-100 p-2 border-0'
                value={expense.date}
                onChange={handleChangeDate}
                
            />
        </div>

        <input type="submit" className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg" 
                value={ state.editingId ? 'Guardar Cambios' :'Registrar gasto'} />
        
    </form>
  )
}

