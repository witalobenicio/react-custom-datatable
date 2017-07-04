import React, {Component} from 'react';
import 'lodash';

export default class Row extends Component {

  constructor() {
    super();

    this.state = {
      columns: [],
      columnsVisible: [],
      item: {},
      endlineRenders: [],
      index: 0,
      data: {},
      showExpand: false,
      checked: false,
      selectedItems: [],
      onClickRow: () => {},
    }
  }

  componentDidMount() {
    this.setState({
      columnsVisible: this.props.columnsVisible,
      data: this.props.data,
      onClickRow: this.props.onClickRow,
      columns: this.props.columns,
      item: this.props.item,
      index: this.props.index,
      selectedItems: this.props.selectedItems,
      endlineRenders: this.props.endlineRenders
    }, ()=> {
      let key = ('table-rows-expand-' + (this.props.id || this.props.ref || 'roove'));
      let value = JSON.parse(localStorage.getItem(key) || '{}');

      this.setState({
        showExpand: !!value[this.state.data[this.props.rowId]]
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      columnsVisible: nextProps.columnsVisible,
      data: nextProps.data,
      columns: nextProps.columns,
      item: nextProps.item,
      index: nextProps.index,
      selectedItems: nextProps.selectedItems,
      endlineRenders: nextProps.endlineRenders
    });
  }

  onClickRow(item, index) {
    if (this.props.renderRowExpand) {
      this.showExpand();
    } else {
      return this.props.onClickRow(item, index);
    }
  }

  showExpand() {
    this.setState({
      showExpand: !this.state.showExpand
    }, ()=> {
      let key = ('table-rows-expand-' + (this.props.id || this.props.ref || 'roove'));
      let value = JSON.parse(localStorage.getItem(key) || '{}');

      value[this.state.data[this.props.rowId]] = this.state.showExpand;

      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  onChangeCheck() {
    this.props.onChangeCheck(this.state.data);
  }

  render() {
    return (
      (this.state.data !== {} && this.props.hiddenRow ? this.props.hiddenRow(this.state.data, this.state.index) : false) ? null :
        <div className="row-box" id={ this.state.data[this.props.rowId] || this.state.index }>
          <div onClick={this.props.onClickRow ? this.onClickRow.bind(this, this.state.data, this.state.index) : null}
               className={'line resume ' + (this.props.rowClasses && (this.props.rowClasses(this.state.data, this.state.index)))}
               style={{cursor: 'pointer'}}
               key={this.state.index}>
            {!!this.props.renderRowExpand && (
              this.state.showExpand ?
                <i className="mdi mdi-chevron-up mdi-hc-lg"></i>
              :
                <i className="mdi mdi-chevron-down mdi-hc-lg"></i>
            )}
            {!!this.props.enableCheck && (
              <div className="be-checkbox inline" style={{padding: 0}}>
                <input type="checkbox" id={'table-select-' + this.state.index}
                       name={'table-select-' + this.state.index}
                       onChange={this.onChangeCheck.bind(this)}
                       checked={_.includes(this.state.selectedItems, this.state.data)}/>
                <label htmlFor={'table-select-' + this.state.index}></label>
              </div>
            )}
            {this.state.columns && (this.state.columns.map((column, index) => {
              if (this.props.useShowHideColumns) {
                if (_.includes(this.state.columnsVisible, column)) {
                  return (
                    <div className={'td ' + (column.itemClasses && (column.itemClasses(this.state.data, this.state.index)))} style={column.itemStyle || column.style} key={this.state.index + '-' + index}>
                      {column.renderItem ? column.renderItem(this.state.data, this.state.index) : this.state.data[column.property]}
                    </div>
                  );
                } else {
                  return null;
                }
              } else {
                return (
                  <div className={'td ' + (column.itemClasses && (column.itemClasses(this.state.data, this.state.index)))} style={column.itemStyle || column.style} key={this.state.index + '-' + index}>
                    {column.renderItem ? column.renderItem(this.state.data, this.state.index) : this.state.data[column.property]}
                  </div>
                )
              }
            }))}
            {this.state.endlineRenders && (this.state.endlineRenders.map((render, index) => {
              return (
                render.render(this.state.data, this.state.index)
              );
            }))}
          </div>
          {this.props.renderRowExpand && this.state.showExpand &&
          <div className="md-mb-20">
            <div className="horizontal-divider"></div>
            <div className="expand-content">
              {this.props.renderRowExpand(this.state.data, this.state.index)}
            </div>
          </div>
          }
        </div>
    );
  }
}
