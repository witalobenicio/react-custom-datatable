import React  from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import DefaultAdapter from './adapters/DefaultAdapter.js';

class ScrollListView extends React.Component {

  static get defaultProps() {
    return {
      initialLoad: false,
      pageStart: 50,
      adapter: DefaultAdapter,
      adapterOptions: {},
      refName: 'list',
      useWindow: true,
      data: []
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      hasMore: false,
      useWindow: true,
      page: 1
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({useWindow: nextProps.useWindow, pageStart: nextProps.pageStart,
      hasMore: (this.state.page * this.props.pageStart) < this.props.data.length
    });
  }

  componentWillMount() {
    this.setState({
      useWindow: this.props.useWindow,
      hasMore: (this.state.page * this.props.pageStart) < this.props.data.length
    });
  }

  getItems() {
    if (!this.state.hasMore && !this.props.data.length) {
      return (
        <div className="m-t-30 m-b-30 col-md-12">
          <div className="m-t-30 text-center">
            <div className="m-t-30"><i className="zmdi zmdi-alert-octagon zmdi-hc-5x"></i></div>
            <div className="m-t-5 m-b-30">Nenhum registro encontrado.</div>
          </div>
        </div>
      );
    }

    let data = [];
    for (let i = 0; i < (this.state.page * this.props.pageStart); i++) {
      let item = this.props.data[i];
      if (item === undefined) {
        break;
      }

      data.push(this.getAdapter(item, i));
    }

    return data;
  }

  getAdapter(data, key) {
    let Adapter = this.props.adapter;
    return <Adapter {...this.props.adapterOptions} data={data} index={key} key={key} />;
  }

  getLoader() {
    return (<div className="m-t-30 m-b-40 p-30 text-center col-xs-12">Carregando...</div>)
  }

  loadMore() {
    let page = this.state.page;
    page++;

    this.setState({
      page,
      hasMore: (page * this.props.pageStart) < this.props.data.length
    });
  }

  render() {
    return (
      <InfiniteScroll
        initialLoad={false}
        pageStart={this.props.pageStart}
        loader={this.getLoader()}
        loadMore={this.loadMore.bind(this)}
        hasMore={this.state.hasMore}
        useWindow={this.state.useWindow}>

        {this.getItems()}

      </InfiniteScroll>
    )
  }
}

export default ScrollListView;
