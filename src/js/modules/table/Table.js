import React, { Component } from "react";
import Header from "./Header";
import Row from "./Row";
import ScrollListView from "../listview/ScrollListView";
import { Sticky, StickyContainer } from "react-sticky";

export default class Table extends Component {
    constructor() {
        super();

        this.state = {
            columns: [],
            items: [],
            endlineRenders: [],
            loading: false,
            error: false,
            initialSortProp: "",
            searchString: "",
            lastSortProp: "",
            lastSortAsc: "desc",
            selectedItems: [],
            columnsVisible: [],
            withoutSorting: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.state.columns.length === 0 &&
            nextProps.columns.length > 0 &&
            this.state.initialSortProp !== ""
        ) {
            this.setState(
                {
                    lastSortProp: this.state.initialSortProp,
                    lastSortAsc: "asc",
                    columns: nextProps.columns
                },
                () => {
                    this.sortTable(this.state.initialSortProp);
                }
            );
        }
        this.setState({
            rowActive: nextProps.rowActive,
            columns: nextProps.columns,
            items: nextProps.items,
            endlineRenders: nextProps.endlineRenders,
            initialSortProp: nextProps.initialSortProp,
            withoutSorting: nextProps.withoutSorting
        });
    }

    changeColumnsVisible(column) {
        let columnsVisible = this.state.columnsVisible;
        if (_.includes(this.state.columnsVisible, column)) {
            let index = columnsVisible.indexOf(column);
            columnsVisible.splice(index, 1);
        } else {
            columnsVisible.push(column);
        }

        this.setState({ columnsVisible });
    }

    componentDidMount() {
        this.setState(
            {
                columnsVisible: Object.assign([], this.props.columns),
                rowActive: this.props.rowActive,
                columns: this.props.columns,
                items: this.props.items,
                endlineRenders: this.props.endlineRenders,
                initialSortProp: this.props.initialSortProp
            },
            () => {
                if (
                    this.state.columns.length > 0 &&
                    this.state.initialSortProp !== ""
                ) {
                    this.sortTable(this.state.initialSortProp);
                    this.setState({
                        lastSortProp: this.state.initialSortProp,
                        lastSortAsc: "asc"
                    });
                }

                let key =
                    "search-table-" + (this.props.id || this.props.ref || "roove");
                let value = localStorage.getItem(key);
                if (value !== null) {
                    let element = $("#" + key);
                    element.val(value);
                    this.setState({ searchString: value });
                }
            }
        );
    }

    sortArrayBy = function(field, reverse, pr) {
        reverse = reverse ? -1 : 1;
        return function(a, b) {
            a = a[field];
            b = b[field];
            if (pr !== undefined) {
                a = pr(a);
                b = pr(b);
            }
            if (a < b) return reverse * -1;
            if (a > b) return reverse * 1;
            return 0;
        };
    };

    sortTable(propName, pr) {
        let reverse =
            propName === this.state.lastSortProp && this.state.lastSortAsc === "asc";
        let items = this.state.items;

        if (propName !== this.state.lastSortProp) {
            items = items.sort(this.sortArrayBy(propName, reverse, pr));
            this.setState(
                { items, lastSortAsc: "asc", lastSortProp: propName },
                () => {}
            );
        } else {
            if (this.state.lastSortAsc === "desc") {
                items = items.sort(this.sortArrayBy(propName, reverse, pr));
                this.setState(
                    { items, lastSortAsc: "asc", lastSortProp: propName },
                    () => {}
                );
            } else {
                items = items.sort(this.sortArrayBy(propName, reverse, pr));
                this.setState(
                    { items, lastSortAsc: "desc", lastSortProp: propName },
                    () => {}
                );
            }
        }
    }

    getIconForSort(propName) {
        if (propName === this.state.lastSortProp) {
            return this.state.lastSortAsc === "asc" ? (
                <i className="mdi mdi-long-arrow-down" />
            ) : (
                <i className="mdi mdi-long-arrow-up" />
            );
        } else {
            return null;
        }
    }

