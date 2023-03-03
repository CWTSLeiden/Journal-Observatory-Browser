import React from "react";
import * as searchActions from "../actions/search";
import { CheckBoxFilter, CheckSliderFilter } from "./filter";
import { labelize } from "../query/labels";

export const PubPolicyFilter = () => (
    <CheckBoxFilter
        state={(store) => store.search.pub_policy}
        action={searchActions.toggle_pub_policy}
        label={labelize("ppo:hasPublicationPolicy", "has Publication Policy")}
    />
)

export const OpenAccessFilter = () => (
    <CheckBoxFilter
        state={(store) => store.search.open_access}
        action={searchActions.toggle_open_access}
        label={labelize("ppo:isOpenAccess", "is Open Access")}
    />
)

export const PubEmbargoFilter = () => (
    <CheckSliderFilter
        state={(store) => store.search.pub_embargo}
        togglestate={searchActions.toggle_pub_embargo}
        label={labelize("fabio:hasEmbargoDuration", "has Embargo Duration")}
        value={(store) => store.search.pub_embargoduration}
        setvalue={searchActions.set_pub_embargo}
        range={[0, 6, 12, 18, 24]}
        unit="Months"
    />
);

export const PubApcFilter = () => (
    <CheckSliderFilter
        state={(store) => store.search.pub_apc}
        togglestate={searchActions.toggle_pub_apc}
        label={labelize("ppo:hasArticlePublishingCharges", "has APC")}
        value={(store) => store.search.pub_apcamount}
        setvalue={searchActions.set_pub_apc}
        range={[0, 100, 200, 300, 400]}
        unit="USD"
    />
);
