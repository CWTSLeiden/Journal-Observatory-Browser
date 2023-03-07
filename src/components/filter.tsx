import React, { ReactElement, useEffect, useState } from "react";
import {
    Badge,
    Checkbox,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Slider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { enabledToggles, Toggles } from "../reducers/search";
import { labelize } from "../query/labels";

type CheckboxFilterParams = {
    state: boolean;
    action: () => void;
    label: string;
};
export const CheckboxFilter = ({
    state,
    action,
    label,
}: CheckboxFilterParams) => {
    return (
        <ListItem>
            <ListItemButton onClick={action}>
                <ListItemIcon>
                    <Checkbox checked={state} />
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItemButton>
        </ListItem>
    );
};

type SliderFilterParams = {
    state: boolean;
    value: number;
    setvalue: (n: number) => void;
    range: number[];
    unit?: string;
};
export const SliderFilter = ({
    state,
    value,
    setvalue,
    range,
    unit,
}: SliderFilterParams) => {
    const [number, setNumber] = useState(value);
    useEffect(() => setNumber(value), [value]);
    return (
        <Slider
            disabled={!state}
            valueLabelFormat={(n) => <div>{`${n} ${unit ? unit : ""}`}</div>}
            value={number}
            onChange={(_, n: number) => setNumber(n)}
            onChangeCommitted={(_, n: number) => setvalue(n)}
            min={Math.min(...range)}
            max={Math.max(...range)}
            valueLabelDisplay="auto"
            marks={range.map((n) => ({
                value: n,
                label: String(n),
            }))}
        />
    );
};

type DropdownCheckboxProps = {
    state: boolean;
    toggle: () => void;
    icon?: ReactElement;
    label: string;
    children: ReactElement | ReactElement[];
    indicator?: boolean;
}
export const DropdownCheckbox = ({state, toggle, icon, label, children, indicator}: DropdownCheckboxProps) => {
    return (
        <React.Fragment>
            <ListItem>
                <ListItemButton onClick={toggle}>
                    <ListItemIcon>
                        {icon ? icon : <Checkbox checked={state} />}
                    </ListItemIcon>
                    <ListItemText primary={label} />
                    {indicator ? (state ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItemButton>
            </ListItem>
            <Collapse in={state} timeout="auto" unmountOnExit>
                <List sx={{pl: 4, pr: 2}}>
                    { children }
                </List>
            </Collapse>
        </React.Fragment>
    )
}

type DropdownTogglesProps = {
    label: string;
    toggles: Toggles;
    toggle_action: (p: string) => void;
}
export const DropdownToggles = ({label, toggles, toggle_action}: DropdownTogglesProps) => {
    const [open, setOpen] = useState(false)
    const amount = enabledToggles(toggles).length
    const icon = (
        <Badge overlap="circular" badgeContent={amount} color="primary">
            <Checkbox checked={amount > 0} />
        </Badge>
    )
    return (
        <DropdownCheckbox
            state={open}
            toggle={() => setOpen(!open)}
            icon={icon}
            label={label}
            indicator
        >
            { Object.keys(toggles).map((p: string) => 
                <CheckboxFilter
                    key={p}
                    state={toggles[p]}
                    action={() => toggle_action(p)}
                    label={labelize(p)}
                />)
            }
        </DropdownCheckbox>
    )
}
