import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "../store";

// Correctly typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
