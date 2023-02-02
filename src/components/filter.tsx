import React, { ReactNode } from "react";
import { SearchState } from "./search";

type FilterBarProps = {
    search: SearchState;
    setSearch: (search: SearchState) => void;
    handleSubmit: React.UIEventHandler;
};
const FilterBar = ({ search, setSearch, handleSubmit }: FilterBarProps) => (
    <div id="filterbar">
        <h2>Publication Policy</h2>
        <div id="filters">
            <CheckboxFilter
                id="pubpolicy"
                filterProp={search.pubpolicy}
                setFilterProp={(b: boolean) =>
                    setSearch({ ...search, pubpolicy: b })
                }
                label="hasPolicy: PublicationPolicy"
            />
            <CheckboxFilter
                id="paywall"
                filterProp={search.paywall}
                setFilterProp={(b: boolean) =>
                    setSearch({ ...search, paywall: b })
                }
                label="hasPaywall"
            />
            <SliderFilter
                id="embargo"
                filterProp1={search.embargo}
                setFilterProp1={(b: boolean) =>
                    setSearch({ ...search, embargo: b })
                }
                filterProp2={search.embargoduration}
                setFilterProp2={(n: number) =>
                    setSearch({ ...search, embargoduration: n })
                }
                label="hasEmbargo"
            />
        </div>
        <button onClick={handleSubmit}>Filter</button>
    </div>
);

type CheckboxFilterProps = {
    id: string;
    filterProp: boolean;
    setFilterProp: (b: boolean) => void;
    label: string;
    children?: Array<ReactNode> | ReactNode;
};
const CheckboxFilter = (props: CheckboxFilterProps) => (
    <div id={props.id} className="filter filter-toggle">
        <input
            id={`${props.id}-toggle`}
            type="checkbox"
            checked={Boolean(props.filterProp)}
            onChange={() => props.setFilterProp(!props.filterProp)}
        />
        <label htmlFor={`${props.id}-toggle`}>{props.label}</label>
        {props.children}
    </div>
);

type SliderFilterProps = {
    id: string;
    filterProp1: boolean;
    filterProp2: number;
    setFilterProp1: (b: boolean) => void;
    setFilterProp2: (n: number) => void;
    label: string;
};
const SliderFilter = (props: SliderFilterProps) => (
    <CheckboxFilter
        id={props.id}
        filterProp={props.filterProp1}
        setFilterProp={props.setFilterProp1}
        label={props.label}
    >
        <input
            id={`${props.id}-slider`}
            type="range"
            min="0"
            max="100"
            value={props.filterProp2 || 0}
            onChange={(e) => props.setFilterProp2(Number(e.target.value))}
        />
    </CheckboxFilter>
);

export { FilterBar };
