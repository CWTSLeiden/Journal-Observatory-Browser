import React, { ReactElement, ReactNode } from "react";
import { LinkItUrl } from "react-linkify-it";
import PropTypes from "prop-types";

function urlize(thing: ReactNode): ReactElement {
    return <LinkItUrl>{thing}</LinkItUrl>;
}

const LoadingView = () => <div>Loading</div>;

type SrcViewProps = { sources: Array<string> };
const SrcView = ({ sources }: SrcViewProps) => (
    <div className="src">
        <div className="src-short">{sources.length}</div>
        <div className="src-long">{urlize(sources.join(", "))}</div>
    </div>
);
SrcView.propTypes = { sources: PropTypes.arrayOf(PropTypes.string).isRequired };

type ValueViewProps = { value: string; src?: ReactNode };
const ValueView = ({ value, src }: ValueViewProps) => (
    <div className="value">
        {urlize(value)}
        {src}
    </div>
);
ValueView.propTypes = {
    value: PropTypes.string.isRequired,
    src: PropTypes.node,
};

type IdViewProps = { id: string; children?: ReactNode; src?: ReactNode };
const IdView = ({ id, children, src }: IdViewProps) => (
    <div className="id">
        {urlize(id)}
        {src}
        {children}
    </div>
);
IdView.propTypes = {
    id: PropTypes.string.isRequired,
    content: PropTypes.any,
    src: PropTypes.node,
};

type ListViewProps = { value: string | ReactNode; src?: ReactNode };
const ListView = ({ value, src }: ListViewProps) => (
    <li>
        {value}
        {src}
    </li>
);
ListView.propTypes = {
    value: PropTypes.any.isRequired,
    src: PropTypes.node,
};

type SortProps = { children: Array<ReactNode>; by?: string };
const Sort = ({ children, by }: SortProps) => {
    const compare = (a: ReactNode, b: ReactNode) => (a[by] > b[by] ? 1 : -1);
    if (by) {
        return <>{React.Children.toArray(children).sort(compare)}</>;
    }
    return <>{children}</>;
};

type UnorderedListViewProps = { children: Array<ReactNode>; sortBy?: string; src?: ReactNode };
const UnorderedListView = ({ children, sortBy, src }: UnorderedListViewProps) => (
        <ul>
            {src}
            <Sort by={sortBy || "key"}>{children}</Sort>
        </ul>
    );
UnorderedListView.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    sortBy: PropTypes.string,
    src: PropTypes.node,
};

type OrderedListViewProps = { children: Array<ReactNode>; sortBy?: string; src?: ReactNode };
const OrderedListView = ({ children, sortBy, src }: OrderedListViewProps) => (
    <ol>
        {src}
        <Sort by={sortBy || "key"}>{children}</Sort>
    </ol>
);
OrderedListView.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
    sortBy: PropTypes.string,
    src: PropTypes.node,
};

type DefListViewProps = {
    title: string;
    value: string | ReactNode;
    src?: ReactNode;
};
const DefListView = ({ title, value, src }: DefListViewProps) => (
    <li>
        <dt>{title}</dt>
        <dd>{value}</dd>
        {src}
    </li>
);
DefListView.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    src: PropTypes.node,
};

export {
    LoadingView,
    SrcView,
    ValueView,
    IdView,
    DefListView,
    ListView,
    UnorderedListView,
    OrderedListView,
};
