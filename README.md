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

Use the generated .css file.

### Example
``

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
