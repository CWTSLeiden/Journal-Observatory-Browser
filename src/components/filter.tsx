import React from "react";
import { SearchState, SearchRange } from "./search"

type FilterBarProps = {
    search: SearchState;
    setSearch: (search: SearchState) => void;
    handleSubmit: React.UIEventHandler;
};
const FilterBar = ({ search, setSearch, handleSubmit }: FilterBarProps) => (
    <div id="filterbar">
        <h2>Publication Policy</h2>
        <CheckboxFilter
            id="pubpolicy"
            filterProp={search.pubpolicy}
            setFilterProp={() =>
                setSearch({ ...search, pubpolicy: !search.pubpolicy })
            }
            label="hasPolicy: PublicationPolicy"
        />
        <CheckboxFilter
            id="paywall"
            filterProp={search.paywall}
            setFilterProp={() =>
                setSearch({ ...search, paywall: !search.paywall })
            }
            label="hasPaywall"
        />
        <SliderFilter
            id="embargo"
            filterProp={search.embargo}
            setFilterProp={(sr: SearchRange) => setSearch({ ...search, embargo: sr })}
            label="hasEmbargo"
        />
    </div>
);

type CheckboxFilterProps = {
    id: string;
    filterProp: boolean;
    setFilterProp: () => void;
    label: string;
};
const CheckboxFilter = (props: CheckboxFilterProps) => (
    <div id={props.id} className="filter filter-toggle">
        <input
            id={`${props.id}-toggle`}
            type="checkbox"
            onChange={props.setFilterProp}
        />
        <label htmlFor={`${props.id}-toggle`}>{props.label}</label>
    </div>
);

type SliderFilterProps = {
    id: string;
    filterProp: SearchRange;
    setFilterProp: (rf: SearchRange) => void;
    label: string;
};
const SliderFilter = (props: SliderFilterProps) => {
    const checked = props.filterProp ? props.filterProp.filter : false
    const handleCheckChange = () => props.setFilterProp({...props.filterProp, filter: !checked,})
    const handleRangeChange = (e) => props.setFilterProp({...props.filterProp, number: Number(e.target.value),})
    return (
        <div id={props.id} className="filter filter-toggle">
            <input
                id={`${props.id}-toggle`}
                type="checkbox"
                onChange={handleCheckChange}
            />
            <label htmlFor={`${props.id}-toggle`}>{props.label}</label>
            <input
                id={`${props.id}-slider`}
                type="range"
                min="0"
                max="100"
                defaultValue={0}
                onChange={handleRangeChange}
            />
        </div>
    )
};

export { FilterBar };
