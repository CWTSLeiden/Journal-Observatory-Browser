import { Quadstore } from "quadstore";
import { createContext } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import SearchReducer from "../store/search";
import PadsReducer from "../store/pads";
import DetailsReducer from "../store/details";

// Redux
const store = configureStore({
    reducer: {
        search: SearchReducer,
        pads: PadsReducer,
        details: DetailsReducer
    },
    devTools: true
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type SearchStore = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<SearchStore> = useSelector

// React Context
const defaultOntologyContext: Quadstore = undefined
export const OntologyContext = createContext(defaultOntologyContext)

export const LabelContext = createContext({})

const defaultPadContext: Quadstore = undefined
export const PadContext = createContext(defaultPadContext)
