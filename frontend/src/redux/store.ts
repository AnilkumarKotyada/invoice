import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import productSlice from "./slices/productSlice";
import invoiceSlice from "./slices/invoiceSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    product: productSlice,
    invoice: invoiceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
