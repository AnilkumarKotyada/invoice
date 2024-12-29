import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Invoice {
  id: string;
  amount: number;
  date: string;
}

const initialState: Invoice[] = [];

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    generateInvoice: (state, action: PayloadAction<Invoice>) => {
      state.push(action.payload);
    },
  },
});

export const { generateInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