    search(item) {
        this.props.searchProps.forEach(prop => {
            if (!String.prototype.contains) {
                return item[prop].indexOf(this.state.searchString) !== -1;
            }
            return item[prop].contains(this.state.searchString);
        });
    }

    trimString(s) {
        if (s === null || s === undefined) {
            s = "";
        }
        return s.replace(/\s/g, "");
    }

    compareObjects(o1, o2) {
        let k = "";
        for (k in o1) if (o1[k] !== o2[k]) return false;
        for (k in o2) if (o1[k] !== o2[k]) return false;
        return true;
    }

    itemExists(haystack, needle) {
        for (let i = 0; i < haystack.length; i++)
            if (this.compareObjects(haystack[i], needle)) return true;
        return false;
    }

    searchFor(toSearch, items, props) {
        let results = [];
        toSearch = this.trimString(toSearch);
        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < props.length; j++) {
                if (
                    this.trimString(items[i][props[j]])
                        .toLowerCase()
                        .indexOf(toSearch.toLowerCase()) !== -1
                ) {
                    if (!this.itemExists(results, items[i])) results.push(items[i]);
                }
            }
        }
        return results;
    }

    getItems() {
        let searchProps = this.props.searchProps || [];
        if (searchProps.length > 0 && this.state.searchString.length > 0) {
            return this.searchFor(
                this.state.searchString,
                this.state.items,
                this.props.searchProps
            );
        } else {
            return this.state.items;
        }
    }

    onChangeSearchString() {
        let key = "search-table-" + (this.props.id || this.props.ref || "roove");
        let value = this.searchInput.value;
        localStorage.setItem(key, value);
        this.setState({ searchString: value });
    }

    onChangeCheckAll() {
        let selectedItems = [];
        if (this.state.selectedItems.length !== this.getItems().length) {
            selectedItems = Object.assign([], this.getItems());
        }
        this.setState({ selectedItems }, () => {
            if (!!this.props.enableCheck) {
                this.props.onSelectedItemsChange(this.state.selectedItems);
            }
        });
    }

    onChangeItemCheck(data) {
        let selectedItems = this.state.selectedItems;

        if (!_.includes(selectedItems, data)) {
            selectedItems.push(data);
        } else {
            let index = selectedItems.indexOf(data);
            selectedItems.splice(index, 1);
        }

        this.setState({ selectedItems }, () => {
            if (!!this.props.enableCheck) {
                this.props.onSelectedItemsChange(this.state.selectedItems);
            }
        });
    }

    render() {
        return (
            <div
                className={
                    "table " +
                    (this.props.tableClasses &&
                        this.props.tableClasses(this.state.data, this.state.index))
                }
                style={{ paddingTop: 0, marginTop: "20px" }}
                id="table"
            >
                {this.props.searchProps &&
                this.props.searchProps.length > 0 && (
                    <input
                        type="text"
                        className="form-control"
                        ref={item => (this.searchInput = item)}
                        id={
                            "search-table-" + (this.props.id || this.props.ref || "roove")
                        }
                        placeholder="Buscar ..."
                        style={{
                            width: "30%",
                            minWidth: "200px",
                            marginBottom: "30px",
                            marginRight: "15px",
                            height: "41px",
                            padding: "3px 5px",
                            display: "inline-block"
                        }}
                        onChange={this.onChangeSearchString.bind(this)}
                    />
                )}

                {this.props.useShowHideColumns && (
                    <li className="dropdown toggle-columns-container">
                        <a
                            href="#"
                            data-toggle="dropdown"
                            role="button"
                            aria-expanded="false"
                            className="dropdown-toggle"
                        >
                            Esconder/Exibir colunas <span className="mdi mdi-caret-down" />
                        </a>
                        <ul
                            role="menu"
                            className="dropdown-menu"
                            style={{ marginBottom: "20px" }}
                        >
                            {this.state.columns.map((column, index) => {
                                return (
                                    <li style={{ marginLeft: "15px" }} key={index}>
                                        <input
                                            type="checkbox"
                                            id={
                                                (this.props.id || "roove") +
                                                "-check-column-visible" +
                                                index
                                            }
                                            name={
                                                (this.props.id || "roove") +
                                                "-check-column-visible" +
                                                index
                                            }
                                            onChange={this.changeColumnsVisible.bind(this, column)}
                                            checked={_.includes(this.state.columnsVisible, column)}
                                        />
                                        <label
                                            htmlFor={
                                                (this.props.id || "roove") +
                                                "-check-column-visible" +
                                                index
                                            }
                                            className="lg-ml-10"
                                        >
                                            {column.name}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                )}

                {this.props.disableSticky ? (
                    <div>
                        <Header
                            disableSticky={this.props.disableSticky}
                            renderRowExpand={this.props.renderRowExpand}
                            useShowHideColumns={this.props.useShowHideColumns}
                            changeColumnVisible={this.changeColumnsVisible.bind(this)}
                            columnsVisible={this.state.columnsVisible}
                            id={this.props.id || this.props.ref || "roove"}
                            onChangeCheckAll={this.onChangeCheckAll.bind(this)}
                            enableCheck={this.props.enableCheck || false}
                            checked={
                                this.state.selectedItems.length === this.state.items.length
                            }
                            columns={this.state.columns}
                            getIconForSort={this.getIconForSort.bind(this)}
                            sortTable={this.sortTable.bind(this)}
                            withoutSorting={this.props.withoutSorting || false}
                        />

                        <ScrollListView
                            adapterOptions={{
                                useShowHideColumns: this.props.useShowHideColumns,
                                columnsVisible: this.state.columnsVisible,
                                columns: this.state.columns,
                                endlineRenders: this.state.endlineRenders,
                                onClickRow: this.props.onClickRow,
                                hiddenRow: this.props.hiddenRow,
                                rowClasses: this.props.rowClasses,
                                enableCheck: this.props.enableCheck || false,
                                selectedItems: this.state.selectedItems,
                                onChangeCheck: this.onChangeItemCheck.bind(this)
                            }}
                            pageStart={this.props.pageStart}
                            useWindow={this.props.useWindow}
                            data={this.getItems()}
                            adapter={Row}
                        />
                    </div>
                ) : (
                    <StickyContainer>
                        <Sticky topOffset={this.props.topOffset || 0}>
                            {({ style, isSticky }) => {
                                return (
                                    <Header
                                        topOffset={this.props.topOffset}
                                        disableSticky={this.props.disableSticky}
                                        isSticky={isSticky}
                                        style={style}
                                        changeColumnVisible={this.changeColumnsVisible.bind(this)}
                                        useShowHideColumns={this.props.useShowHideColumns}
                                        columnsVisible={this.state.columnsVisible}
                                        id={this.props.id || this.props.ref || "roove"}
                                        onChangeCheckAll={this.onChangeCheckAll.bind(this)}
                                        enableCheck={this.props.enableCheck || false}
                                        checked={
                                            this.state.selectedItems.length ===
                                            this.state.items.length
                                        }
                                        columns={this.state.columns}
                                        getIconForSort={this.getIconForSort.bind(this)}
                                        sortTable={this.sortTable.bind(this)}
                                        withoutSorting={this.props.withoutSorting || false}
                                    />
                                );
                            }}
                        </Sticky>

                        <ScrollListView
                            adapterOptions={{
                                renderRowExpand: this.props.renderRowExpand,
                                useShowHideColumns: this.props.useShowHideColumns,
                                columnsVisible: this.state.columnsVisible,
                                columns: this.state.columns,
                                endlineRenders: this.state.endlineRenders,
                                onClickRow: this.props.onClickRow,
                                hiddenRow: this.props.hiddenRow,
                                rowClasses: this.props.rowClasses,
                                enableCheck: this.props.enableCheck || false,
                                rowId: this.props.rowId || "id",
                                id: this.props.id || this.props.ref || "roove",
                                selectedItems: this.state.selectedItems,
                                onChangeCheck: this.onChangeItemCheck.bind(this)
                            }}
                            pageStart={this.props.pageStart}
                            useWindow={this.props.useWindow}
                            data={this.getItems()}
                            adapter={Row}
                        />
                    </StickyContainer>
                )}
            </div>
        );
    }
}
