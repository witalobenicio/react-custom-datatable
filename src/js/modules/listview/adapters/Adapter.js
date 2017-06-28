import React from 'react';

class Adapter extends React.Component {

    static get defaultProps() {
        return {
            data: {},
            view: 'grid'
        }
    }

    render() {
        return (<div>{this.props.data.title}</div>);
    }
}

export default Adapter;
