const contextReducer = (state, action) => {
  let transactions;

  switch (action.type) {
    case "DELETE_TRANSACTIONS":
      transactions = state.filter(
        (transaction) => transaction.id !== action.payload
      );

      localStorage.setItem("transactions", JSON.stringify(transactions));
      return transactions;
    case "Add_TRANSACTIONS":
      transactions = [action.payload, ...state];

      localStorage.setItem("transactions", JSON.stringify(transactions));
      return transactions;
    default:
      return state;
  }
};

export default contextReducer;
