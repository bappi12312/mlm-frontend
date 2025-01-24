"use client"
import { Provider } from "react-redux"
import React,{ReactNode,useMemo} 
from "react"
import { makeStore } from "../lib/store/store"


export const StoreProvider = ({children}:{children:ReactNode}) => {
  const store = useMemo(() => makeStore(), []);

  return <Provider store={store}>{children}</Provider>;
}