import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import searchReducer from "../reducers/search";
import PadsReducer from "../reducers/pads";

const store = configureStore({
    reducer: {
        search: searchReducer,
        pads: PadsReducer
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
