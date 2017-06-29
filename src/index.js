import ComponentTable from './js/modules/table/Table';
import React, {Component} from 'react';

class Table extends Component {

  render() {
    return (
      <ComponentTable {...this.props} />
    )
  }

}

export default Table;