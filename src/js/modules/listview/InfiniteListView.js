import React  from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import DefaultAdapter from './adapters/DefaultAdapter.js';

class InfiniteListView extends React.Component {

    static get defaultProps() {
        return {
            initialLoad: true,
            threshold: 250,
            pageStart: 1,
            perPage: 50,
            adapter: DefaultAdapter,
            adapterOptions: {},
            refName: 'scroll',
            useWindow: true,
            loadData: (pageToLoad) => {},
            onLoadData: (data) => {},
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            success: true,
            hasMore: true,
            view: 'list',
            paginate: {
                page: 1,
                per_page: this.props.perPage,
                q: ''
            }
        };

        // See: https://hjnilsson.com/2016/04/17/addChangeListener-removeChangeListener-bind-and-unbind/
        // this.onRecieveHeaderAction = this._onRecieveHeaderActions.bind(this);
    }

    reload() {
        let data = [];

        let paginate = this.state.paginate;
        paginate.page = 1;

        this.setState({data, paginate, hasMore: true});
        this.refs.scroll.scrollListener();
    }

    loadData() {
        console.log("loadData");
        this.props.loadData(
            this.onLoadData.bind(this),
            this.state.paginate
        );
    }

    onSearch(action) {
        let data = [];

        let paginate = this.state.paginate;
        paginate.q = action.value;
        paginate.page = 1;

        this.setState({data, paginate, hasMore: true});
        this.refs.scroll.scrollListener();
    }

    // onChangeView(action) {
    //     let view = action.value;
    //     this.setState({view});
    // }

    // _onRecieveHeaderActions(action) {
    //
    //     switch (action.actionType) {
    //         case HeaderActionTypes.TOP_SEARCH:
    //             this.onSearch(action);
    //             break;
    //
    //         case HeaderActionTypes.SYNC:
    //             this.reload();
    //             break;
    //
    //         case HeaderActionTypes.CHANGE_VIEW:
    //             this.onChangeView(action);
    //             break;
    //
    //         default:
    //             break;
    //     }
    // }

    getItems() {
        if (!this.state.hasMore && !this.state.data.length) {
            return (
                <div className="m-t-30 m-b-30 col-md-12">
                    <div className="m-t-30 text-center">
                        <div className="m-t-30"><i className="zmdi zmdi-alert-octagon zmdi-hc-5x"></i></div>
                        <div className="m-t-5 m-b-30">Nenhum registro encontrado.</div>
                    </div>
                </div>
            );
        }

        return this.state.data.map((data, key) => {
            return this.getAdapter(data, key);
        });
    }

    getAdapter(data, key) {
        let Adapter = this.props.adapter;
        return <Adapter {...this.props.adapterOptions} view={this.state.view} data={data} key={data.identifier} />;
    }

    onLoadData(newData, success) {
        let hasMore = (newData.length === this.props.perPage);
        let data = this.state.data.concat(newData);
        let paginate = this.state.paginate;
        paginate.page = paginate.page + 1;

        this.setState({data, paginate, hasMore, success: !!success});
        this.props.onLoadData(data);
    }

    getLoader() {
        return (<div className="m-t-30 m-b-40 p-30 text-center col-xs-12">Carregando...</div>)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({view : nextProps.view});
    }

    getErrorMessage() {
        return (
            <div className="m-t-30 m-b-30 col-md-12">
                <div className="m-t-30 text-center">
                    <div className="m-t-30"><i className="zmdi zmdi-alert-triangle zmdi-hc-5x c-red"></i></div>
                    <div className="m-t-5 m-b-30">Ocorreu um erro ao recuperar os dados.</div>
                </div>
            </div>
        );
    }

    render() {
        // if (!this.state.success) {
        //     return this.getErrorMessage();
        // }

        return (
            <InfiniteScroll
                initialLoad={this.props.initialLoad}
                pageStart={this.props.pageStart}
                loadMore={this.loadData.bind(this)}
                hasMore={this.state.hasMore}
                threshold={this.props.threshold}
                loader={this.getLoader()}
                useWindow={this.props.useWindow}>

                {this.getItems()}

            </InfiniteScroll>
        )
    }
}

export default InfiniteListView;
