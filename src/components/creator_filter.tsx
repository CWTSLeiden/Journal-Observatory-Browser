import React from "react";
import * as searchActions from "../actions/search";
import { CheckBoxFilter } from "./filter";
import { creators } from "../config";

export const CreatorFilter = ({ creator }: { creator: string }) => {
    return (
        <CheckBoxFilter
            state={(store) => store.search.creators[creator]}
            action={() => searchActions.toggle_creator(creator)}
            label={creators[creator] || creator}
        />
)}
