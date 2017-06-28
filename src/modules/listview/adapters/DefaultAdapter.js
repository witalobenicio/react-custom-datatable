import React from 'react';
import Adapter from './Adapter.js';

class DefaultAdapter extends Adapter {

    render() {
        return (
            <li>{this.props.data.title}</li>
        )
    }
}

export default DefaultAdapter;
