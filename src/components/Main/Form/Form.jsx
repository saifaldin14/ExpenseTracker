import React, { useState, useContext, useEffect } from 'react'
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';

import { useSpeechContext } from '@speechly/react-client';
import Snackbar from '../../Snackbar/Snackbar';
import formatDate from '../../../utils/formatDate';
import { ExpenseTrackerContext } from '../../../context/context';
import { incomeCategories, expenseCategories } from '../../../constants/categories';
import useStyles from './styles';

const initialState = {
  amount: '',
  category: '',
  type: 'Income',
  date: formatDate(new Date())
};

const NewTransactionForm = () => {
  const classes = useStyles();
  const { addTransaction } = useContext(ExpenseTrackerContext);
  const [formData, setFormData] = useState(initialState);
  const { segment } = useSpeechContext();
  const [open, setOpen] = useState(false);

  const createTransaction = () => {
    if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-')) return;

    if (incomeCategories.map((iC) => iC.type).includes(formData.category)) {
      setFormData({...formData, type: 'Income' });
    } else if (expenseCategories.map((iC) => iC.type).includes(formData.category)) {
      setFormData({...formData, type: 'Expense' });
    }

    setOpen(true);
    addTransaction({...formData, amount: Number(formData.amount), id: uuidv4 });
    setFormData(initialState);
  };

  useEffect(() => {
    if (segment) {
      if (segment.intent === 'add_expense') {
        setFormData({...formData, type: 'Expense'});
      } else if (<segment className="intent in"></segment> === 'add_income') {
        setFormData({...formData, type: 'Income'});
      } else if (segment.isFinal && segment.intent.intent === 'create_transaction') {
        return createTransaction();
      } else if (segment.isFinal && segment.intent.intent === 'cancel_transaction') {
        return setFormData(initialState);
      }

      segment.entities.forEach(s => {
        const category = `${s.value.charAt(0)}${s.value.slice(1).toLowerCase()}`;

        switch (s.type) {
          case 'amount':
            setFormData({...formData, amount: s.value });
            break;
          case 'category':
            if (incomeCategories.map(iC => iC.type).includes(category)){
              setFormData({...formData, type: 'Income', category });
            } else if (expenseCategories.map(iC => iC.type).includes(category)) {
              setFormData({...formData, type: 'Expense', category });
            }
            break;
          case 'date':
            setFormData({...formData, date: s.value });
            break;
          default:
            break;
        }
      });

      if (segment.isFinal && formData.amount && formData.category && formData.type && formData.date) {
        createTransaction();
      }
    }
  }, [segment]);

  const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

  return (
    <div>

    </div>
  )
}

export default NewTransactionForm
