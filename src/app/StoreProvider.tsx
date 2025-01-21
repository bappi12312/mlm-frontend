"use client"
import { Provider } from "react-redux"
import React,{ReactNode,useRef} 
from "react"
import { makeStore, AppStore } from "../lib/store/store"


export const StoreProvider = ({children}:{children:ReactNode}) => {
  const storeRef = useRef<AppStore>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}