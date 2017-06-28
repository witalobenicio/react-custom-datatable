import React, {Component} from 'react';
import {withRouter} from 'react-router'

class Header extends Component {

  constructor() {
    super();

    this.state = {
      columns: [],
      columnsVisible: [],
      lastSortProp: '',
      lastSortAsc: 'asc',
      checked: false,
    }
  }

  componentDidMount() {
    this.setState({checked: this.props.checked, columns: this.props.columns, columnsVisible: this.props.columnsVisible});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({checked: nextProps.checked, columns: nextProps.columns, columnsVisible: nextProps.columnsVisible});
  }

  onChangeCheck() {
    this.props.onChangeCheckAll();
  }

  render() {

    return (
        <div className="line header resume">
            {!!this.props.enableCheck && (
              <div className="be-checkbox inline" style={{padding: 0}}>
                <input type="checkbox" id={'table-selectall-' + this.props.id}
                       name={'table-selectall-' + this.props.id}
                       onChange={this.onChangeCheck.bind(this)}
                       checked={this.state.checked}/>
                <label htmlFor={'table-selectall-' + this.props.id}></label>
              </div>
            )}
          { this.state.columns && (this.state.columns.map((column, index) => {
            if (this.props.useShowHideColumns) {
              if (_.includes(this.state.columnsVisible, column)) {
                return (
                  <div className={'th ' + (column.classes && (column.classes(column, index)))} style={column.style} onClick={column.disableSort ? null : () => this.props.sortTable(column.property, column.type)} key={index}>
                    {/*{ this.props.useShowHideColumns && (*/}
                      {/*<i className="mdi mdi-close close-column" onClick={() => this.props.changeColumnVisible(column)}></i>*/}
                    {/*)}*/}
                    {column.renderHeader ? column.renderHeader(column, index) : column.name} {this.props.getIconForSort(column.property)}
                  </div>
                );
              } else {
                return null;
              }
            } else {
              return (
                <div className={'th ' + (column.classes && (column.classes(column, index)))} style={column.style} onClick={column.disableSort ? null : () => this.props.sortTable(column.property, column.type)} key={index}>
                {/*{ this.props.useShowHideColumns && (*/}
                  {/*<i className="mdi mdi-close close-column" onClick={() => this.props.changeColumnVisible(column)}></i>*/}
                {/*)}*/}
                {column.renderHeader ? column.renderHeader(column, index) : column.name} {this.props.getIconForSort(column.property)}
              </div>
              );
            }
          }))}
        </div>
    );
  }
}

export default withRouter(Header, {withRef: true});