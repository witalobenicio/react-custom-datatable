# react-datatable
A react component similar to the very known jquery datatable.

### Features of react-datatable
- Default theme
- Hide and show columns
- Hide row
- Order ascending and descending
- Set initial order
- Customize headers
- Customize items
- Endline render
- Row Click
- Row Expand
- Select rows
- Set selected row (e.g.: for keyboard navigation feature)
- Endless scroll
- Sticky header

## Getting started
`npm install react-custom-datatable --save`

### CSS
To use the default theme you have to import the .less in your main .less file

Or

Use the generated .css file

## Props
- `columns`: an array that contains the info needed by the component to build the table
- `items`: array of items used to fill the table
- `endlineRenders`: an array of renders to be printed at the end of the row
- `rowActive`: set the row active (index)
- `initialSortProp`: property to initially sort items 
- `pageStart`: value of items rendered on each scroll that reaches bottom 
- `useWindow`: used when using endless scroll, to tell if the scroll is relative to window (default: `true`)
- `stickyProps`: receives an object containing props to the StickyHeader
- `disableSticky`: disable Sticky header (default: `false`)
- `useShowHideColumns`: enable show/hide columns (defaul: `false`)
- `searchProps`: properties to be used by the search (setting it enables the search box)
- `renderRowExpand`: it enables to click in a row and show the provided render
- `onClickRow`: method to be called when user clicks on a row (if `renderRowExpand` is not defined)
- `enableCheck`: enable select rows
- `onSelectedItemsChange`: callback when user selects a row
- `hiddenRow`: a method to return a boolean indicating if a row needs to be hidden

## Examples

### Basic Example
This is the basic usage of `react-custom-datatable`

```javascript

export default class Products extends Component {

  constructor() {
    super();

    this.state = {
      products: [
      {
        reference: '3144141',
        name: 'ball'
      },
      {
        reference: '3144123',
        name: 'watch'
      },
      ],
      columns: [
        {
          name: 'REF.',
          property: 'reference',
          style: {
            width: '50%'
          }
        },
        {
          name: 'PRODUCT',
          property: 'name',
          style: {
            width: '50%'
          }
        }
      ]
    }
  }

render () {
 return (
  <ReactRooveTable
    id="table-products"
    ref="table-products"
    columns={this.state.columns}
    items={this.state.products}
    pageStart={30}
    useWindow={true}
  />
 ); 
}
}
```

### Render items, headers and endlineRenders

You can render custom headers and items by following:

```javascript

export default class Products extends Component {

  constructor() {
    super();

    this.state = {
      products: [
      {
        reference: '3144141',
        name: 'ball'
      },
      {
        reference: '3144123',
        name: 'watch'
      },
      ],
      columns: [
        {
          name: 'REF.',
          property: 'reference',
          style: {
            width: '50%'
          },
          renderItem: (item, index) => {
          
            let row = group[item.reference] || {};

            return (
              <div>
                <Image url={ImageUtil.formatUrl(item.name)} classes={'product-img'} />
                {item.reference}
            </div>
            );
          }
        },
        {
          name: 'PRODUCT',
          property: 'name',
          style: {
            width: '50%'
          },
          renderHeader:(column, index) => {
            return (
              <div style={{display: 'inline-block'}}>
                PRODUCT - FROM
                STORE {StoreUtil.getStoreNameFromCode(column.store)}
              </div>
            );
          },
        }
      ],
      endlineRenders: [
        {
          render: (item, index) => {
            let store = this.state.distribution.calculo[index];
            return (
              store.movimenta_estoque ? null :
                <div
                  key={index}
                  className="check-badge"
                  data-toggle="popover" data-placement="top" data-trigger="hover" title=""
                  data-original-title="Sem pedido de movimentação"
                  style={{background: 'transparent', fontSize: 16}}>
                  <i className="mdi mdi-alert-triangle c-orange"></i>
                </div>
            );
          },
        },
      ],
    }
  }

render () {
 return (
  <ReactRooveTable
    id="table-products"
    ref="table-products"
    columns={this.state.columns}
    items={this.state.products}
    pageStart={30}
    endlineRenders={this.state.endlineRenders}
    useWindow={true}
  />
 ); 
}
}
```

### Using props
Here you can get an example of some props used by `react-custom-datatable`

```javascript
render () {
 return (
  <ReactRooveTable
    id="table-products"
    ref="table-products"
    columns={this.state.columns}
    items={this.state.products}
    pageStart={30}
    endlineRenders={this.state.endlineRenders}
    useWindow={true}
    rowActive={2}
    initialSortProp={'source_store'}
    useShowHideColumns={true}
    searchProps={['name', 'reference']}
    enableCheck={true}
    disableSticky={true}
  />
 ); 
}
```

### Expanding a row
You can define a render that will be printed below a row when user clicks on it by doing the following:

```javascript
renderExpand() {
    return (
      <div> Some text </div>
    )
  }

render () {
 return (
  <ReactRooveTable
    id="table-products"
    ref="table-products"
    columns={this.state.columns}
    items={this.state.products}
    pageStart={30}
    useWindow={true}
    renderRowExpand={this.renderRowExpand.bind(this)}
  />
 ); 
}
```

### Enabling row click

Define a method that will called when user clicks on a row

```javascript
openModal() {
    this.setState({showModal: true});
  }

render () {
 return (
  <ReactRooveTable
    id="table-products"
    ref="table-products"
    columns={this.state.columns}
    items={this.state.products}
    pageStart={30}
    useWindow={true}
    onClickRow={this.openModal.bind(this)}
  />
 ); 
}
```

### Selected items

When enabling check on items, you can get an array of the items selected:

```javascript
onSelectedProductsChange(items) {
    this.setState({selectedProducts: items});
}

render () {
 return (
  <ReactRooveTable
    id="table-products"
    ref="table-products"
    columns={this.state.columns}
    items={this.state.products}
    pageStart={30}
    useWindow={true}
    onSelectedItemsChange={this.onSelectedProductsChange.bind(this)}
  />
 ); 
}
```



