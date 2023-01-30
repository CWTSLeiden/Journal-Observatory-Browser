import React, { ReactElement, ReactNode } from "react";
import { LinkItUrl } from "react-linkify-it";
import PropTypes from "prop-types";

function urlize(thing: ReactNode): ReactElement {
    return <LinkItUrl>{thing}</LinkItUrl>;
}

const LoadingView = () => (
    <div>Loading</div>
)

const SrcView = ({ sources }) => (
    <div className="src">
        <div className="src-short">{sources.length}</div>
        <div className="src-long">{urlize(sources.join(", "))}</div>
    </div>
);
SrcView.propTypes = { sources: PropTypes.arrayOf(PropTypes.string).isRequired };

const ValueView = ({ value, src }) => (
    <div className="value">
        {urlize(value)}
        {src}
    </div>
);
ValueView.propTypes = {
    value: PropTypes.string.isRequired,
    src: PropTypes.node,
};

const IdView = ({ id, content, src }) => (
    <div className="id">
        {urlize(id)}
        {src}
        {content}
    </div>
);
IdView.propTypes = {
    id: PropTypes.string.isRequired,
    content: PropTypes.any,
    src: PropTypes.node,
};

const ListView = ({ value, src }) => (
    <li>
        {value}
        {src}
    </li>
);
ListView.propTypes = {
    value: PropTypes.any.isRequired,
    src: PropTypes.node,
};

const UnorderedListView = ({ items, src }) => (
    <ul>
        {items}
        {src}
    </ul>
);
UnorderedListView.propTypes = {
    items: PropTypes.arrayOf(PropTypes.node).isRequired,
    src: PropTypes.node,
};

const OrderedListView = ({ items, src }) => (
    <ol>
        {items}
        {src}
    </ol>
);
OrderedListView.propTypes = {
    items: PropTypes.arrayOf(PropTypes.node).isRequired,
    src: PropTypes.node,
};

const DefListView = ({ title, value, src }) => (
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
