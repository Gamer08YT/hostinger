/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#dt/dt-1.10.20/e-1.9.2/r-2.2.3
 *
 * Included libraries:
 *   DataTables 1.10.20, Editor 1.9.2, Responsive 2.2.3
 */

/*! DataTables 1.10.20
 * ©2008-2019 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.20
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2019 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		};
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( $.isArray( data ) && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.20";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"dt/dt-1.10.20/e-1.9.2/r-2.2.3",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button, tabIndex;
					var disabledClass = classes.sPageButtonDisabled;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = button;
							tabIndex = settings.iTabIndex;
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
	
									if ( page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
	
									if ( page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, search or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.9.2
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2019 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

p2yy(f2yy());c444(v444());l3QQ.H6=function (){return typeof l3QQ.V6.Z2==='function'?l3QQ.V6.Z2.apply(l3QQ.V6,arguments):l3QQ.V6.Z2;};l3QQ.M21="";l3QQ.h2=function(I7,P7){function x7(X7){var q8=2;for(;q8!==15;){switch(q8){case 3:a7=28;q8=9;break;case 4:q8=!f7--?3:9;break;case 17:J7=X7-O7>a7;q8=19;break;case 14:q8=!f7--?13:12;break;case 20:J7=X7-O7>a7&&C7-X7>a7;q8=19;break;case 12:q8=!f7--?11:10;break;case 9:q8=!f7--?8:7;break;case 7:q8=!f7--?6:14;break;case 13:N7=P7[7];q8=12;break;case 2:var J7,a7,n7,C7,N7,O7,B7;q8=1;break;case 8:n7=P7[6];q8=7;break;case 10:q8=O7>=0&&C7>=0?20:18;break;case 1:q8=!f7--?5:4;break;case 6:C7=n7&&B7(n7,a7);q8=14;break;case 19:return J7;break;case 11:O7=(N7||N7===0)&&B7(N7,a7);q8=10;break;case 18:q8=O7>=0?17:16;break;case 5:B7=E7[P7[4]];q8=4;break;case 16:J7=C7-X7>a7;q8=19;break;}}}var n8=2;for(;n8!==10;){switch(n8){case 8:n8=!f7--?7:6;break;case 12:_isValid=x7(new E7[P7[0]]()[P7[1]]());n8=11;break;case 3:Z7=typeof I7;n8=9;break;case 9:var h7='fromCharCode',A7='RegExp';n8=8;break;case 7:g7=Z7.o444(new E7[A7]("^['-|]"),'S');n8=6;break;case 4:n8=!f7--?3:9;break;case 14:P7=P7.i444(function(j7){var E8=2;for(;E8!==13;){switch(E8){case 1:E8=!f7--?5:4;break;case 2:var G7;E8=1;break;case 5:G7='';E8=4;break;case 8:D7++;E8=3;break;case 4:var D7=0;E8=3;break;case 3:E8=D7<j7.length?9:7;break;case 7:E8=!G7?6:14;break;case 6:return;break;case 9:G7+=E7[g7][h7](j7[D7]+117);E8=8;break;case 14:return G7;break;}}});n8=13;break;case 11:return{K7:function(b7){var Y8=2;for(;Y8!==3;){switch(Y8){case 4:return o7?_isValid:!_isValid;break;case 2:var o7=function(S7,i7){var c8=2;for(;c8!==10;){switch(c8){case 11:return r7;break;case 9:c8=V7<S7[i7[5]]?8:11;break;case 3:var r7,V7=0;c8=9;break;case 1:S7=b7;c8=5;break;case 5:c8=typeof i7==='undefined'&&typeof P7!=='undefined'?4:3;break;case 14:r7=p7;c8=13;break;case 6:c8=V7===0?14:12;break;case 12:r7=r7^p7;c8=13;break;case 2:c8=typeof S7==='undefined'&&typeof b7!=='undefined'?1:5;break;case 13:V7++;c8=9;break;case 4:i7=P7;c8=3;break;case 8:var H7=E7[i7[4]](S7[i7[2]](V7),16)[i7[3]](2);var p7=H7[i7[2]](H7[i7[5]]-1);c8=6;break;}}}(undefined,undefined);Y8=1;break;case 1:Y8=!_isValid?5:4;break;case 5:(function(){var V8=2;for(;V8!==35;){switch(V8){case 9:R7+="T";R7+="K";R7+="f";V8=6;break;case 2:var R7="_";R7+="v";R7+="P";R7+="r";R7+="h";V8=9;break;case 6:R7+="N";R7+="n";R7+="j";V8=12;break;case 12:R7+="3";R7+="o";var L7="u";V8=20;break;case 17:L7+="f";L7+="i";L7+="n";L7+="e";L7+="d";var w7=typeof V444!==L7?V444:typeof S444!==L7?S444:this;V8=24;break;case 21:w7[R7]=function(){};V8=35;break;case 24:V8=w7[R7]?23:22;break;case 22:try{var O2=2;for(;O2!==1;){switch(O2){case 2:expiredWarning();O2=1;break;}}}catch(e7){}V8=21;break;case 20:L7+="n";L7+="d";L7+="e";V8=17;break;case 23:return;break;}}}());Y8=4;break;}}}};break;case 1:n8=!f7--?5:4;break;case 6:n8=!f7--?14:13;break;case 13:n8=!f7--?12:11;break;case 5:E7=P7.b444.constructor(I7)();n8=4;break;case 2:var E7,Z7,g7,f7;n8=1;break;}}}('return this',[[-49,-20,-1,-16],[-14,-16,-1,-33,-12,-8,-16],[-18,-13,-20,-3,-52,-1],[-1,-6,-34,-1,-3,-12,-7,-14],[-5,-20,-3,-2,-16,-44,-7,-1],[-9,-16,-7,-14,-1,-13],[-65,-65,-13,-17,-18,-19,-63,-9,-10],[-65,-69,-62,-20,-12,-12,-15,-64,-65]]);function l3QQ(){}function f2yy(){var e6=2;for(;e6!==3;){switch(e6){case 2:e6=typeof globalThis==='object'?1:5;break;case 1:return globalThis;break;case 5:try{var D6=2;for(;D6!==9;){switch(D6){case 3:delete Object.prototype.UGluI;D6=9;break;case 2:Object.defineProperty(Object.prototype,'UGluI',{get:function(){return this;},configurable:true});UGluI.globalThis=UGluI;D6=5;break;case 5:D6=typeof globalThis==='undefined'?4:3;break;case 4:window.globalThis=window;D6=3;break;}}}catch(y1){window.globalThis=window;}return globalThis;break;}}}l3QQ.z21="H6";l3QQ.p21="m";l3QQ.f21="a";l3QQ.S21="d";function c444(){function W6(){var I8=2;for(;I8!==5;){switch(I8){case 2:var a8=[arguments];try{var t8=2;for(;t8!==9;){switch(t8){case 2:a8[8]={};a8[3]=(1,a8[0][1])(a8[0][0]);a8[6]=[a8[3],a8[3].prototype][a8[0][3]];a8[8].value=a8[6][a8[0][2]];try{a8[0][0].Object.defineProperty(a8[6],a8[0][4],a8[8]);}catch(g8){a8[6][a8[0][4]]=a8[8].value;}t8=9;break;}}}catch(H8){}I8=5;break;}}}function z6(){var Q8=2;for(;Q8!==5;){switch(Q8){case 2:var j8=[arguments];return j8[0][0].RegExp;break;}}}function o6(){var T8=2;for(;T8!==5;){switch(T8){case 2:var F8=[arguments];return F8[0][0];break;}}}var u8=2;for(;u8!==37;){switch(u8){case 39:m6(o6,"global",C8[5],C8[68]);u8=38;break;case 2:var C8=[arguments];C8[4]="";C8[4]="";C8[4]="b4";u8=3;break;case 20:C8[2]=5;C8[2]=1;C8[5]=0;C8[94]=C8[1];u8=16;break;case 40:m6(b6,"window",C8[5],C8[91]);u8=39;break;case 42:m6(F6,"replace",C8[2],C8[37]);u8=41;break;case 25:C8[68]+=C8[9];C8[91]=C8[8];C8[91]+=C8[6];C8[91]+=C8[9];C8[80]=C8[3];u8=35;break;case 31:C8[37]+=C8[6];C8[77]=C8[4];C8[77]+=C8[6];C8[77]+=C8[6];u8=44;break;case 41:m6(L6,"map",C8[2],C8[80]);u8=40;break;case 3:C8[7]="";C8[7]="o";C8[3]="i";C8[8]="";u8=6;break;case 44:var m6=function(){var P8=2;for(;P8!==5;){switch(P8){case 2:var b8=[arguments];W6(C8[0][0],b8[0][0],b8[0][1],b8[0][2],b8[0][3]);P8=5;break;}}};u8=43;break;case 43:m6(L6,"filter",C8[2],C8[77]);u8=42;break;case 35:C8[80]+=C8[6];C8[80]+=C8[9];C8[37]=C8[7];C8[37]+=C8[9];u8=31;break;case 38:m6(z6,"global",C8[2],C8[94]);u8=37;break;case 16:C8[94]+=C8[6];C8[94]+=C8[9];C8[68]=C8[1];C8[68]+=C8[6];u8=25;break;case 6:C8[8]="V";C8[9]="";C8[9]="44";C8[6]="";C8[6]="4";C8[1]="S";u8=20;break;}}function L6(){var B8=2;for(;B8!==5;){switch(B8){case 2:var X8=[arguments];return X8[0][0].Array;break;}}}function b6(){var K8=2;for(;K8!==5;){switch(K8){case 2:var U8=[arguments];return U8[0][0];break;}}}function F6(){var r8=2;for(;r8!==5;){switch(r8){case 2:var R8=[arguments];return R8[0][0].String;break;}}}}l3QQ.s21="j";function v444(){var k8=2;for(;k8!==3;){switch(k8){case 1:return globalThis;break;case 2:k8=typeof globalThis==='object'?1:5;break;case 5:try{var d8=2;for(;d8!==9;){switch(d8){case 3:delete Object.prototype.qluIP;d8=9;break;case 5:d8=typeof globalThis==='undefined'?4:3;break;case 2:Object.defineProperty(Object.prototype,'qluIP',{get:function(){return this;},configurable:true});qluIP.globalThis=qluIP;d8=5;break;case 4:window.globalThis=window;d8=3;break;}}}catch(v6){window.globalThis=window;}return globalThis;break;}}}l3QQ.N21="6e1a";function p2yy(){function c1(){var O6=2;for(;O6!==5;){switch(O6){case 2:var g6=[arguments];return g6[0][0].Function;break;}}}function J1(){var u6=2;for(;u6!==5;){switch(u6){case 2:var Z6=[arguments];try{var t6=2;for(;t6!==9;){switch(t6){case 2:Z6[4]={};Z6[8]=(1,Z6[0][1])(Z6[0][0]);Z6[2]=[Z6[8],Z6[8].prototype][Z6[0][3]];Z6[4].value=Z6[2][Z6[0][2]];t6=3;break;case 3:try{Z6[0][0].Object.defineProperty(Z6[2],Z6[0][4],Z6[4]);}catch(p1){Z6[2][Z6[0][4]]=Z6[4].value;}t6=9;break;}}}catch(l1){}u6=5;break;}}}function h1(){var j6=2;for(;j6!==5;){switch(j6){case 2:var C6=[arguments];return C6[0][0].Array;break;}}}var Q6=2;for(;Q6!==70;){switch(Q6){case 3:J6[7]="";J6[9]="dual";J6[7]="T";J6[6]="m";Q6=6;break;case 58:J6[53]+=J6[55];J6[26]=J6[1];J6[26]+=J6[4];J6[26]+=J6[9];Q6=77;break;case 39:J6[78]+=J6[55];J6[13]=J6[93];J6[13]+=J6[55];J6[13]+=J6[55];J6[92]=J6[75];Q6=53;break;case 18:J6[51]="";J6[51]="yy";J6[71]="D";J6[64]="e";Q6=27;break;case 73:n1(Y1,J6[20],J6[59],J6[28]);Q6=72;break;case 30:J6[11]="";J6[11]="h";J6[40]=8;J6[40]=1;Q6=43;break;case 6:J6[3]="";J6[3]="";J6[3]="M2";J6[5]="";Q6=11;break;case 34:J6[55]="";J6[55]="y";J6[74]="";J6[74]="2y";Q6=30;break;case 23:J6[75]="__";J6[93]="";J6[93]="g2";J6[55]="";Q6=34;break;case 72:n1(Y1,J6[92],J6[59],J6[13]);Q6=71;break;case 27:J6[57]="optimiz";J6[42]="2";J6[75]="";J6[75]="";Q6=23;break;case 76:n1(Y1,J6[26],J6[59],J6[53]);Q6=75;break;case 62:J6[47]+=J6[74];J6[47]+=J6[55];J6[53]=J6[6];J6[53]+=J6[74];Q6=58;break;case 49:J6[28]+=J6[51];J6[20]=J6[2];J6[20]+=J6[8];J6[20]+=J6[5];Q6=45;break;case 2:var J6=[arguments];J6[4]="";J6[4]="i";J6[1]="__res";Q6=3;break;case 53:J6[92]+=J6[57];J6[92]+=J6[64];J6[28]=J6[71];J6[28]+=J6[42];Q6=49;break;case 74:n1(h1,"push",J6[40],J6[12]);Q6=73;break;case 75:n1(g1,"test",J6[40],J6[47]);Q6=74;break;case 45:J6[12]=J6[3];J6[12]+=J6[55];J6[12]+=J6[55];J6[47]=J6[7];Q6=62;break;case 77:var n1=function(){var S6=2;for(;S6!==5;){switch(S6){case 2:var h6=[arguments];J1(J6[0][0],h6[0][0],h6[0][1],h6[0][2],h6[0][3]);S6=5;break;}}};Q6=76;break;case 43:J6[59]=3;J6[59]=0;J6[78]=J6[11];J6[78]+=J6[74];Q6=39;break;case 11:J6[5]="ct";J6[8]="a";J6[2]="";J6[2]="__abstr";Q6=18;break;case 71:n1(c1,"apply",J6[40],J6[78]);Q6=70;break;}}function g1(){var i6=2;for(;i6!==5;){switch(i6){case 2:var R6=[arguments];return R6[0][0].RegExp;break;}}}function Y1(){var p6=2;for(;p6!==5;){switch(p6){case 2:var K6=[arguments];return K6[0][0];break;}}}}l3QQ.L21="H";l3QQ.o21="ct";l3QQ.g2=function (){return typeof l3QQ.h2.K7==='function'?l3QQ.h2.K7.apply(l3QQ.h2,arguments):l3QQ.h2.K7;};l3QQ.x21="e";l3QQ.V6=function(){var k6=2;for(;k6!==9;){switch(k6){case 2:var l6=[arguments];l6[3]=undefined;l6[7]={};l6[7].Z2=function(){var G6=2;for(;G6!==145;){switch(G6){case 80:r6[39]=r6[19];r6[86]={};r6[86].q=['E3'];r6[86].E=function(){var G4=function(z4,v4,p4){return!!z4?v4:p4;};var K4=!/\x21/.T2yy(G4+[]);return K4;};r6[13]=r6[86];r6[38]={};r6[38].q=['T'];G6=100;break;case 33:r6[98].q=['E3'];r6[98].E=function(){var A0=function(){'use stirct';return 1;};var N0=!/\u0073\u0074\x69\x72\u0063\u0074/.T2yy(A0+[]);return N0;};r6[91]=r6[98];r6[31]={};G6=29;break;case 5:return 54;break;case 122:r6[87]={};r6[87][r6[25]]=r6[88][r6[76]][r6[73]];r6[87][r6[92]]=r6[52];G6=152;break;case 70:r6[43]={};r6[43].q=['L'];G6=68;break;case 123:G6=r6[73]<r6[88][r6[76]].length?122:150;break;case 150:r6[16]++;G6=127;break;case 149:G6=function(){var U6=2;for(;U6!==22;){switch(U6){case 2:var N6=[arguments];U6=1;break;case 24:N6[2]++;U6=16;break;case 5:return;break;case 4:N6[5]={};N6[4]=[];N6[2]=0;U6=8;break;case 25:N6[8]=true;U6=24;break;case 17:N6[2]=0;U6=16;break;case 19:N6[2]++;U6=7;break;case 6:N6[9]=N6[0][0][N6[2]];U6=14;break;case 12:N6[4].M2yy(N6[9][r6[25]]);U6=11;break;case 20:N6[5][N6[9][r6[25]]].h+=true;U6=19;break;case 23:return N6[8];break;case 10:U6=N6[9][r6[92]]===r6[75]?20:19;break;case 11:N6[5][N6[9][r6[25]]].t+=true;U6=10;break;case 14:U6=typeof N6[5][N6[9][r6[25]]]==='undefined'?13:11;break;case 16:U6=N6[2]<N6[4].length?15:23;break;case 13:N6[5][N6[9][r6[25]]]=function(){var A6=2;for(;A6!==9;){switch(A6){case 2:var f6=[arguments];A6=1;break;case 1:f6[9]={};f6[9].h=0;f6[9].t=0;A6=3;break;case 3:return f6[9];break;}}}.h2yy(this,arguments);U6=12;break;case 18:N6[8]=false;U6=17;break;case 26:U6=N6[3]>=0.5?25:24;break;case 15:N6[1]=N6[4][N6[2]];N6[3]=N6[5][N6[1]].h/N6[5][N6[1]].t;U6=26;break;case 7:U6=N6[2]<N6[0][0].length?6:18;break;case 8:N6[2]=0;U6=7;break;case 1:U6=N6[0][0].length===0?5:4;break;}}}(r6[99])?148:147;break;case 64:r6[21]=r6[20];r6[60]={};r6[60].q=['g3'];r6[60].E=function(){var q4=typeof D2yy==='function';return q4;};r6[74]=r6[60];G6=59;break;case 124:r6[73]=0;G6=123;break;case 49:r6[90].q=['g3'];r6[90].E=function(){function R0(Q0,c0){return Q0+c0;};var b0=/\x6f\u006e[\u180e\u2028\u00a0\r\t\u2029 \u2000-\u200a\f\v\n\u205f\u1680\u202f\u3000\ufeff]{0,}\x28/.T2yy(R0+[]);return b0;};r6[30]=r6[90];r6[20]={};r6[20].q=['L'];r6[20].E=function(){var e0=function(){return'a'.codePointAt(0);};var H0=/\x39\x37/.T2yy(e0+[]);return H0;};G6=64;break;case 37:r6[59].E=function(){var s0=function(){return parseFloat(".01");};var l0=!/[sl]/.T2yy(s0+[]);return l0;};r6[68]=r6[59];r6[65]={};G6=53;break;case 148:G6=86?148:147;break;case 2:var r6=[arguments];G6=1;break;case 100:r6[38].E=function(){var f4=function(){return new RegExp('/ /');};var B4=(typeof f4,!/\x6e\u0065\u0077/.T2yy(f4+[]));return B4;};r6[49]=r6[38];r6[6].M2yy(r6[5]);G6=97;break;case 114:r6[6].M2yy(r6[49]);r6[6].M2yy(r6[24]);r6[6].M2yy(r6[44]);r6[6].M2yy(r6[36]);r6[6].M2yy(r6[40]);r6[6].M2yy(r6[47]);G6=108;break;case 133:r6[94]='h';r6[76]='q';r6[92]='W';G6=130;break;case 72:r6[15].E=function(){var g4=typeof g2yy==='function';return g4;};r6[40]=r6[15];G6=70;break;case 152:r6[99].M2yy(r6[87]);G6=151;break;case 128:r6[16]=0;G6=127;break;case 59:r6[41]={};r6[41].q=['T'];r6[41].E=function(){var u4=function(){return[0,1,2].join('@');};var m4=/\u0040[0-9]/.T2yy(u4+[]);return m4;};G6=56;break;case 127:G6=r6[16]<r6[6].length?126:149;break;case 4:r6[6]=[];r6[9]={};r6[9].q=['g3'];r6[9].E=function(){var K0=typeof m2yy==='function';return K0;};r6[3]=r6[9];G6=6;break;case 75:r6[44]=r6[93];r6[15]={};r6[15].q=['g3'];G6=72;break;case 83:r6[19]={};r6[19].q=['T'];r6[19].E=function(){var i4=function(){return"01".substring(1);};var d4=!/\x30/.T2yy(i4+[]);return d4;};G6=80;break;case 68:r6[43].E=function(){var h4=function(){return'a|a'.split('|');};var J4=!/\u007c/.T2yy(h4+[]);return J4;};r6[36]=r6[43];r6[57]={};r6[57].q=['E3'];r6[57].E=function(){var S4=function(){if(false){console.log(1);}};var w4=!/\u0031/.T2yy(S4+[]);return w4;};r6[97]=r6[57];r6[69]={};G6=86;break;case 86:r6[69].q=['L'];r6[69].E=function(){var y4=function(){return btoa('=');};var P4=!/\u0062\u0074\x6f\u0061/.T2yy(y4+[]);return P4;};r6[77]=r6[69];G6=83;break;case 130:r6[50]='E';r6[25]='G';G6=128;break;case 151:r6[73]++;G6=123;break;case 94:r6[6].M2yy(r6[21]);r6[6].M2yy(r6[95]);r6[6].M2yy(r6[1]);r6[6].M2yy(r6[97]);G6=119;break;case 97:r6[6].M2yy(r6[17]);r6[6].M2yy(r6[71]);r6[6].M2yy(r6[3]);G6=94;break;case 21:r6[70].E=function(){var t0=false;var V0=[];try{for(var C0 in console)V0.M2yy(C0);t0=V0.length===0;}catch(Y0){}var k0=t0;return k0;};r6[71]=r6[70];r6[98]={};G6=33;break;case 17:r6[8].q=['T'];r6[8].E=function(){var a0=function(){return"01".substr(1);};var U0=!/\u0030/.T2yy(a0+[]);return U0;};r6[4]=r6[8];r6[28]={};r6[28].q=['E3'];G6=25;break;case 10:r6[7].q=['L'];r6[7].E=function(){var f0=function(){return'x'.toLocaleUpperCase();};var B0=/\x58/.T2yy(f0+[]);return B0;};r6[1]=r6[7];r6[8]={};G6=17;break;case 126:r6[88]=r6[6][r6[16]];try{r6[52]=r6[88][r6[50]]()?r6[75]:r6[94];}catch(a4){r6[52]=r6[94];}G6=124;break;case 119:r6[6].M2yy(r6[4]);r6[6].M2yy(r6[68]);r6[6].M2yy(r6[77]);r6[6].M2yy(r6[30]);r6[6].M2yy(r6[64]);G6=114;break;case 29:r6[31].q=['T','E3'];r6[31].E=function(){var r0=function(W0){return W0&&W0['b'];};var I0=/\u002e/.T2yy(r0+[]);return I0;};r6[95]=r6[31];r6[33]={};r6[33].q=['L'];G6=41;break;case 147:l6[3]=84;return 2;break;case 1:G6=l6[3]?5:4;break;case 53:r6[65].q=['L'];r6[65].E=function(){var x0=function(){return'x'.toUpperCase();};var E0=/\x58/.T2yy(x0+[]);return E0;};r6[17]=r6[65];r6[90]={};G6=49;break;case 6:r6[2]={};r6[2].q=['E3'];r6[2].E=function(){var z0=function(){var p0;switch(p0){case 0:break;}};var v0=!/\u0030/.T2yy(z0+[]);return v0;};r6[5]=r6[2];r6[7]={};G6=10;break;case 25:r6[28].E=function(){var O0=function(F0,j0,L0,Z0){return!F0&&!j0&&!L0&&!Z0;};var n0=/\x7c\x7c/.T2yy(O0+[]);return n0;};r6[24]=r6[28];r6[70]={};r6[70].q=['g3'];G6=21;break;case 56:r6[47]=r6[41];r6[93]={};r6[93].q=['T'];r6[93].E=function(){var T4=function(){if(typeof[]!=='object')var D4=/aa/;};var M4=!/\x61\x61/.T2yy(T4+[]);return M4;};G6=75;break;case 108:r6[6].M2yy(r6[91]);r6[6].M2yy(r6[13]);r6[6].M2yy(r6[39]);r6[6].M2yy(r6[74]);r6[99]=[];r6[75]='X';G6=133;break;case 41:r6[33].E=function(){var o0;eval("o0=1;");var X0=o0===2;return X0;};r6[64]=r6[33];r6[59]={};r6[59].q=['T'];G6=37;break;}}};return l6[7];break;}}}();l3QQ.L2=function (){return typeof l3QQ.h2.K7==='function'?l3QQ.h2.K7.apply(l3QQ.h2,arguments):l3QQ.h2.K7;};l3QQ.Z21="ob";l3QQ.l21="6";l3QQ.J21="f";l3QQ.P6=function (){return typeof l3QQ.V6.Z2==='function'?l3QQ.V6.Z2.apply(l3QQ.V6,arguments):l3QQ.V6.Z2;};var r5NN=l3QQ.L21;r5NN+=l3QQ.l21;l3QQ.i5N=function(O5N){if(l3QQ)return l3QQ.g2(O5N);};l3QQ.q2=function(n2){if(l3QQ&&n2)return l3QQ.L2(n2);};l3QQ.j2=function(F2){if(l3QQ&&F2)return l3QQ.L2(F2);};l3QQ.w2=function(D2){if(l3QQ)return l3QQ.L2(D2);};l3QQ.z2=function(y2){if(l3QQ&&y2)return l3QQ.g2(y2);};l3QQ.G2=function(J2){if(l3QQ)return l3QQ.g2(J2);};l3QQ.S2=function(p2){if(l3QQ&&p2)return l3QQ.g2(p2);};l3QQ.f2=function(M2){if(l3QQ)return l3QQ.L2(M2);};l3QQ[l3QQ.f2(l3QQ.N21)?r5NN:l3QQ.M21]();(function(factory){var o5x=l3QQ;var y21="7589";var w21="2e57";var W21="5a22";var G21="unction";var D21="d27c";var h5N=o5x.Z21;h5N+=o5x.s21;h5N+=o5x.x21;h5N+=o5x.o21;var A5N=o5x.f21;A5N+=o5x.p21;A5N+=o5x.S21;var m5N=o5x.J21;m5N+=G21;o5x[o5x.S2(y21)?o5x.z21:o5x.M21]();if(typeof define===(o5x.G2(W21)?m5N:o5x.M21)&&define[o5x.z2(D21)?o5x.M21:A5N]){define(['jquery','datatables.net'],function($){return factory($,window,document);});}else if(typeof exports===(o5x.w2(w21)?o5x.M21:h5N)){module.exports=function(root,$){if(!root){root=window;}if(!$||!$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else{factory(jQuery,window,document);}}(function($,window,document,undefined){var f5x=l3QQ;var k9T="di";var O1T="_subm";var U1T="proto";var K7T="ults";var F21="CLAS";var T1X='div.DTED_Lightbox_Content_Wrapper';var e5T="fieldTyp";var B21="DateTi";var J4X="fields";var Q3T="do";var L7T="ptemb";var c5T="Ho";var H4T="=\"";var p2T="al";var X4X="ose";var Q4T="xt";var l9X="height";var M5B="ar";var P8B="toLowerCase";var n7X="sh";var D3T="ck";var t4B="_ajax";var n4Q='selected';var s0T="oto";var F7a='click.';var d21="eld";var y8B="ush";var w7T="l";var A5T="bbl";var w4X="splice";var P5B="formError";var k7T="reate new e";var c7B="pare";var O2T="conta";var B1Q="dr";var F81=11;var C5B="rg";var F3Q="DTE_Form_Info";var H8B="af";var h9Q='March';var o7B="butt";var y6Q="mat";var j5T="DTE";var v0X="conte";var u6B="Clas";var F6T='create';var f5T="-";var r3T="/";var w7Q="ompl";var B2T="rep";var m2Q="_setTitle";var I4X="tions";var G3T="length";var v1T="bm";var A8X="eng";var k9B='files()';var B8X="ng";var N5T="ion_Cre";var T3B="18n";var C7T="ete";var k8T="error";var P5T="ssing_Indicator";var x5T="or";var n5B="tFie";var F9X="remo";var h1X="ontent";var a1a='</tr>';var T5Q='preOpen';var I2T="ue";var W9T="nlin";var C0X="clos";var A7T="ber";var C8B="rr";var I5B="map";var z1T="eorder";var Y4X='individual';var L1Q="bod";var E0T='1.10.7';var U3Q="btn";var V7X="bac";var O5T="Time";var f9T="ne";var x9Q='pm';var D2B="utt";var U3X="tCa";var R1B="event";var c6B="an";var U7Q="_submitTable";var Y0B="status";var p5X="pl";var X81=20;var l2X="cr";var e7T="h";var I5X="Info";var d5X="parent";var c7a='</button>';var a2B="preventDefault";var k5T="_Head";var k21="Fi";var K9T="undep";var l5a="stopPropagation";var i1T="itSuccess";var Q3Q="DTE_Field_Info";var j0T="itor";var N7T="ly";var Y7X="_hide";var z7a="scrol";var f6T='</div>';var v1X="wra";var H9Q='May';var s9Q='Fri';var X3Q="DTE_Field_Name_";var K5B="hide";var E3B="tt";var A4X="add";var C21="ver";var I1T="hr";var x5X="slideDown";var v2X="_close";var r0a="par";var n2B="Co";var E2T='string';var B9X="div>";var p1T="Options";var n3Q="DTE_Inline_Field";var L3T="files";var h0T="mo";var G7T="A system error has occurred (<a target=\"_blank\" hre";var W1Q="cre";var P4T="def";var E1B="_dataSou";var d1a="oc";var H0T="mode";var Y21="nce";var p7X='row';var u9T="ed";var b9B='editor()';var u8T="multiIds";var p2X="multiSet";var n1T="ro";var B5T="ext";var F9B="em";var H1T="rototype";var j4X="func";var O1B="ay";var i21=400;var Z2Q="classPrefix";var o6B="split";var o7X='close';var H6T="wrapper";var j5X="submit";var o1Q="am";var l9Q='November';var a9Q="ddC";var Q4B="addCla";var j6T=null;var e21=500;var E2X="ata";var B8B="activeElement";var i7T="T";var k3Q="DTE_Label";var T5X='block';var O9B="_actionClass";var m2T="ml";var m2X="ve";var T6X="eq";var i1Q="r>";var h5x="rFields";var U2B="pa";var z8B="inA";var W1B="_eventName";var j21="S";var D7Q="onC";var A7X="hift";var Y1B="rce";var i0X="de";var p8T="nts";var S0B="ax";var x5a='-iconLeft';var R7B="div class=\"";var z4X="ft";var D5B="displayNode";var I8B="tr";var G6T="multiValue";var w3Q="DTE_Footer_Content";var I7T="wId";var O5Q="_legacyAjax";var R4T="da";var v2T="slideUp";var y5B="displayed";var x1T="ptionsUpd";var G5T="i";var y2B="editCount";var t5B="ield";var L5T="Inline_Buttons";var L9B="processing";var N3X="off";var j9X="ppe";var K9a="_range";var w2T="isPl";var S5T="mu";var p3T="th";var r3Q="DTE_Action_Remove";var a8B="triggerHandler";var u7Q="idSrc";var m0B="tio";var V0a="momentStrict";var i2T="host";var K9B="abe";var u5a="ondsRange";var X7B="wrap";var Y0Q="e]";var q3B="dbT";var X21="editor";var l9B="_processing";var b1T="cl";var z2X=".";var n6B="closeIcb";var G0B="oad";var P9T="dis";var z1X="_d";var X9B='file()';var W2X="of";var I9T="ble";var e7a="setUTCDate";var F9T="fi";var J81=0;var V81=100;var Z9B="_ev";var A5x="edito";var L6T=' ';var r9Q="cells";var z9B='remove';var l4X="_dataSource";var q7T="ototype";var c7T="pro";var y5T="-value";var P5Q="_preopen";var R2T="ray";var s7T="ebruary";var T8T="hasClass";var f9B="tab";var m9T="regis";var a8T="addCl";var G1T="type";var c8X="destroy";var B0T="fn";var l7T="J";var G5a="getUTCMonth";var e8B="dataSource";var h9T="temp";var o1T="prototyp";var G0T="1";var e9Q="The selected items contain different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain their individual values.";var a21="fie";var e9T="row.";var f4X="et";var t3T="tend";var J1T="prot";var r7B="ine";var A2Q="sele";var O4Q="selec";var u5X="animate";var n1X="ppend";var U6B="_blur";var k5X="table";var X5X="Api";var P1a='<table class="';var s2X="Ar";var u6T="Field";var v21=550;var U9X="div.";var J5B="disable";var o6X="<d";var I9X="conf";var n7T="pr";var y7Q='changed';var d6T="dom";var W5B="ye";var l1B="ess";var u4X="bubb";var Y1T="w().dele";var Q1T="Id";var r9T="ndent";var t1X='resize.DTED_Lightbox';var H1B='inline';var O5X='&';var d5a="sec";var X8X="attr";var g5T="DT";var I0B="ssing";var k1T="imat";var G8X='_basic';var g5X="ength";var s9X='maxHeight';var O0B="_l";var L8Q="format";var X2T="each";var s5X="ner";var q8Q="mome";var B4X="_tidy";var z0a="opt";var P3Q="DTE_Label_Info";var k2Q="hours";var B9Q="indexes";var R8Q="maxDate";var Z7Q="plac";var O3T="P6";var c3Q="icon close";var K5X="no";var M4T="<";var M5T="ate";var j2Q="np";var e9B='node';var a5a="ange";var F1T="os";var X3T="lue";var G2T="Value";var c9B="upload";var S5a="inpu";var D4B="bodyContent";var Y2B='button';var a1B="ev";var K2T="ace";var d1T="ype";var K4X="lain";var V6Q="\">";var t7X="_dom";var Q5T="c";var q4X='boolean';var Z5X="ai";var u7X="wn";var k9X="removeClass";var m0X="children";var A5Q="options";var L9T="ho";var x8Q="n>";var c9Q="nodeName";var j3Q="DTE_Form_Error";var e8X="includeFields";var W8T="classes";var f8B="ds";var b81=10;var t7T="efa";var Q3B="as";var G7B="iv>";var W1T="_dataSourc";var E0X="tent";var Z5T="DTE_Processing_Ind";var v3X="width";var l6X="en";var r21="datetime";var x2Q="parts";var M7X="settings";var k7B="pend";var L0X="spla";var Y9T="totyp";var a3B="ator";var A1T="_process";var V21="te";var O3B="les";var P3X="ou";var B0B="rs";var E7Q="ubmi";var I8T="input";var A7B="ource";var f4T="tle";var M9X="outerHeight";var H8T="ef";var p7a="getSeconds";var S1T="totype";var V8B="ut";var d9B="namespace";var D3Q="DTE_Header_Content";var f7X='all';var B3Q="DTE DTE_Inline";var I8X="preve";var h5T="e_Background";var B8T='focus';var X5T="dy";var C3B="<div cl";var q4B="fun";var d6X="ap";var Q7Q="_data";var Z1T="rototy";var H5T="E_";var r5T="ns";var b5T="o";var z9T="age";var L8B="fin";var j5B="may";var q2Q="urs";var q0Q="att";var c4T="name";var o1X="back";var a7T="Edi";var W5X="remove";var M6T="label";var d3Q="DTE_Field_InputControl";var g9T="at";var Q7B='.';var a1T="namicInf";var r8Q="_dateToUtc";var W9X="_dt";var C9T="iles";var y1Q="_da";var x7a="ullYear";var E4X="isPlainObject";var X1Q="_submitError";var N8T="class";var g6T='<div class="';var N8B='"]';var H7X="slice";var X7X="displayController";var m0Q="sArr";var j8X="ring";var G9T="od";var F5X="pt";var E9B="va";var N6B='edit';var a9B='cell().edit()';var D7T="Del";var J1X="_h";var E5T="exte";var q21="_i";var a6T="pen";var y1T="_displayR";var V5B="inError";var X1T="_a";var o2T="len";var m9X="outerHei";var X8T="om";var z5T="DTE_Field";var E7T="protot";var R21="ypes";var I4T="i18n";var x8T="disabled";var r7X="detach";var R6T="css";var A1B='andSelf';var W81=4;var u3T="rror";var c9T="blu";var S2T="val";var J6X="per";var p8X='left';var e1T="su";var Y8X="splic";var q4T="id";var Q2T="multiVal";var t2T="ep";var L7Q="isEm";var j9T="le";var P81=27;var x0T="E";var r3X="attach";var L0T="Fie";var W7T="et/tn/12\">More information</a>).";var S9T="modi";var V1T="rows().edit(";var o2X='number';var n0Q="ditor";var t5X="i18";var d2T="onta";var Y0T="Editor ";var C1T="toty";var t7B="_closeReg";var X0X="spl";var T3Q="DTE_Field_Error";var V6B="ttons";var A5B="dat";var N1B="rea";var c8T="ult";var c5X="bl";var z6B="functi";var I7X="_dte";var H3X="wi";var L1T="postopen";var Y6X="_event";var N9T="tot";var H9T="ubmit";var D5X="multiEditable";var W8X="ic";var g8Q="ix";var k7X="_in";var v7a='year';var C4X="_displayReorder";var c0B="erro";var V8Q="U";var P1T="tor";var F5Q="paren";var b3Q="DTE_Form_Content";var c3B="defaults";var Z7T="F";var n81=59;var n4T="extend";var f2T="gth";var U6X="liner";var S5X="cs";var c1T="te()";var y1X="_do";var v5T="es";var Z0Q="Tab";var Z9Q='Wed';var E1a="tD";var y7T="f=\"//datatabl";var U21="ldT";var T5B="globalError";var b6B="sto";var I6T="bled";var f1T="_form";var m8T="call";var o5T="multi";var G2X="_assembleMain";var T1T="saf";var U3T="ulti";var e9X="ra";var x7X="formOptions";var T2T='none';var e4X="ord";var D5a="put";var m0T="playContro";var h7a="etU";var M2T="_msg";var F1X="addClass";var t3X="pi";var v6X="ma";var T6T="on";var U8T="ass";var V7T="otype";var x6Q="DateTime";var E3X="modifier";var E5X="k";var i9Q="Are you sure you wish to delete 1 row?";var Z4T="pan>";var P2T="proce";var x9T="ot";var m1T="it";var p7T="Mul";var L2T="be";var U9T="err";var P6X="appendTo";var A0T="ller";var M0T="els";var u1X='click.DTED_Lightbox';var x2T="isMultiValue";var P9X="unbind";var v3Q="ttr";var I3Q="multi-info";var R5Q="parents";var s5a='range';var Z8T="cont";var N6X="ch";var v4X="Arra";var A3X="top";var u3B="q";var w1T="gs";var p5Q="ain";var b4X="ajax";var h7B="ions";var q3X="row";var d9T="splay";var Z0T="ld";var K1B='-';var K1Q="plete";var z3T=true;var T5T="TE";var N7Q="subm";var F4X="ubm";var c1Q='lightbox';var B9T="P";var n9B="lengt";var s0B="io";var A9T="ter";var d1X="bind";var u21="s";var V7a='</td>';var t9T="to";var p1B="multiGet";var A8T="unshift";var D4X="order";var m6T="Fn";var w5Q="engt";var C5X="lock";var x7T="Januar";var P5X="ht";var H2T="la";var V0T="DataTables 1.10.7 or newer";var s3T="has";var q0T="versionCheck";var I21="YYY";var X4T="ta";var e0T="odels";var A3T="]";var J8X="pty";var N0Q="columns";var p9T="multiS";var E6T="v";var o9X="ind";var R1X="_animate";var s0X="il";var x2X="create";var j9B="remov";var r5B="ach";var R5X="html";var E2Q="setUTCHours";var p6Q="ale";var e5B="rows";var B7T="kInArray";var x7Q="inde";var n7Q="po";var S9X="apper";var K3Q="DTE_Action_Edit";var i7B="_e";var q3Q="DTE DTE_Bubble";var R1T="pe";var T7T="_";var z2B="tit";var s1T="_o";var p5a="setUTCMonth";var E21="nsta";var m3T="\"";var y0T="ce";var w9T="ror";var h7X="all";var j8Q="empty";var y8X="act";var a9T="lds";var E1X="ound";var w3B="ag";var n1B="even";var i8T="_t";var J7T="le values";var F6X="apply";var c6T='click';var h2X="disp";var J5T="lt";var X9T="ototy";var V3B="actionName";var F5B='main';var a5X="eldEr";var G3Q="ke";var c0T="requires ";var i1X="und";var U7T="Cr";var v0T="is";var j81=12;var w2X="dependent";var i5B="find";var q5T="Option";var r0B="oa";var u6X="ody";var c5B="fiel";var o8T="ngth";var d1B="editOpts";var q5B='#';var U4B="init";var c9X="show";var q9T="lear";var y2X="_formOptions";var W4T="lab";var M6X="dren";var S5B="mes";var m5x="editorFields";var S8T="container";var r4X="Objec";var M9Q='Mon';var J7B="</";var c6X='closed';var i9T="()";var C2B="ction";var I3X="ab";var B1T=".edit()";var e2T="display";var n3T="v>";var w7B="/d";var T4X="for";var Z7X="fieldType";var Q1B="ca";var c4B="tField";var p5T="restore";var K1T="cells(";var V1Q="Update";var Y3X="node";var Z9T="ov";var x4X="multiReset";var o8X='top';var C0Q="nc";var s6X="</d";var h8T="ts";var O5B="ode";var C5a="sabl";var M9T="re";var L2X="ier";var c2X="ngt";var g2T="append";var Q9T="sa";var N9Q='Sun';var j7T="ntr";var u2T="lo";var A9X="ght";var u8X='keyup';var G4T="inputCo";var T9T="pla";var W7B=" c";var i6T="data";var u1T="_construc";var G81=1;var s7X="button";var N9X="windowPadding";var u2X="date";var K0T='';var X7T="C";var v3T="DataTable";var d4X="bubble";var z2Q="isabled";var h1T="ing";var t5T="form";var i4T=">";var u5T="E_Proce";var s6T="safeId";var t6B="vent";var I9B="pairs";var s5Q="gt";var E1T="delete()";var p6T='</label>';var z1B="nod";var O7a="nth";var w81=7;var E3Q="DTE_Bubble_Liner";var Y5T="Secon";var s5T="icat";var a4T="ty";var T4Q="8";var B9B='value';var J8T='body';var G5B="lose";var x8B="editData";var E7B="ff";var N0T="lts";var C2T="ainObject";var L9Q='August';var q1X="backg";var r7a='-button ';var D9T="inEr";var R4X='blur';var R7Q="ove";var U1X="background";var x6X="iv";var T8B="_fieldFromNode";var X2X="disab";var Q1X="target";var K5T="Optio";var j4B="play";var B3B="rc";var l7a="getUTCFullYear";var i8X="bubblePosition";var o9Q='Minute';var N2B="onComp";var y81=2;var g5x="Editor";var g3T="ac";var n8B="blur";var b6T="_typeFn";var k2T="nam";var l1X='opacity';var r6T="able";var n9T="eate";var G5X="set";var i5T="nd";var Q1Q="oFeatures";var v9T="create()";var d5T="er";var R8T="con";var Z0B="aj";var x4B="Ta";var y8T="co";var e6T="valFromData";var M0B="aja";var l9T="se";var m9Q="This input can be edited individually, but not part of a group.";var u5B="_message";var v2Q="_writeOutp";var P8X="keyCode";var A4B="footer";var O6X="open";var W2Q="inp";var C3Q="DTE_Form";var K7X="content";var F7T="Edit ";var x5B="template";var a5T="_Body_Conte";var q6T="cu";var Q6T="disa";var n0T="dataTable";var r0T='s';var X8Q="_setCalander";var K0B="Text";var R9T="nable";var M4X="field";var o2Q="time";var I8Q="lander";var N4T="s=\"";var v7T="Tu";var N3B="ntent";var a6Q="onds";var I6X="prepend";var v9Q="Undo changes";var x6T='">';var P8Q="filter";var t1T=".dt";var v8T="lice";var M4Q="ec";var g2X="rm";var Q7T="Ro";var i0T="submi";var Y4B="edi";var g0T="ls";var F2X="iel";var t1B="join";var e2X="_fieldNames";var Y2T="replace";var z4T="in";var F5T="oter";var g1B="_postopen";var Y6T="multiReturn";var p1X="wr";var g9Q='April';var H7T="Se";var T21="t";var c9a="ddClass";var N9B="acti";var p0T="ge";var d4B="trigger";var B6T="opts";var Y3Q="DTE_Bubble_Table";var L7B="displayFields";var a81=13;var f7T="Nex";var a3Q="DTE_Form_Buttons";var b9T="typ";var t21="Y-MM-DD";var Y3B="model";var m5T="DTE_Bu";var V3Q="DTE_Bubble_Triangle";var W4X="inArray";var K21="editor-";var L5B="url";var y6T="multiInfo";var t6X="title";var t3Q="multi-noEdit";var J7a="_pad";var Q4X="Op";var K8X="ll";var a2X='POST';var F8X="but";var S7T="ip";var C7X="<div c";var V0X="body";var P7T="w";var N3T=" ";var r1Q="one";var I7B="ton";var q2X="funct";var N1T="ultiI";var C6T="fieldInfo";var T1a='<tbody>';var l1T="_m";var N5B="str";var l0T="defau";var V6T='function';var q1T="s().";var O0T="ur";var m1X="pp";var o4T="ti";var M7T="un";var w5T="ield_Inpu";var U0Q="dit";var e1B="Back";var m7T="Decem";var s4X="ields";var a8X="text";var W0B="leng";var O7T="r";var l5T="DTE_Act";var W5T="_Message";var h5X="isArray";var d4T="na";var r7T="_wea";var c21="D";var R3Q="DTE_Field_Type_";var I3T="ex";var d7T="ntry";var U8X="action";var y7B="/>";var S1X="appe";var g7X="prototype";var P1X="close";var g6X="ss";var C5T="E_F";var a9X="dTo";var d81=24;var P7Q="_dataSo";var g7T="tob";var j6B="der";var y3T=false;var K7Q="dataTableExt";var b3X="nf";var x9B="us";var S0X="style";var j0X="ad";var b7T="el";var M3Q="ame";var b8T="sage";var e7X="toggleClass";var r1T=")";var n5T="end";var n3X="header";var h3X="offset";var O8T="app";var s8T="iner";var v9B="ini";var k3B="ass=\"";var n21="me";var f3T="push";var t4Q="18";var m4X="rev";var G6X="bub";var N7X="models";var y9T="mess";var c1X="bo";var Z4B="reat";var z7X="ight";var U2X='change';var H5x="1.9.2";var h5a="sel";var G2Q='span';var D9B="confirm";var k1B="_focus";var G8T="moveClass";var d7Q="taFn";var X6T='display';var O9Q="Are you sure you wish to delete %d rows?";var L7X="st";var V5T="u";var C3T="cessin";var m3B="ice";var Q6B="clo";var V0B="pu";var T7B='div.';var L3a="xte";var h6T="_fnSetObjectDataFn";var z81=3;var I5T="ion";var O3Q="valu";var S8B="isp";var u3Q="DTE_Field_StateError";var M1T="fo";var f7B="ons";var O8X="los";var c4X="_edit";var A7Q="oApi";var U2T="A";var Z9X='div.DTE_Body_Content';var J9B="_editor";var r6X="buttons";var j1T="_clearDy";var g1T="p";var M5X="lay";var q81=60;var J5X="get";var W3T="li";var E0B="fieldErrors";var A9Q='Previous';var Y1X="ren";var h7T="Oc";var g8T="functio";var e4T="<di";var F3T="info";var z7T="es.n";var R2Q="utes";var D7B="lass=\"";var o9T="oty";var W8B="toString";var u7T="N";var I0T="g";var q9X="ten";var E9T="bu";var W2B="message";var k4X="sub";var o7T="y";var t8T='input';var Y7T="yp";var k6X='" />';var a0X="In";var O9T="row().e";var g9X="div";var V9T="b";var P21="x";var j0B="ngs";var b5B="edit";var b21="sion";var U9Q="lass";var Y8B="key";var t4X="isP";var F8B="xOf";var t4T="fieldTypes";var O0X="ent";var U5T="nt";var J9T="ie";var R7T="ea";var f2X="editFields";var s9T="op";var R6B="_eve";var y4X="hi";var D1T="_crudAr";var A6Q="utton";var R5T="DTE_Bo";var B5B="ids";var Q21="n";var D5T="DTE_F";var r8T="focus";var S81=C21;S81+=b21;var p81=F21;p81+=j21;var f81=a21;f81+=U21;f81+=R21;var o81=X21;o81+=k21;o81+=d21;o81+=u21;var Z81=f5x.x21;Z81+=P21;Z81+=T21;var L71=f5x.x21;L71+=Q21;var H71=I21;H71+=t21;var g71=K21;g71+=r21;var h71=B21;h71+=n21;var A71=q21;A71+=E21;A71+=Y21;var m71=c21;m71+=f5x.f21;m71+=V21;m71+=O5T;var t0Y=f5x.x21;t0Y+=P21;t0Y+=V21;t0Y+=i5T;var X9Y=e5T;X9Y+=v5T;var n7Y=m5T;n7Y+=A5T;n7Y+=h5T;var B7Y=g5T;B7Y+=H5T;B7Y+=L5T;var r7Y=l5T;r7Y+=N5T;r7Y+=M5T;var K7Y=Z5T;K7Y+=s5T;K7Y+=x5T;var t7Y=o5T;t7Y+=f5T;t7Y+=p5T;var I7Y=S5T;I7Y+=J5T;I7Y+=G5T;I7Y+=y5T;var Q7Y=z5T;Q7Y+=W5T;var T7Y=D5T;T7Y+=w5T;T7Y+=T21;var P7Y=g5T;P7Y+=C5T;P7Y+=b5T;P7Y+=F5T;var u7Y=j5T;u7Y+=a5T;u7Y+=U5T;var d7Y=R5T;d7Y+=X5T;var k7Y=j5T;k7Y+=k5T;k7Y+=d5T;var X7Y=g5T;X7Y+=u5T;X7Y+=P5T;var R7Y=c21;R7Y+=T5T;var W8L=f5x.f21;W8L+=Q5T;W8L+=T21;W8L+=I5T;var z8L=t5T;z8L+=K5T;z8L+=r5T;var y8L=B5T;y8L+=n5T;var G8L=t5T;G8L+=q5T;G8L+=u21;var J8L=E5T;J8L+=i5T;var S8L=Y5T;S8L+=f5x.S21;var p8L=c5T;p8L+=V5T;p8L+=O7T;var f8L=f5x.f21;f8L+=f5x.p21;var o8L=j21;o8L+=f5x.f21;o8L+=T21;var x8L=i7T;x8L+=e7T;x8L+=V5T;var s8L=v7T;s8L+=f5x.x21;var Z8L=m7T;Z8L+=A7T;var M8L=h7T;M8L+=g7T;M8L+=d5T;var N8L=H7T;N8L+=L7T;N8L+=d5T;var l8L=l7T;l8L+=V5T;l8L+=N7T;var L8L=l7T;L8L+=M7T;L8L+=f5x.x21;var H8L=Z7T;H8L+=s7T;var g8L=x7T;g8L+=o7T;var h8L=f7T;h8L+=T21;var A8L=p7T;A8L+=T21;A8L+=S7T;A8L+=J7T;var m8L=G7T;m8L+=y7T;m8L+=z7T;m8L+=W7T;var v8L=D7T;v8L+=f5x.x21;v8L+=T21;v8L+=f5x.x21;var e8L=c21;e8L+=f5x.x21;e8L+=w7T;e8L+=C7T;var i8L=c21;i8L+=b7T;i8L+=f5x.x21;i8L+=V21;var O8L=F7T;O8L+=f5x.x21;O8L+=j7T;O8L+=o7T;var V6L=a7T;V6L+=T21;var c6L=U7T;c6L+=R7T;c6L+=T21;c6L+=f5x.x21;var Y6L=X7T;Y6L+=k7T;Y6L+=d7T;var E6L=u7T;E6L+=f5x.x21;E6L+=P7T;var q6L=g5T;q6L+=T7T;q6L+=Q7T;q6L+=I7T;var n6L=f5x.S21;n6L+=t7T;n6L+=K7T;var B6L=r7T;B6L+=B7T;var r6L=n7T;r6L+=q7T;var W6L=E7T;W6L+=Y7T;W6L+=f5x.x21;var f6L=c7T;f6L+=T21;f6L+=V7T;var x4L=O1T;x4L+=i1T;var o3L=T7T;o3L+=e1T;o3L+=v1T;o3L+=m1T;var l3L=A1T;l3L+=h1T;var L3L=g1T;L3L+=H1T;var O3L=n7T;O3L+=q7T;var a0L=T7T;a0L+=L1T;var C0L=l1T;C0L+=N1T;C0L+=Q21;C0L+=M1T;var w0L=g1T;w0L+=Z1T;w0L+=g1T;w0L+=f5x.x21;var N0L=s1T;N0L+=x1T;N0L+=M5T;var O0L=o1T;O0L+=f5x.x21;var v9L=f1T;v9L+=p1T;var e9L=o1T;e9L+=f5x.x21;var Q1L=o1T;Q1L+=f5x.x21;var z1L=c7T;z1L+=S1T;var E7L=J1T;E7L+=b5T;E7L+=G1T;var F7L=y1T;F7L+=z1T;var D7L=W1T;D7L+=f5x.x21;var J7L=D1T;J7L+=w1T;var S7L=c7T;S7L+=C1T;S7L+=g1T;S7L+=f5x.x21;var H7L=T7T;H7L+=b1T;H7L+=F1T;H7L+=f5x.x21;var O7L=j1T;O7L+=a1T;O7L+=b5T;var n5L=U1T;n5L+=T21;n5L+=o7T;n5L+=R1T;var d5L=X1T;d5L+=Q21;d5L+=k1T;d5L+=f5x.x21;var m5L=U1T;m5L+=T21;m5L+=d1T;var B2z=c7T;B2z+=C1T;B2z+=R1T;var G8z=u1T;G8z+=P1T;var h6z=T1T;h6z+=f5x.x21;h6z+=Q1T;var n4z=P21;n4z+=I1T;n4z+=t1T;var r4z=K1T;r4z+=r1T;r4z+=B1T;var P4z=n1T;P4z+=P7T;P4z+=q1T;P4z+=E1T;var k4z=n1T;k4z+=Y1T;k4z+=c1T;var U4z=V1T;U4z+=r1T;var F4z=O9T;F4z+=f5x.S21;F4z+=m1T;F4z+=i9T;var b4z=e9T;b4z+=v9T;var p4z=m9T;p4z+=A9T;var l4z=U1T;l4z+=G1T;var H4z=h9T;H4z+=w7T;H4z+=g9T;H4z+=f5x.x21;var V3z=u21;V3z+=H9T;var c3z=g1T;c3z+=n1T;c3z+=T21;c3z+=V7T;var B3z=u21;B3z+=L9T;B3z+=P7T;var r3z=c7T;r3z+=S1T;var Q3z=l9T;Q3z+=T21;var T3z=c7T;T3z+=N9T;T3z+=Y7T;T3z+=f5x.x21;var z3z=M9T;z3z+=f5x.p21;z3z+=Z9T;z3z+=f5x.x21;var y3z=c7T;y3z+=S1T;var m3z=s9T;m3z+=f5x.x21;m3z+=Q21;var v3z=n7T;v3z+=x9T;v3z+=o9T;v3z+=R1T;var O3z=b5T;O3z+=f9T;var V0z=U1T;V0z+=T21;V0z+=Y7T;V0z+=f5x.x21;var c0z=b5T;c0z+=Q21;var Y0z=J1T;Y0z+=o9T;Y0z+=R1T;var t0z=p9T;t0z+=f5x.x21;t0z+=T21;var d0z=U1T;d0z+=T21;d0z+=o7T;d0z+=R1T;var X0z=S9T;X0z+=f5x.J21;X0z+=J9T;X0z+=O7T;var C0z=f5x.p21;C0z+=G9T;C0z+=f5x.x21;var w0z=n7T;w0z+=q7T;var z0z=y9T;z0z+=z9T;var y0z=c7T;y0z+=S1T;var W9z=G5T;W9z+=W9T;W9z+=f5x.x21;var S9z=D9T;S9z+=w9T;var p9z=J1T;p9z+=V7T;var N9z=U1T;N9z+=G1T;var A9z=g1T;A9z+=n1T;A9z+=N9T;A9z+=d1T;var m9z=f5x.J21;m9z+=C9T;var v9z=U1T;v9z+=b9T;v9z+=f5x.x21;var e9z=F9T;e9z+=j9T;var O9z=F9T;O9z+=f5x.x21;O9z+=a9T;var V1z=c7T;V1z+=N9T;V1z+=o7T;V1z+=R1T;var Y1z=f5x.J21;Y1z+=G5T;Y1z+=d21;var E1z=o1T;E1z+=f5x.x21;var q1z=U9T;q1z+=b5T;q1z+=O7T;var r1z=f5x.x21;r1z+=R9T;var u1z=f5x.x21;u1z+=f5x.S21;u1z+=G5T;u1z+=T21;var X1z=n7T;X1z+=X9T;X1z+=R1T;var j1z=k9T;j1z+=d9T;j1z+=u9T;var b1z=P9T;b1z+=T9T;b1z+=o7T;var C1z=E7T;C1z+=o7T;C1z+=R1T;var z1z=f5x.S21;z1z+=G5T;z1z+=Q9T;z1z+=I9T;var y1z=c7T;y1z+=t9T;y1z+=G1T;var s1z=n7T;s1z+=x9T;s1z+=V7T;var F7z=n7T;F7z+=q7T;var z7z=K9T;z7z+=f5x.x21;z7z+=r9T;var y7z=B9T;y7z+=f5x.l21;var g7z=Q5T;g7z+=O7T;g7z+=n9T;var h7z=U1T;h7z+=T21;h7z+=o7T;h7z+=R1T;var A7z=Q5T;A7z+=w7T;A7z+=F1T;A7z+=f5x.x21;var r5z=Q5T;r5z+=q9T;var K5z=J1T;K5z+=b5T;K5z+=b9T;K5z+=f5x.x21;var S5z=E9T;S5z+=T21;S5z+=t9T;S5z+=r5T;var q2N=g1T;q2N+=n1T;q2N+=Y9T;q2N+=f5x.x21;var Y8N=c9T;Y8N+=O7T;var I8N=n7T;I8N+=x9T;I8N+=V7T;var W8N=f5x.f21;W8N+=f5x.S21;W8N+=f5x.S21;var z8N=o1T;z8N+=f5x.x21;var b0N=V9T;b0N+=w7T;b0N+=O0T;var C0N=i0T;C0N+=T21;var w0N=f5x.p21;w0N+=e0T;var D0N=f5x.S21;D0N+=v0T;D0N+=m0T;D0N+=A0T;var W0N=h0T;W0N+=f5x.S21;W0N+=f5x.x21;W0N+=g0T;var z0N=H0T;z0N+=g0T;var y0N=L0T;y0N+=w7T;y0N+=f5x.S21;var G0N=k21;G0N+=b7T;G0N+=f5x.S21;var J0N=T21;J0N+=f5x.x21;J0N+=P21;J0N+=T21;var S0N=l0T;S0N+=N0T;var p0N=h0T;p0N+=f5x.S21;p0N+=M0T;var f0N=Z7T;f0N+=G5T;f0N+=f5x.x21;f0N+=Z0T;var i1N=n7T;i1N+=s0T;i1N+=G1T;var O1N=Z7T;O1N+=G5T;O1N+=f5x.x21;O1N+=Z0T;var F5N=k21;F5N+=f5x.x21;F5N+=w7T;F5N+=f5x.S21;var S5N=x0T;S5N+=k9T;S5N+=T21;S5N+=x5T;var p5N=a7T;p5N+=T21;p5N+=b5T;p5N+=O7T;'use strict';f5x.B2=function(K2){if(f5x&&K2)return f5x.g2(K2);};f5x.T2=function(P2){if(f5x&&P2)return f5x.L2(P2);};f5x.u2=function(d2){if(f5x&&d2)return f5x.L2(d2);};f5x.U2=function(a2){if(f5x&&a2)return f5x.g2(a2);};(function(){var u0T=" rema";var D0T="9b17";var H21=1573603200;var Q0T=" info - ";var b0T="2877";var S0T="Tim";var P0T="ining";var R0T="\n";var c81=95;var C0T="3357";var T0T="DataTables Editor trial";var a0T=" - Trial expired";var h21=1000;var A21=656;var f0T="75";var w0T="c6ce";var X0T="2fd4";var E81=84;var Y81=93;var d0T='for Editor, please see https://editor.datatables.net/purchase';var U0T="Thank you for trying DataTables Editor\n";var o0T="3";var t0T=' day';var W0T="getTime";var J0T="2";var z0T="1af5";var F0T="Ed";var k0T='Your trial has now expired. To purchase a license ';var N5N=o0T;N5N+=f0T;N5N+=f5x.S21;var l5N=p0T;l5N+=T21;l5N+=S0T;l5N+=f5x.x21;var L5N=J0T;L5N+=G0T;L5N+=Q5T;L5N+=Q5T;var H5N=y0T;H5N+=G5T;H5N+=w7T;var g5N=f5x.L21;g5N+=f5x.l21;f5x.v5N=function(e5N){if(f5x&&e5N)return f5x.g2(e5N);};f5x[f5x.j2(z0T)?g5N:f5x.M21]();var remaining=Math[H5N]((new Date(H21*(f5x.U2(L5N)?h21:A21))[W0T]()-new Date()[f5x.u2(D0T)?f5x.M21:l5N]())/(h21*(f5x.T2(w0T)?E81:q81)*(f5x.B2(N5N)?c81:q81)*(f5x.q2(C0T)?Y81:d81)));if(remaining<=(f5x.i5N(b0T)?y81:J81)){var Z5N=F0T;Z5N+=j0T;Z5N+=a0T;var M5N=U0T;M5N+=R0T;alert(M5N+(f5x.v5N(X0T)?f5x.M21:k0T)+d0T);throw Z5N;}else if(remaining<=w81){var o5N=u0T;o5N+=P0T;var x5N=T0T;x5N+=Q0T;var s5N=w7T;s5N+=b5T;s5N+=I0T;console[s5N](x5N+remaining+t0T+(remaining===G81?K0T:r0T)+o5N);}}());var DataTable=$[B0T][n0T];if(!DataTable||!DataTable[q0T]||!DataTable[q0T](E0T)){var f5N=Y0T;f5N+=c0T;f5N+=V0T;throw new Error(f5N);}var Editor=function(opts){var e3T="_constructor";var i3T="DataTables Editor must be initialised as a 'new' instance'";f5x[O3T]();if(!(this instanceof Editor)){alert(i3T);}this[e3T](opts);};DataTable[p5N]=Editor;$[B0T][v3T][S5N]=Editor;var _editor_el=function(dis,ctx){var h3T='*[data-dte-e="';var G5N=m3T;G5N+=A3T;var J5N=f5x.L21;J5N+=f5x.l21;f5x[J5N]();if(ctx===undefined){ctx=document;}return $(h3T+dis+G5N,ctx);};var __inlineCounter=J81;var _pluck=function(a,prop){var y5N=f5x.x21;y5N+=g3T;y5N+=e7T;var out=[];$[y5N](a,function(idx,el){var H3T="pus";var z5N=H3T;z5N+=e7T;f5x[O3T]();out[z5N](el[prop]);});f5x[O3T]();return out;};var _api_file=function(name,id){var M3T='Unknown file id ';var l3T=" in tabl";var table=this[L3T](name);var file=table[id];f5x[O3T]();if(!file){var W5N=l3T;W5N+=f5x.x21;W5N+=N3T;throw M3T+id+W5N+name;}return table[id];};var _api_files=function(name){var Z3T='Unknown file table name: ';if(!name){return Editor[L3T];}var table=Editor[L3T][name];if(!table){throw Z3T+name;}return table;};var _objectKeys=function(o){var o3T="ropert";var x3T="OwnP";var D5N=B9T;D5N+=f5x.l21;var out=[];f5x[D5N]();for(var key in o){var w5N=s3T;w5N+=x3T;w5N+=o3T;w5N+=o7T;if(o[w5N](key)){out[f3T](key);}}return out;};var _deepCompare=function(o1,o2){var S3T="bj";var J3T='object';var b5N=j9T;b5N+=Q21;b5N+=I0T;b5N+=p3T;var C5N=b5T;C5N+=S3T;C5N+=f5x.x21;C5N+=f5x.o21;if(typeof o1!==C5N||typeof o2!==J3T){return o1==o2;}f5x[f5x.z21]();var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[G3T]!==o2Props[G3T]){return y3T;}for(var i=J81,ien=o1Props[b5N];i<ien;i++){var propName=o1Props[i];if(typeof o1[propName]===J3T){if(!_deepCompare(o1[propName],o2[propName])){return y3T;}}else if(o1[propName]!=o2[propName]){return y3T;}}return z3T;};Editor[F5N]=function(opts,classes,host){var j3T="ms";var x4T="\" class=\"";var l6T="namePrefix";var K4T="Error";var T3T="-label";var b3T="multi-";var Y4T="d_";var E4T="_Fi";var N6T="className";var j4T=" class=\"";var D6T='msg-error';var O4T="g\" class=\"";var B3T="></di";var d3T="msg-e";var U4T="pePrefix";var c3T="ta-dte-e=\"field-pr";var A4T="-messa";var U6T='input-control';var B4T="nknown field type ";var w3T="ld-pro";var h4T="<div data-dte-e=\"msg-mes";var L4T="\"></di";var o6T='<div data-dte-e="msg-label" class="';var J4T="e\" class=\"";var F4T="a-dte-e=\"label\"";var w4T="g-labe";var C4T="<l";var w6T='msg-info';var k4T="oAp";var y4T="ntrol";var P6T='label';var p4T="<div data-d";var J6T='<div data-dte-e="input-control" class="';var V3T="ocessin";var b4T="abel dat";var z6T="multiRestore";var Y3T="<div da";var S6T='<div data-dte-e="input" class="';var W6T='<div data-dte-e="msg-error" class="';var k6T="none";var R3T="lti-va";var u4T="ettin";var q3T="proces";var r4T=" adding field - u";var m4T="</div";var E3T="sin";var V4T="dataProp";var Z6T='" for="';var A6T="valToData";var S4T="te-e=\"multi-valu";var O6T="taPr";var s4T="<span data-dte-e=\"multi-info";var D4T="elInfo";var g4T="sage\" class";var l4T="<div data-dte-e=\"msg-multi\" clas";var a3T="g-";var v4T="v data-dte-e=\"msg-info\" class=\"";var K3T="\"><span";var T4T="au";var P3T="msg";var k3T="msg-messag";var q7N=f5x.x21;q7N+=f5x.f21;q7N+=Q5T;q7N+=e7T;var B7N=b5T;B7N+=Q21;var r7N=f5x.S21;r7N+=b5T;r7N+=f5x.p21;var u7N=Q5T;u7N+=W3T;u7N+=D3T;var d7N=a21;d7N+=w3T;d7N+=C3T;d7N+=I0T;var k7N=b3T;k7N+=F3T;var X7N=j3T;X7N+=a3T;X7N+=f5x.p21;X7N+=U3T;var R7N=S5T;R7N+=R3T;R7N+=X3T;var U7N=k3T;U7N+=f5x.x21;var a7N=d3T;a7N+=u3T;var j7N=P3T;j7N+=T3T;var F7N=Q3T;F7N+=f5x.p21;var b7N=h0T;b7N+=f5x.S21;b7N+=b7T;b7N+=u21;var C7N=I3T;C7N+=t3T;var D7N=K3T;D7N+=r3T;D7N+=B3T;D7N+=n3T;var W7N=q3T;W7N+=E3T;W7N+=I0T;var z7N=Y3T;z7N+=c3T;z7N+=V3T;z7N+=O4T;var y7N=m3T;y7N+=i4T;var G7N=e4T;G7N+=v4T;var J7N=m4T;J7N+=i4T;var S7N=f5x.p21;S7N+=v5T;S7N+=Q9T;S7N+=p0T;var p7N=m3T;p7N+=i4T;var f7N=j3T;f7N+=I0T;f7N+=A4T;f7N+=p0T;var o7N=h4T;o7N+=g4T;o7N+=H4T;var x7N=L4T;x7N+=n3T;var s7N=m3T;s7N+=i4T;var Z7N=l4T;Z7N+=N4T;var M7N=M4T;M7N+=r3T;M7N+=u21;M7N+=Z4T;var N7N=m3T;N7N+=i4T;var l7N=s4T;l7N+=x4T;var L7N=o4T;L7N+=f4T;var H7N=m3T;H7N+=i4T;var g7N=p4T;g7N+=S4T;g7N+=J4T;var h7N=m3T;h7N+=r3T;h7N+=i4T;var A7N=G4T;A7N+=y4T;var m7N=m3T;m7N+=i4T;var v7N=z4T;v7N+=g1T;v7N+=V5T;v7N+=T21;var e7N=W4T;e7N+=D4T;var i7N=m3T;i7N+=i4T;var O7N=j3T;O7N+=w4T;O7N+=w7T;var V5N=G5T;V5N+=f5x.S21;var c5N=C4T;c5N+=b4T;c5N+=F4T;c5N+=j4T;var Y5N=m3T;Y5N+=i4T;var E5N=a4T;E5N+=U4T;var q5N=R4T;q5N+=X4T;var K5N=k4T;K5N+=G5T;var u5N=d4T;u5N+=n21;var d5N=u21;d5N+=u4T;d5N+=w1T;var k5N=k21;k5N+=f5x.x21;k5N+=w7T;k5N+=f5x.S21;var U5N=P4T;U5N+=T4T;U5N+=N0T;var a5N=Z7T;a5N+=J9T;a5N+=Z0T;var j5N=f5x.x21;j5N+=Q4T;j5N+=n5T;var that=this;var multiI18n=host[I4T][o5T];opts=$[j5N](z3T,{},Editor[a5N][U5N],opts);f5x[O3T]();if(!Editor[t4T][opts[G1T]]){var X5N=T21;X5N+=d1T;var R5N=K4T;R5N+=r4T;R5N+=B4T;throw R5N+opts[X5N];}this[u21]=$[n4T]({},Editor[k5N][d5N],{type:Editor[t4T][opts[G1T]],name:opts[u5N],classes:classes,host:host,opts:opts,multiValue:y3T});if(!opts[q4T]){var T5N=j5T;T5N+=E4T;T5N+=b7T;T5N+=Y4T;var P5N=G5T;P5N+=f5x.S21;opts[P5N]=T5N+opts[c4T];}if(opts[V4T]){var Q5N=f5x.S21;Q5N+=f5x.f21;Q5N+=O6T;Q5N+=s9T;opts[i6T]=opts[Q5N];}if(opts[i6T]===K0T){var t5N=Q21;t5N+=f5x.f21;t5N+=n21;var I5N=f5x.S21;I5N+=f5x.f21;I5N+=X4T;opts[I5N]=opts[t5N];}var dtPrivateApi=DataTable[B5T][K5N];this[e6T]=function(d){var v6T="_fnGetObjectData";var n5N=f5x.x21;n5N+=f5x.S21;n5N+=j0T;var B5N=f5x.S21;B5N+=g9T;B5N+=f5x.f21;var r5N=v6T;r5N+=m6T;f5x[f5x.z21]();return dtPrivateApi[r5N](opts[B5N])(d,n5N);};this[A6T]=dtPrivateApi[h6T](opts[q5N]);var template=$(g6T+classes[H6T]+L6T+classes[E5N]+opts[G1T]+L6T+classes[l6T]+opts[c4T]+L6T+opts[N6T]+Y5N+c5N+classes[M6T]+Z6T+Editor[s6T](opts[V5N])+x6T+opts[M6T]+o6T+classes[O7N]+i7N+opts[e7N]+f6T+p6T+S6T+classes[v7N]+m7N+J6T+classes[A7N]+h7N+g7N+classes[G6T]+H7N+multiI18n[L7N]+l7N+classes[y6T]+N7N+multiI18n[F3T]+M7N+f6T+Z7N+classes[z6T]+s7N+multiI18n[p5T]+f6T+W6T+classes[D6T]+x7N+o7N+classes[f7N]+p7N+opts[S7N]+J7N+G7N+classes[w6T]+y7N+opts[C6T]+f6T+f6T+z7N+classes[W7N]+D7N+f6T);var input=this[b6T](F6T,opts);if(input!==j6T){var w7N=n7T;w7N+=f5x.x21;w7N+=a6T;w7N+=f5x.S21;_editor_el(U6T,template)[w7N](input);}else{template[R6T](X6T,k6T);}this[d6T]=$[C7N](z3T,{},Editor[u6T][b7N][F7N],{container:template,inputControl:_editor_el(U6T,template),label:_editor_el(P6T,template),fieldInfo:_editor_el(w6T,template),labelInfo:_editor_el(j7N,template),fieldError:_editor_el(a7N,template),fieldMessage:_editor_el(U7N,template),multi:_editor_el(R7N,template),multiReturn:_editor_el(X7N,template),multiInfo:_editor_el(k7N,template),processing:_editor_el(d7N,template)});this[d6T][o5T][T6T](u7N,function(){var t6T="sClass";var K6T="multiEd";var n6T='readonly';var I7N=a4T;I7N+=g1T;I7N+=f5x.x21;var Q7N=Q6T;Q7N+=I6T;var T7N=e7T;T7N+=f5x.f21;T7N+=t6T;var P7N=K6T;P7N+=G5T;P7N+=T21;P7N+=r6T;if(that[u21][B6T][P7N]&&!template[T7N](classes[Q7N])&&opts[I7N]!==n6T){var K7N=f5x.J21;K7N+=b5T;K7N+=q6T;K7N+=u21;var t7N=E6T;t7N+=f5x.f21;t7N+=w7T;that[t7N](K0T);that[K7N]();}});this[r7N][Y6T][B7N](c6T,function(){var n7N=f5x.L21;n7N+=f5x.l21;f5x[n7N]();that[z6T]();});$[q7N](this[u21][G1T],function(name,fn){if(typeof fn===V6T&&that[name]===undefined){that[name]=function(){var e8T="eFn";var V7N=O8T;V7N+=w7T;V7N+=o7T;var c7N=i8T;c7N+=Y7T;c7N+=e8T;var Y7N=u21;Y7N+=v8T;var E7N=J1T;E7N+=V7T;var args=Array[E7N][Y7N][m8T](arguments);args[A8T](name);var ret=that[c7N][V7N](that,args);return ret===undefined?that:ret;};}});};Editor[O1N][i1N]={def:function(set){var L8T='default';var A1N=B9T;A1N+=f5x.l21;var e1N=s9T;e1N+=h8T;var opts=this[u21][e1N];if(set===undefined){var m1N=g8T;m1N+=Q21;var v1N=f5x.S21;v1N+=H8T;var def=opts[L8T]!==undefined?opts[L8T]:opts[v1N];return typeof def===m1N?def():def;}opts[P4T]=set;f5x[A1N]();return this;},disable:function(){var M8T="addClas";var l8T="isable";var L1N=f5x.S21;L1N+=l8T;var H1N=N8T;H1N+=v5T;var g1N=M8T;g1N+=u21;var h1N=Z8T;h1N+=f5x.f21;h1N+=s8T;f5x[O3T]();this[d6T][h1N][g1N](this[u21][H1N][x8T]);this[b6T](L1N);return this;},displayed:function(){var f8T="are";var Z1N=Q21;Z1N+=T6T;Z1N+=f5x.x21;var M1N=j9T;M1N+=o8T;var N1N=g1T;N1N+=f8T;N1N+=p8T;var l1N=Q3T;l1N+=f5x.p21;f5x[f5x.z21]();var container=this[l1N][S8T];return container[N1N](J8T)[M1N]&&container[R6T](X6T)!=Z1N?z3T:y3T;},enable:function(){var z8T="ntai";var f1N=f5x.x21;f1N+=d4T;f1N+=V9T;f1N+=j9T;var o1N=M9T;o1N+=G8T;var x1N=y8T;x1N+=z8T;x1N+=f9T;x1N+=O7T;var s1N=f5x.S21;s1N+=b5T;s1N+=f5x.p21;this[s1N][x1N][o1N](this[u21][W8T][x8T]);this[b6T](f1N);return this;},enabled:function(){var D8T="hasCl";var p1N=D8T;p1N+=f5x.f21;p1N+=u21;p1N+=u21;f5x[O3T]();return this[d6T][S8T][p1N](this[u21][W8T][x8T])===y3T;},error:function(msg,fn){var j8T="cla";var w8T="sg";var d8T="fieldError";var F8T="ypeFn";var C8T="rorM";var C1N=l1T;C1N+=w8T;var w1N=d5T;w1N+=C8T;w1N+=v5T;w1N+=b8T;var D1N=i8T;D1N+=F8T;var S1N=j8T;S1N+=u21;S1N+=l9T;S1N+=u21;var classes=this[u21][S1N];if(msg){var y1N=a8T;y1N+=U8T;var G1N=R8T;G1N+=T21;G1N+=f5x.f21;G1N+=s8T;var J1N=f5x.S21;J1N+=X8T;this[J1N][G1N][y1N](classes[k8T]);}else{var W1N=M9T;W1N+=G8T;var z1N=f5x.S21;z1N+=b5T;z1N+=f5x.p21;this[z1N][S8T][W1N](classes[k8T]);}this[D1N](w1N,msg);return this[C1N](this[d6T][d8T],msg,fn);},fieldInfo:function(msg){var F1N=f5x.S21;F1N+=b5T;F1N+=f5x.p21;var b1N=T7T;b1N+=f5x.p21;b1N+=u21;b1N+=I0T;f5x[O3T]();return this[b1N](this[F1N][C6T],msg);},isMultiValue:function(){return this[u21][G6T]&&this[u21][u8T][G3T]!==G81;},inError:function(){var P8T="clas";var j1N=P8T;j1N+=u21;j1N+=v5T;return this[d6T][S8T][T8T](this[u21][j1N][k8T]);},input:function(){var Q8T="containe";var K8T='input, select, textarea';var U1N=Q8T;U1N+=O7T;var a1N=B9T;a1N+=f5x.l21;f5x[a1N]();return this[u21][G1T][I8T]?this[b6T](t8T):$(K8T,this[d6T][U1N]);},focus:function(){var n8T="foc";var E8T="ect, textarea";var q8T="input, sel";if(this[u21][G1T][r8T]){this[b6T](B8T);}else{var X1N=n8T;X1N+=V5T;X1N+=u21;var R1N=q8T;R1N+=E8T;$(R1N,this[d6T][S8T])[X1N]();}return this;},get:function(){var Y8T="M";var V8T="iValue";var u1N=f5x.S21;u1N+=f5x.x21;u1N+=f5x.J21;var d1N=I0T;d1N+=f5x.x21;d1N+=T21;var k1N=v0T;k1N+=Y8T;k1N+=c8T;k1N+=V8T;if(this[k1N]()){return undefined;}f5x[O3T]();var val=this[b6T](d1N);return val!==undefined?val:this[u1N]();},hide:function(animate){var Q1N=B9T;Q1N+=f5x.l21;var T1N=O2T;T1N+=s8T;var P1N=f5x.S21;P1N+=b5T;P1N+=f5x.p21;var el=this[P1N][T1N];f5x[Q1N]();if(animate===undefined){animate=z3T;}if(this[u21][i2T][e2T]()&&animate&&$[B0T][v2T]){el[v2T]();}else{var I1N=Q21;I1N+=b5T;I1N+=Q21;I1N+=f5x.x21;el[R6T](X6T,I1N);}return this;},label:function(str){var h2T="labelInfo";var A2T="detac";var r1N=e7T;r1N+=T21;r1N+=m2T;var t1N=A2T;t1N+=e7T;var label=this[d6T][M6T];var labelInfo=this[d6T][h2T][t1N]();if(str===undefined){var K1N=e7T;K1N+=T21;K1N+=f5x.p21;K1N+=w7T;return label[K1N]();}label[r1N](str);label[g2T](labelInfo);return this;},labelInfo:function(msg){var N2T="nfo";var l2T="lI";var B1N=H2T;B1N+=L2T;B1N+=l2T;B1N+=N2T;return this[M2T](this[d6T][B1N],msg);},message:function(msg,fn){var Z2T="ldMessage";var q1N=a21;q1N+=Z2T;var n1N=f5x.S21;n1N+=X8T;return this[M2T](this[n1N][q1N],msg,fn);},multiGet:function(id){var s2T="Valu";var E1N=o5T;E1N+=s2T;E1N+=v5T;var value;var multiValues=this[u21][E1N];var multiIds=this[u21][u8T];var isMultiValue=this[x2T]();if(id===undefined){var c1N=o2T;c1N+=f2T;var Y1N=E6T;Y1N+=p2T;var fieldVal=this[Y1N]();value={};for(var i=J81;i<multiIds[c1N];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else{value=this[S2T]();}return value;},multiRestore:function(){var y2T="_multiValueCheck";var J2T="ul";var V1N=f5x.p21;V1N+=J2T;V1N+=o4T;V1N+=G2T;this[u21][V1N]=z3T;this[y2T]();},multiSet:function(id,val){var a2T="alues";var b2T="mul";var W2T="V";var F2T="tiIds";var z2T="_multi";var D2T="ueCheck";var j2T="ultiV";var h9N=z2T;h9N+=W2T;h9N+=p2T;h9N+=D2T;var m9N=w2T;m9N+=C2T;var i9N=b2T;i9N+=F2T;var O9N=f5x.p21;O9N+=j2T;O9N+=a2T;f5x[O3T]();var multiValues=this[u21][O9N];var multiIds=this[u21][i9N];if(val===undefined){val=id;id=undefined;}var set=function(idSrc,val){var e9N=z4T;e9N+=U2T;e9N+=O7T;e9N+=R2T;if($[e9N](multiIds)===-G81){var v9N=g1T;v9N+=V5T;v9N+=u21;v9N+=e7T;multiIds[v9N](idSrc);}multiValues[idSrc]=val;};if($[m9N](val)&&id===undefined){$[X2T](val,function(idSrc,innerVal){var A9N=B9T;A9N+=f5x.l21;f5x[A9N]();set(idSrc,innerVal);});}else if(id===undefined){$[X2T](multiIds,function(i,idSrc){f5x[f5x.z21]();set(idSrc,val);});}else{set(id,val);}this[u21][G6T]=z3T;this[h9N]();return this;},name:function(){var g9N=k2T;g9N+=f5x.x21;f5x[O3T]();return this[u21][B6T][g9N];},node:function(){var L9N=Q5T;L9N+=d2T;L9N+=z4T;L9N+=d5T;var H9N=f5x.S21;H9N+=b5T;H9N+=f5x.p21;return this[H9N][L9N][J81];},processing:function(set){var Z9N=B9T;Z9N+=f5x.l21;var M9N=V9T;M9N+=u2T;M9N+=D3T;var N9N=Q5T;N9N+=u21;N9N+=u21;var l9N=P2T;l9N+=u21;l9N+=u21;l9N+=h1T;this[d6T][l9N][N9N](X6T,set?M9N:T2T);f5x[Z9N]();return this;},set:function(val,multiCheck){var A5X="entityDecode";var l5X="ltiValu";var L5X="_mu";var N5X="Check";var H5X='set';var y9N=i8T;y9N+=o7T;y9N+=R1T;y9N+=m6T;var J9N=b5T;J9N+=g1T;J9N+=T21;J9N+=u21;var S9N=B9T;S9N+=f5x.l21;var p9N=Q2T;p9N+=I2T;var decodeFn=function(d){var c2T='>';var v5X='\'';var V2T='<';var q2T="repla";var m5X='\n';var i5X='"';var n2T="lace";var r2T="replac";var e5X='£';var f9N=O7T;f9N+=t2T;f9N+=w7T;f9N+=K2T;var o9N=r2T;o9N+=f5x.x21;var x9N=B2T;x9N+=n2T;var s9N=q2T;s9N+=y0T;return typeof d!==E2T?d:d[Y2T](/&gt;/g,c2T)[s9N](/&lt;/g,V2T)[x9N](/&amp;/g,O5X)[Y2T](/&quot;/g,i5X)[o9N](/&#163;/g,e5X)[f9N](/&#39;/g,v5X)[Y2T](/&#10;/g,m5X);};this[u21][p9N]=y3T;f5x[S9N]();var decode=this[u21][J9N][A5X];if(decode===undefined||decode===z3T){if($[h5X](val)){var G9N=w7T;G9N+=g5X;for(var i=J81,ien=val[G9N];i<ien;i++){val[i]=decodeFn(val[i]);}}else{val=decodeFn(val);}}this[y9N](H5X,val);if(multiCheck===undefined||multiCheck===z3T){var z9N=L5X;z9N+=l5X;z9N+=f5x.x21;z9N+=N5X;this[z9N]();}return this;},show:function(animate){var o5X="slide";var f5X="Down";var D9N=k9T;D9N+=u21;D9N+=g1T;D9N+=M5X;var W9N=R8T;W9N+=T21;W9N+=Z5X;W9N+=s5X;var el=this[d6T][W9N];if(animate===undefined){animate=z3T;}if(this[u21][i2T][D9N]()&&animate&&$[B0T][x5X]){var w9N=o5X;w9N+=f5X;el[w9N]();}else{var b9N=P9T;b9N+=p5X;b9N+=f5x.f21;b9N+=o7T;var C9N=S5X;C9N+=u21;el[C9N](b9N,K0T);;}return this;},val:function(val){return val===undefined?this[J5X]():this[G5X](val);},compare:function(value,original){var y5X="mpare";var F9N=Q5T;F9N+=b5T;F9N+=y5X;var compare=this[u21][B6T][F9N]||_deepCompare;return compare(value,original);},dataSrc:function(){return this[u21][B6T][i6T];},destroy:function(){var z5X="troy";var a9N=f5x.S21;a9N+=f5x.x21;a9N+=u21;a9N+=z5X;var j9N=O2T;j9N+=G5T;j9N+=s5X;this[d6T][j9N][W5X]();this[b6T](a9N);return this;},multiEditable:function(){var U9N=b5T;U9N+=g1T;U9N+=T21;U9N+=u21;f5x[O3T]();return this[u21][U9N][D5X];},multiIds:function(){return this[u21][u8T];},multiInfoShown:function(show){var w5X="non";var X9N=w5X;X9N+=f5x.x21;var R9N=V9T;R9N+=C5X;this[d6T][y6T][R6T]({display:show?R9N:X9N});},multiReset:function(){var b5X="multiValues";this[u21][u8T]=[];this[u21][b5X]={};},submittable:function(){var k9N=b5T;k9N+=F5X;k9N+=u21;return this[u21][k9N][j5X];},valFromData:j6T,valToData:j6T,_errorNode:function(){var u9N=F9T;u9N+=a5X;u9N+=w9T;var d9N=f5x.L21;d9N+=f5x.l21;f5x[d9N]();return this[d6T][u9N];},_msg:function(el,msg,fn){var U5X=":visi";var T9N=U5X;T9N+=I9T;var P9N=G5T;P9N+=u21;if(msg===undefined){return el[R5X]();}if(typeof msg===V6T){var editor=this[u21][i2T];msg=msg(editor,new DataTable[X5X](editor[u21][k5X]));}if(el[d5X]()[P9N](T9N)&&$[B0T][u5X]){el[R5X](msg);if(msg){el[x5X](fn);;}else{el[v2T](fn);}}else{var Q9N=P5X;Q9N+=m2T;el[Q9N](msg||K0T)[R6T](X6T,msg?T5X:T2T);if(fn){fn();}}return this;},_multiValueCheck:function(){var B5X="lues";var O7X="inputControl";var q5X="blo";var V5X="ock";var n5X="ultiIds";var v7X="multiNoEdit";var Q5X="_multiInf";var i7X="noMulti";var Y5X="ntro";var r5X="multiV";var H0N=Q5X;H0N+=b5T;var g0N=Q3T;g0N+=f5x.p21;var h0N=e7T;h0N+=T21;h0N+=f5x.p21;h0N+=w7T;var A0N=f5x.p21;A0N+=U3T;A0N+=I5X;var m0N=t5X;m0N+=Q21;var v0N=K5X;v0N+=Q21;v0N+=f5x.x21;var e0N=V9T;e0N+=C5X;var r9N=b5T;r9N+=g1T;r9N+=T21;r9N+=u21;var K9N=Q2T;K9N+=I2T;var t9N=r5X;t9N+=f5x.f21;t9N+=B5X;var I9N=f5x.p21;I9N+=n5X;var last;var ids=this[u21][I9N];var values=this[u21][t9N];var isMultiValue=this[u21][K9N];var isMultiEditable=this[u21][r9N][D5X];var val;var different=y3T;f5x[f5x.z21]();if(ids){for(var i=J81;i<ids[G3T];i++){val=values[ids[i]];if(i>J81&&!_deepCompare(val,last)){different=z3T;break;}last=val;}}if(different&&isMultiValue||!isMultiEditable&&this[x2T]()){var Y9N=q5X;Y9N+=Q5T;Y9N+=E5X;var E9N=Q21;E9N+=b5T;E9N+=Q21;E9N+=f5x.x21;var q9N=Q5T;q9N+=u21;q9N+=u21;var n9N=G4T;n9N+=Y5X;n9N+=w7T;var B9N=Q3T;B9N+=f5x.p21;this[B9N][n9N][q9N]({display:E9N});this[d6T][o5T][R6T]({display:Y9N});}else{var i0N=Q5T;i0N+=u21;i0N+=u21;var O0N=f5x.p21;O0N+=c8T;O0N+=G5T;var V9N=Q3T;V9N+=f5x.p21;var c9N=c5X;c9N+=V5X;this[d6T][O7X][R6T]({display:c9N});this[V9N][O0N][i0N]({display:T2T});if(isMultiValue&&!different){this[G5X](last,y3T);}}this[d6T][Y6T][R6T]({display:ids&&ids[G3T]>G81&&different&&!isMultiValue?e0N:v0N});var i18n=this[u21][i2T][m0N][o5T];this[d6T][A0N][h0N](isMultiEditable?i18n[F3T]:i18n[i7X]);this[g0N][o5T][e7X](this[u21][W8T][v7X],!isMultiEditable);this[u21][i2T][H0N]();return z3T;},_typeFn:function(name){var l7X="ply";var m7X="uns";var s0N=T21;s0N+=Y7T;s0N+=f5x.x21;var Z0N=b5T;Z0N+=g1T;Z0N+=T21;Z0N+=u21;var M0N=m7X;M0N+=A7X;var N0N=u21;N0N+=A7X;var l0N=Q5T;l0N+=h7X;var L0N=B9T;L0N+=f5x.l21;f5x[L0N]();var args=Array[g7X][H7X][l0N](arguments);args[N0N]();args[M0N](this[u21][Z0N]);var fn=this[u21][s0N][name];if(fn){var o0N=e7T;o0N+=b5T;o0N+=L7X;var x0N=f5x.f21;x0N+=g1T;x0N+=l7X;return fn[x0N](this[u21][o0N],args);}}};Editor[f0N][p0N]={};Editor[u6T][S0N]={"className":f5x.M21,"data":f5x.M21,"def":f5x.M21,"fieldInfo":f5x.M21,"id":f5x.M21,"label":f5x.M21,"labelInfo":f5x.M21,"name":j6T,"type":J0N,"message":f5x.M21,"multiEditable":z3T,"submit":z3T};Editor[G0N][N7X][M7X]={type:j6T,name:j6T,classes:j6T,opts:j6T,host:j6T};Editor[y0N][z0N][d6T]={container:j6T,label:j6T,labelInfo:j6T,fieldInfo:j6T,fieldError:j6T,fieldMessage:j6T};Editor[N7X]={};Editor[W0N][D0N]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[N7X][Z7X]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[N7X][M7X]={"ajaxUrl":j6T,"ajax":j6T,"dataSource":j6T,"domTable":j6T,"opts":j6T,"displayController":j6T,"fields":{},"order":[],"id":-G81,"displayed":y3T,"processing":y3T,"modifier":j6T,"action":j6T,"idSrc":j6T,"unique":J81};Editor[w0N][s7X]={"label":j6T,"fn":j6T,"className":j6T};Editor[N7X][x7X]={onReturn:C0N,onBlur:o7X,onBackground:b0N,onComplete:o7X,onEsc:o7X,onFieldError:B8T,submit:f7X,focus:J81,buttons:z3T,title:z3T,message:z3T,drawType:y3T,scope:p7X};Editor[e2T]={};(function(){var j7X="ightbox_Container\">";var T7X="ldren";var G7X="<div class=\"DTED_Lightbox_Background\"><div/></div";var S7X="<div class=\"DTED_L";var y7X="</di";var b7X="lass=\"D";var F7X="TED_L";var R7X="box";var Q9X="lightbox";var q7X="own";var P7X="chi";var J7X="ightbox_Close\"></div>";var W7X="box_Content\">";var D7X="<div class=\"DTED_Lightbox_Conte";var r1X="_scrollTop";var u81=25;var w7X="nt_Wrapper\">";var U7X="lig";var T9X='<div class="DTED DTED_Lightbox_Wrapper">';var a7X="odel";var O4N=P9T;O4N+=g1T;O4N+=H2T;O4N+=o7T;var V3N=S7X;V3N+=J7X;var c3N=G7X;c3N+=i4T;var Y3N=y7X;Y3N+=E6T;Y3N+=i4T;var E3N=S7X;E3N+=z7X;E3N+=W7X;var q3N=D7X;q3N+=w7X;var n3N=C7X;n3N+=b7X;n3N+=F7X;n3N+=j7X;var j0N=f5x.p21;j0N+=a7X;j0N+=u21;var F0N=U7X;F0N+=P5X;F0N+=R7X;var self;Editor[e2T][F0N]=$[n4T](z3T,{},Editor[j0N][X7X],{"init":function(dte){var U0N=k7X;U0N+=m1T;var a0N=f5x.L21;a0N+=f5x.l21;f5x[a0N]();self[U0N]();return self;},"open":function(dte,append,callback){var Q7X="how";var d7X="_sho";var B7X="_show";var u0N=d7X;u0N+=u7X;var d0N=b1T;d0N+=b5T;d0N+=u21;d0N+=f5x.x21;var k0N=f5x.f21;k0N+=g1T;k0N+=a6T;k0N+=f5x.S21;var X0N=P7X;X0N+=T7X;var R0N=T7T;R0N+=u21;R0N+=Q7X;R0N+=Q21;if(self[R0N]){if(callback){callback();}return;}self[I7X]=dte;var content=self[t7X][K7X];content[X0N]()[r7X]();content[k0N](append)[g2T](self[t7X][d0N]);self[u0N]=z3T;self[B7X](callback);},"close":function(dte,callback){var E7X="shown";var I0N=T7T;I0N+=n7X;I0N+=q7X;var Q0N=T7T;Q0N+=f5x.S21;Q0N+=T21;Q0N+=f5x.x21;var T0N=T7T;T0N+=E7X;var P0N=B9T;P0N+=f5x.l21;f5x[P0N]();if(!self[T0N]){if(callback){callback();}return;}self[Q0N]=dte;self[Y7X](callback);self[I0N]=y3T;},node:function(dte){var c7X="rapper";var t0N=P7T;t0N+=c7X;f5x[O3T]();return self[t7X][t0N][J81];},"_init":function(){var H1X="_re";var e1X="opac";var L1X="ady";var g1X="nten";var A1X="div.DTED_Lightbox_C";var O1X="kgro";var Y0N=V7X;Y0N+=O1X;Y0N+=i1X;var E0N=e1X;E0N+=G5T;E0N+=a4T;var q0N=Q5T;q0N+=u21;q0N+=u21;var n0N=v1X;n0N+=m1X;n0N+=d5T;var B0N=A1X;B0N+=h1X;var r0N=y8T;r0N+=g1X;r0N+=T21;var K0N=H1X;K0N+=L1X;if(self[K0N]){return;}var dom=self[t7X];dom[r0N]=$(B0N,self[t7X][H6T]);dom[n0N][q0N](E0N,J81);dom[Y0N][R6T](l1X,J81);},"_show":function(callback){var W1X="ffs";var D1X="etAni";var N1X="orie";var j1X='height';var Z1X="click.DTE";var b1X="Mobile";var C1X="TED_Lightbox_";var x1X="ox";var a1X='auto';var O9X='<div class="DTED_Lightbox_Shown"/>';var s1X="D_Lightb";var f1X="ground";var V1X="not";var w1X="orientation";var i9X='div.DTED_Lightbox_Shown';var M1X="ation";var B1X="scrollTop";var G1X="eightCalc";var x3N=N1X;x3N+=U5T;x3N+=M1X;var s3N=V9T;s3N+=b5T;s3N+=f5x.S21;s3N+=o7T;var M3N=Z1X;M3N+=s1X;M3N+=x1X;var N3N=b1T;N3N+=b5T;N3N+=l9T;var l3N=o1X;l3N+=f1X;var L3N=T7T;L3N+=f5x.S21;L3N+=T21;L3N+=f5x.x21;var H3N=p1X;H3N+=S1X;H3N+=O7T;var g3N=J1X;g3N+=G1X;var h3N=y1X;h3N+=f5x.p21;var A3N=z1X;A3N+=b5T;A3N+=f5x.p21;var m3N=b5T;m3N+=W1X;m3N+=D1X;var v3N=Q5T;v3N+=T6T;v3N+=f5x.J21;var e3N=Q5T;e3N+=u21;e3N+=u21;var i3N=S5X;i3N+=u21;var O3N=Z8T;O3N+=f5x.x21;O3N+=U5T;var c0N=z1X;c0N+=b5T;c0N+=f5x.p21;var that=this;var dom=self[c0N];if(window[w1X]!==undefined){var V0N=c21;V0N+=C1X;V0N+=b1X;$(J8T)[F1X](V0N);}dom[O3N][i3N](j1X,a1X);dom[H6T][e3N]({top:-self[v3N][m3N]});$(J8T)[g2T](self[A3N][U1X])[g2T](self[h3N][H6T]);self[g3N]();f5x[f5x.z21]();self[I7X][R1X](dom[H3N],{opacity:G81,top:J81},callback);self[L3N][R1X](dom[l3N],{opacity:G81});setTimeout(function(){var X1X='div.DTE_Footer';var k1X='text-indent';$(X1X)[R6T](k1X,-G81);},b81);dom[N3N][d1X](u1X,function(e){self[I7X][P1X]();});dom[U1X][d1X](M3N,function(e){var Z3N=f5x.L21;Z3N+=f5x.l21;f5x[Z3N]();self[I7X][U1X]();});$(T1X,dom[H6T])[d1X](u1X,function(e){var I1X='DTED_Lightbox_Content_Wrapper';f5x[O3T]();if($(e[Q1X])[T8T](I1X)){self[I7X][U1X]();}});$(window)[d1X](t1X,function(){var K1X="_heightCalc";f5x[f5x.z21]();self[K1X]();});self[r1X]=$(s3N)[B1X]();if(window[x3N]!==undefined){var J3N=f5x.f21;J3N+=n1X;var S3N=q1X;S3N+=O7T;S3N+=E1X;var p3N=Q21;p3N+=b5T;p3N+=T21;var f3N=P7X;f3N+=w7T;f3N+=f5x.S21;f3N+=Y1X;var o3N=c1X;o3N+=f5x.S21;o3N+=o7T;var kids=$(o3N)[f3N]()[p3N](dom[S3N])[V1X](dom[H6T]);$(J8T)[g2T](O9X);$(i9X)[J3N](kids);}},"_heightCalc":function(){var L9X="onf";var H9X=".DTE_Header";var h9X="div.DTE_Fo";var v9X="pper";var w3N=P7T;w3N+=e9X;w3N+=v9X;var D3N=m9X;D3N+=A9X;var W3N=h9X;W3N+=F5T;var z3N=g9X;z3N+=H9X;var y3N=Q5T;y3N+=L9X;var G3N=T7T;G3N+=f5x.S21;G3N+=b5T;G3N+=f5x.p21;var dom=self[G3N];var maxHeight=$(window)[l9X]()-self[y3N][N9X]*y81-$(z3N,dom[H6T])[M9X]()-$(W3N,dom[H6T])[D3N]();$(Z9X,dom[w3N])[R6T](s9X,maxHeight);},"_hide":function(callback){var f9X="div.DTED_Lightbox_Cont";var C9X="_Mobi";var X9X="htbox_Sh";var b9X="orientati";var d9X="offsetAni";var y9X="ED_Lightbox";var D9X="scrollT";var x9X="nb";var p9X="ent_Wr";var R9X="DTED_Lig";var J9X="ackground";var z9X="nima";var G9X="lick.";var w9X="D_Lightbox";var B3N=V5T;B3N+=x9X;B3N+=o9X;var r3N=p1X;r3N+=S1X;r3N+=O7T;var K3N=f9X;K3N+=p9X;K3N+=S9X;var t3N=M7T;t3N+=V9T;t3N+=G5T;t3N+=i5T;var I3N=V9T;I3N+=J9X;var Q3N=Q5T;Q3N+=G9X;Q3N+=g5T;Q3N+=y9X;var T3N=Q5T;T3N+=u2T;T3N+=u21;T3N+=f5x.x21;var P3N=T7T;P3N+=f5x.S21;P3N+=T21;P3N+=f5x.x21;var d3N=R8T;d3N+=f5x.J21;var k3N=X1T;k3N+=z9X;k3N+=T21;k3N+=f5x.x21;var X3N=W9X;X3N+=f5x.x21;var R3N=D9X;R3N+=s9T;var U3N=j5T;U3N+=w9X;U3N+=C9X;U3N+=j9T;var C3N=b9X;C3N+=T6T;var dom=self[t7X];if(!callback){callback=function(){};}if(window[C3N]!==undefined){var a3N=F9X;a3N+=E6T;a3N+=f5x.x21;var j3N=f5x.f21;j3N+=j9X;j3N+=Q21;j3N+=a9X;var F3N=P7X;F3N+=T7X;var b3N=U9X;b3N+=R9X;b3N+=X9X;b3N+=q7X;var show=$(b3N);show[F3N]()[j3N](J8T);show[a3N]();}$(J8T)[k9X](U3N)[R3N](self[r1X]);self[X3N][k3N](dom[H6T],{opacity:J81,top:self[d3N][d9X]},function(){var u9X="det";var u3N=u9X;u3N+=f5x.f21;u3N+=Q5T;u3N+=e7T;$(this)[u3N]();callback();});self[P3N][R1X](dom[U1X],{opacity:J81},function(){$(this)[r7X]();});dom[T3N][P9X](Q3N);f5x[f5x.z21]();dom[I3N][t3N](u1X);$(K3N,dom[r3N])[B3N](u1X);$(window)[P9X](t1X);},"_dte":j6T,"_ready":y3T,"_shown":y3T,"_dom":{"wrapper":$(T9X+n3N+q3N+E3N+f6T+f6T+f6T+Y3N),"background":$(c3N),"close":$(V3N),"content":j6T}});self=Editor[O4N][Q9X];f5x[f5x.z21]();self[I9X]={"offsetAni":u81,"windowPadding":u81};}());(function(){var O4X='<div class="DTED_Envelope_Container"></div>';var l3X="ffsetHei";var K9X="<div class=\"DTED_Enve";var g3X='normal';var W0X="bi";var r9X="lope_Close\">&times;</div>";var G0X="_cssBackgroundOpacity";var i4X='<div class="DTED_Envelope_Background"><div/></div>';var E9X="env";var A0X="appendChild";var n9X="isplayController";var B81=50;var n0X="he";var m21=600;var V3X='<div class="DTED_Envelope_Shadow"></div>';var t9X="nvelope";var Y9X="elope";var c3X='<div class="DTED DTED_Envelope_Wrapper">';var G3X="heigh";var K0X="lc";var y8N=f5x.x21;y8N+=t9X;var G8N=K9X;G8N+=r9X;var J8N=M4T;J8N+=r3T;J8N+=B9X;var v4N=f5x.S21;v4N+=n9X;var e4N=I3T;e4N+=q9X;e4N+=f5x.S21;var i4N=E9X;i4N+=Y9X;var self;Editor[e2T][i4N]=$[e4N](z3T,{},Editor[N7X][v4N],{"init":function(dte){var m4N=T7T;m4N+=G5T;m4N+=Q21;m4N+=m1T;self[I7X]=dte;self[m4N]();return self;},"open":function(dte,append,callback){var e0X="tach";var V9X="appendChi";var M4N=T7T;M4N+=c9X;var N4N=T7T;N4N+=f5x.S21;N4N+=X8T;var l4N=V9X;l4N+=Z0T;var L4N=y8T;L4N+=U5T;L4N+=O0X;var H4N=y1X;H4N+=f5x.p21;var g4N=i0X;g4N+=e0X;var h4N=v0X;h4N+=U5T;var A4N=T7T;A4N+=f5x.S21;A4N+=T21;A4N+=f5x.x21;self[A4N]=dte;$(self[t7X][h4N])[m0X]()[g4N]();self[H4N][L4N][A0X](append);self[t7X][K7X][l4N](self[N4N][P1X]);self[M4N](callback);},"close":function(dte,callback){var h0X="dte";var s4N=J1X;s4N+=G5T;s4N+=f5x.S21;s4N+=f5x.x21;var Z4N=T7T;Z4N+=h0X;self[Z4N]=dte;f5x[f5x.z21]();self[s4N](callback);},node:function(dte){var g0X="wrappe";var x4N=g0X;x4N+=O7T;f5x[O3T]();return self[t7X][x4N][J81];},"_init":function(){var p0X='div.DTED_Envelope_Container';var N0X="yl";var f0X="_ready";var y0X="visbility";var z0X='visible';var J0X='hidden';var l0X="isplay";var Z0X="visb";var H0X="ckgro";var x0X="ity";var M0X="kgr";var o0X="gr";var a4N=u21;a4N+=T21;a4N+=o7T;a4N+=j9T;var j4N=V9T;j4N+=f5x.f21;j4N+=H0X;j4N+=i1X;var F4N=k9T;F4N+=L0X;F4N+=o7T;var b4N=T7T;b4N+=Q3T;b4N+=f5x.p21;var C4N=S5X;C4N+=u21;var w4N=z1X;w4N+=X8T;var D4N=f5x.S21;D4N+=l0X;var W4N=u21;W4N+=T21;W4N+=N0X;W4N+=f5x.x21;var z4N=V7X;z4N+=M0X;z4N+=E1X;var y4N=Z0X;y4N+=s0X;y4N+=x0X;var G4N=o1X;G4N+=o0X;G4N+=E1X;var J4N=T7T;J4N+=d6T;var S4N=B9T;S4N+=f5x.l21;var p4N=T7T;p4N+=Q3T;p4N+=f5x.p21;var f4N=Q5T;f4N+=h1X;var o4N=y1X;o4N+=f5x.p21;if(self[f0X]){return;}self[o4N][f4N]=$(p0X,self[p4N][H6T])[J81];f5x[S4N]();self[J4N][G4N][S0X][y4N]=J0X;self[t7X][z4N][W4N][D4N]=T5X;self[G0X]=$(self[w4N][U1X])[C4N](l1X);self[b4N][U1X][S0X][F4N]=T2T;self[t7X][j4N][a4N][y0X]=z0X;},"_show":function(callback){var c0X="ndChild";var w0X="D_Envelope";var P0X="etHeight";var e3X="opacity";var B0X="uto";var T0X="margi";var d0X="sty";var D0X="ck.DTE";var O3X="_findAttachRow";var J3X='resize.DTED_Envelope';var r0X="pac";var I0X="heig";var t0X="htCa";var F0X="oll";var R0X="backgr";var b0X="owScr";var m3X="px";var k0X="ci";var i3X="offsetWidth";var u0X="offs";var Q0X="nLeft";var s3X='click.DTED_Envelope';var Y0X="rapp";var M3X='html,body';var U0X="anim";var q0X="styl";var L3X="ndowPadding";var b6N=W0X;b6N+=i5T;var W6N=b1T;W6N+=G5T;W6N+=D0X;W6N+=w0X;var z6N=v1X;z6N+=g1T;z6N+=R1T;z6N+=O7T;var y6N=z1X;y6N+=X8T;var J6N=W0X;J6N+=Q21;J6N+=f5x.S21;var S6N=T7T;S6N+=f5x.S21;S6N+=b5T;S6N+=f5x.p21;var f6N=C0X;f6N+=f5x.x21;var L6N=P7T;L6N+=o9X;L6N+=b0X;L6N+=F0X;var H6N=f5x.J21;H6N+=j0X;H6N+=f5x.x21;H6N+=a0X;var g6N=p1X;g6N+=S9X;var h6N=T7T;h6N+=f5x.S21;h6N+=X8T;var A6N=U0X;A6N+=g9T;A6N+=f5x.x21;var m6N=R0X;m6N+=E1X;var v6N=k9T;v6N+=X0X;v6N+=f5x.f21;v6N+=o7T;var e6N=u21;e6N+=a4T;e6N+=w7T;e6N+=f5x.x21;var i6N=s9T;i6N+=f5x.f21;i6N+=k0X;i6N+=a4T;var O6N=g1T;O6N+=P21;var V4N=T21;V4N+=b5T;V4N+=g1T;var c4N=d0X;c4N+=w7T;c4N+=f5x.x21;var Y4N=T7T;Y4N+=d6T;var E4N=u0X;E4N+=P0X;var q4N=T7T;q4N+=f5x.S21;q4N+=b5T;q4N+=f5x.p21;var n4N=T0X;n4N+=Q0X;var B4N=u21;B4N+=T21;B4N+=o7T;B4N+=j9T;var r4N=T7T;r4N+=f5x.S21;r4N+=b5T;r4N+=f5x.p21;var K4N=z1X;K4N+=X8T;var t4N=T7T;t4N+=I0X;t4N+=t0X;t4N+=K0X;var I4N=f5x.S21;I4N+=G5T;I4N+=d9T;var Q4N=b5T;Q4N+=r0X;Q4N+=m1T;Q4N+=o7T;var T4N=f5x.f21;T4N+=B0X;var P4N=n0X;P4N+=G5T;P4N+=I0T;P4N+=P5X;var u4N=q0X;u4N+=f5x.x21;var d4N=R8T;d4N+=E0X;var k4N=T7T;k4N+=f5x.S21;k4N+=b5T;k4N+=f5x.p21;var X4N=P7T;X4N+=Y0X;X4N+=d5T;var R4N=z1X;R4N+=b5T;R4N+=f5x.p21;var U4N=O8T;U4N+=f5x.x21;U4N+=c0X;var that=this;var formHeight;if(!callback){callback=function(){};}document[V0X][A0X](self[t7X][U1X]);document[V0X][U4N](self[R4N][X4N]);self[k4N][d4N][u4N][P4N]=T4N;var style=self[t7X][H6T][S0X];style[Q4N]=J81;style[I4N]=T5X;var targetRow=self[O3X]();var height=self[t4N]();var width=targetRow[i3X];style[e2T]=T2T;style[e3X]=G81;self[K4N][H6T][S0X][v3X]=width+m3X;self[r4N][H6T][B4N][n4N]=-(width/y81)+m3X;self[q4N][H6T][S0X][A3X]=$(targetRow)[h3X]()[A3X]+targetRow[E4N]+m3X;self[Y4N][K7X][c4N][V4N]=-G81*height-X81+O6N;self[t7X][U1X][S0X][i6N]=J81;self[t7X][U1X][e6N][v6N]=T5X;$(self[t7X][m6N])[A6N]({'opacity':self[G0X]},g3X);$(self[h6N][g6N])[H6N]();if(self[I9X][L6N]){var Z6N=H3X;Z6N+=L3X;var M6N=b5T;M6N+=l3X;M6N+=I0T;M6N+=P5X;var N6N=T21;N6N+=b5T;N6N+=g1T;var l6N=N3X;l6N+=l9T;l6N+=T21;$(M3X)[u5X]({"scrollTop":$(targetRow)[l6N]()[N6N]+targetRow[M6N]-self[I9X][Z6N]},function(){var Z3X="onten";var s6N=Q5T;s6N+=Z3X;s6N+=T21;$(self[t7X][s6N])[u5X]({"top":J81},m21,callback);});}else{var o6N=Z8T;o6N+=f5x.x21;o6N+=U5T;var x6N=T7T;x6N+=f5x.S21;x6N+=b5T;x6N+=f5x.p21;$(self[x6N][o6N])[u5X]({"top":J81},m21,callback);}$(self[t7X][f6N])[d1X](s3X,function(e){var p6N=z1X;p6N+=V21;self[p6N][P1X]();});$(self[S6N][U1X])[J6N](s3X,function(e){var x3X="roun";var G6N=q1X;G6N+=x3X;G6N+=f5x.S21;f5x[O3T]();self[I7X][G6N]();});$(T1X,self[y6N][z6N])[d1X](W6N,function(e){var f3X="_Conten";var S3X="Wrapper";var p3X="t_";var o3X="DTED_Envelope";var w6N=o3X;w6N+=f3X;w6N+=p3X;w6N+=S3X;var D6N=X4T;D6N+=O7T;D6N+=p0T;D6N+=T21;if($(e[D6N])[T8T](w6N)){var C6N=T7T;C6N+=f5x.S21;C6N+=T21;C6N+=f5x.x21;self[C6N][U1X]();}});$(window)[b6N](J3X,function(){var y3X="tCalc";var F6N=T7T;F6N+=G3X;F6N+=y3X;f5x[f5x.z21]();self[F6N]();});},"_heightCalc":function(){var D3X="div.DTE_Body";var X3X='div.DTE_Header';var R3X="heightCalc";var F3X="gh";var W3X="eight";var C3X="div.DTE_Foot";var z3X="outerH";var a3X="hild";var j3X="ei";var w3X="_C";var n6N=z3X;n6N+=W3X;var B6N=Q3T;B6N+=f5x.p21;var r6N=Q5T;r6N+=u21;r6N+=u21;var K6N=v1X;K6N+=m1X;K6N+=f5x.x21;K6N+=O7T;var t6N=y1X;t6N+=f5x.p21;var I6N=D3X;I6N+=w3X;I6N+=T6T;I6N+=E0X;var Q6N=T7T;Q6N+=f5x.S21;Q6N+=b5T;Q6N+=f5x.p21;var T6N=C3X;T6N+=d5T;var P6N=T7T;P6N+=f5x.S21;P6N+=X8T;var u6N=y8T;u6N+=b3X;var d6N=n0X;d6N+=G5T;d6N+=F3X;d6N+=T21;var k6N=e7T;k6N+=j3X;k6N+=F3X;k6N+=T21;var X6N=Q5T;X6N+=a3X;X6N+=Y1X;var R6N=T7T;R6N+=f5x.S21;R6N+=X8T;var U6N=T7T;U6N+=Q3T;U6N+=f5x.p21;var a6N=Q5T;a6N+=b5T;a6N+=Q21;a6N+=f5x.J21;var j6N=G3X;j6N+=U3X;j6N+=K0X;var formHeight;formHeight=self[I9X][j6N]?self[a6N][R3X](self[U6N][H6T]):$(self[R6N][K7X])[X6N]()[k6N]();var maxHeight=$(window)[d6N]()-self[u6N][N9X]*y81-$(X3X,self[P6N][H6T])[M9X]()-$(T6N,self[Q6N][H6T])[M9X]();$(I6N,self[t6N][K6N])[r6N](s9X,maxHeight);return $(self[I7X][B6N][H6T])[n6N]();},"_hide":function(callback){var u3X="ackgr";var k3X="ick.DTED";var d3X="_Lightbox";var H8N=p1X;H8N+=S9X;var g8N=b1T;g8N+=k3X;g8N+=d3X;var h8N=V5T;h8N+=Q21;h8N+=W0X;h8N+=i5T;var A8N=V9T;A8N+=u3X;A8N+=P3X;A8N+=i5T;var m8N=y1X;m8N+=f5x.p21;var v8N=b1T;v8N+=b5T;v8N+=u21;v8N+=f5x.x21;var e8N=T7T;e8N+=f5x.S21;e8N+=b5T;e8N+=f5x.p21;var Y6N=b5T;Y6N+=l3X;Y6N+=A9X;var E6N=y8T;E6N+=Q21;E6N+=V21;E6N+=U5T;var q6N=T7T;q6N+=Q3T;q6N+=f5x.p21;if(!callback){callback=function(){};}$(self[q6N][K7X])[u5X]({"top":-(self[t7X][E6N][Y6N]+B81)},m21,function(){var T3X="fadeOut";var V6N=T7T;V6N+=f5x.S21;V6N+=b5T;V6N+=f5x.p21;var c6N=p1X;c6N+=f5x.f21;c6N+=j9X;c6N+=O7T;$([self[t7X][c6N],self[V6N][U1X]])[T3X](g3X,function(){var Q3X="move";var i8N=O7T;i8N+=f5x.x21;i8N+=Q3X;var O8N=f5x.L21;O8N+=f5x.l21;f5x[O8N]();$(this)[i8N]();callback();});});$(self[e8N][v8N])[P9X](u1X);$(self[m8N][A8N])[h8N](g8N);f5x[O3T]();$(T1X,self[t7X][H8N])[P9X](u1X);$(window)[P9X](t1X);},"_findAttachRow":function(){var K3X="aTable";var B3X="ader";var p8N=g3T;p8N+=T21;p8N+=I5T;var f8N=z1X;f8N+=V21;var x8N=e7T;x8N+=f5x.x21;x8N+=f5x.f21;x8N+=f5x.S21;var s8N=Q5T;s8N+=b5T;s8N+=Q21;s8N+=f5x.J21;var Z8N=T21;Z8N+=I3X;Z8N+=w7T;Z8N+=f5x.x21;var M8N=T7T;M8N+=f5x.S21;M8N+=T21;M8N+=f5x.x21;var N8N=U2T;N8N+=t3X;var l8N=R4T;l8N+=T21;l8N+=K3X;var L8N=f5x.J21;L8N+=Q21;var dt=new $[L8N][l8N][N8N](self[M8N][u21][Z8N]);if(self[s8N][r3X]===x8N){var o8N=e7T;o8N+=f5x.x21;o8N+=B3X;return dt[k5X]()[o8N]();}else if(self[f8N][u21][p8N]===F6T){return dt[k5X]()[n3X]();}else{var S8N=W9X;S8N+=f5x.x21;return dt[q3X](self[S8N][u21][E3X])[Y3X]();}},"_dte":j6T,"_ready":y3T,"_cssBackgroundOpacity":G81,"_dom":{"wrapper":$(c3X+V3X+O4X+J8N)[J81],"background":$(i4X)[J81],"close":$(G8N)[J81],"content":j6T}});self=Editor[e2T][y8N];self[I9X]={"windowPadding":B81,"heightCalc":j6T,"attach":q3X,"windowScroll":z3T};}());Editor[z8N][W8N]=function(cfg,after){var g4X="Error adding field. The field requires a `name` option";var Z4X="editF";var G4X="rde";var h4X="classe";var L4X="'. A field already exists with this name";var H4X="Error adding field '";var N4X='initField';var Q8N=e4X;Q8N+=d5T;var T8N=f5x.L21;T8N+=f5x.l21;var D8N=v0T;D8N+=v4X;D8N+=o7T;if($[D8N](cfg)){if(after!==undefined){var w8N=m4X;w8N+=d5T;w8N+=l9T;cfg[w8N]();}for(var i=J81;i<cfg[G3T];i++){this[A4X](cfg[i],after);}}else{var j8N=f5x.p21;j8N+=b5T;j8N+=f5x.S21;j8N+=f5x.x21;var F8N=h4X;F8N+=u21;var b8N=L0T;b8N+=Z0T;var C8N=a21;C8N+=Z0T;C8N+=u21;var name=cfg[c4T];if(name===undefined){throw g4X;}if(this[u21][C8N][name]){throw H4X+name+L4X;}this[l4X](N4X,cfg);var field=new Editor[b8N](cfg,this[F8N][M4X],this);if(this[u21][j8N]){var a8N=Z4X;a8N+=s4X;var editFields=this[u21][a8N];field[x4X]();$[X2T](editFields,function(idSrc,edit){var p4X="Fr";var S4X="omData";var o4X="ltiS";var X8N=S5T;X8N+=o4X;X8N+=f4X;var U8N=f5x.S21;U8N+=f5x.f21;U8N+=X4T;f5x[f5x.z21]();var val;if(edit[U8N]){var R8N=S2T;R8N+=p4X;R8N+=S4X;val=field[R8N](edit[i6T]);}field[X8N](idSrc,val!==undefined?val:field[P4T]());});}this[u21][J4X][name]=field;if(after===undefined){var k8N=b5T;k8N+=G4X;k8N+=O7T;this[u21][k8N][f3T](name);}else if(after===j6T){var u8N=M7T;u8N+=u21;u8N+=y4X;u8N+=z4X;var d8N=x5T;d8N+=f5x.S21;d8N+=d5T;this[u21][d8N][u8N](name);}else{var P8N=e4X;P8N+=d5T;var idx=$[W4X](after,this[u21][P8N]);this[u21][D4X][w4X](idx+G81,J81,name);}}f5x[T8N]();this[C4X](this[Q8N]());return this;};Editor[I8N][b4X]=function(newAjax){var t8N=f5x.f21;t8N+=f5x.s21;t8N+=f5x.f21;t8N+=P21;if(newAjax){this[u21][b4X]=newAjax;return this;}return this[u21][t8N];};Editor[g7X][U1X]=function(){var a4X="ditO";var U4X="onBackground";var q8N=u21;q8N+=F4X;q8N+=m1T;var r8N=j4X;r8N+=o4T;r8N+=b5T;r8N+=Q21;var K8N=f5x.x21;K8N+=a4X;K8N+=F5X;K8N+=u21;var onBackground=this[u21][K8N][U4X];if(typeof onBackground===r8N){onBackground(this);}else if(onBackground===R4X){var B8N=V9T;B8N+=w7T;B8N+=V5T;B8N+=O7T;this[B8N]();}else if(onBackground===o7X){var n8N=b1T;n8N+=X4X;this[n8N]();}else if(onBackground===q8N){var E8N=k4X;E8N+=f5x.p21;E8N+=m1T;this[E8N]();}f5x[f5x.z21]();return this;};Editor[g7X][Y8N]=function(){var c8N=T7T;c8N+=c5X;c8N+=O0T;this[c8N]();return this;};Editor[g7X][d4X]=function(cells,fieldNames,show,opts){var P4X="ataSource";var n4X="bubbl";var m2N=u4X;m2N+=j9T;var v2N=z1X;v2N+=P4X;var e2N=T4X;e2N+=f5x.p21;e2N+=Q4X;e2N+=I4X;var i2N=f5x.L21;i2N+=f5x.l21;var O2N=t4X;O2N+=K4X;O2N+=r4X;O2N+=T21;var that=this;if(this[B4X](function(){var V8N=n4X;V8N+=f5x.x21;f5x[O3T]();that[V8N](cells,fieldNames,opts);})){return this;}if($[O2N](fieldNames)){opts=fieldNames;fieldNames=undefined;show=z3T;}else if(typeof fieldNames===q4X){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[E4X](show)){opts=show;show=z3T;}if(show===undefined){show=z3T;}f5x[i2N]();opts=$[n4T]({},this[u21][e2N][d4X],opts);var editFields=this[v2N](Y4X,cells,fieldNames);this[c4X](cells,editFields,m2N,opts,function(){var f6X="iv class=\"";var z6X="ubbleNodes";var R6X='<div class="DTE_Processing_Indicator"><span></div>';var L6X="chil";var W6X="_preope";var h6X="utto";var a6X='"><div/></div>';var S6X="rap";var w6X='bubble';var K6X="hea";var Z6X="<div class";var A6X="eReg";var C6X='resize.';var V4X="_post";var m6X="_clos";var D6X="_formO";var Q6X="rmInfo";var V6X="click";var y6X="onc";var H6X="rmEr";var p6X="<div class=";var X6X="pointer";var e6X="ani";var i6X="_focu";var j6X="bg";var n2N=n4X;n2N+=f5x.x21;var B2N=V4X;B2N+=O6X;var r2N=i6X;r2N+=u21;var K2N=T7T;K2N+=e6X;K2N+=v6X;K2N+=V21;var u2N=m6X;u2N+=A6X;var d2N=V9T;d2N+=h6X;d2N+=Q21;d2N+=u21;var a2N=n21;a2N+=g6X;a2N+=f5x.f21;a2N+=p0T;var j2N=f5x.S21;j2N+=b5T;j2N+=f5x.p21;var F2N=n7T;F2N+=f5x.x21;F2N+=a6T;F2N+=f5x.S21;var b2N=M1T;b2N+=H6X;b2N+=w9T;var C2N=L6X;C2N+=f5x.S21;C2N+=O7T;C2N+=l6X;var w2N=N6X;w2N+=G5T;w2N+=w7T;w2N+=M6X;var y2N=Z6X;y2N+=H4T;var G2N=s6X;G2N+=x6X;G2N+=i4T;var J2N=s6X;J2N+=x6X;J2N+=i4T;var S2N=m3T;S2N+=N3T;S2N+=r3T;S2N+=i4T;var p2N=b1T;p2N+=b5T;p2N+=u21;p2N+=f5x.x21;var f2N=o6X;f2N+=f6X;var o2N=X4T;o2N+=c5X;o2N+=f5x.x21;var x2N=p6X;x2N+=m3T;var s2N=P7T;s2N+=S6X;s2N+=J6X;var Z2N=Z6X;Z2N+=H4T;var M2N=G6X;M2N+=I9T;var N2N=g9T;N2N+=T21;N2N+=f5x.f21;N2N+=N6X;var l2N=Q5T;l2N+=y6X;l2N+=g9T;var L2N=V9T;L2N+=z6X;var g2N=b5T;g2N+=Q21;var h2N=W6X;h2N+=Q21;var A2N=D6X;A2N+=g1T;A2N+=I4X;var namespace=that[A2N](opts);var ret=that[h2N](w6X);if(!ret){return that;}$(window)[g2N](C6X+namespace,function(){var b6X="bubblePosit";var H2N=b6X;H2N+=I5T;that[H2N]();});var nodes=[];that[u21][L2N]=nodes[l2N][F6X](nodes,_pluck(editFields,N2N));var classes=that[W8T][M2N];var background=$(Z2N+classes[j6X]+a6X);var container=$(g6T+classes[s2N]+x6T+g6T+classes[U6X]+x6T+x2N+classes[o2N]+x6T+f2N+classes[p2N]+S2N+R6X+J2N+G2N+y2N+classes[X6X]+k6X+f6T);if(show){var D2N=V9T;D2N+=b5T;D2N+=X5T;var W2N=d6X;W2N+=R1T;W2N+=Q21;W2N+=a9X;var z2N=V9T;z2N+=u6X;container[P6X](z2N);background[W2N](D2N);}var liner=container[w2N]()[T6X](J81);var table=liner[C2N]();var close=table[m0X]();liner[g2T](that[d6T][b2N]);table[F2N](that[j2N][t5T]);if(opts[a2N]){var R2N=M1T;R2N+=Q6X;var U2N=Q3T;U2N+=f5x.p21;liner[I6X](that[U2N][R2N]);}if(opts[t6X]){var k2N=K6X;k2N+=i0X;k2N+=O7T;var X2N=f5x.S21;X2N+=b5T;X2N+=f5x.p21;liner[I6X](that[X2N][k2N]);}if(opts[d2N]){table[g2T](that[d6T][r6X]);}var pair=$()[A4X](container)[A4X](background);that[u2N](function(submitComplete){that[R1X](pair,{opacity:J81},function(){var E6X="ize.";var q6X="cIn";var n6X="Dynami";var B6X="_clear";if(this===container[J81]){var Q2N=B6X;Q2N+=n6X;Q2N+=q6X;Q2N+=M1T;var T2N=M9T;T2N+=u21;T2N+=E6X;var P2N=b5T;P2N+=f5x.J21;P2N+=f5x.J21;pair[r7X]();$(window)[P2N](T2N+namespace);that[Q2N]();that[Y6X](c6X,[w6X]);}});});background[V6X](function(){var I2N=c9T;I2N+=O7T;that[I2N]();});close[V6X](function(){var t2N=T7T;t2N+=Q5T;t2N+=O8X;t2N+=f5x.x21;that[t2N]();});that[i8X]();that[K2N](pair,{opacity:G81});that[r2N](that[u21][e8X],opts[r8T]);that[B2N](n2N,z3T);});return this;};Editor[q2N][i8X]=function(){var x8X="outerWidth";var M8X="left";var Z8X="right";var H8X='div.DTE_Bubble_Liner';var s8X="bottom";var L8X="bubbleNodes";var v8X="fs";var m8X="rig";var f8X="belo";var g8X="ubble";var h8X="div.DTE_B";var R81=15;var M5z=b5T;M5z+=f5x.J21;M5z+=v8X;M5z+=f4X;var N5z=S5X;N5z+=u21;var l5z=f5x.L21;l5z+=f5x.l21;var L5z=b1T;L5z+=f5x.f21;L5z+=g6X;L5z+=v5T;var H5z=m8X;H5z+=P5X;var g5z=j9T;g5z+=f5x.J21;g5z+=T21;var h5z=w7T;h5z+=A8X;h5z+=T21;h5z+=e7T;var A5z=j9T;A5z+=o8T;var m5z=T21;m5z+=b5T;m5z+=g1T;var Y2N=f5x.x21;Y2N+=f5x.f21;Y2N+=Q5T;Y2N+=e7T;var E2N=h8X;E2N+=g8X;var wrapper=$(E2N),liner=$(H8X),nodes=this[u21][L8X];var position={top:J81,left:J81,right:J81,bottom:J81};$[Y2N](nodes,function(i,node){var N8X="offsetWid";var l8X="offsetHeig";var v5z=l8X;v5z+=P5X;var e5z=N8X;e5z+=p3T;var i5z=w7T;i5z+=f5x.x21;i5z+=z4X;var O5z=T21;O5z+=b5T;O5z+=g1T;var V2N=T21;V2N+=s9T;var c2N=I0T;c2N+=f5x.x21;c2N+=T21;var pos=$(node)[h3X]();node=$(node)[c2N](J81);position[V2N]+=pos[O5z];f5x[O3T]();position[M8X]+=pos[i5z];position[Z8X]+=pos[M8X]+node[e5z];position[s8X]+=pos[A3X]+node[v5z];});position[m5z]/=nodes[G3T];position[M8X]/=nodes[A5z];position[Z8X]/=nodes[h5z];position[s8X]/=nodes[G3T];var top=position[A3X],left=(position[g5z]+position[H5z])/y81,width=liner[x8X](),visLeft=left-width/y81,visRight=visLeft+width,docWidth=$(window)[v3X](),padding=R81,classes=this[L5z][d4X];f5x[l5z]();wrapper[N5z]({top:top,left:left});if(liner[G3T]&&liner[M5z]()[A3X]<J81){var s5z=V9T;s5z+=f5x.x21;s5z+=u2T;s5z+=P7T;var Z5z=Q5T;Z5z+=g6X;wrapper[Z5z](o8X,position[s8X])[F1X](s5z);}else{var x5z=f8X;x5z+=P7T;wrapper[k9X](x5z);}if(visRight+padding>docWidth){var o5z=Q5T;o5z+=u21;o5z+=u21;var diff=visRight-docWidth;liner[o5z](p8X,visLeft<padding?-(visLeft-padding):-(diff+padding));}else{var p5z=j9T;p5z+=f5x.J21;p5z+=T21;var f5z=Q5T;f5z+=u21;f5z+=u21;liner[f5z](p5z,visLeft<padding?-(visLeft-padding):J81);}return this;};Editor[g7X][S5z]=function(buttons){var S8X="eac";var W5z=S8X;W5z+=e7T;var z5z=f5x.x21;z5z+=f5x.p21;z5z+=J8X;var that=this;if(buttons===G8X){var G5z=i0T;G5z+=T21;var J5z=y8X;J5z+=G5T;J5z+=T6T;buttons=[{text:this[I4T][this[u21][J5z]][G5z],action:function(){var z8X="mit";var y5z=u21;y5z+=V5T;y5z+=V9T;y5z+=z8X;this[y5z]();}}];}else if(!$[h5X](buttons)){buttons=[buttons];}$(this[d6T][r6X])[z5z]();$[W5z](buttons,function(i,btn){var D8X="eypress";var R8X='<button/>';var k8X='tabindex';var b8X="Name";var w8X="tabInde";var C8X="assNam";var d8X="tabIndex";var t5z=s7X;t5z+=u21;var I5z=f5x.S21;I5z+=b5T;I5z+=f5x.p21;var P5z=Q5T;P5z+=w7T;P5z+=W8X;P5z+=E5X;var d5z=E5X;d5z+=D8X;var k5z=b5T;k5z+=Q21;var X5z=w8X;X5z+=P21;var R5z=g8T;R5z+=Q21;var U5z=e7T;U5z+=T21;U5z+=m2T;var a5z=Q5T;a5z+=w7T;a5z+=C8X;a5z+=f5x.x21;var j5z=N8T;j5z+=b8X;var F5z=F8X;F5z+=t9T;F5z+=Q21;var b5z=N8T;b5z+=v5T;var C5z=f5x.J21;C5z+=Q21;var D5z=u21;D5z+=T21;D5z+=j8X;if(typeof btn===D5z){btn={text:btn,action:function(){var w5z=e1T;w5z+=v1T;w5z+=G5T;w5z+=T21;f5x[O3T]();this[w5z]();}};}var text=btn[a8X]||btn[M6T];var action=btn[U8X]||btn[C5z];$(R8X,{'class':that[b5z][t5T][F5z]+(btn[j5z]?L6T+btn[a5z]:K0T)})[U5z](typeof text===R5z?text(that):text||K0T)[X8X](k8X,btn[d8X]!==undefined?btn[X5z]:J81)[T6T](u8X,function(e){if(e[P8X]===a81&&action){action[m8T](that);}})[k5z](d5z,function(e){var Q8X="Default";var T8X="revent";f5x[f5x.z21]();if(e[P8X]===a81){var u5z=g1T;u5z+=T8X;u5z+=Q8X;e[u5z]();}})[T6T](P5z,function(e){var t8X="ntD";var T5z=I8X;T5z+=t8X;T5z+=t7T;T5z+=c8T;e[T5z]();f5x[O3T]();if(action){var Q5z=Q5T;Q5z+=f5x.f21;Q5z+=K8X;action[Q5z](that,e);}})[P6X](that[I5z][t5z]);});return this;};Editor[K5z][r5z]=function(fieldName){var n8X="nclud";var V8X="plice";var O2X="cludeFi";var i2X="elds";var r8X="ri";var q8X="eFields";var E8X="inAr";var B5z=L7X;B5z+=r8X;B5z+=B8X;var that=this;var fields=this[u21][J4X];if(typeof fieldName===B5z){var V5z=G5T;V5z+=n8X;V5z+=q8X;var c5z=E8X;c5z+=O7T;c5z+=f5x.f21;c5z+=o7T;var Y5z=Y8X;Y5z+=f5x.x21;var E5z=x5T;E5z+=f5x.S21;E5z+=f5x.x21;E5z+=O7T;var q5z=e4X;q5z+=d5T;var n5z=F9T;n5z+=f5x.x21;n5z+=w7T;n5z+=f5x.S21;that[n5z](fieldName)[c8X]();delete fields[fieldName];var orderIdx=$[W4X](fieldName,this[u21][q5z]);this[u21][E5z][Y5z](orderIdx,G81);var includeIdx=$[c5z](fieldName,this[u21][V5z]);if(includeIdx!==-G81){var i7z=u21;i7z+=V8X;var O7z=G5T;O7z+=Q21;O7z+=O2X;O7z+=i2X;this[u21][O7z][i7z](includeIdx,G81);}}else{var e7z=R7T;e7z+=N6X;$[e7z](this[e2X](fieldName),function(i,name){var m7z=Q5T;m7z+=q9T;var v7z=f5x.L21;v7z+=f5x.l21;f5x[v7z]();that[m7z](name);});}return this;};Editor[g7X][A7z]=function(){this[v2X](y3T);return this;};Editor[h7z][g7z]=function(arg1,arg2,arg3,arg4){var H2X="mod";var N2X="mai";var M2X="_c";var S2X='initCreate';var Z2X="rud";var A2X="_actionCl";var S7z=T7T;S7z+=f5x.x21;S7z+=m2X;S7z+=U5T;var f7z=R7T;f7z+=N6X;var o7z=A2X;o7z+=U8T;var x7z=h2X;x7z+=w7T;x7z+=f5x.f21;x7z+=o7T;var s7z=L7X;s7z+=o7T;s7z+=w7T;s7z+=f5x.x21;var Z7z=f5x.J21;Z7z+=b5T;Z7z+=g2X;var M7z=H2X;M7z+=G5T;M7z+=f5x.J21;M7z+=L2X;var N7z=l2X;N7z+=n9T;var l7z=N2X;l7z+=Q21;var L7z=f5x.p21;L7z+=b5T;L7z+=f5x.S21;L7z+=f5x.x21;var H7z=M2X;H7z+=Z2X;H7z+=s2X;H7z+=w1T;var that=this;var fields=this[u21][J4X];var count=G81;if(this[B4X](function(){that[x2X](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1===o2X){count=arg1;arg1=arg2;arg2=arg3;}this[u21][f2X]={};for(var i=J81;i<count;i++){this[u21][f2X][i]={fields:this[u21][J4X]};}var argOpts=this[H7z](arg1,arg2,arg3,arg4);this[u21][L7z]=l7z;this[u21][U8X]=N7z;this[u21][M7z]=j6T;this[d6T][Z7z][s7z][x7z]=T5X;this[o7z]();this[C4X](this[J4X]());$[f7z](fields,function(name,field){var p7z=i0X;p7z+=f5x.J21;field[x4X]();for(var i=J81;i<count;i++){field[p2X](i,field[P4T]());}field[G5X](field[p7z]());});this[S7z](S2X,j6T,function(){var J2X="maybeO";var G7z=J2X;G7z+=g1T;G7z+=l6X;var J7z=b5T;J7z+=g1T;J7z+=T21;J7z+=u21;that[G2X]();that[y2X](argOpts[J7z]);argOpts[G7z]();});return this;};f5x[y7z]();Editor[g7X][z7z]=function(parent){var D2X="undepen";var b7z=z2X;b7z+=f5x.x21;b7z+=i0X;b7z+=g1T;var C7z=W2X;C7z+=f5x.J21;var W7z=v0T;W7z+=v4X;W7z+=o7T;if($[W7z](parent)){var D7z=j9T;D7z+=B8X;D7z+=T21;D7z+=e7T;for(var i=J81,ien=parent[D7z];i<ien;i++){var w7z=D2X;w7z+=i0X;w7z+=U5T;this[w7z](parent[i]);}return this;}var field=this[M4X](parent);$(field[Y3X]())[C7z](b7z);return this;};Editor[F7z][w2X]=function(parent,url,opts){var n2X='.edep';var b2X="so";var j2X="dep";var C2X="eve";var Z1z=B9T;Z1z+=f5x.l21;var E7z=C2X;E7z+=Q21;E7z+=T21;var R7z=f5x.x21;R7z+=Q4T;R7z+=f5x.x21;R7z+=i5T;var U7z=f5x.s21;U7z+=b2X;U7z+=Q21;var a7z=f5x.J21;a7z+=F2X;a7z+=f5x.S21;if($[h5X](parent)){for(var i=J81,ien=parent[G3T];i<ien;i++){var j7z=j2X;j7z+=n5T;j7z+=f5x.x21;j7z+=U5T;this[j7z](parent[i],url,opts);}return this;}var that=this;var field=this[a7z](parent);var ajaxOpts={type:a2X,dataType:U7z};opts=$[R7z]({event:U2X,data:j6T,preUpdate:j6T,postUpdate:j6T},opts);var update=function(json){var Q2X='error';var d2X="reUp";var I2X='enable';var P2X='update';var T2X='message';var k2X="preUpda";var K2X="postUpdate";var R2X="essin";var r2X="post";var B2X="Up";var q7z=c7T;q7z+=Q5T;q7z+=R2X;q7z+=I0T;var r7z=X2X;r7z+=w7T;r7z+=f5x.x21;var K7z=u21;K7z+=e7T;K7z+=b5T;K7z+=P7T;var t7z=e7T;t7z+=q4T;t7z+=f5x.x21;var P7z=E6T;P7z+=f5x.f21;P7z+=w7T;var u7z=W4T;u7z+=b7T;var d7z=f5x.x21;d7z+=f5x.f21;d7z+=Q5T;d7z+=e7T;var X7z=k2X;X7z+=V21;if(opts[X7z]){var k7z=g1T;k7z+=d2X;k7z+=u2X;opts[k7z](json);}$[d7z]({labels:u7z,options:P2X,values:P7z,messages:T2X,errors:Q2X},function(jsonProp,fieldFn){var T7z=f5x.L21;T7z+=f5x.l21;f5x[T7z]();if(json[jsonProp]){var Q7z=R7T;Q7z+=Q5T;Q7z+=e7T;$[Q7z](json[jsonProp],function(field,val){var I7z=B9T;I7z+=f5x.l21;f5x[I7z]();that[M4X](field)[fieldFn](val);});}});$[X2T]([t7z,K7z,I2X,r7z],function(i,key){var t2X="animat";f5x[O3T]();if(json[key]){var B7z=t2X;B7z+=f5x.x21;that[key](json[key],json[B7z]);}});if(opts[K2X]){var n7z=r2X;n7z+=B2X;n7z+=f5x.S21;n7z+=M5T;opts[n7z](json);}field[q7z](y3T);};$(field[Y3X]())[T6T](opts[E7z]+n2X,function(e){var V2X="targ";var h5B="the";var H5B="nObject";var m5B="values";var v5B='data';var Y2X="cessi";var g5B="isPlai";var A1z=q2X;A1z+=I5T;var e1z=f5x.S21;e1z+=E2X;var i1z=q3X;i1z+=u21;var O1z=c7T;O1z+=Y2X;O1z+=Q21;O1z+=I0T;var V7z=w7T;V7z+=f5x.x21;V7z+=c2X;V7z+=e7T;var c7z=V2X;c7z+=f5x.x21;c7z+=T21;var Y7z=Q21;Y7z+=O5B;if($(field[Y7z]())[i5B](e[c7z])[V7z]===J81){return;}field[O1z](z3T);var data={};data[e5B]=that[u21][f2X]?_pluck(that[u21][f2X],v5B):j6T;data[q3X]=data[i1z]?data[e5B][J81]:j6T;data[m5B]=that[S2T]();if(opts[e1z]){var v1z=f5x.S21;v1z+=f5x.f21;v1z+=X4T;var ret=opts[v1z](data);if(ret){var m1z=A5B;m1z+=f5x.f21;opts[m1z]=ret;}}if(typeof url===A1z){var o=url[m8T](that,field[S2T](),data,update);if(o){var g1z=T21;g1z+=e7T;g1z+=f5x.x21;g1z+=Q21;var h1z=f5x.Z21;h1z+=f5x.s21;h1z+=f5x.x21;h1z+=f5x.o21;if(typeof o===h1z&&typeof o[g1z]===V6T){var H1z=h5B;H1z+=Q21;o[H1z](function(resolved){if(resolved){update(resolved);}});}else{update(o);}}}else{var M1z=I3T;M1z+=q9X;M1z+=f5x.S21;var N1z=f5x.f21;N1z+=f5x.s21;N1z+=f5x.f21;N1z+=P21;var L1z=g5B;L1z+=H5B;if($[L1z](url)){var l1z=E5T;l1z+=i5T;$[l1z](ajaxOpts,url);}else{ajaxOpts[L5B]=url;}$[N1z]($[M1z](ajaxOpts,{url:url,data:data,success:update}));}});f5x[Z1z]();return this;};Editor[s1z][c8X]=function(){var o5B='.dte';var s5B="laye";var Z5B="sp";var l5B="ique";var G1z=V5T;G1z+=Q21;G1z+=l5B;var J1z=i0X;J1z+=N5B;J1z+=b5T;J1z+=o7T;var p1z=b1T;p1z+=f5x.x21;p1z+=M5B;var o1z=k9T;o1z+=Z5B;o1z+=s5B;o1z+=f5x.S21;var x1z=B9T;x1z+=f5x.l21;f5x[x1z]();if(this[u21][o1z]){var f1z=b1T;f1z+=b5T;f1z+=l9T;this[f1z]();}this[p1z]();if(this[u21][x5B]){var S1z=d6X;S1z+=R1T;S1z+=Q21;S1z+=f5x.S21;$(J8T)[S1z](this[u21][x5B]);}var controller=this[u21][X7X];if(controller[J1z]){controller[c8X](this);}$(document)[N3X](o5B+this[u21][G1z]);this[d6T]=j6T;this[u21]=j6T;};Editor[y1z][z1z]=function(name){var p5B="dNa";var f5B="_fie";var D1z=f5B;D1z+=w7T;D1z+=p5B;D1z+=S5B;var W1z=f5x.x21;W1z+=f5x.f21;W1z+=Q5T;W1z+=e7T;var that=this;$[W1z](this[D1z](name),function(i,n){var w1z=f5x.L21;w1z+=f5x.l21;f5x[w1z]();that[M4X](n)[J5B]();});return this;};Editor[C1z][b1z]=function(show){var z5B='open';var F1z=Q5T;F1z+=G5B;if(show===undefined){return this[u21][y5B];}return this[show?z5B:F1z]();};Editor[g7X][j1z]=function(){var U1z=f5x.J21;U1z+=s4X;var a1z=f5x.p21;a1z+=f5x.f21;a1z+=g1T;f5x[O3T]();return $[a1z](this[u21][U1z],function(field,name){var R1z=k9T;R1z+=L0X;R1z+=W5B;R1z+=f5x.S21;return field[R1z]()?name:j6T;});};Editor[X1z][D5B]=function(){var d1z=Q21;d1z+=O5B;var k1z=B9T;k1z+=f5x.l21;f5x[k1z]();return this[u21][X7X][d1z](this);};Editor[g7X][u1z]=function(items,arg1,arg2,arg3,arg4){var w5B="_crudA";var Q1z=a21;Q1z+=Z0T;Q1z+=u21;var T1z=w5B;T1z+=C5B;T1z+=u21;var that=this;if(this[B4X](function(){var P1z=B9T;P1z+=f5x.l21;f5x[P1z]();that[b5B](items,arg1,arg2,arg3,arg4);})){return this;}f5x[O3T]();var argOpts=this[T1z](arg1,arg2,arg3,arg4);this[c4X](items,this[l4X](Q1z,items),F5B,argOpts[B6T],function(){var R5B="semble";var U5B="_as";var X5B="Mai";var a5B="eOp";var K1z=j5B;K1z+=V9T;K1z+=a5B;K1z+=l6X;var t1z=T7T;t1z+=x7X;var I1z=U5B;I1z+=R5B;I1z+=X5B;I1z+=Q21;that[I1z]();f5x[O3T]();that[t1z](argOpts[B6T]);argOpts[K1z]();});return this;};Editor[g7X][r1z]=function(name){var k5B="ldNames";var B1z=T7T;B1z+=a21;B1z+=k5B;var that=this;$[X2T](this[B1z](name),function(i,n){var d5B="enable";var n1z=F9T;n1z+=b7T;n1z+=f5x.S21;f5x[f5x.z21]();that[n1z](n)[d5B]();});return this;};Editor[g7X][q1z]=function(name,msg){if(msg===undefined){this[u5B](this[d6T][P5B],name);this[u21][T5B]=name;}else{this[M4X](name)[k8T](msg);}return this;};Editor[E1z][Y1z]=function(name){var Q5B='Unknown field name - ';var c1z=F9T;c1z+=d21;c1z+=u21;var fields=this[u21][c1z];if(!fields[name]){throw Q5B+name;}return fields[name];};Editor[V1z][O9z]=function(){var i9z=B9T;i9z+=f5x.l21;f5x[i9z]();return $[I5B](this[u21][J4X],function(field,name){return name;});};Editor[g7X][e9z]=_api_file;Editor[v9z][m9z]=_api_files;Editor[A9z][J5X]=function(name){var l9z=p0T;l9z+=T21;var L9z=f5x.J21;L9z+=J9T;L9z+=Z0T;var H9z=f5x.L21;H9z+=f5x.l21;var that=this;if(!name){name=this[J4X]();}if($[h5X](name)){var out={};$[X2T](name,function(i,n){var g9z=f5x.J21;g9z+=t5B;var h9z=B9T;h9z+=f5x.l21;f5x[h9z]();out[n]=that[g9z](n)[J5X]();});return out;}f5x[H9z]();return this[L9z](name)[l9z]();};Editor[N9z][K5B]=function(names,animate){var M9z=f5x.x21;M9z+=r5B;var that=this;$[M9z](this[e2X](names),function(i,n){var s9z=F9T;s9z+=d21;var Z9z=f5x.L21;Z9z+=f5x.l21;f5x[Z9z]();that[s9z](n)[K5B](animate);});return this;};Editor[g7X][B5B]=function(includeHash){var o9z=u9T;o9z+=G5T;o9z+=n5B;o9z+=a9T;var x9z=f5x.p21;x9z+=f5x.f21;x9z+=g1T;f5x[O3T]();return $[x9z](this[u21][o9z],function(edit,idSrc){var f9z=B9T;f9z+=f5x.l21;f5x[f9z]();return includeHash===z3T?q5B+idSrc:idSrc;});};Editor[p9z][S9z]=function(inNames){var Y5B="ormErr";var E5B="_fieldN";var y9z=E5B;y9z+=f5x.f21;y9z+=n21;y9z+=u21;var G9z=f5x.J21;G9z+=Y5B;G9z+=x5T;var J9z=f5x.S21;J9z+=b5T;J9z+=f5x.p21;var formError=$(this[J9z][G9z]);if(this[u21][T5B]){return z3T;}var names=this[y9z](inNames);for(var i=J81,ien=names[G3T];i<ien;i++){var z9z=c5B;z9z+=f5x.S21;if(this[z9z](names[i])[V5B]()){return z3T;}}f5x[O3T]();return y3T;};Editor[g7X][W9z]=function(cell,fieldName,opts){var m7B="aS";var e7B="_ti";var g7B="inline";var v7B="asse";var s7B='div.DTE_Field';var O7B="nli";var X9z=G5T;X9z+=O7B;X9z+=Q21;X9z+=f5x.x21;var R9z=i7B;R9z+=f5x.S21;R9z+=G5T;R9z+=T21;var U9z=e7B;U9z+=X5T;var a9z=w7T;a9z+=l6X;a9z+=f2T;var C9z=b1T;C9z+=v7B;C9z+=u21;var w9z=z1X;w9z+=g9T;w9z+=m7B;w9z+=A7B;var D9z=t5T;D9z+=Q4X;D9z+=T21;D9z+=h7B;var that=this;if($[E4X](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[n4T]({},this[u21][D9z][g7B],opts);var editFields=this[w9z](Y4X,cell,fieldName);var node,field;var countOuter=J81,countInner;var closed=y3T;var classes=this[C9z][g7B];$[X2T](editFields,function(i,editField){var H7B='Cannot edit more than one row inline at a time';var F9z=B9T;F9z+=f5x.l21;var b9z=g9T;b9z+=T21;b9z+=r5B;if(countOuter>J81){throw H7B;}node=$(editField[b9z][J81]);f5x[F9z]();countInner=J81;$[X2T](editField[L7B],function(j,f){var Z7B="e at a time";var M7B="field inlin";var N7B="ot edit more than one ";var l7B="Cann";if(countInner>J81){var j9z=l7B;j9z+=N7B;j9z+=M7B;j9z+=Z7B;throw j9z;}field=f;countInner++;});countOuter++;;});if($(s7B,node)[a9z]){return this;}if(this[U9z](function(){f5x[f5x.z21]();that[g7B](cell,fieldName,opts);})){return this;}this[R9z](cell,editFields,X9z,opts,function(){var x7B="focu";var d7B="tac";var a7B="=\"width:";var C7B="<div class=\"";var j7B="\" styl";var p7B="rmError";var S7B="ppen";var U7B="line";var P7B='px">';var z7B="tons";var q7B="lic";var F7B="cessing_Indicator\"><span/></div>";var u7B="ontents";var b7B="DTE_Pr";var G0z=T7T;G0z+=x7B;G0z+=u21;var v0z=o7B;v0z+=f7B;var e0z=f5x.J21;e0z+=b5T;e0z+=p7B;var i0z=Q3T;i0z+=f5x.p21;var O0z=f5x.f21;O0z+=S7B;O0z+=f5x.S21;var V9z=Q21;V9z+=b5T;V9z+=f5x.S21;V9z+=f5x.x21;var c9z=F9T;c9z+=i5T;var Y9z=J7B;Y9z+=f5x.S21;Y9z+=G7B;var E9z=m3T;E9z+=y7B;var q9z=E9T;q9z+=T21;q9z+=z7B;var n9z=e4T;n9z+=E6T;n9z+=W7B;n9z+=D7B;var B9z=M4T;B9z+=w7B;B9z+=x6X;B9z+=i4T;var r9z=C7B;r9z+=b7B;r9z+=b5T;r9z+=F7B;var K9z=j7B;K9z+=f5x.x21;K9z+=a7B;var t9z=U7B;t9z+=O7T;var I9z=M4T;I9z+=R7B;var Q9z=X7B;Q9z+=J6X;var T9z=d6X;T9z+=k7B;var P9z=f5x.S21;P9z+=f5x.x21;P9z+=d7B;P9z+=e7T;var u9z=Q5T;u9z+=u7B;var d9z=G5T;d9z+=W9T;d9z+=f5x.x21;var k9z=T7T;k9z+=n7T;k9z+=f5x.x21;k9z+=O6X;var namespace=that[y2X](opts);var ret=that[k9z](d9z);if(!ret){return that;}var children=node[u9z]()[P9z]();node[T9z]($(g6T+classes[Q9z]+x6T+I9z+classes[t9z]+K9z+node[v3X]()+P7B+r9z+B9z+n9z+classes[q9z]+E9z+Y9z));node[c9z](T7B+classes[U6X][Y2T](/ /g,Q7B))[g2T](field[V9z]())[O0z](that[i0z][e0z]);if(opts[v0z]){var g0z=F8X;g0z+=I7B;g0z+=u21;var h0z=f5x.S21;h0z+=b5T;h0z+=f5x.p21;var A0z=d6X;A0z+=k7B;var m0z=f5x.J21;m0z+=G5T;m0z+=Q21;m0z+=f5x.S21;node[m0z](T7B+classes[r6X][Y2T](/ /g,Q7B))[A0z](that[h0z][g0z]);}that[t7B](function(submitComplete,action){var K7B="nl";var Y7B="contents";var B7B="_clearD";var n7B="ynamic";var Z0z=G5T;Z0z+=K7B;Z0z+=r7B;var M0z=B7B;M0z+=n7B;M0z+=I5X;var l0z=f5x.x21;l0z+=f5x.S21;l0z+=G5T;l0z+=T21;var L0z=Q5T;L0z+=q7B;L0z+=E5X;var H0z=b5T;H0z+=E7B;closed=z3T;f5x[f5x.z21]();$(document)[H0z](L0z+namespace);if(!submitComplete||action!==l0z){var N0z=f5x.S21;N0z+=f4X;N0z+=r5B;node[Y7B]()[N0z]();node[g2T](children);}that[M0z]();return Z0z;;});setTimeout(function(){var s0z=Q5T;s0z+=q7B;s0z+=E5X;if(closed){return;}f5x[f5x.z21]();$(document)[T6T](s0z+namespace,function(e){var h1B='owns';var i1B="dd";var m1B="ack";var V7B="nArr";var v1B="dB";var S0z=c7B;S0z+=U5T;S0z+=u21;var p0z=G5T;p0z+=V7B;p0z+=O1B;var f0z=f5x.L21;f0z+=f5x.l21;var o0z=f5x.f21;o0z+=i1B;o0z+=e1B;var x0z=j0X;x0z+=v1B;x0z+=m1B;var back=$[B0T][x0z]?o0z:A1B;f5x[f0z]();if(!field[b6T](h1B,e[Q1X])&&$[p0z](node[J81],$(e[Q1X])[S0z]()[back]())===-G81){var J0z=V9T;J0z+=w7T;J0z+=V5T;J0z+=O7T;that[J0z]();}});},J81);that[G0z]([field],opts[r8T]);that[g1B](H1B,z3T);});return this;};Editor[y0z][z0z]=function(name,msg){var L1B="mIn";if(msg===undefined){var W0z=T4X;W0z+=L1B;W0z+=M1T;this[u5B](this[d6T][W0z],name);}else{var D0z=f5x.p21;D0z+=l1B;D0z+=z9T;this[M4X](name)[D0z](msg);}f5x[f5x.z21]();return this;};Editor[w0z][C0z]=function(mode){var M1B='Not currently in an editing mode';var o1B="not supported";var Z1B="Chang";var s1B="ing from create mode i";var x1B="s ";var R0z=f5x.f21;R0z+=Q5T;R0z+=T21;R0z+=I5T;var a0z=l2X;a0z+=n9T;var j0z=Q5T;j0z+=N1B;j0z+=V21;var F0z=f5x.f21;F0z+=f5x.o21;F0z+=G5T;F0z+=T6T;var b0z=y8X;b0z+=G5T;b0z+=b5T;b0z+=Q21;if(!mode){return this[u21][U8X];}if(!this[u21][b0z]){throw new Error(M1B);}else if(this[u21][F0z]===j0z&&mode!==a0z){var U0z=Z1B;U0z+=s1B;U0z+=x1B;U0z+=o1B;throw new Error(U0z);}this[u21][R0z]=mode;return this;};Editor[g7X][X0z]=function(){var f1B="dif";var k0z=h0T;k0z+=f1B;k0z+=J9T;k0z+=O7T;return this[u21][k0z];};Editor[d0z][p1B]=function(fieldNames){var S1B="Get";var I0z=f5x.p21;I0z+=c8T;I0z+=G5T;I0z+=S1B;var Q0z=f5x.J21;Q0z+=F2X;Q0z+=f5x.S21;var that=this;if(fieldNames===undefined){var u0z=F9T;u0z+=d21;u0z+=u21;fieldNames=this[u0z]();}if($[h5X](fieldNames)){var P0z=R7T;P0z+=Q5T;P0z+=e7T;var out={};$[P0z](fieldNames,function(i,name){var G1B="iGet";var J1B="mult";var T0z=J1B;T0z+=G1B;out[name]=that[M4X](name)[T0z]();});return out;}return this[Q0z](fieldNames)[I0z]();};Editor[g7X][t0z]=function(fieldNames,val){var y1B="Set";var that=this;if($[E4X](fieldNames)&&val===undefined){$[X2T](fieldNames,function(name,value){var K0z=f5x.J21;K0z+=F2X;K0z+=f5x.S21;that[K0z](name)[p2X](value);});}else{var B0z=f5x.p21;B0z+=U3T;B0z+=y1B;var r0z=F9T;r0z+=d21;this[r0z](fieldNames)[B0z](val);}return this;};Editor[g7X][Y3X]=function(name){var E0z=z1B;E0z+=f5x.x21;var q0z=c5B;q0z+=f5x.S21;var that=this;if(!name){name=this[D4X]();}f5x[f5x.z21]();return $[h5X](name)?$[I5B](name,function(n){var n0z=f5x.J21;n0z+=J9T;n0z+=w7T;n0z+=f5x.S21;f5x[O3T]();return that[n0z](n)[Y3X]();}):this[q0z](name)[E0z]();};Editor[g7X][N3X]=function(name,fn){f5x[f5x.z21]();$(this)[N3X](this[W1B](name),fn);return this;};Editor[Y0z][c0z]=function(name,fn){$(this)[T6T](this[W1B](name),fn);return this;};Editor[V0z][O3z]=function(name,fn){var w1B="tName";var D1B="_even";var e3z=D1B;e3z+=w1B;var i3z=b5T;i3z+=Q21;i3z+=f5x.x21;$(this)[i3z](this[e3z](name),fn);return this;};Editor[v3z][m3z]=function(){var b1B="lle";var F1B="_preop";var C1B="displayCont";var j1B="Re";var N3z=C1B;N3z+=n1T;N3z+=b1B;N3z+=O7T;var l3z=f5x.p21;l3z+=f5x.f21;l3z+=z4T;var L3z=F1B;L3z+=l6X;var A3z=v2X;A3z+=j1B;A3z+=I0T;var that=this;this[C4X]();this[A3z](function(){that[u21][X7X][P1X](that,function(){var U1B="_clearDynamicInfo";var H3z=f5x.p21;H3z+=f5x.f21;H3z+=G5T;H3z+=Q21;var g3z=b1T;g3z+=F1T;g3z+=u9T;var h3z=T7T;h3z+=a1B;h3z+=l6X;h3z+=T21;that[U1B]();that[h3z](g3z,[H3z]);});});var ret=this[L3z](l3z);if(!ret){return this;}this[u21][N3z][O6X](this,this[d6T][H6T],function(){var X1B="ocu";var x3z=s9T;x3z+=f5x.x21;x3z+=Q21;x3z+=u9T;var s3z=T7T;s3z+=R1B;var Z3z=f5x.J21;Z3z+=X1B;Z3z+=u21;that[k1B]($[I5B](that[u21][D4X],function(name){var M3z=B9T;M3z+=f5x.l21;f5x[M3z]();return that[u21][J4X][name];}),that[u21][d1B][Z3z]);that[s3z](x3z,[F5B,that[u21][U8X]]);});this[g1B](F5B,y3T);return this;};Editor[g7X][D4X]=function(set){var P1B="Reorder";var T1B="slic";var B1B="lds, and no additional fields, must be provided for ordering.";var I1B="sort";var u1B="_display";var r1B="All fie";var G3z=u1B;G3z+=P1B;var S3z=T1B;S3z+=f5x.x21;var o3z=j9T;o3z+=o8T;if(!set){return this[u21][D4X];}if(arguments[o3z]&&!$[h5X](set)){var p3z=Q1B;p3z+=w7T;p3z+=w7T;var f3z=g1T;f3z+=n1T;f3z+=C1T;f3z+=R1T;set=Array[f3z][H7X][p3z](arguments);}if(this[u21][D4X][S3z]()[I1B]()[t1B](K1B)!==set[H7X]()[I1B]()[t1B](K1B)){var J3z=r1B;J3z+=B1B;throw J3z;}$[n4T](this[u21][D4X],set);this[G3z]();return this;};Editor[y3z][z3z]=function(items,arg1,arg2,arg3,arg4){var q1B="ditFields";var i9B='initRemove';var V1B='fields';var c1B="_crudArgs";var j3z=f5x.S21;j3z+=f5x.f21;j3z+=T21;j3z+=f5x.f21;var F3z=T7T;F3z+=n1B;F3z+=T21;var b3z=T4X;b3z+=f5x.p21;var C3z=f5x.x21;C3z+=q1B;var w3z=f5x.L21;w3z+=f5x.l21;var D3z=E1B;D3z+=Y1B;var W3z=i8T;W3z+=G5T;W3z+=f5x.S21;W3z+=o7T;var that=this;if(this[W3z](function(){that[W5X](items,arg1,arg2,arg3,arg4);})){return this;}if(items[G3T]===undefined){items=[items];}var argOpts=this[c1B](arg1,arg2,arg3,arg4);var editFields=this[D3z](V1B,items);f5x[w3z]();this[u21][U8X]=W5X;this[u21][E3X]=items;this[u21][C3z]=editFields;this[d6T][b3z][S0X][e2T]=T2T;this[O9B]();this[F3z](i9B,[_pluck(editFields,e9B),_pluck(editFields,j3z),items],function(){var m9B="tMultiRemo";var U3z=v9B;U3z+=m9B;U3z+=E6T;U3z+=f5x.x21;var a3z=i7B;a3z+=E6T;a3z+=l6X;a3z+=T21;f5x[f5x.z21]();that[a3z](U3z,[editFields,items],function(){var h9B="_formOp";var A9B="editOp";var d3z=f5x.J21;d3z+=b5T;d3z+=q6T;d3z+=u21;var k3z=A9B;k3z+=h8T;var X3z=j5B;X3z+=L2T;X3z+=Q4X;X3z+=l6X;var R3z=h9B;R3z+=I4X;that[G2X]();that[R3z](argOpts[B6T]);argOpts[X3z]();f5x[f5x.z21]();var opts=that[u21][k3z];if(opts[d3z]!==j6T){var P3z=f5x.S21;P3z+=b5T;P3z+=f5x.p21;var u3z=F8X;u3z+=t9T;u3z+=Q21;$(u3z,that[P3z][r6X])[T6X](opts[r8T])[r8T]();}});});return this;};Editor[T3z][Q3z]=function(set,val){var t3z=f5x.x21;t3z+=f5x.f21;t3z+=Q5T;t3z+=e7T;var I3z=w2T;I3z+=C2T;var that=this;if(!$[I3z](set)){var o={};o[set]=val;set=o;}$[t3z](set,function(n,v){var K3z=f5x.J21;K3z+=J9T;K3z+=Z0T;that[K3z](n)[G5X](v);});return this;};Editor[r3z][B3z]=function(names,animate){var g9B="_fi";var H9B="dNames";var E3z=g9B;E3z+=b7T;E3z+=H9B;var q3z=R7T;q3z+=Q5T;q3z+=e7T;var n3z=f5x.L21;n3z+=f5x.l21;f5x[n3z]();var that=this;$[q3z](this[E3z](names),function(i,n){var Y3z=a21;Y3z+=w7T;Y3z+=f5x.S21;that[Y3z](n)[c9X](animate);});return this;};Editor[c3z][V3z]=function(successCallback,errorCallback,formatdata,hide){var A4z=f5x.x21;A4z+=f5x.f21;A4z+=N6X;var O4z=g3T;O4z+=o4T;O4z+=b5T;O4z+=Q21;var that=this,fields=this[u21][J4X],errorFields=[],errorReady=J81,sent=y3T;if(this[u21][L9B]||!this[u21][O4z]){return this;}this[l9B](z3T);var send=function(){var M9B="initS";var m4z=N9B;m4z+=b5T;m4z+=Q21;var v4z=M9B;v4z+=H9T;var e4z=Z9B;e4z+=l6X;e4z+=T21;var i4z=f5x.L21;i4z+=f5x.l21;if(errorFields[G3T]!==errorReady||sent){return;}f5x[i4z]();that[e4z](v4z,[that[u21][m4z]],function(result){var s9B="_submit";if(result===y3T){that[l9B](y3T);return;}f5x[O3T]();sent=z3T;that[s9B](successCallback,errorCallback,formatdata,hide);});};this[k8T]();$[A4z](fields,function(name,field){f5x[f5x.z21]();if(field[V5B]()){var h4z=g1T;h4z+=x9B;h4z+=e7T;errorFields[h4z](name);}});$[X2T](errorFields,function(i,name){f5x[f5x.z21]();fields[name][k8T](K0T,function(){var g4z=f5x.L21;g4z+=f5x.l21;errorReady++;f5x[g4z]();send();});});send();return this;};Editor[g7X][H4z]=function(set){var o9B="plate";var L4z=T21;L4z+=f5x.x21;L4z+=f5x.p21;L4z+=o9B;if(set===undefined){return this[u21][x5B];}f5x[O3T]();this[u21][L4z]=set===j6T?j6T:$(set);return this;};Editor[l4z][t6X]=function(title){var M4z=Q5T;M4z+=b5T;M4z+=Q21;M4z+=E0X;var N4z=e7T;N4z+=f5x.x21;N4z+=j0X;N4z+=d5T;var header=$(this[d6T][n3X])[m0X](T7B+this[W8T][N4z][M4z]);if(title===undefined){return header[R5X]();}f5x[O3T]();if(typeof title===V6T){var s4z=f9B;s4z+=j9T;var Z4z=U2T;Z4z+=t3X;title=title(this,new DataTable[Z4z](this[u21][s4z]));}header[R5X](title);return this;};Editor[g7X][S2T]=function(field,value){var p9B="PlainObject";var f4z=I0T;f4z+=f5x.x21;f4z+=T21;var o4z=v0T;o4z+=p9B;var x4z=B9T;x4z+=f5x.l21;f5x[x4z]();if(value!==undefined||$[o4z](field)){return this[G5X](field,value);}return this[f4z](field);;};var apiRegister=DataTable[X5X][p4z];function __getInst(api){var S9B="oInit";var G4z=f5x.x21;G4z+=f5x.S21;G4z+=G5T;G4z+=P1T;var J4z=B9T;J4z+=f5x.l21;var S4z=Q5T;S4z+=T6T;S4z+=a8X;var ctx=api[S4z][J81];f5x[J4z]();return ctx[S9B][G4z]||ctx[J9B];}function __setBasic(inst,opts,type,plural){var G9B="ssag";var y9B="itl";var C9B='1';var w9B=/%d/;var W9B="sag";var W4z=n21;W4z+=G9B;W4z+=f5x.x21;var y4z=B9T;y4z+=f5x.l21;f5x[y4z]();if(!opts){opts={};}if(opts[r6X]===undefined){opts[r6X]=G8X;}if(opts[t6X]===undefined){var z4z=T21;z4z+=y9B;z4z+=f5x.x21;opts[t6X]=inst[I4T][type][z4z];}if(opts[W4z]===undefined){if(type===z9B){var w4z=M9T;w4z+=p5X;w4z+=g3T;w4z+=f5x.x21;var D4z=n21;D4z+=u21;D4z+=W9B;D4z+=f5x.x21;var confirm=inst[I4T][type][D9B];opts[D4z]=plural!==G81?confirm[T7T][w4z](w9B,plural):confirm[C9B];}else{var C4z=f5x.p21;C4z+=l1B;C4z+=z9T;opts[C4z]=K0T;}}return opts;}apiRegister(b9B,function(){return __getInst(this);});apiRegister(b4z,function(opts){var inst=__getInst(this);inst[x2X](__setBasic(inst,opts,F6T));return this;});apiRegister(F4z,function(opts){var a4z=f5x.x21;a4z+=f5x.S21;a4z+=m1T;var j4z=f5x.x21;j4z+=f5x.S21;j4z+=m1T;var inst=__getInst(this);inst[j4z](this[J81][J81],__setBasic(inst,opts,a4z));return this;});apiRegister(U4z,function(opts){var X4z=u9T;X4z+=m1T;var R4z=f5x.x21;R4z+=f5x.S21;R4z+=G5T;R4z+=T21;var inst=__getInst(this);f5x[O3T]();inst[R4z](this[J81],__setBasic(inst,opts,X4z));return this;});apiRegister(k4z,function(opts){var u4z=F9X;u4z+=m2X;var d4z=M9T;d4z+=h0T;d4z+=m2X;var inst=__getInst(this);inst[d4z](this[J81][J81],__setBasic(inst,opts,u4z,G81));f5x[O3T]();return this;});apiRegister(P4z,function(opts){var Q4z=O7T;Q4z+=F9B;Q4z+=Z9T;Q4z+=f5x.x21;var T4z=j9B;T4z+=f5x.x21;var inst=__getInst(this);inst[T4z](this[J81],__setBasic(inst,opts,Q4z,this[J81][G3T]));return this;});apiRegister(a9B,function(type,opts){var R9B="inlin";var U9B="inli";var I4z=f5x.L21;I4z+=f5x.l21;f5x[I4z]();if(!type){var t4z=U9B;t4z+=f9T;type=t4z;}else if($[E4X](type)){var K4z=R9B;K4z+=f5x.x21;opts=type;type=K4z;}__getInst(this)[type](this[J81][J81],opts);return this;});apiRegister(r4z,function(opts){var B4z=G6X;B4z+=V9T;B4z+=w7T;B4z+=f5x.x21;f5x[f5x.z21]();__getInst(this)[B4z](this[J81],opts);return this;});apiRegister(X9B,_api_file);apiRegister(k9B,_api_files);$(document)[T6T](n4z,function(e,ctx,json){var u9B='dt';var q4z=F9T;q4z+=j9T;q4z+=u21;if(e[d9B]!==u9B){return;}if(json&&json[q4z]){$[X2T](json[L3T],function(name,files){var Y4z=f5x.J21;Y4z+=s0X;Y4z+=f5x.x21;Y4z+=u21;var E4z=B9T;E4z+=f5x.l21;f5x[E4z]();if(!Editor[Y4z][name]){Editor[L3T][name]={};}$[n4T](Editor[L3T][name],files);});}});Editor[k8T]=function(msg,tn){var P9B=" For mo";var T9B="re information, please refer to https://datatables.net";var Q9B="/tn/";var c4z=P9B;c4z+=T9B;c4z+=Q9B;throw tn?msg+c4z+tn:msg;};Editor[I9B]=function(data,props,fn){var t9B="isAr";var r9B="xtend";var q9B="abel";var Y9B="value";var e6z=t9B;e6z+=O7T;e6z+=O1B;var i6z=w7T;i6z+=K9B;i6z+=w7T;var O6z=f5x.x21;O6z+=r9B;var V4z=B9T;V4z+=f5x.l21;f5x[V4z]();var i,ien,dataPoint;props=$[O6z]({label:i6z,value:B9B},props);if($[e6z](data)){var v6z=n9B;v6z+=e7T;for(i=J81,ien=data[v6z];i<ien;i++){dataPoint=data[i];if($[E4X](dataPoint)){var A6z=w7T;A6z+=q9B;var m6z=E9B;m6z+=w7T;m6z+=V5T;m6z+=f5x.x21;fn(dataPoint[props[Y9B]]===undefined?dataPoint[props[M6T]]:dataPoint[props[m6z]],dataPoint[props[A6z]],i,dataPoint[X8X]);}else{fn(dataPoint,dataPoint,i);}}}else{i=J81;$[X2T](data,function(key,val){fn(val,key,i);f5x[O3T]();i++;});}};Editor[h6z]=function(id){var g6z=B9T;g6z+=f5x.l21;f5x[g6z]();return id[Y2T](/\./g,K1B);};Editor[c9B]=function(editor,conf,files,progressCallback,completeCallback){var V9B="eadAsDataURL";var v3B="_limitLef";var e0B="R";var H0B="onload";var v0B="eadText";var A0B="ja";var h0B='A server error occurred while uploading the file';var g0B="<i>Uploading file</i>";var i0B="imitLef";var J8z=O7T;J8z+=V9B;var o8z=O0B;o8z+=i0B;o8z+=T21;var s6z=F9T;s6z+=j9T;s6z+=e0B;s6z+=v0B;var Z6z=B9T;Z6z+=f5x.l21;var N6z=j4X;N6z+=m0B;N6z+=Q21;var l6z=f5x.f21;l6z+=A0B;l6z+=P21;var L6z=Q21;L6z+=f5x.f21;L6z+=n21;var H6z=U9T;H6z+=x5T;var reader=new FileReader();var counter=J81;var ids=[];var generalError=h0B;editor[H6z](conf[L6z],K0T);if(typeof conf[l6z]===N6z){conf[b4X](files,function(ids){var M6z=Q1B;M6z+=K8X;completeCallback[M6z](editor,ids);});return;}f5x[Z6z]();progressCallback(conf,conf[s6z]||g0B);reader[H0B]=function(e){var C0B='post';var b0B='json';var l0B="plo";var N0B="stri";var y0B='No Ajax option specified for upload plug-in';var z0B='Upload feature cannot use `ajax.data` with an object. Please use it as a function instead.';var p0B="ajaxDa";var L0B="preU";var x0B='upload';var D0B="readAsDataURL";var f0B="ajaxData";var U0B="uplo";var J0B="up";var w0B='preSubmit.DTE_Upload';var o0B='uploadField';var d6z=f5x.x21;d6z+=P21;d6z+=t3T;var R6z=Q21;R6z+=f5x.f21;R6z+=f5x.p21;R6z+=f5x.x21;var U6z=L0B;U6z+=l0B;U6z+=j0X;var a6z=f5x.S21;a6z+=E2X;var j6z=t4X;j6z+=K4X;j6z+=r4X;j6z+=T21;var C6z=N0B;C6z+=B8X;var D6z=u21;D6z+=T21;D6z+=O7T;D6z+=h1T;var W6z=f5x.f21;W6z+=f5x.s21;W6z+=f5x.f21;W6z+=P21;var p6z=M0B;p6z+=P21;var f6z=Z0B;f6z+=f5x.f21;f6z+=P21;var x6z=f5x.f21;x6z+=f5x.o21;x6z+=s0B;x6z+=Q21;var data=new FormData();var ajax;data[g2T](x6z,x0B);data[g2T](o0B,conf[c4T]);data[g2T](x0B,files[counter]);if(conf[f0B]){var o6z=p0B;o6z+=X4T;conf[o6z](data,files[counter],counter);}if(conf[f6z]){ajax=conf[b4X];}else if($[E4X](editor[u21][p6z])){var z6z=f5x.f21;z6z+=f5x.s21;z6z+=S0B;var y6z=J0B;y6z+=u2T;y6z+=j0X;var G6z=f5x.f21;G6z+=f5x.s21;G6z+=f5x.f21;G6z+=P21;var J6z=J0B;J6z+=w7T;J6z+=G0B;var S6z=Z0B;S6z+=f5x.f21;S6z+=P21;ajax=editor[u21][S6z][J6z]?editor[u21][G6z][y6z]:editor[u21][z6z];}else if(typeof editor[u21][W6z]===D6z){var w6z=f5x.f21;w6z+=f5x.s21;w6z+=f5x.f21;w6z+=P21;ajax=editor[u21][w6z];}if(!ajax){throw new Exception(y0B);}if(typeof ajax===C6z){ajax={url:ajax};}if(typeof ajax[i6T]===V6T){var d={};var ret=ajax[i6T](d);if(ret!==undefined&&typeof ret!==E2T){d=ret;}$[X2T](d,function(key,value){var F6z=d6X;F6z+=R1T;F6z+=Q21;F6z+=f5x.S21;var b6z=f5x.L21;b6z+=f5x.l21;f5x[b6z]();data[F6z](key,value);});}else if($[j6z](ajax[a6z])){throw new Exception(z0B);}var preRet=editor[Y6X](U6z,[conf[R6z],files[counter],data]);if(preRet===y3T){var X6z=W0B;X6z+=p3T;if(counter<files[X6z]-G81){counter++;reader[D0B](files[counter]);}else{var k6z=Q5T;k6z+=f5x.f21;k6z+=w7T;k6z+=w7T;completeCallback[k6z](editor,ids);}return;}var submit=y3T;editor[T6T](w0B,function(){submit=z3T;return y3T;});$[b4X]($[d6z]({},ajax,{type:C0B,data:data,dataType:b0B,contentType:y3T,processData:y3T,xhr:function(){var T0B="onloadend";var F0B="ajaxSet";var R0B="onprogress";var a0B="xhr";var n6z=f5x.L21;n6z+=f5x.l21;var P6z=V5T;P6z+=p5X;P6z+=b5T;P6z+=j0X;var u6z=F0B;u6z+=o4T;u6z+=j0B;var xhr=$[u6z][a0B]();if(xhr[P6z]){var K6z=U0B;K6z+=j0X;xhr[c9B][R0B]=function(e){var u0B="%";var X0B="ngthComputable";var d0B="toFixed";var k0B="ded";var P0B=':';var T6z=j9T;T6z+=X0B;if(e[T6z]){var t6z=w7T;t6z+=g5X;var I6z=N9T;I6z+=p2T;var Q6z=w7T;Q6z+=b5T;Q6z+=f5x.f21;Q6z+=k0B;var percent=(e[Q6z]/e[I6z]*V81)[d0B](J81)+u0B;progressCallback(conf,files[G3T]===G81?percent:counter+P0B+files[t6z]+L6T+percent);}};xhr[K6z][T0B]=function(e){var Q0B="Proce";var t0B="rocessin";var B6z=Q0B;B6z+=I0B;var r6z=g1T;r6z+=t0B;r6z+=I0T;r6z+=K0B;f5x[O3T]();progressCallback(conf,conf[r6z]||B6z);};}f5x[n6z]();return xhr;},success:function(json){var n0B="dErrors";var q0B='uploadXhrSuccess';var v8z=J0B;v8z+=w7T;v8z+=r0B;v8z+=f5x.S21;var V6z=F9T;V6z+=a5X;V6z+=n1T;V6z+=B0B;var c6z=c5B;c6z+=n0B;var Y6z=k2T;Y6z+=f5x.x21;var E6z=f5x.L21;E6z+=f5x.l21;var q6z=b5T;q6z+=f5x.J21;q6z+=f5x.J21;editor[q6z](w0B);f5x[E6z]();editor[Y6X](q0B,[conf[Y6z],json]);if(json[c6z]&&json[V6z][G3T]){var O8z=n9B;O8z+=e7T;var errors=json[E0B];for(var i=J81,ien=errors[O8z];i<ien;i++){editor[k8T](errors[i][c4T],errors[i][Y0B]);}}else if(json[k8T]){var e8z=f5x.x21;e8z+=O7T;e8z+=O7T;e8z+=x5T;var i8z=c0B;i8z+=O7T;editor[i8z](json[e8z]);}else if(!json[v8z]||!json[c9B][q4T]){editor[k8T](conf[c4T],generalError);}else{var L8z=j9T;L8z+=B8X;L8z+=p3T;var H8z=U0B;H8z+=j0X;var g8z=V0B;g8z+=n7X;var m8z=F9T;m8z+=O3B;if(json[m8z]){var A8z=F9T;A8z+=w7T;A8z+=v5T;$[X2T](json[A8z],function(table,files){var h8z=f5x.J21;h8z+=s0X;h8z+=f5x.x21;h8z+=u21;f5x[f5x.z21]();if(!Editor[h8z][table]){Editor[L3T][table]={};}$[n4T](Editor[L3T][table],files);});}ids[g8z](json[H8z][q4T]);if(counter<files[L8z]-G81){counter++;reader[D0B](files[counter]);}else{completeCallback[m8T](editor,ids);if(submit){var l8z=u21;l8z+=H9T;editor[l8z]();}}}progressCallback(conf);},error:function(xhr){var e3B="hrE";var i3B="X";var x8z=Q21;x8z+=f5x.f21;x8z+=f5x.p21;x8z+=f5x.x21;var s8z=U9T;s8z+=b5T;s8z+=O7T;var Z8z=Q21;Z8z+=f5x.f21;Z8z+=f5x.p21;Z8z+=f5x.x21;var M8z=c9B;M8z+=i3B;M8z+=e3B;M8z+=u3T;var N8z=Z9B;N8z+=O0X;editor[N8z](M8z,[conf[Z8z],xhr]);editor[s8z](conf[x8z],generalError);progressCallback(conf);}}));};files=$[I5B](files,function(val){f5x[f5x.z21]();return val;});if(conf[o8z]!==undefined){var S8z=w7T;S8z+=g5X;var p8z=v3B;p8z+=T21;var f8z=X0X;f8z+=m3B;files[f8z](conf[p8z],files[S8z]);}reader[J8z](files[J81]);};Editor[g7X][G8z]=function(init){var H4B='</form>';var b3B="iv data-dte-e=\"foot\" class=\"";var o4B="bleT";var h3B="tEdit";var k4B='initComplete';var y3B="d\" class=\"";var W4B='foot';var s3B="leT";var d3B="uni";var x3B="ools";var A3B="ni";var s4B="BUTTO";var X3B="ing\" cl";var g3B="xh";var f3B="<div data-dte-e=\"for";var G3B="=\"hea";var h4B='<form data-dte-e="form" class="';var l3B="_co";var N4B='"><div class="';var W3B="e=\"for";var I3B="ses";var L4B='<div data-dte-e="form_error" class="';var l4B='<div data-dte-e="form_info" class="';var O4B="domTable";var H3B="r.dt.d";var G4B="events";var C4B="unique";var w4B='init.dt.dte';var b4B="nTable";var f4B="oo";var g4B='"/>';var o3B="dataTa";var M4B='"/></div>';var z3B="<div data-dte-";var v4B='"><span/></div>';var p3B="m_b";var m4B='<div data-dte-e="body_content" class="';var a4B="Controller";var r3B="Table";var L3B="process";var P3B="setti";var S3B="uttons\" class=\"";var J3B="<div data-dte-e";var F3B="iv data-dte";var M3B="m_con";var U3B="processin";var n3B="xUrl";var t3B="templ";var K3B="Sou";var Z3B="formConten";var R3B="v data-dte-e=\"process";var i4B="dataSources";var D3B="m_content\" class";var j3B="-e=\"body\" class";var e4B="legacyAjax";var r2z=G5T;r2z+=A3B;r2z+=h3B;r2z+=x5T;var u2z=g3B;u2z+=H3B;u2z+=T21;u2z+=f5x.x21;var k2z=f5x.J21;k2z+=t5B;k2z+=u21;var X2z=L3B;X2z+=G5T;X2z+=B8X;var R2z=c7T;R2z+=y0T;R2z+=g6X;R2z+=h1T;var U2z=V0X;U2z+=l3B;U2z+=N3B;var a2z=V9T;a2z+=b5T;a2z+=f5x.S21;a2z+=o7T;var j2z=M1T;j2z+=b5T;j2z+=V21;j2z+=O7T;var F2z=T4X;F2z+=M3B;F2z+=E0X;var b2z=Z3B;b2z+=T21;var y2z=R7T;y2z+=N6X;var Z2z=i7T;Z2z+=I3X;Z2z+=s3B;Z2z+=x3B;var M2z=o3B;M2z+=V9T;M2z+=w7T;M2z+=f5x.x21;var N2z=o7B;N2z+=b5T;N2z+=Q21;N2z+=u21;var l2z=f5x.J21;l2z+=b5T;l2z+=O7T;l2z+=f5x.p21;var L2z=f3B;L2z+=p3B;L2z+=S3B;var H2z=J3B;H2z+=G3B;H2z+=y3B;var g2z=m3T;g2z+=r3T;g2z+=i4T;var h2z=G5T;h2z+=b3X;h2z+=b5T;var A2z=M1T;A2z+=g2X;var m2z=d5T;m2z+=n1T;m2z+=O7T;var v2z=z3B;v2z+=W3B;v2z+=D3B;v2z+=H4T;var e2z=m3T;e2z+=i4T;var i2z=T21;i2z+=w3B;var O2z=M1T;O2z+=O7T;O2z+=f5x.p21;var V8z=M4T;V8z+=w7B;V8z+=x6X;V8z+=i4T;var c8z=m3T;c8z+=r3T;c8z+=i4T;var Y8z=y8T;Y8z+=Q21;Y8z+=E0X;var E8z=C3B;E8z+=U8T;E8z+=H4T;var q8z=o6X;q8z+=b3B;var n8z=J7B;n8z+=k9T;n8z+=E6T;n8z+=i4T;var B8z=m3T;B8z+=r3T;B8z+=i4T;var r8z=v0X;r8z+=U5T;var K8z=V9T;K8z+=G9T;K8z+=o7T;var t8z=o6X;t8z+=F3B;t8z+=j3B;t8z+=H4T;var I8z=z4T;I8z+=f5x.S21;I8z+=W8X;I8z+=a3B;var Q8z=U3B;Q8z+=I0T;var T8z=e4T;T8z+=R3B;T8z+=X3B;T8z+=k3B;var P8z=f5x.S21;P8z+=b5T;P8z+=f5x.p21;var u8z=d3B;u8z+=u3B;u8z+=I2T;var d8z=P3B;d8z+=Q21;d8z+=w1T;var k8z=H0T;k8z+=w7T;k8z+=u21;var X8z=G5T;X8z+=T3B;var R8z=I3T;R8z+=t3T;var U8z=Q5T;U8z+=w7T;U8z+=Q3B;U8z+=I3B;var a8z=t3B;a8z+=f5x.f21;a8z+=V21;var j8z=i6T;j8z+=K3B;j8z+=Y1B;j8z+=u21;var F8z=R4T;F8z+=X4T;F8z+=r3B;var b8z=q4T;b8z+=j21;b8z+=B3B;var C8z=M0B;C8z+=n3B;var w8z=q3B;w8z+=r6T;var D8z=X4T;D8z+=I9T;var W8z=l9T;W8z+=E3B;W8z+=z4T;W8z+=w1T;var z8z=Y3B;z8z+=u21;var y8z=I3T;y8z+=T21;y8z+=l6X;y8z+=f5x.S21;init=$[n4T](z3T,{},Editor[c3B],init);this[u21]=$[y8z](z3T,{},Editor[z8z][W8z],{actionName:init[V3B],table:init[O4B]||init[D8z],dbTable:init[w8z]||j6T,ajaxUrl:init[C8z],ajax:init[b4X],idSrc:init[b8z],dataSource:init[O4B]||init[k5X]?Editor[i4B][F8z]:Editor[j8z][R5X],formOptions:init[x7X],legacyAjax:init[e4B],template:init[a8z]?$(init[x5B])[r7X]():j6T});this[U8z]=$[R8z](z3T,{},Editor[W8T]);this[I4T]=init[X8z];Editor[k8z][d8z][u8z]++;var that=this;var classes=this[W8T];this[P8z]={"wrapper":$(g6T+classes[H6T]+x6T+T8z+classes[Q8z][I8z]+v4B+t8z+classes[V0X][H6T]+x6T+m4B+classes[K8z][r8z]+B8z+n8z+q8z+classes[A4B][H6T]+x6T+E8z+classes[A4B][Y8z]+c8z+V8z+f6T)[J81],"form":$(h4B+classes[O2z][i2z]+e2z+v2z+classes[t5T][K7X]+g4B+H4B)[J81],"formError":$(L4B+classes[t5T][m2z]+g4B)[J81],"formInfo":$(l4B+classes[A2z][h2z]+g2z)[J81],"header":$(H2z+classes[n3X][H6T]+N4B+classes[n3X][K7X]+M4B)[J81],"buttons":$(L2z+classes[l2z][N2z]+g4B)[J81]};if($[B0T][M2z][Z2z]){var f2z=f5x.x21;f2z+=f5x.S21;f2z+=G5T;f2z+=T21;var o2z=Q5T;o2z+=Z4B;o2z+=f5x.x21;var x2z=s4B;x2z+=u7T;x2z+=j21;var s2z=x4B;s2z+=o4B;s2z+=f4B;s2z+=g0T;var ttButtons=$[B0T][n0T][s2z][x2z];var i18n=this[I4T];$[X2T]([o2z,f2z,z9B],function(i,val){var S4B="nText";var J4B="r_";var p4B="sBut";var G2z=V9T;G2z+=V5T;G2z+=E3B;G2z+=T6T;var J2z=p4B;J2z+=t9T;J2z+=S4B;var S2z=b5B;S2z+=b5T;S2z+=J4B;var p2z=B9T;p2z+=f5x.l21;f5x[p2z]();ttButtons[S2z+val][J2z]=i18n[val][G2z];});}$[y2z](init[G4B],function(evt,fn){var W2z=b5T;W2z+=Q21;var z2z=f5x.L21;z2z+=f5x.l21;f5x[z2z]();that[W2z](evt,function(){var y4B="sli";var z4B="shift";var C2z=B9T;C2z+=f5x.l21;var w2z=Q5T;w2z+=h7X;var D2z=y4B;D2z+=y0T;var args=Array[g7X][D2z][w2z](arguments);args[z4B]();f5x[C2z]();fn[F6X](that,args);});});var dom=this[d6T];var wrapper=dom[H6T];dom[b2z]=_editor_el(F2z,dom[t5T])[J81];dom[j2z]=_editor_el(W4B,wrapper)[J81];dom[V0X]=_editor_el(a2z,wrapper)[J81];dom[D4B]=_editor_el(U2z,wrapper)[J81];dom[R2z]=_editor_el(X2z,wrapper)[J81];if(init[k2z]){this[A4X](init[J4X]);}$(document)[T6T](w4B+this[u21][C4B],function(e,settings,json){var d2z=I0T;d2z+=f5x.x21;d2z+=T21;if(that[u21][k5X]&&settings[b4B]===$(that[u21][k5X])[d2z](J81)){settings[J9B]=that;}})[T6T](u2z+this[u21][C4B],function(e,settings,json){var F4B="_optionsUpdate";var T2z=I0T;T2z+=f5x.x21;T2z+=T21;var P2z=T21;P2z+=r6T;f5x[O3T]();if(json&&that[u21][P2z]&&settings[b4B]===$(that[u21][k5X])[T2z](J81)){that[F4B](json);}});try{var I2z=k9T;I2z+=u21;I2z+=g1T;I2z+=M5X;var Q2z=P9T;Q2z+=j4B;Q2z+=a4B;this[u21][Q2z]=Editor[I2z][init[e2T]][U4B](this);}catch(e){var X4B="ind display controller ";var R4B="Cannot f";var K2z=k9T;K2z+=u21;K2z+=T9T;K2z+=o7T;var t2z=R4B;t2z+=X4B;throw t2z+init[K2z];}this[Y6X](k4B,[]);$(document)[d4B](r2z,[this]);};Editor[B2z][O9B]=function(){var I4B="ddCl";var T4B="tion";var P4B="wrapp";var u4B="Class";var i5L=u9T;i5L+=m1T;var V2z=Q5T;V2z+=M9T;V2z+=M5T;var c2z=W5X;c2z+=u4B;var Y2z=P4B;Y2z+=d5T;var E2z=f5x.S21;E2z+=X8T;var q2z=f5x.f21;q2z+=Q5T;q2z+=T4B;var n2z=g3T;n2z+=I4X;var classesActions=this[W8T][n2z];var action=this[u21][q2z];var wrapper=$(this[E2z][Y2z]);wrapper[c2z]([classesActions[V2z],classesActions[b5B],classesActions[W5X]][t1B](L6T));if(action===x2X){var O5L=Q4B;O5L+=g6X;wrapper[O5L](classesActions[x2X]);}else if(action===i5L){var v5L=f5x.x21;v5L+=f5x.S21;v5L+=G5T;v5L+=T21;var e5L=f5x.f21;e5L+=I4B;e5L+=f5x.f21;e5L+=g6X;wrapper[e5L](classesActions[v5L]);}else if(action===W5X){wrapper[F1X](classesActions[W5X]);}};Editor[m5L][t4B]=function(data,success,error,submitParams){var p6B="rl";var l6B="ajaxUrl";var D6B="param";var V4B="js";var G6B="comp";var E4B="idS";var r4B="eBody";var M6B=',';var S6B="compl";var w6B='?';var Z6B="eat";var J6B="exten";var W6B="deleteBody";var x6B="indexOf";var B4B="DEL";var n4B="ETE";var f6B=/_id_/;var y6B="complete";var K4B="elet";var s6B="axUrl";var R5L=f5x.S21;R5L+=K4B;R5L+=r4B;var U5L=B4B;U5L+=n4B;var a5L=T21;a5L+=Y7T;a5L+=f5x.x21;var j5L=f5x.S21;j5L+=f5x.f21;j5L+=T21;j5L+=f5x.f21;var C5L=f5x.S21;C5L+=f5x.f21;C5L+=T21;C5L+=f5x.f21;var x5L=q4B;x5L+=Q5T;x5L+=m0B;x5L+=Q21;var s5L=E4B;s5L+=O7T;s5L+=Q5T;var Z5L=Y4B;Z5L+=c4B;Z5L+=u21;var M5L=j9B;M5L+=f5x.x21;var A5L=V4B;A5L+=T6T;var that=this;var action=this[u21][U8X];var thrown;var opts={type:a2X,dataType:A5L,data:j6T,error:[function(xhr,text,err){thrown=err;}],success:[],complete:[function(xhr,text){var i6B="espons";var O6B="Array";var m6B="eTex";var O21=204;var e6B="eText";var H6B="seJSON";var A6B="arseJ";var v6B="respons";var g6B="respon";var h6B="SON";var L6B="responseJSON";var N5L=G5T;N5L+=u21;N5L+=O6B;var g5L=Q21;g5L+=V5T;g5L+=w7T;g5L+=w7T;var h5L=O7T;h5L+=i6B;h5L+=e6B;var json=j6T;if(xhr[Y0B]===O21||xhr[h5L]===g5L){json={};}else{try{var l5L=v6B;l5L+=m6B;l5L+=T21;var L5L=g1T;L5L+=A6B;L5L+=h6B;var H5L=g6B;H5L+=H6B;json=xhr[L6B]?xhr[H5L]:$[L5L](xhr[l5L]);}catch(e){}}f5x[O3T]();if($[E4X](json)||$[N5L](json)){success(json,xhr[Y0B]>=i21,xhr);}else{error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[u21][b4X]||this[u21][l6B];var id=action===N6B||action===M5L?_pluck(this[u21][Z5L],s5L):j6T;if($[h5X](id)){id=id[t1B](M6B);}if($[E4X](ajaxSrc)&&ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc===x5L){var uri=j6T;var method=j6T;if(this[u21][l6B]){var f5L=Q5T;f5L+=O7T;f5L+=Z6B;f5L+=f5x.x21;var o5L=Z0B;o5L+=s6B;var url=this[u21][o5L];if(url[f5L]){uri=url[action];}if(uri[x6B](L6T)!==-G81){a=uri[o6B](L6T);method=a[J81];uri=a[G81];}uri=uri[Y2T](f6B,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc===E2T){if(ajaxSrc[x6B](L6T)!==-G81){var J5L=V5T;J5L+=p6B;var S5L=T21;S5L+=o7T;S5L+=g1T;S5L+=f5x.x21;var p5L=X0X;p5L+=G5T;p5L+=T21;a=ajaxSrc[p5L](L6T);opts[S5L]=a[J81];opts[J5L]=a[G81];}else{var G5L=V5T;G5L+=O7T;G5L+=w7T;opts[G5L]=ajaxSrc;}}else{var z5L=S6B;z5L+=f5x.x21;z5L+=T21;z5L+=f5x.x21;var y5L=J6B;y5L+=f5x.S21;var optsCopy=$[y5L]({},ajaxSrc||{});if(optsCopy[z5L]){var D5L=G6B;D5L+=w7T;D5L+=f5x.x21;D5L+=V21;var W5L=S6B;W5L+=f5x.x21;W5L+=T21;W5L+=f5x.x21;opts[W5L][A8T](optsCopy[y6B]);delete optsCopy[D5L];}if(optsCopy[k8T]){var w5L=c0B;w5L+=O7T;opts[k8T][A8T](optsCopy[k8T]);delete optsCopy[w5L];}opts=$[n4T]({},opts,optsCopy);}opts[L5B]=opts[L5B][Y2T](f6B,id);if(opts[C5L]){var F5L=f5x.S21;F5L+=f5x.f21;F5L+=X4T;var b5L=z6B;b5L+=T6T;var isFn=typeof opts[i6T]===b5L;var newData=isFn?opts[F5L](data):opts[i6T];data=isFn&&newData?newData:$[n4T](z3T,data,newData);}opts[j5L]=data;if(opts[a5L]===U5L&&(opts[W6B]===undefined||opts[R5L]===z3T)){var k5L=A5B;k5L+=f5x.f21;var X5L=R4T;X5L+=X4T;var params=$[D6B](opts[X5L]);opts[L5B]+=opts[L5B][x6B](w6B)===-G81?w6B+params:O5X+params;delete opts[k5L];}$[b4X](opts);};Editor[g7X][d5L]=function(target,style,time,callback){var C6B="anima";var u5L=C6B;u5L+=T21;u5L+=f5x.x21;f5x[f5x.z21]();if($[B0T][u5L]){var P5L=b6B;P5L+=g1T;target[P5L]()[u5X](style,time,callback);}else{var Q5L=q2X;Q5L+=G5T;Q5L+=T6T;var T5L=S5X;T5L+=u21;target[T5L](style);if(typeof time===Q5L){var I5L=Q5T;I5L+=f5x.f21;I5L+=w7T;I5L+=w7T;time[I5L](target);}else if(callback){var t5L=Q5T;t5L+=f5x.f21;t5L+=w7T;t5L+=w7T;callback[t5L](target);}}};Editor[g7X][G2X]=function(){var a6B="formInfo";var F6B="appen";var B5L=F6B;B5L+=f5x.S21;var r5L=B9T;r5L+=f5x.l21;var K5L=e7T;K5L+=f5x.x21;K5L+=f5x.f21;K5L+=j6B;var dom=this[d6T];$(dom[H6T])[I6X](dom[K5L]);f5x[r5L]();$(dom[A4B])[g2T](dom[P5B])[g2T](dom[r6X]);$(dom[D4B])[B5L](dom[a6B])[g2T](dom[t5T]);};Editor[n5L][U6B]=function(){var d6B='preBlur';var X6B="onBlu";var k6B="Opts";var V5L=e1T;V5L+=v1T;V5L+=G5T;V5L+=T21;var c5L=R6B;c5L+=U5T;var Y5L=B9T;Y5L+=f5x.l21;var E5L=X6B;E5L+=O7T;var q5L=b5B;q5L+=k6B;var opts=this[u21][q5L];var onBlur=opts[E5L];f5x[Y5L]();if(this[c5L](d6B)===y3T){return;}if(typeof onBlur===V6T){onBlur(this);}else if(onBlur===V5L){this[j5X]();}else if(onBlur===o7X){this[v2X]();}};Editor[g7X][O7L]=function(){var g7L=S5B;g7L+=b8T;var h7L=U9T;h7L+=x5T;var v7L=f5x.x21;v7L+=g3T;v7L+=e7T;var e7L=j9B;e7L+=f5x.x21;e7L+=u6B;e7L+=u21;var i7L=F9T;i7L+=f5x.x21;i7L+=Z0T;if(!this[u21]){return;}f5x[f5x.z21]();var errorClass=this[W8T][i7L][k8T];var fields=this[u21][J4X];$(T7B+errorClass,this[d6T][H6T])[e7L](errorClass);$[v7L](fields,function(name,field){var A7L=y9T;A7L+=f5x.f21;A7L+=I0T;A7L+=f5x.x21;var m7L=f5x.x21;m7L+=O7T;m7L+=n1T;m7L+=O7T;f5x[O3T]();field[m7L](K0T)[A7L](K0T);});this[h7L](K0T)[g7L](K0T);};Editor[g7X][H7L]=function(submitComplete,mode){var I6B="seCb";var P6B="cus.";var T6B="editor-focus";var r6B="eCb";var q6B="eIcb";var B6B="closeC";var K6B='preClose';var f7L=Q5T;f7L+=w7T;f7L+=X4X;var o7L=M1T;o7L+=P6B;o7L+=T6B;var x7L=c1X;x7L+=f5x.S21;x7L+=o7T;var l7L=Q6B;l7L+=I6B;var L7L=i7B;L7L+=t6B;var closed;if(this[L7L](K6B)===y3T){return;}if(this[u21][l7L]){var M7L=C0X;M7L+=r6B;var N7L=B6B;N7L+=V9T;closed=this[u21][N7L](submitComplete,mode);this[u21][M7L]=j6T;}if(this[u21][n6B]){var s7L=C0X;s7L+=q6B;var Z7L=b1T;Z7L+=b5T;Z7L+=u21;Z7L+=q6B;this[u21][Z7L]();this[u21][s7L]=j6T;}$(x7L)[N3X](o7L);this[u21][y5B]=y3T;this[Y6X](f7L);if(closed){var p7L=Z9B;p7L+=f5x.x21;p7L+=U5T;this[p7L](c6X,[closed]);}};Editor[S7L][t7B]=function(fn){var E6B="closeCb";this[u21][E6B]=fn;};Editor[g7X][J7L]=function(arg1,arg2,arg3,arg4){var O8B="main";var Y6B="ool";var G7L=V9T;G7L+=Y6B;G7L+=f5x.x21;G7L+=c6B;var that=this;var title;var buttons;var show;var opts;if($[E4X](arg1)){opts=arg1;}else if(typeof arg1===G7L){show=arg1;opts=arg2;;}else{title=arg1;buttons=arg2;show=arg3;opts=arg4;;}if(show===undefined){show=z3T;}if(title){var y7L=T21;y7L+=G5T;y7L+=T21;y7L+=j9T;that[y7L](title);}if(buttons){var z7L=E9T;z7L+=V6B;that[z7L](buttons);}return{opts:$[n4T]({},this[u21][x7X][O8B],opts),maybeOpen:function(){if(show){var W7L=b5T;W7L+=g1T;W7L+=l6X;that[W7L]();}}};};Editor[g7X][D7L]=function(name){var i8B="ift";var b7L=n7X;b7L+=i8B;var C7L=Q1B;C7L+=w7T;C7L+=w7T;var w7L=g1T;w7L+=n1T;w7L+=T21;w7L+=V7T;var args=Array[w7L][H7X][C7L](arguments);f5x[O3T]();args[b7L]();var fn=this[u21][e8B][name];if(fn){return fn[F6X](this,args);}};Editor[g7X][F7L]=function(includeFields){var m8B="formContent";var M8B="To";var v8B="dre";var Z8B='displayOrder';var q7L=g3T;q7L+=T21;q7L+=s0B;q7L+=Q21;var n7L=R6B;n7L+=Q21;n7L+=T21;var R7L=i0X;R7L+=T21;R7L+=f5x.f21;R7L+=N6X;var U7L=N6X;U7L+=s0X;U7L+=v8B;U7L+=Q21;var a7L=v6X;a7L+=z4T;var j7L=b5T;j7L+=O7T;j7L+=i0X;j7L+=O7T;var that=this;f5x[O3T]();var formContent=$(this[d6T][m8B]);var fields=this[u21][J4X];var order=this[u21][j7L];var template=this[u21][x5B];var mode=this[u21][H0T]||a7L;if(includeFields){this[u21][e8X]=includeFields;}else{includeFields=this[u21][e8X];}formContent[U7L]()[R7L]();$[X2T](order,function(i,fieldOrName){var h8B="[data";var g8B="-editor-template=\"";var l8B='editor-field[name="';var A8B="_weakInArr";var d7L=A8B;d7L+=O1B;var k7L=Z7T;k7L+=G5T;k7L+=b7T;k7L+=f5x.S21;var X7L=B9T;X7L+=f5x.l21;f5x[X7L]();var name=fieldOrName instanceof Editor[k7L]?fieldOrName[c4T]():fieldOrName;if(that[d7L](name,includeFields)!==-G81){var u7L=f5x.p21;u7L+=Z5X;u7L+=Q21;if(template&&mode===u7L){var K7L=O8T;K7L+=n5T;var t7L=m3T;t7L+=A3T;var I7L=h8B;I7L+=g8B;var Q7L=F9T;Q7L+=i5T;var T7L=H8B;T7L+=V21;T7L+=O7T;var P7L=L8B;P7L+=f5x.S21;template[P7L](l8B+name+N8B)[T7L](fields[name][Y3X]());template[Q7L](I7L+name+t7L)[K7L](fields[name][Y3X]());}else{var r7L=f5x.f21;r7L+=n1X;formContent[r7L](fields[name][Y3X]());}}});if(template&&mode===F5B){var B7L=d6X;B7L+=k7B;B7L+=M8B;template[B7L](formContent);}this[n7L](Z8B,[this[u21][y5B],this[u21][q7L],formContent]);};Editor[E7L][c4X]=function(items,editFields,type,formOptions,setupDone){var s8B="modif";var J1L=f5x.S21;J1L+=E2X;var S1L=U4B;S1L+=a7T;S1L+=T21;var p1L=T7T;p1L+=n1B;p1L+=T21;var o1L=u21;o1L+=v8T;var x1L=x5T;x1L+=j6B;var e1L=c5X;e1L+=b5T;e1L+=D3T;var i1L=u21;i1L+=a4T;i1L+=j9T;var O1L=f5x.S21;O1L+=b5T;O1L+=f5x.p21;var V7L=f5x.x21;V7L+=f5x.S21;V7L+=G5T;V7L+=T21;var c7L=s8B;c7L+=L2X;var Y7L=B9T;Y7L+=f5x.l21;var that=this;var fields=this[u21][J4X];var usedFields=[];var includeInOrder;var editData={};this[u21][f2X]=editFields;this[u21][x8B]=editData;f5x[Y7L]();this[u21][c7L]=items;this[u21][U8X]=V7L;this[O1L][t5T][i1L][e2T]=e1L;this[u21][H0T]=type;this[O9B]();$[X2T](fields,function(name,field){var o8B="ltiI";var Z1L=w7T;Z1L+=f5x.x21;Z1L+=B8X;Z1L+=p3T;var M1L=f5x.p21;M1L+=V5T;M1L+=o8B;M1L+=f8B;field[x4X]();f5x[O3T]();includeInOrder=y3T;editData[name]={};$[X2T](editFields,function(idSrc,edit){var G8B="isplayFields";var J8B="layFields";var p8B="displayField";var v1L=f5x.J21;v1L+=G5T;v1L+=f5x.x21;v1L+=a9T;f5x[O3T]();if(edit[v1L][name]){var A1L=u21;A1L+=Q5T;A1L+=s9T;A1L+=f5x.x21;var m1L=f5x.S21;m1L+=g9T;m1L+=f5x.f21;var val=field[e6T](edit[m1L]);editData[name][idSrc]=val===j6T?K0T:$[h5X](val)?val[H7X]():val;if(!formOptions||formOptions[A1L]===p7X){var H1L=p8B;H1L+=u21;var g1L=f5x.S21;g1L+=S8B;g1L+=J8B;var h1L=i0X;h1L+=f5x.J21;field[p2X](idSrc,val!==undefined?val:field[h1L]());if(!edit[g1L]||edit[H1L][name]){includeInOrder=z3T;}}else{var L1L=f5x.S21;L1L+=G8B;if(!edit[L1L]||edit[L7B][name]){var N1L=f5x.S21;N1L+=f5x.x21;N1L+=f5x.J21;var l1L=p9T;l1L+=f4X;field[l1L](idSrc,val!==undefined?val:field[N1L]());includeInOrder=z3T;}}}});if(field[M1L]()[Z1L]!==J81&&includeInOrder){var s1L=g1T;s1L+=y8B;usedFields[s1L](name);}});var currOrder=this[x1L]()[o1L]();for(var i=currOrder[G3T]-G81;i>=J81;i--){var f1L=z8B;f1L+=O7T;f1L+=O7T;f1L+=O1B;if($[f1L](currOrder[i][W8B](),usedFields)===-G81){currOrder[w4X](i,G81);}}this[C4X](currOrder);this[p1L](S1L,[_pluck(editFields,e9B)[J81],_pluck(editFields,J1L)[J81],items,type],function(){var D8B="tMultiEd";var y1L=v9B;y1L+=D8B;y1L+=m1T;var G1L=f5x.L21;G1L+=f5x.l21;f5x[G1L]();that[Y6X](y1L,[editFields,items,type],function(){setupDone();});});};Editor[z1L][Y6X]=function(trigger,args,promiseComplete){var j8B="Event";var R8B="je";var k8B="result";var w8B="sA";var d8B="esu";var b8B="resu";var U8B='Cancelled';var X8B="esult";var W1L=G5T;W1L+=w8B;W1L+=C8B;W1L+=O1B;if(!args){args=[];}if($[W1L](trigger)){var D1L=w7T;D1L+=l6X;D1L+=f2T;for(var i=J81,ien=trigger[D1L];i<ien;i++){this[Y6X](trigger[i],args);}}else{var k1L=b8B;k1L+=J5T;var b1L=b8B;b1L+=J5T;var C1L=g1T;C1L+=O7T;C1L+=f5x.x21;var w1L=G5T;w1L+=Q21;w1L+=i0X;w1L+=F8B;var e=$[j8B](trigger);$(this)[a8B](e,args);if(trigger[w1L](C1L)===J81&&e[b1L]===y3T){$(this)[a8B]($[j8B](trigger+U8B),args);}if(promiseComplete){var a1L=p3T;a1L+=f5x.x21;a1L+=Q21;var j1L=f5x.Z21;j1L+=R8B;j1L+=Q5T;j1L+=T21;var F1L=O7T;F1L+=X8B;if(e[k8B]&&typeof e[F1L]===j1L&&e[k8B][a1L]){var R1L=T21;R1L+=e7T;R1L+=f5x.x21;R1L+=Q21;var U1L=O7T;U1L+=d8B;U1L+=w7T;U1L+=T21;e[U1L][R1L](promiseComplete);}else{var X1L=M9T;X1L+=e1T;X1L+=w7T;X1L+=T21;promiseComplete(e[X1L]);}}return e[k1L];}};Editor[g7X][W1B]=function(input){var u8B=/^on([A-Z])/;var T1L=B9T;T1L+=f5x.l21;var d1L=o2T;d1L+=I0T;d1L+=p3T;var name;var names=input[o6B](L6T);for(var i=J81,ien=names[d1L];i<ien;i++){var u1L=v6X;u1L+=T21;u1L+=Q5T;u1L+=e7T;name=names[i];var onStyle=name[u1L](u8B);if(onStyle){var P1L=k4X;P1L+=u21;P1L+=T21;P1L+=j8X;name=onStyle[G81][P8B]()+name[P1L](z81);}names[i]=name;}f5x[T1L]();return names[t1B](L6T);};Editor[Q1L][T8B]=function(node){var I1L=R7T;I1L+=Q5T;I1L+=e7T;var foundField=j6T;$[I1L](this[u21][J4X],function(name,field){var B1L=j9T;B1L+=Q21;B1L+=I0T;B1L+=p3T;var r1L=f5x.J21;r1L+=o9X;var K1L=z1B;K1L+=f5x.x21;var t1L=f5x.L21;t1L+=f5x.l21;f5x[t1L]();if($(field[K1L]())[r1L](node)[B1L]){foundField=field;}});return foundField;};Editor[g7X][e2X]=function(fieldNames){var q1L=B9T;q1L+=f5x.l21;if(fieldNames===undefined){var n1L=f5x.J21;n1L+=J9T;n1L+=Z0T;n1L+=u21;return this[n1L]();}else if(!$[h5X](fieldNames)){return[fieldNames];}f5x[q1L]();return fieldNames;};Editor[g7X][k1B]=function(fieldsIn,focus){var K8B='div.DTE ';var Q8B="tFocu";var r8B=/^jq:/;var t8B=":";var i9L=l9T;i9L+=Q8B;i9L+=u21;var E1L=f5x.p21;E1L+=f5x.f21;E1L+=g1T;var that=this;var field;var fields=$[E1L](fieldsIn,function(fieldOrName){var Y1L=u21;Y1L+=I8B;Y1L+=h1T;return typeof fieldOrName===Y1L?that[u21][J4X][fieldOrName]:fieldOrName;});if(typeof focus===o2X){field=fields[focus];}else if(focus){var V1L=f5x.s21;V1L+=u3B;V1L+=t8B;var c1L=z4T;c1L+=i0X;c1L+=F8B;if(focus[c1L](V1L)===J81){field=$(K8B+focus[Y2T](r8B,K0T));}else{var O9L=f5x.J21;O9L+=G5T;O9L+=f5x.x21;O9L+=a9T;field=this[u21][O9L][focus];}}else{document[B8B][n8B]();}this[u21][i9L]=field;if(field){field[r8T]();}};Editor[e9L][v9L]=function(opts){var s2B="nBlur";var L2B='.dteInline';var S2B='submit';var o2B="onR";var J2B="Background";var j2B="canReturnSubmit";var q8B="loseI";var w2B="displ";var l2B="eOnComplete";var c8B="down";var E8B="cb";var G2B="blurOnBackground";var A2B="rn";var H2B="closeOnComplet";var x2B="Blu";var v2B="ckground";var h2B="submitOn";var M2B="let";var p2B="submitOnReturn";var f2B="eturn";var O2B="titl";var Z2B="ubmitO";var g2B="Blur";var m2B="bmitOnRetu";var e2B="OnBa";var i2B="ditOpts";var Y9L=Q5T;Y9L+=q8B;Y9L+=E8B;var R9L=b5T;R9L+=Q21;var b9L=Y8B;b9L+=c8B;var C9L=b5T;C9L+=Q21;var W9L=V9T;W9L+=V8B;W9L+=T21;W9L+=f7B;var y9L=y9T;y9L+=w3B;y9L+=f5x.x21;var S9L=O2B;S9L+=f5x.x21;var p9L=L7X;p9L+=j8X;var f9L=o4T;f9L+=T21;f9L+=w7T;f9L+=f5x.x21;var o9L=f5x.x21;o9L+=i2B;var s9L=n8B;s9L+=e2B;s9L+=v2B;var N9L=e1T;N9L+=m2B;N9L+=A2B;var g9L=h2B;g9L+=g2B;var m9L=H2B;m9L+=f5x.x21;var that=this;var inlineCount=__inlineCounter++;var namespace=L2B+inlineCount;if(opts[m9L]!==undefined){var h9L=C0X;h9L+=l2B;var A9L=N2B;A9L+=M2B;A9L+=f5x.x21;opts[A9L]=opts[h9L]?o7X:T2T;}if(opts[g9L]!==undefined){var l9L=u21;l9L+=H9T;var L9L=u21;L9L+=Z2B;L9L+=s2B;var H9L=T6T;H9L+=x2B;H9L+=O7T;opts[H9L]=opts[L9L]?l9L:o7X;}if(opts[N9L]!==undefined){var Z9L=Q21;Z9L+=b5T;Z9L+=Q21;Z9L+=f5x.x21;var M9L=o2B;M9L+=f2B;opts[M9L]=opts[p2B]?S2B:Z9L;}if(opts[s9L]!==undefined){var x9L=T6T;x9L+=J2B;opts[x9L]=opts[G2B]?R4X:T2T;}this[u21][o9L]=opts;this[u21][y2B]=inlineCount;if(typeof opts[f9L]===p9L||typeof opts[S9L]===V6T){var G9L=z2B;G9L+=j9T;var J9L=O2B;J9L+=f5x.x21;this[t6X](opts[J9L]);opts[G9L]=z3T;}if(typeof opts[y9L]===E2T||typeof opts[W2B]===V6T){var z9L=n21;z9L+=g6X;z9L+=f5x.f21;z9L+=p0T;this[z9L](opts[W2B]);opts[W2B]=z3T;}if(typeof opts[W9L]!==q4X){var w9L=V9T;w9L+=D2B;w9L+=T6T;w9L+=u21;var D9L=F8X;D9L+=T21;D9L+=T6T;D9L+=u21;this[D9L](opts[w9L]);opts[r6X]=z3T;}$(document)[C9L](b9L+namespace,function(e){var b2B="canRetu";var F2B="rnSubmit";var j9L=w2B;j9L+=f5x.f21;j9L+=o7T;j9L+=u9T;var F9L=f5x.L21;F9L+=f5x.l21;f5x[F9L]();if(e[P8X]===a81&&that[u21][j9L]){var el=$(document[B8B]);if(el){var U9L=q4B;U9L+=C2B;var a9L=b2B;a9L+=F2B;var field=that[T8B](el);if(field&&typeof field[a9L]===U9L&&field[j2B](el)){e[a2B]();}}}});$(document)[R9L](u8X+namespace,function(e){var R2B="aye";var Q2B="fault";var T2B="tDe";var u2B="onReturn";var E2B="prev";var K81=37;var c2B="nex";var r2B="lur";var K2B="onEsc";var d2B="urnSubmit";var X2B="eyCode";var r81=39;var I2B="onEs";var B2B='.DTE_Form_Buttons';var k2B="canRe";var q2B="Code";var P2B="preven";var t2B="ntDefa";var B9L=j9T;B9L+=B8X;B9L+=T21;B9L+=e7T;var r9L=U2B;r9L+=M9T;r9L+=p8T;var k9L=w2B;k9L+=R2B;k9L+=f5x.S21;var X9L=E5X;X9L+=X2B;var el=$(document[B8B]);if(e[X9L]===a81&&that[u21][k9L]){var d9L=k2B;d9L+=T21;d9L+=d2B;var field=that[T8B](el);if(field&&typeof field[d9L]===V6T&&field[j2B](el)){var P9L=z6B;P9L+=b5T;P9L+=Q21;if(opts[u2B]===S2B){var u9L=P2B;u9L+=T2B;u9L+=Q2B;e[u9L]();that[j5X]();}else if(typeof opts[u2B]===P9L){e[a2B]();opts[u2B](that,e);}}}else if(e[P8X]===P81){var t9L=Q6B;t9L+=l9T;var Q9L=I2B;Q9L+=Q5T;var T9L=I8X;T9L+=t2B;T9L+=c8T;e[T9L]();if(typeof opts[K2B]===V6T){opts[K2B](that,e);}else if(opts[Q9L]===R4X){var I9L=V9T;I9L+=r2B;that[I9L]();}else if(opts[K2B]===t9L){var K9L=Q5T;K9L+=O8X;K9L+=f5x.x21;that[K9L]();}else if(opts[K2B]===S2B){that[j5X]();}}else if(el[r9L](B2B)[B9L]){var q9L=Y8B;q9L+=n2B;q9L+=f5x.S21;q9L+=f5x.x21;var n9L=Y8B;n9L+=q2B;if(e[n9L]===K81){el[E2B](Y2B)[r8T]();}else if(e[q9L]===r81){var E9L=c2B;E9L+=T21;el[E9L](Y2B)[r8T]();}}});this[u21][Y9L]=function(){var V2B="ydow";var V9L=E5X;V9L+=f5x.x21;V9L+=V2B;V9L+=Q21;var c9L=b5T;c9L+=E7B;$(document)[c9L](V9L+namespace);$(document)[N3X](u8X+namespace);};return namespace;};Editor[O0L][O5Q]=function(direction,action,data){var i5Q="legacyAja";var e5Q='send';var i0L=i5Q;i0L+=P21;if(!this[u21][i0L]||!data){return;}if(direction===e5Q){if(action===F6T||action===N6B){var m0L=u9T;m0L+=G5T;m0L+=T21;var v0L=f5x.S21;v0L+=f5x.f21;v0L+=X4T;var e0L=f5x.S21;e0L+=f5x.f21;e0L+=T21;e0L+=f5x.f21;var id;$[X2T](data[e0L],function(rowId,values){var v5Q='Editor: Multi-row editing is not supported by the legacy Ajax data format';if(id!==undefined){throw v5Q;}id=rowId;});data[v0L]=data[i6T][id];if(action===m0L){data[q4T]=id;}}else{var A0L=R4T;A0L+=T21;A0L+=f5x.f21;data[q4T]=$[I5B](data[A0L],function(values,id){f5x[O3T]();return id;});delete data[i6T];}}else{var g0L=O7T;g0L+=b5T;g0L+=P7T;var h0L=f5x.S21;h0L+=f5x.f21;h0L+=X4T;if(!data[h0L]&&data[g0L]){var L0L=n1T;L0L+=P7T;var H0L=f5x.S21;H0L+=f5x.f21;H0L+=T21;H0L+=f5x.f21;data[H0L]=[data[L0L]];}else if(!data[i6T]){var l0L=f5x.S21;l0L+=f5x.f21;l0L+=X4T;data[l0L]=[];}}};Editor[g7X][N0L]=function(json){var m5Q="ptions";var Z0L=b5T;Z0L+=m5Q;var M0L=f5x.L21;M0L+=f5x.l21;var that=this;f5x[M0L]();if(json[Z0L]){$[X2T](this[u21][J4X],function(name,field){var g5Q="pda";var h5Q="pdate";if(json[A5Q][name]!==undefined){var x0L=V5T;x0L+=h5Q;var s0L=c5B;s0L+=f5x.S21;var fieldInst=that[s0L](name);if(fieldInst&&fieldInst[x0L]){var o0L=V5T;o0L+=g5Q;o0L+=V21;fieldInst[o0L](json[A5Q][name]);}}});}};Editor[g7X][u5B]=function(el,msg){var l5Q="eOut";var N5Q="displa";var Z5Q="deIn";var H5Q="played";var L5Q="fad";var M5Q="fa";var p0L=B9T;p0L+=f5x.l21;var f0L=f5x.J21;f0L+=Q21;var canAnimate=$[f0L][u5X]?z3T:y3T;if(typeof msg===V6T){msg=msg(this,new DataTable[X5X](this[u21][k5X]));}el=$(el);f5x[p0L]();if(canAnimate){var S0L=b6B;S0L+=g1T;el[S0L]();}if(!msg){var J0L=f5x.S21;J0L+=G5T;J0L+=u21;J0L+=H5Q;if(this[u21][J0L]&&canAnimate){var G0L=L5Q;G0L+=l5Q;el[G0L](function(){el[R5X](K0T);});}else{var y0L=N5Q;y0L+=o7T;el[R5X](K0T)[R6T](y0L,T2T);}}else{if(this[u21][y5B]&&canAnimate){var W0L=M5Q;W0L+=Z5Q;var z0L=P5X;z0L+=f5x.p21;z0L+=w7T;el[z0L](msg)[W0L]();}else{var D0L=S5X;D0L+=u21;el[R5X](msg)[D0L](X6T,T5X);}}};Editor[w0L][C0L]=function(){var o5Q="multiInfoShown";var x5Q="multiEditabl";var F0L=o2T;F0L+=s5Q;F0L+=e7T;var b0L=F9T;b0L+=b7T;b0L+=f5x.S21;b0L+=u21;var fields=this[u21][b0L];var include=this[u21][e8X];var show=z3T;var state;if(!include){return;}for(var i=J81,ien=include[F0L];i<ien;i++){var j0L=x5Q;j0L+=f5x.x21;var field=fields[include[i]];var multiEditable=field[j0L]();if(field[x2T]()&&multiEditable&&show){state=z3T;show=y3T;}else if(field[x2T]()&&!multiEditable){state=z3T;}else{state=y3T;}fields[include[i]][o5Q](state);}};Editor[g7X][a0L]=function(type,immediate){var D5Q="ocus";var z5Q="focus.edito";var G5Q='submit.editor-internal';var f5Q="ub";var u5Q='opened';var W5Q="r-f";var d5Q="_multiInfo";var S5Q="captureFocu";var J5Q="layController";var V0L=g3T;V0L+=T21;V0L+=s0B;V0L+=Q21;var c0L=b5T;c0L+=g1T;c0L+=l6X;var Y0L=R6B;Y0L+=U5T;var T0L=V9T;T0L+=f5Q;T0L+=c5X;T0L+=f5x.x21;var P0L=f5x.p21;P0L+=p5Q;var d0L=b5T;d0L+=Q21;var k0L=f5x.J21;k0L+=b5T;k0L+=O7T;k0L+=f5x.p21;var X0L=f5x.S21;X0L+=b5T;X0L+=f5x.p21;var R0L=S5Q;R0L+=u21;var U0L=h2X;U0L+=J5Q;var that=this;var focusCapture=this[u21][U0L][R0L];if(focusCapture===undefined){focusCapture=z3T;}$(this[X0L][k0L])[N3X](G5Q)[d0L](G5Q,function(e){var y5Q="preventDefau";var u0L=y5Q;u0L+=J5T;f5x[f5x.z21]();e[u0L]();});if(focusCapture&&(type===P0L||type===T0L)){var I0L=z5Q;I0L+=W5Q;I0L+=D5Q;var Q0L=V9T;Q0L+=G9T;Q0L+=o7T;$(Q0L)[T6T](I0L,function(){var a5Q="leme";var X5Q="setFocus";var j5Q="ctiveE";var b5Q="ED";var C5Q=".DT";var U5Q='.DTE';var k5Q="setF";var n0L=w7T;n0L+=w5Q;n0L+=e7T;var B0L=C5Q;B0L+=b5Q;var r0L=w7T;r0L+=A8X;r0L+=T21;r0L+=e7T;var K0L=F5Q;K0L+=h8T;var t0L=f5x.f21;t0L+=j5Q;t0L+=a5Q;t0L+=U5T;if($(document[t0L])[K0L](U5Q)[r0L]===J81&&$(document[B8B])[R5Q](B0L)[n0L]===J81){if(that[u21][X5Q]){var E0L=f5x.J21;E0L+=b5T;E0L+=Q5T;E0L+=x9B;var q0L=k5Q;q0L+=D5Q;that[u21][q0L][E0L]();}}});}this[d5Q]();this[Y0L](c0L,[type,this[u21][V0L]]);if(immediate){this[Y6X](u5Q,[type,this[u21][U8X]]);}return z3T;};Editor[O3L][P5Q]=function(type){var t5Q="_cle";var Q5Q="Icb";var K5Q="arDynam";var B5Q="closeIc";var I5Q="ubb";var r5Q='cancelOpen';var e3L=g3T;e3L+=m0B;e3L+=Q21;var i3L=B9T;i3L+=f5x.l21;f5x[i3L]();if(this[Y6X](T5Q,[type,this[u21][e3L]])===y3T){var H3L=Q5T;H3L+=G5B;H3L+=Q5Q;var h3L=V9T;h3L+=I5Q;h3L+=j9T;var A3L=h0T;A3L+=i0X;var m3L=h0T;m3L+=i0X;var v3L=t5Q;v3L+=K5Q;v3L+=W8X;v3L+=I5X;this[v3L]();this[Y6X](r5Q,[type,this[u21][U8X]]);if((this[u21][m3L]===H1B||this[u21][A3L]===h3L)&&this[u21][n6B]){var g3L=B5Q;g3L+=V9T;this[u21][g3L]();}this[u21][H3L]=j6T;return y3T;}this[u21][y5B]=type;return z3T;};Editor[L3L][l3L]=function(processing){var E5Q="tive";var q5Q=".DTE";var n5Q="sing";var c5Q="sses";var Y5Q="rocessi";var x3L=P2T;x3L+=u21;x3L+=n5Q;var s3L=g9X;s3L+=q5Q;var Z3L=g3T;Z3L+=E5Q;var M3L=g1T;M3L+=Y5Q;M3L+=Q21;M3L+=I0T;var N3L=b1T;N3L+=f5x.f21;N3L+=c5Q;var procClass=this[N3L][M3L][Z3L];$([s3L,this[d6T][H6T]])[e7X](procClass,processing);this[u21][L9B]=processing;this[Y6X](x3L,[processing]);};Editor[g7X][o3L]=function(successCallback,errorCallback,formatdata,hide){var g7Q="IfC";var C7Q="onComplete";var O7Q="jax";var W7Q="cti";var e7Q="sen";var m7Q="odifier";var i7Q="Url";var h7Q="bTa";var V5Q="tTable";var v7Q="_legacyAj";var H7Q="hanged";var b7Q='preSubmit';var z7Q="itComplete";var V3L=T7T;V3L+=i0T;V3L+=V5Q;var c3L=X1T;c3L+=O7Q;var Y3L=b4X;Y3L+=i7Q;var q3L=Z9B;q3L+=f5x.x21;q3L+=Q21;q3L+=T21;var n3L=e7Q;n3L+=f5x.S21;var B3L=v7Q;B3L+=S0B;var t3L=j9B;t3L+=f5x.x21;var y3L=f5x.x21;y3L+=f5x.S21;y3L+=m1T;var G3L=l2X;G3L+=R7T;G3L+=T21;G3L+=f5x.x21;var S3L=q3B;S3L+=I3X;S3L+=w7T;S3L+=f5x.x21;var p3L=f5x.p21;p3L+=m7Q;var f3L=f5x.x21;f3L+=P21;f3L+=T21;var that=this;var i,iLen,eventRet,errorNodes;var changed=y3T,allData={},changedData={};var setBuilder=DataTable[f3L][A7Q][h6T];var dataSource=this[u21][e8B];var fields=this[u21][J4X];var editCount=this[u21][y2B];var modifier=this[u21][p3L];var editFields=this[u21][f2X];var editData=this[u21][x8B];var opts=this[u21][d1B];var changedSubmit=opts[j5X];var submitParamsLocal;var action=this[u21][U8X];var submitParams={"data":{}};submitParams[this[u21][V3B]]=action;if(this[u21][S3L]){var J3L=f5x.S21;J3L+=h7Q;J3L+=V9T;J3L+=j9T;submitParams[k5X]=this[u21][J3L];}if(action===G3L||action===y3L){var R3L=f5x.f21;R3L+=K8X;R3L+=g7Q;R3L+=H7Q;var U3L=l2X;U3L+=R7T;U3L+=V21;$[X2T](editFields,function(idSrc,edit){var l7Q="ptyObje";var G7Q="isEmptyObject";var a3L=L7Q;a3L+=l7Q;a3L+=f5x.o21;var allRowData={};var changedRowData={};$[X2T](fields,function(name,field){var o7Q="xO";var J7Q='-many-count';var p7Q="alFromDa";var S7Q=/\[.*$/;var s7Q="[";var M7Q="com";var f7Q="ltiGe";var z3L=N7Q;z3L+=m1T;z3L+=f9B;z3L+=j9T;if(edit[J4X][name]&&field[z3L]()){var j3L=M7Q;j3L+=c7B;var F3L=f5x.x21;F3L+=f5x.S21;F3L+=G5T;F3L+=T21;var b3L=O7T;b3L+=f5x.x21;b3L+=Z7Q;b3L+=f5x.x21;var C3L=s7Q;C3L+=A3T;var w3L=x7Q;w3L+=o7Q;w3L+=f5x.J21;var W3L=f5x.p21;W3L+=V5T;W3L+=f7Q;W3L+=T21;var multiGet=field[W3L]();var builder=setBuilder(name);if(multiGet[idSrc]===undefined){var D3L=E6T;D3L+=p7Q;D3L+=X4T;var originalVal=field[D3L](edit[i6T]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=$[h5X](value)&&name[w3L](C3L)!==-G81?setBuilder(name[b3L](S7Q,K0T)+J7Q):j6T;builder(allRowData,value);if(manyBuilder){manyBuilder(allRowData,value[G3T]);}if(action===F3L&&(!editData[name]||!field[j3L](value,editData[name][idSrc]))){builder(changedRowData,value);changed=z3T;if(manyBuilder){manyBuilder(changedRowData,value[G3T]);}}}});if(!$[a3L](allRowData)){allData[idSrc]=allRowData;}if(!$[G7Q](changedRowData)){changedData[idSrc]=changedRowData;}});if(action===U3L||changedSubmit===f7X||changedSubmit===R3L&&changed){var X3L=f5x.S21;X3L+=f5x.f21;X3L+=T21;X3L+=f5x.f21;submitParams[X3L]=allData;}else if(changedSubmit===y7Q&&changed){var k3L=R4T;k3L+=T21;k3L+=f5x.f21;submitParams[k3L]=changedData;}else{var I3L=N7Q;I3L+=z7Q;var T3L=q4B;T3L+=W7Q;T3L+=b5T;T3L+=Q21;var u3L=Q6B;u3L+=u21;u3L+=f5x.x21;var d3L=D7Q;d3L+=w7Q;d3L+=C7T;this[u21][U8X]=j6T;if(opts[d3L]===u3L&&(hide===undefined||hide)){var P3L=T7T;P3L+=b1T;P3L+=F1T;P3L+=f5x.x21;this[P3L](y3T);}else if(typeof opts[C7Q]===T3L){opts[C7Q](this);}if(successCallback){var Q3L=Q5T;Q3L+=f5x.f21;Q3L+=w7T;Q3L+=w7T;successCallback[Q3L](this);}this[l9B](y3T);this[Y6X](I3L);return;}}else if(action===t3L){var K3L=R7T;K3L+=N6X;$[K3L](editFields,function(idSrc,edit){var r3L=f5x.S21;r3L+=E2X;submitParams[r3L][idSrc]=edit[i6T];});}this[B3L](n3L,action,submitParams);submitParamsLocal=$[n4T](z3T,{},submitParams);if(formatdata){formatdata(submitParams);}if(this[q3L](b7Q,[submitParams,action])===y3T){var E3L=A1T;E3L+=G5T;E3L+=B8X;this[E3L](y3T);return;}var submitWire=this[u21][b4X]||this[u21][Y3L]?this[c3L]:this[V3L];submitWire[m8T](this,submitParams,function(json,notGood,xhr){var F7Q="_submitSuccess";var O4L=g3T;O4L+=m0B;O4L+=Q21;that[F7Q](json,notGood,submitParams,submitParamsLocal,that[u21][O4L],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var j7Q="_sub";var a7Q="mitEr";var e4L=N9B;e4L+=b5T;e4L+=Q21;var i4L=j7Q;i4L+=a7Q;i4L+=w9T;f5x[O3T]();that[i4L](xhr,err,thrown,errorCallback,submitParams,that[u21][e4L]);},submitParams);};Editor[g7X][U7Q]=function(data,success,error,submitParams){var I7Q="Source";var T7Q="urce";var k7Q="tObjectDa";var X7Q="_fnGe";var A4L=O7T;A4L+=f5x.x21;A4L+=f5x.p21;A4L+=R7Q;var m4L=G5T;m4L+=f5x.S21;m4L+=j21;m4L+=B3B;var v4L=X7Q;v4L+=k7Q;v4L+=d7Q;var that=this;var action=data[U8X];var out={data:[]};var idGet=DataTable[B5T][A7Q][v4L](this[u21][u7Q]);var idSet=DataTable[B5T][A7Q][h6T](this[u21][m4L]);f5x[O3T]();if(action!==A4L){var N4L=R7T;N4L+=N6X;var l4L=P7Q;l4L+=T7Q;var L4L=S9T;L4L+=F9T;L4L+=f5x.x21;L4L+=O7T;var H4L=c5B;H4L+=f8B;var g4L=Q7Q;g4L+=I7Q;var h4L=f5x.p21;h4L+=p5Q;var originalData=this[u21][H0T]===h4L?this[g4L](H4L,this[L4L]()):this[l4L](Y4X,this[E3X]());$[N4L](data[i6T],function(key,vals){var t7Q="_fnEx";var s4L=f5x.S21;s4L+=f5x.f21;s4L+=T21;s4L+=f5x.f21;var Z4L=u9T;Z4L+=m1T;var M4L=t7Q;M4L+=t3T;var toSave;var extender=$[B0T][K7Q][A7Q][M4L];f5x[O3T]();if(action===Z4L){var rowData=originalData[key][i6T];toSave=extender({},rowData,z3T);toSave=extender(toSave,vals,z3T);}else{toSave=extender({},vals,z3T);}var overrideId=idGet(toSave);if(action===F6T&&overrideId===undefined){idSet(toSave,+new Date()+K0T+key);}else{idSet(toSave,overrideId);}out[s4L][f3T](toSave);});}success(out);};Editor[g7X][x4L]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var w1Q="postCreat";var Y7Q='receive';var q7Q="stS";var z1Q="taSou";var b1Q="reE";var G1Q="_dataS";var F1Q='postEdit';var S1Q="ucce";var J1Q="ommit";var C1Q="preCre";var j1Q="preRemo";var c7Q="submitUn";var R1Q="mplete";var a1Q='postRemove';var e1Q="ieldEr";var O1Q="<b";var U1Q='commit';var p1Q="submitS";var B7Q="eldErrors";var v1Q="rors";var V7Q="successful";var r7Q="submitCom";var D1Q='setData';var o6L=r7Q;o6L+=p5X;o6L+=f4X;o6L+=f5x.x21;var x6L=i7B;x6L+=t6B;var p4L=F9T;p4L+=B7Q;var f4L=f5x.x21;f4L+=O7T;f4L+=O7T;f4L+=x5T;var o4L=n7Q;o4L+=q7Q;o4L+=E7Q;o4L+=T21;var that=this;var setData;var fields=this[u21][J4X];var opts=this[u21][d1B];var modifier=this[u21][E3X];this[O5Q](Y7Q,action,json);this[Y6X](o4L,[json,submitParams,action,xhr]);if(!json[k8T]){json[k8T]=f5x.M21;}if(!json[E0B]){json[E0B]=[];}if(notGood||json[f4L]||json[p4L][G3T]){var u4L=c7Q;u4L+=V7Q;var d4L=i7B;d4L+=m2X;d4L+=U5T;var k4L=O1Q;k4L+=i1Q;var X4L=U9T;X4L+=b5T;X4L+=O7T;var G4L=f5x.J21;G4L+=e1Q;G4L+=v1Q;var J4L=f5x.x21;J4L+=g3T;J4L+=e7T;var globalError=[];if(json[k8T]){var S4L=g1T;S4L+=V5T;S4L+=u21;S4L+=e7T;globalError[S4L](json[k8T]);}$[J4L](json[G4L],function(i,err){var A1Q="Err";var M1Q="onFieldError";var g1Q="onF";var f1Q=': ';var H1Q="ieldE";var N1Q="position";var h1Q="atus";var x1Q="Er";var s1Q="dEr";var Z1Q="Fiel";var m1Q='Unknown field: ';var l1Q="yC";f5x[O3T]();var field=fields[err[c4T]];if(!field){var y4L=Q21;y4L+=f5x.f21;y4L+=n21;throw new Error(m1Q+err[y4L]);}else if(field[y5B]()){var D4L=A1Q;D4L+=b5T;D4L+=O7T;var W4L=L7X;W4L+=h1Q;var z4L=f5x.x21;z4L+=O7T;z4L+=O7T;z4L+=x5T;field[z4L](err[W4L]||D4L);if(i===J81){var w4L=g1Q;w4L+=H1Q;w4L+=u3T;if(opts[w4L]===B8T){var F4L=X7B;F4L+=J6X;var b4L=L1Q;b4L+=l1Q;b4L+=b5T;b4L+=N3B;var C4L=f5x.S21;C4L+=b5T;C4L+=f5x.p21;that[R1X]($(that[C4L][b4L],that[u21][F4L]),{scrollTop:$(field[Y3X]())[N1Q]()[A3X]},e21);field[r8T]();}else if(typeof opts[M1Q]===V6T){var j4L=T6T;j4L+=Z1Q;j4L+=s1Q;j4L+=w9T;opts[j4L](that,err);}}}else{var R4L=x1Q;R4L+=O7T;R4L+=b5T;R4L+=O7T;var U4L=Q21;U4L+=o1Q;U4L+=f5x.x21;var a4L=g1T;a4L+=x9B;a4L+=e7T;globalError[a4L](field[U4L]()+f1Q+(err[Y0B]||R4L));}});this[X4L](globalError[t1B](k4L));this[d4L](u4L,[json]);if(errorCallback){var P4L=Q5T;P4L+=f5x.f21;P4L+=K8X;errorCallback[P4L](that,json);}}else{var s6L=p1Q;s6L+=S1Q;s6L+=g6X;var Z6L=T7T;Z6L+=R1B;var i6L=j9B;i6L+=f5x.x21;var T4L=A5B;T4L+=f5x.f21;var store={};if(json[T4L]&&(action===x2X||action===b5B)){var O6L=Q5T;O6L+=J1Q;var V4L=G1Q;V4L+=A7B;var t4L=f5x.S21;t4L+=f5x.f21;t4L+=T21;t4L+=f5x.f21;var I4L=g1T;I4L+=B2T;var Q4L=y1Q;Q4L+=z1Q;Q4L+=Y1B;this[Q4L](I4L,action,modifier,submitParamsLocal,json,store);for(var i=J81;i<json[t4L][G3T];i++){var B4L=W1Q;B4L+=M5T;var r4L=Z9B;r4L+=O0X;var K4L=G5T;K4L+=f5x.S21;setData=json[i6T][i];var id=this[l4X](K4L,setData);this[r4L](D1Q,[json,setData,action]);if(action===B4L){var E4L=w1Q;E4L+=f5x.x21;var q4L=Q7Q;q4L+=j21;q4L+=A7B;var n4L=C1Q;n4L+=f5x.f21;n4L+=V21;this[Y6X](n4L,[json,setData,id]);this[q4L](F6T,fields,setData,store);this[Y6X]([F6T,E4L],[json,setData,id]);}else if(action===b5B){var c4L=u9T;c4L+=G5T;c4L+=T21;var Y4L=g1T;Y4L+=b1Q;Y4L+=k9T;Y4L+=T21;this[Y6X](Y4L,[json,setData,id]);this[l4X](N6B,modifier,fields,setData,store);this[Y6X]([c4L,F1Q],[json,setData,id]);}}this[V4L](O6L,action,modifier,json[i6T],store);}else if(action===i6L){var g6L=G5T;g6L+=f5x.S21;g6L+=u21;var h6L=P7Q;h6L+=O0T;h6L+=Q5T;h6L+=f5x.x21;var A6L=j1Q;A6L+=E6T;A6L+=f5x.x21;var m6L=T7T;m6L+=a1B;m6L+=l6X;m6L+=T21;var v6L=g1T;v6L+=B2T;var e6L=E1B;e6L+=Y1B;this[e6L](v6L,action,modifier,submitParamsLocal,json,store);this[m6L](A6L,[json,this[B5B]()]);this[h6L](z9B,modifier,fields,store);this[Y6X]([z9B,a1Q],[json,this[g6L]()]);this[l4X](U1Q,action,modifier,json[i6T],store);}if(editCount===this[u21][y2B]){var N6L=b5T;N6L+=Q21;N6L+=n2B;N6L+=R1Q;var l6L=Q5T;l6L+=u2T;l6L+=u21;l6L+=f5x.x21;var L6L=N2B;L6L+=w7T;L6L+=f4X;L6L+=f5x.x21;var H6L=f5x.f21;H6L+=C2B;var action=this[u21][U8X];this[u21][H6L]=j6T;if(opts[L6L]===l6L&&(hide===undefined||hide)){this[v2X](json[i6T]?z3T:y3T,action);}else if(typeof opts[N6L]===V6T){var M6L=D7Q;M6L+=w7Q;M6L+=C7T;opts[M6L](this);}}if(successCallback){successCallback[m8T](that,json);}this[Z6L](s6L,[json,setData,action]);}this[l9B](y3T);this[x6L](o6L,[json,setData,action]);};Editor[f6L][X1Q]=function(xhr,err,thrown,errorCallback,submitParams,action){var k1Q="tEr";var P1Q='submitComplete';var d1Q="tS";var u1Q="system";var z6L=N7Q;z6L+=G5T;z6L+=k1Q;z6L+=w9T;var y6L=i7B;y6L+=E6T;y6L+=f5x.x21;y6L+=U5T;var G6L=B9T;G6L+=f5x.l21;var J6L=d5T;J6L+=w9T;var S6L=g1T;S6L+=F1T;S6L+=d1Q;S6L+=H9T;var p6L=i7B;p6L+=E6T;p6L+=l6X;p6L+=T21;this[p6L](S6L,[j6T,submitParams,action,xhr]);this[k8T](this[I4T][J6L][u1Q]);this[l9B](y3T);f5x[G6L]();if(errorCallback){errorCallback[m8T](this,xhr,err,thrown);}this[y6L]([z6L,P1Q],[xhr,err,thrown,submitParams]);};Editor[W6L][B4X]=function(fn){var T1Q="Tabl";var t1Q="Com";var I1Q="bServerSide";var X6L=u4X;X6L+=j9T;var R6L=k9T;R6L+=X0X;R6L+=O1B;var b6L=T21;b6L+=I3X;b6L+=j9T;var C6L=i6T;C6L+=T1Q;C6L+=f5x.x21;var w6L=f5x.J21;w6L+=Q21;var D6L=T21;D6L+=I3X;D6L+=j9T;var that=this;var dt=this[u21][D6L]?new $[w6L][C6L][X5X](this[u21][b6L]):j6T;var ssp=y3T;if(dt){ssp=dt[M7X]()[J81][Q1Q][I1Q];}if(this[u21][L9B]){var F6L=N7Q;F6L+=m1T;F6L+=t1Q;F6L+=K1Q;this[r1Q](F6L,function(){var j6L=B9T;j6L+=f5x.l21;f5x[j6L]();if(ssp){var U6L=B1Q;U6L+=f5x.f21;U6L+=P7T;var a6L=b5T;a6L+=f9T;dt[a6L](U6L,fn);}else{setTimeout(function(){f5x[O3T]();fn();},b81);}});return z3T;}else if(this[R6L]()===H1B||this[e2T]()===X6L){var K6L=V9T;K6L+=w7T;K6L+=V5T;K6L+=O7T;var d6L=Q6B;d6L+=u21;d6L+=f5x.x21;var k6L=b5T;k6L+=Q21;k6L+=f5x.x21;this[k6L](d6L,function(){var q1Q="submitCo";var E1Q="mpl";var n1Q="ssin";var P6L=P2T;P6L+=n1Q;P6L+=I0T;var u6L=B9T;u6L+=f5x.l21;f5x[u6L]();if(!that[u21][P6L]){setTimeout(function(){var T6L=B9T;T6L+=f5x.l21;f5x[T6L]();if(that[u21]){fn();}},b81);}else{var I6L=q1Q;I6L+=E1Q;I6L+=C7T;var Q6L=b5T;Q6L+=Q21;Q6L+=f5x.x21;that[Q6L](I6L,function(e,json){var Y1Q='draw';if(ssp&&json){var t6L=T6T;t6L+=f5x.x21;dt[t6L](Y1Q,fn);}else{setTimeout(function(){if(that[u21]){fn();}},b81);}});}})[K6L]();return z3T;}return y3T;};Editor[r6L][B6L]=function(name,arr){for(var i=J81,ien=arr[G3T];i<ien;i++){if(name==arr[i]){return i;}}return-G81;};Editor[n6L]={"table":j6T,"ajaxUrl":j6T,"fields":[],"display":c1Q,"ajax":j6T,"idSrc":q6L,"events":{},"i18n":{"create":{"button":E6L,"title":Y6L,"submit":c6L},"edit":{"button":V6L,"title":O8L,"submit":V1Q},"remove":{"button":i8L,"title":e8L,"submit":v8L,"confirm":{"_":O9Q,"1":i9Q}},"error":{"system":m8L},multi:{title:A8L,info:e9Q,restore:v9Q,noMulti:m9Q},datetime:{previous:A9Q,next:h8L,months:[g8L,H8L,h9Q,g9Q,H9Q,L8L,l8L,L9Q,N8L,M8L,l9Q,Z8L],weekdays:[N9Q,M9Q,s8L,Z9Q,x8L,s9Q,o8L],amPm:[f8L,x9Q],hours:p8L,minutes:o9Q,seconds:S8L,unknown:K1B}},formOptions:{bubble:$[n4T]({},Editor[N7X][x7X],{title:y3T,message:y3T,buttons:G8X,submit:y7Q}),inline:$[J8L]({},Editor[N7X][G8L],{buttons:y3T,submit:y7Q}),main:$[y8L]({},Editor[N7X][z8L])},legacyAjax:y3T,actionName:W8L};(function(){var r0Q="htm";var V0Q="[data-editor-";var f3Q='keyless';var p0Q="cancelled";var s0Q="any";var f9Q="taSources";var D9Q="drawType";var j0Q="ell";var f0Q="rowIds";var v0Q="_fnGetObjectDataFn";var I9Q="isA";var F5Y=B9T;F5Y+=f5x.l21;var D8L=R4T;D8L+=f9Q;var __dataSources=Editor[D8L]={};var __dtIsSsp=function(dt,editor){var W9Q="tti";var z9Q="atur";var p9Q="itO";var y9Q="oFe";var G9Q="erverSi";var S9Q="pts";var J9Q="bS";var a8L=Q21;a8L+=r1Q;var j8L=f5x.x21;j8L+=f5x.S21;j8L+=p9Q;j8L+=S9Q;var F8L=J9Q;F8L+=G9Q;F8L+=i0X;var b8L=y9Q;b8L+=z9Q;b8L+=f5x.x21;b8L+=u21;var C8L=l9T;C8L+=W9Q;C8L+=j0B;var w8L=f5x.L21;w8L+=f5x.l21;f5x[w8L]();return dt[C8L]()[J81][b8L][F8L]&&editor[u21][j8L][D9Q]!==a8L;};var __dtApi=function(table){var w9Q="ataTab";var U8L=c21;U8L+=w9Q;U8L+=j9T;return $(table)[U8L]();};var __dtHighlight=function(node){var R8L=f5x.L21;R8L+=f5x.l21;f5x[R8L]();node=$(node);setTimeout(function(){var b9Q="ddClas";var C9Q="ghlight";var k8L=y4X;k8L+=C9Q;var X8L=f5x.f21;X8L+=b9Q;X8L+=u21;node[X8L](k8L);setTimeout(function(){var j9Q="noHighli";var F9Q="highl";var T8L=F9Q;T8L+=z7X;var P8L=j9Q;P8L+=I0T;P8L+=P5X;var u8L=f5x.f21;u8L+=a9Q;u8L+=U9Q;var d8L=B9T;d8L+=f5x.l21;f5x[d8L]();node[u8L](P8L)[k9X](T8L);setTimeout(function(){var R9Q="Highli";var I8L=Q21;I8L+=b5T;I8L+=R9Q;I8L+=A9X;var Q8L=B9T;Q8L+=f5x.l21;f5x[Q8L]();node[k9X](I8L);},v21);},e21);},X81);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){var X9Q="exe";var r8L=f5x.x21;r8L+=f5x.f21;r8L+=Q5T;r8L+=e7T;var K8L=z4T;K8L+=f5x.S21;K8L+=X9Q;K8L+=u21;var t8L=O7T;t8L+=b5T;t8L+=P7T;t8L+=u21;dt[t8L](identifier)[K8L]()[r8L](function(idx){var u9Q="le to find row identifier";var U81=14;var k9Q="ow";var d9Q="Unab";var n8L=f5x.S21;n8L+=f5x.f21;n8L+=T21;n8L+=f5x.f21;var B8L=O7T;B8L+=k9Q;var row=dt[B8L](idx);var data=row[n8L]();var idSrc=idFn(data);if(idSrc===undefined){var q8L=d9Q;q8L+=u9Q;Editor[k8T](q8L,U81);}out[idSrc]={idSrc:idSrc,data:data,node:row[Y3X](),fields:fields,type:p7X};});};var __dtFieldsFromIdx=function(dt,fields,idx){var T9Q="oC";var Q9Q="olum";var K9Q="omatically determine field from source. Please specify the field name.";var P9Q="mD";var t9Q="Unable to aut";var A2L=L7Q;A2L+=J8X;A2L+=r4X;A2L+=T21;var e2L=R7T;e2L+=Q5T;e2L+=e7T;var V8L=P9Q;V8L+=f5x.f21;V8L+=T21;V8L+=f5x.f21;var c8L=f5x.x21;c8L+=f5x.S21;c8L+=G5T;c8L+=c4B;var Y8L=u9T;Y8L+=G5T;Y8L+=n5B;Y8L+=Z0T;var E8L=f5x.f21;E8L+=T9Q;E8L+=Q9Q;E8L+=r5T;var field;var col=dt[M7X]()[J81][E8L][idx];var dataSrc=col[Y8L]!==undefined?col[c8L]:col[V8L];f5x[f5x.z21]();var resolvedFields={};var run=function(field,dataSrc){var O2L=Q21;O2L+=f5x.f21;O2L+=n21;if(field[O2L]()===dataSrc){var i2L=d4T;i2L+=f5x.p21;i2L+=f5x.x21;resolvedFields[field[i2L]()]=field;}};$[e2L](fields,function(name,fieldInst){var v2L=I9Q;v2L+=C8B;v2L+=f5x.f21;v2L+=o7T;if($[v2L](dataSrc)){var m2L=o2T;m2L+=I0T;m2L+=T21;m2L+=e7T;for(var i=J81;i<dataSrc[m2L];i++){run(fieldInst,dataSrc[i]);}}else{run(fieldInst,dataSrc);}});if($[A2L](resolvedFields)){var h2L=t9Q;h2L+=K9Q;Editor[k8T](h2L,F81);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var g2L=f5x.x21;g2L+=f5x.f21;g2L+=Q5T;g2L+=e7T;dt[r9Q](identifier)[B9Q]()[g2L](function(idx){var V9Q="ttach";var Y9Q="column";var O0Q="fixedNode";var q9Q="attac";var E9Q="obj";var n9Q="Fields";var o2L=h2X;o2L+=w7T;o2L+=O1B;o2L+=n9Q;var x2L=B5T;x2L+=f5x.x21;x2L+=i5T;var s2L=K5X;s2L+=f5x.S21;s2L+=f5x.x21;var Z2L=q9Q;Z2L+=e7T;var N2L=E9Q;N2L+=f5x.x21;N2L+=Q5T;N2L+=T21;var l2L=f5x.S21;l2L+=f5x.f21;l2L+=X4T;var L2L=O7T;L2L+=b5T;L2L+=P7T;var H2L=Q5T;H2L+=f5x.x21;H2L+=w7T;H2L+=w7T;var cell=dt[H2L](idx);var row=dt[q3X](idx[L2L]);var data=row[l2L]();var idSrc=idFn(data);var fields=forceFields||__dtFieldsFromIdx(dt,allFields,idx[Y9Q]);var isNode=typeof identifier===N2L&&identifier[c9Q]||identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){var M2L=f5x.f21;M2L+=V9Q;prevAttach=out[idSrc][M2L];prevDisplayFields=out[idSrc][L7B];}__dtRowSelector(out,dt,idx[q3X],allFields,idFn);out[idSrc][r3X]=prevAttach||[];out[idSrc][Z2L][f3T](isNode?$(identifier)[J5X](J81):cell[O0Q]?cell[O0Q]():cell[s2L]());out[idSrc][L7B]=prevDisplayFields||{};$[x2L](out[idSrc][o2L],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var p2L=f5x.x21;p2L+=f5x.f21;p2L+=N6X;var f2L=o9X;f2L+=f5x.x21;f2L+=P21;f2L+=v5T;f5x[O3T]();dt[r9Q](j6T,identifier)[f2L]()[p2L](function(idx){__dtCellSelector(out,dt,idx,fields,idFn);});};var __dtjqId=function(id){var i0Q='\\$1';var J2L=O7T;J2L+=t2T;J2L+=w7T;J2L+=K2T;var S2L=f5x.L21;S2L+=f5x.l21;f5x[S2L]();return typeof id===E2T?q5B+id[J2L](/(:|\.|\[|\]|,)/g,i0Q):q5B+id;};__dataSources[n0T]={id:function(data){var e0Q="_fnGetObjectDa";var z2L=e0Q;z2L+=d7Q;var y2L=b5T;y2L+=U2T;y2L+=t3X;var G2L=f5x.L21;G2L+=f5x.l21;f5x[G2L]();var idFn=DataTable[B5T][y2L][z2L](this[u21][u7Q]);return idFn(data);},individual:function(identifier,fieldNames){var idFn=DataTable[B5T][A7Q][v0Q](this[u21][u7Q]);var dt=__dtApi(this[u21][k5X]);var fields=this[u21][J4X];var out={};var forceFields;var responsiveNode;if(fieldNames){var D2L=f5x.x21;D2L+=f5x.f21;D2L+=N6X;var W2L=G5T;W2L+=m0Q;W2L+=f5x.f21;W2L+=o7T;if(!$[W2L](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[D2L](fieldNames,function(i,name){forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var h0Q="mns";var L0Q="Src";var l0Q="Ap";var g0Q="Pla";var H0Q="inObject";var A0Q="colu";var a2L=A0Q;a2L+=h0Q;var j2L=G5T;j2L+=u21;j2L+=g0Q;j2L+=H0Q;var F2L=F9T;F2L+=b7T;F2L+=f8B;var b2L=q4T;b2L+=L0Q;var C2L=b5T;C2L+=l0Q;C2L+=G5T;var w2L=I3T;w2L+=T21;var idFn=DataTable[w2L][C2L][v0Q](this[u21][b2L]);f5x[f5x.z21]();var dt=__dtApi(this[u21][k5X]);var fields=this[u21][F2L];var out={};if($[j2L](identifier)&&(identifier[e5B]!==undefined||identifier[a2L]!==undefined||identifier[r9Q]!==undefined)){var R2L=y0T;R2L+=w7T;R2L+=g0T;if(identifier[e5B]!==undefined){var U2L=q3X;U2L+=u21;__dtRowSelector(out,dt,identifier[U2L],fields,idFn);}if(identifier[N0Q]!==undefined){__dtColumnSelector(out,dt,identifier[N0Q],fields,idFn);}if(identifier[R2L]!==undefined){__dtCellSelector(out,dt,identifier[r9Q],fields,idFn);}}else{__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var dt=__dtApi(this[u21][k5X]);if(!__dtIsSsp(dt,this)){var d2L=Q21;d2L+=b5T;d2L+=f5x.S21;d2L+=f5x.x21;var k2L=f5x.f21;k2L+=f5x.S21;k2L+=f5x.S21;var X2L=O7T;X2L+=b5T;X2L+=P7T;var row=dt[X2L][k2L](data);__dtHighlight(row[d2L]());}},edit:function(identifier,fields,data,store){var x0Q="rowId";var o0Q="_fnExtend";var M0Q="editOpt";var P2L=Q21;P2L+=T6T;P2L+=f5x.x21;var u2L=M0Q;u2L+=u21;var that=this;var dt=__dtApi(this[u21][k5X]);if(!__dtIsSsp(dt,this)||this[u21][u2L][D9Q]===P2L){var t2L=c6B;t2L+=o7T;var I2L=Q5T;I2L+=h7X;var Q2L=G5T;Q2L+=f5x.S21;var T2L=R4T;T2L+=X4T;T2L+=Z0Q;T2L+=j9T;var rowId=__dataSources[T2L][Q2L][I2L](this,data);var row;try{row=dt[q3X](__dtjqId(rowId));}catch(e){row=dt;}if(!row[t2L]()){var K2L=n1T;K2L+=P7T;row=dt[K2L](function(rowIdx,rowData,rowNode){var r2L=Q5T;r2L+=f5x.f21;r2L+=K8X;return rowId==__dataSources[n0T][q4T][r2L](that,rowData);});}if(row[s0Q]()){var q2L=u21;q2L+=p5X;q2L+=m3B;var n2L=x0Q;n2L+=u21;var B2L=b5T;B2L+=U2T;B2L+=g1T;B2L+=G5T;var extender=$[B0T][K7Q][B2L][o0Q];var toSave=extender({},row[i6T](),z3T);toSave=extender(toSave,data,z3T);row[i6T](toSave);var idx=$[W4X](rowId,store[n2L]);store[f0Q][q2L](idx,G81);}else{row=dt[q3X][A4X](data);}__dtHighlight(row[Y3X]());}},remove:function(identifier,fields,store){var S0Q="ws";var J0Q="every";var E2L=j9T;E2L+=c2X;E2L+=e7T;var that=this;var dt=__dtApi(this[u21][k5X]);var cancelled=store[p0Q];if(cancelled[E2L]===J81){var Y2L=O7T;Y2L+=b5T;Y2L+=P7T;Y2L+=u21;dt[Y2L](identifier)[W5X]();}else{var v5Y=O7T;v5Y+=F9B;v5Y+=R7Q;var e5Y=n1T;e5Y+=S0Q;var indexes=[];dt[e5B](identifier)[J0Q](function(){var G0Q="Arr";var y0Q="index";var O5Y=z4T;O5Y+=G0Q;O5Y+=O1B;var V2L=f5x.S21;V2L+=E2X;var c2L=G5T;c2L+=f5x.S21;var id=__dataSources[n0T][c2L][m8T](that,this[V2L]());if($[O5Y](id,cancelled)===-G81){var i5Y=g1T;i5Y+=V5T;i5Y+=n7X;indexes[i5Y](this[y0Q]());}});dt[e5Y](indexes)[v5Y]();}},prep:function(action,identifier,submit,json,store){var F0Q="can";var b0Q="elled";if(action===N6B){var A5Y=f5x.p21;A5Y+=f5x.f21;A5Y+=g1T;var m5Y=q3X;m5Y+=Q1T;m5Y+=u21;var cancelled=json[p0Q]||[];store[m5Y]=$[A5Y](submit[i6T],function(val,key){var W0Q="isEmpt";var z0Q="rra";var w0Q="ject";var D0Q="yOb";var H5Y=z8B;H5Y+=z0Q;H5Y+=o7T;var g5Y=W0Q;g5Y+=D0Q;g5Y+=w0Q;var h5Y=B9T;h5Y+=f5x.l21;f5x[h5Y]();return!$[g5Y](submit[i6T][key])&&$[H5Y](key,cancelled)===-G81?key:undefined;});}else if(action===z9B){var l5Y=Q1B;l5Y+=C0Q;l5Y+=b0Q;var L5Y=F0Q;L5Y+=Q5T;L5Y+=j0Q;L5Y+=u9T;store[L5Y]=json[l5Y]||[];}},commit:function(action,identifier,data,store){var k0Q="rSide";var a0Q="editO";var d0Q="ting";var X0Q="bSer";var G5Y=Q21;G5Y+=T6T;G5Y+=f5x.x21;var J5Y=a0Q;J5Y+=F5X;J5Y+=u21;var Z5Y=n9B;Z5Y+=e7T;var M5Y=f5x.x21;M5Y+=U0Q;var N5Y=T21;N5Y+=f5x.f21;N5Y+=V9T;N5Y+=j9T;var that=this;var dt=__dtApi(this[u21][N5Y]);if(!__dtIsSsp(dt,this)&&action===M5Y&&store[f0Q][Z5Y]){var o5Y=o2T;o5Y+=s5Q;o5Y+=e7T;var ids=store[f0Q];var row;var compare=function(id){f5x[O3T]();return function(rowIdx,rowData,rowNode){var R0Q="aT";var x5Y=G5T;x5Y+=f5x.S21;var s5Y=R4T;s5Y+=T21;s5Y+=R0Q;s5Y+=r6T;f5x[O3T]();return id==__dataSources[s5Y][x5Y][m8T](that,rowData);};};for(var i=J81,ien=ids[o5Y];i<ien;i++){var S5Y=X0Q;S5Y+=E6T;S5Y+=f5x.x21;S5Y+=k0Q;var p5Y=G5X;p5Y+=d0Q;p5Y+=u21;try{var f5Y=O7T;f5Y+=b5T;f5Y+=P7T;row=dt[f5Y](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[s0Q]()){row=dt[q3X](compare(ids[i]));}if(row[s0Q]()&&!dt[p5Y]()[J81][Q1Q][S5Y]){row[W5X]();}}}var drawType=this[u21][J5Y][D9Q];if(drawType!==G5Y){var y5Y=B1Q;y5Y+=f5x.f21;y5Y+=P7T;dt[y5Y](drawType);}}};function __html_id(identifier){var u0Q="keyle";var T0Q="or-";var I0Q='Could not find an element with `data-editor-id` or `id` of: ';var Q0Q="id=\"";var P0Q="[data-ed";var z5Y=u0Q;z5Y+=u21;z5Y+=u21;var context=document;f5x[O3T]();if(identifier!==z5Y){var D5Y=o2T;D5Y+=f2T;var W5Y=P0Q;W5Y+=m1T;W5Y+=T0Q;W5Y+=Q0Q;context=$(W5Y+identifier+N8B);if(context[G3T]===J81){context=typeof identifier===E2T?$(__dtjqId(identifier)):$(identifier);}if(context[D5Y]===J81){throw I0Q+identifier;}}return context;}function __html_el(identifier,name){var t0Q="[data-editor";var K0Q="-field=";var b5Y=m3T;b5Y+=A3T;var C5Y=t0Q;C5Y+=K0Q;C5Y+=m3T;var w5Y=f5x.L21;w5Y+=f5x.l21;var context=__html_id(identifier);f5x[w5Y]();return $(C5Y+name+b5Y,context);}f5x[F5Y]();function __html_els(identifier,names){var j5Y=o2T;j5Y+=I0T;j5Y+=T21;j5Y+=e7T;var out=$();f5x[f5x.z21]();for(var i=J81,ien=names[j5Y];i<ien;i++){out=out[A4X](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var E0Q="[data-editor-valu";var c0Q="ilter";var B0Q="data-e";var d5Y=r0Q;d5Y+=w7T;var k5Y=B0Q;k5Y+=n0Q;k5Y+=y5T;var X5Y=q0Q;X5Y+=O7T;var R5Y=w7T;R5Y+=f5x.x21;R5Y+=Q21;R5Y+=f2T;var U5Y=E0Q;U5Y+=Y0Q;var a5Y=f5x.J21;a5Y+=c0Q;var el=__html_el(identifier,dataSrc);return el[a5Y](U5Y)[R5Y]?el[X5Y](k5Y):el[d5Y]();}function __html_set(identifier,fields,data){f5x[O3T]();$[X2T](fields,function(name,field){var i3Q="dataSrc";var m3Q="tml";var e3Q="-editor-va";var u5Y=f5x.L21;u5Y+=f5x.l21;f5x[u5Y]();var val=field[e6T](data);if(val!==undefined){var T5Y=V0Q;T5Y+=O3Q;T5Y+=Y0Q;var P5Y=f5x.J21;P5Y+=G5T;P5Y+=w7T;P5Y+=A9T;var el=__html_el(identifier,field[i3Q]());if(el[P5Y](T5Y)[G3T]){var I5Y=i6T;I5Y+=e3Q;I5Y+=X3T;var Q5Y=f5x.f21;Q5Y+=v3Q;el[Q5Y](I5Y,val);}else{var q5Y=e7T;q5Y+=m3Q;var t5Y=f5x.x21;t5Y+=f5x.f21;t5Y+=Q5T;t5Y+=e7T;el[t5Y](function(){var h3Q="Node";var L3Q="emoveChil";var H3Q="tChi";var g3Q="firs";var A3Q="child";var r5Y=j9T;r5Y+=B8X;r5Y+=p3T;var K5Y=A3Q;K5Y+=h3Q;K5Y+=u21;while(this[K5Y][r5Y]){var n5Y=g3Q;n5Y+=H3Q;n5Y+=w7T;n5Y+=f5x.S21;var B5Y=O7T;B5Y+=L3Q;B5Y+=f5x.S21;this[B5Y](this[n5Y]);}})[q5Y](val);}}});}__dataSources[R5X]={id:function(data){var c5Y=q4T;c5Y+=j21;c5Y+=B3B;var Y5Y=b5T;Y5Y+=U2T;Y5Y+=g1T;Y5Y+=G5T;var E5Y=B9T;E5Y+=f5x.l21;f5x[E5Y]();var idFn=DataTable[B5T][Y5Y][v0Q](this[u21][c5Y]);return idFn(data);},initField:function(cfg){var l3Q="[data-editor-lab";var i7Y=Q21;i7Y+=o1Q;i7Y+=f5x.x21;var O7Y=R4T;O7Y+=X4T;var V5Y=l3Q;V5Y+=b7T;V5Y+=H4T;var label=$(V5Y+(cfg[O7Y]||cfg[i7Y])+N8B);f5x[f5x.z21]();if(!cfg[M6T]&&label[G3T]){var v7Y=r0Q;v7Y+=w7T;var e7Y=w7T;e7Y+=f5x.f21;e7Y+=L2T;e7Y+=w7T;cfg[e7Y]=label[v7Y]();}},individual:function(identifier,fieldNames){var N3Q="rray";var o3Q="addBack";var Z3Q="r-i";var x3Q='data-editor-field';var s3Q="id]";var p3Q='Cannot automatically determine field name from data source';var s7Y=f5x.x21;s7Y+=f5x.f21;s7Y+=Q5T;s7Y+=e7T;var Z7Y=c5B;Z7Y+=f8B;var M7Y=w7T;M7Y+=l6X;M7Y+=I0T;M7Y+=p3T;var N7Y=I9Q;N7Y+=N3Q;var A7Y=Y3X;A7Y+=u7T;A7Y+=M3Q;var m7Y=f5x.L21;m7Y+=f5x.l21;var attachEl;f5x[m7Y]();if(identifier instanceof $||identifier[A7Y]){var l7Y=Y4B;l7Y+=t9T;l7Y+=Z3Q;l7Y+=f5x.S21;var L7Y=V0Q;L7Y+=s3Q;var H7Y=f5x.f21;H7Y+=f5x.S21;H7Y+=f5x.S21;H7Y+=e1B;var g7Y=f5x.J21;g7Y+=Q21;attachEl=identifier;if(!fieldNames){var h7Y=f5x.f21;h7Y+=T21;h7Y+=T21;h7Y+=O7T;fieldNames=[$(identifier)[h7Y](x3Q)];}var back=$[g7Y][o3Q]?H7Y:A1B;identifier=$(identifier)[R5Q](L7Y)[back]()[i6T](l7Y);}if(!identifier){identifier=f3Q;}if(fieldNames&&!$[N7Y](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames||fieldNames[M7Y]===J81){throw p3Q;}var out=__dataSources[R5X][Z7Y][m8T](this,identifier);var fields=this[u21][J4X];var forceFields={};$[X2T](fieldNames,function(i,name){f5x[O3T]();forceFields[name]=fields[name];});$[s7Y](out,function(id,set){var J3Q="toArray";var S3Q="splayF";var p7Y=k9T;p7Y+=S3Q;p7Y+=s4X;var f7Y=q0Q;f7Y+=r5B;var o7Y=f5x.L21;o7Y+=f5x.l21;var x7Y=Q5T;x7Y+=j0Q;set[G1T]=x7Y;f5x[o7Y]();set[f7Y]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[J3Q]();set[J4X]=fields;set[p7Y]=forceFields;});return out;},fields:function(identifier){var D7Y=R7T;D7Y+=N6X;var z7Y=B9T;z7Y+=f5x.l21;var S7Y=r0Q;S7Y+=w7T;var out={};var self=__dataSources[S7Y];if($[h5X](identifier)){var J7Y=w7T;J7Y+=w5Q;J7Y+=e7T;for(var i=J81,ien=identifier[J7Y];i<ien;i++){var y7Y=Q1B;y7Y+=w7T;y7Y+=w7T;var G7Y=c5B;G7Y+=f8B;var res=self[G7Y][y7Y](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}f5x[z7Y]();var data={};var fields=this[u21][J4X];if(!identifier){var W7Y=G3Q;W7Y+=o7T;W7Y+=j9T;W7Y+=g6X;identifier=W7Y;}$[D7Y](fields,function(name,field){var y3Q="valT";var z3Q="Data";var W3Q="taSrc";var C7Y=y3Q;C7Y+=b5T;C7Y+=z3Q;var w7Y=f5x.S21;w7Y+=f5x.f21;w7Y+=W3Q;f5x[f5x.z21]();var val=__html_get(identifier,field[w7Y]());field[C7Y](data,val===j6T?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:p7X};return out;},create:function(fields,data){var b7Y=f5x.L21;b7Y+=f5x.l21;f5x[b7Y]();if(data){var j7Y=Q5T;j7Y+=h7X;var F7Y=G5T;F7Y+=f5x.S21;var id=__dataSources[R5X][F7Y][j7Y](this,data);try{if(__html_id(id)[G3T]){__html_set(id,fields,data);}}catch(e){;}}},edit:function(identifier,fields,data){var U7Y=Q5T;U7Y+=h7X;var a7Y=G5T;a7Y+=f5x.S21;var id=__dataSources[R5X][a7Y][U7Y](this,data)||f3Q;__html_set(id,fields,data);},remove:function(identifier,fields){f5x[O3T]();__html_id(identifier)[W5X]();}};}());Editor[W8T]={"wrapper":R7Y,"processing":{"indicator":X7Y,"active":L9B},"header":{"wrapper":k7Y,"content":D3Q},"body":{"wrapper":d7Y,"content":u7Y},"footer":{"wrapper":P7Y,"content":w3Q},"form":{"wrapper":C3Q,"content":b3Q,"tag":f5x.M21,"info":F3Q,"error":j3Q,"buttons":a3Q,"button":U3Q,"buttonInternal":U3Q},"field":{"wrapper":z5T,"typePrefix":R3Q,"namePrefix":X3Q,"label":k3Q,"input":T7Y,"inputControl":d3Q,"error":u3Q,"msg-label":P3Q,"msg-error":T3Q,"msg-message":Q7Y,"msg-info":Q3Q,"multiValue":I7Y,"multiInfo":I3Q,"multiRestore":t7Y,"multiNoEdit":t3Q,"disabled":x8T,"processing":K7Y},"actions":{"create":r7Y,"edit":K3Q,"remove":r3Q},"inline":{"wrapper":B3Q,"liner":n3Q,"buttons":B7Y},"bubble":{"wrapper":q3Q,"liner":E3Q,"table":Y3Q,"close":c3Q,"pointer":V3Q,"bg":n7Y}};(function(){var o4Q="TO";var G4Q="select_single";var e4Q="Single";var m6Q='rows';var E4Q="i1";var z4Q="8n";var r4Q="formMessage";var L4Q="-edit";var h4Q="edS";var I4Q='buttons-create';var A4Q="oveSingle";var i4Q="ted";var p4Q="TableTools";var k4Q="rem";var s4Q="tor_cr";var N4Q="ols";var s6Q="editSingle";var m4Q="gle";var J4Q="editor_edit";var g4Q="ingle";var l4Q="bleTo";var f4Q="NS";var Z4Q="itor_remove";var v4Q="Sin";var x4Q="BUT";var H4Q="uttons-remov";var y4Q="formButton";var R9Y=O4Q;R9Y+=i4Q;R9Y+=e4Q;var U9Y=I3T;U9Y+=V21;U9Y+=Q21;U9Y+=f5x.S21;var a9Y=W5X;a9Y+=v4Q;a9Y+=m4Q;var j9Y=M9T;j9Y+=f5x.p21;j9Y+=A4Q;var F9Y=O4Q;F9Y+=T21;F9Y+=h4Q;F9Y+=g4Q;var b9Y=f5x.x21;b9Y+=P21;b9Y+=q9X;b9Y+=f5x.S21;var C9Y=f5x.x21;C9Y+=f5x.S21;C9Y+=G5T;C9Y+=T21;var w9Y=I3T;w9Y+=V21;w9Y+=Q21;w9Y+=f5x.S21;var A9Y=V9T;A9Y+=H4Q;A9Y+=f5x.x21;var Q1Y=s7X;Q1Y+=u21;Q1Y+=L4Q;var W1Y=E9T;W1Y+=T21;W1Y+=t9T;W1Y+=r5T;var q7Y=x4B;q7Y+=l4Q;q7Y+=N4Q;if(DataTable[q7Y]){var l1Y=l9T;l1Y+=w7T;l1Y+=M4Q;l1Y+=T21;var L1Y=u9T;L1Y+=Z4Q;var Y7Y=Y4B;Y7Y+=s4Q;Y7Y+=R7T;Y7Y+=V21;var E7Y=x4Q;E7Y+=o4Q;E7Y+=f4Q;var ttButtons=DataTable[p4Q][E7Y];var ttButtonBase={sButtonText:j6T,editor:j6T,formTitle:j6T};ttButtons[Y7Y]=$[n4T](z3T,ttButtons[a8X],ttButtonBase,{formButtons:[{label:j6T,fn:function(e){this[j5X]();}}],fnClick:function(button,config){var S4Q="Buttons";var V7Y=w7T;V7Y+=K9B;V7Y+=w7T;var c7Y=M1T;c7Y+=g2X;c7Y+=S4Q;var editor=config[X21];var i18nCreate=editor[I4T][x2X];var buttons=config[c7Y];if(!buttons[J81][V7Y]){var O1Y=H2T;O1Y+=L2T;O1Y+=w7T;buttons[J81][O1Y]=i18nCreate[j5X];}editor[x2X]({title:i18nCreate[t6X],buttons:buttons});}});ttButtons[J4Q]=$[n4T](z3T,ttButtons[G4Q],ttButtonBase,{formButtons:[{label:j6T,fn:function(e){var i1Y=u21;i1Y+=E7Q;i1Y+=T21;this[i1Y]();}}],fnClick:function(button,config){var D4Q="etSele";var w4Q="tedIndexes";var W4Q="fnG";var H1Y=o4T;H1Y+=f4T;var g1Y=y4Q;g1Y+=u21;var h1Y=f5x.x21;h1Y+=f5x.S21;h1Y+=m1T;var A1Y=G5T;A1Y+=G0T;A1Y+=z4Q;var m1Y=f5x.x21;m1Y+=f5x.S21;m1Y+=m1T;m1Y+=x5T;var v1Y=o2T;v1Y+=s5Q;v1Y+=e7T;var e1Y=W4Q;e1Y+=D4Q;e1Y+=Q5T;e1Y+=w4Q;var selected=this[e1Y]();if(selected[v1Y]!==G81){return;}var editor=config[m1Y];var i18nEdit=editor[A1Y][h1Y];var buttons=config[g1Y];if(!buttons[J81][M6T]){buttons[J81][M6T]=i18nEdit[j5X];}editor[b5B](selected[J81],{title:i18nEdit[H1Y],buttons:buttons});}});ttButtons[L1Y]=$[n4T](z3T,ttButtons[l1Y],ttButtonBase,{question:j6T,formButtons:[{label:j6T,fn:function(e){var that=this;f5x[f5x.z21]();this[j5X](function(json){var C4Q="leTools";var F4Q="fnSelectNone";var b4Q="fnGetInstance";var N1Y=Z0Q;N1Y+=C4Q;var tt=$[B0T][n0T][N1Y][b4Q]($(that[u21][k5X])[v3T]()[k5X]()[Y3X]());tt[F4Q]();});}}],fnClick:function(button,config){var R4Q="nfir";var a4Q="firm";var U4Q="nfi";var u4Q="lectedIndexes";var d4Q="fnGetS";var j4Q="emove";var X4Q="formButto";var z1Y=B2T;z1Y+=w7T;z1Y+=f5x.f21;z1Y+=y0T;var y1Y=O7T;y1Y+=j4Q;var J1Y=w7T;J1Y+=I3X;J1Y+=f5x.x21;J1Y+=w7T;var S1Y=y8T;S1Y+=Q21;S1Y+=a4Q;var p1Y=y8T;p1Y+=U4Q;p1Y+=O7T;p1Y+=f5x.p21;var f1Y=y8T;f1Y+=R4Q;f1Y+=f5x.p21;var o1Y=X4Q;o1Y+=Q21;o1Y+=u21;var x1Y=k4Q;x1Y+=R7Q;var s1Y=t5X;s1Y+=Q21;var Z1Y=Y4B;Z1Y+=T21;Z1Y+=x5T;var M1Y=d4Q;M1Y+=f5x.x21;M1Y+=u4Q;var rows=this[M1Y]();if(rows[G3T]===J81){return;}var editor=config[Z1Y];var i18nRemove=editor[s1Y][x1Y];var buttons=config[o1Y];var question=typeof i18nRemove[f1Y]===E2T?i18nRemove[p1Y]:i18nRemove[D9B][rows[G3T]]?i18nRemove[S1Y][rows[G3T]]:i18nRemove[D9B][T7T];if(!buttons[J81][J1Y]){var G1Y=w7T;G1Y+=f5x.f21;G1Y+=L2T;G1Y+=w7T;buttons[J81][G1Y]=i18nRemove[j5X];}editor[y1Y](rows,{message:question[z1Y](/%d/g,rows[G3T]),title:i18nRemove[t6X],buttons:buttons});}});}var _buttons=DataTable[B5T][W1Y];f5x[O3T]();$[n4T](_buttons,{create:{text:function(dt,node,config){var Q4Q='buttons.create';var P4Q="butto";var C1Y=P4Q;C1Y+=Q21;var w1Y=G5T;w1Y+=G0T;w1Y+=T4Q;w1Y+=Q21;var D1Y=B9T;D1Y+=f5x.l21;f5x[D1Y]();return dt[w1Y](Q4Q,config[X21][I4T][x2X][C1Y]);},className:I4Q,editor:j6T,formButtons:{text:function(editor){var F1Y=l2X;F1Y+=R7T;F1Y+=T21;F1Y+=f5x.x21;var b1Y=G5T;b1Y+=t4Q;b1Y+=Q21;return editor[b1Y][F1Y][j5X];},action:function(e){var j1Y=u21;j1Y+=F4X;j1Y+=m1T;this[j1Y]();}},formMessage:j6T,formTitle:j6T,action:function(e,dt,node,config){var B4Q="formTitle";var K4Q="mButt";var d1Y=Q5T;d1Y+=Z4B;d1Y+=f5x.x21;var k1Y=G5T;k1Y+=G0T;k1Y+=T4Q;k1Y+=Q21;var X1Y=M1T;X1Y+=O7T;X1Y+=K4Q;X1Y+=f7B;var R1Y=Q5T;R1Y+=N1B;R1Y+=V21;var U1Y=b5T;U1Y+=Q21;U1Y+=f5x.x21;var a1Y=f5x.x21;a1Y+=n0Q;f5x[f5x.z21]();var that=this;var editor=config[a1Y];this[L9B](z3T);editor[U1Y](T5Q,function(){that[L9B](y3T);})[R1Y]({buttons:config[X1Y],message:config[r4Q]||editor[I4T][x2X][W2B],title:config[B4Q]||editor[k1Y][d1Y][t6X]});}},edit:{extend:n4Q,text:function(dt,node,config){var q4Q='buttons.edit';var T1Y=V9T;T1Y+=D2B;T1Y+=T6T;var P1Y=f5x.x21;P1Y+=U0Q;P1Y+=b5T;P1Y+=O7T;var u1Y=G5T;u1Y+=t4Q;u1Y+=Q21;return dt[u1Y](q4Q,config[P1Y][I4T][b5B][T1Y]);},className:Q1Y,editor:j6T,formButtons:{text:function(editor){var t1Y=t5X;t1Y+=Q21;var I1Y=f5x.L21;I1Y+=f5x.l21;f5x[I1Y]();return editor[t1Y][b5B][j5X];},action:function(e){this[j5X]();}},formMessage:j6T,formTitle:j6T,action:function(e,dt,node,config){var i6Q="xes";var Y4Q="mT";var V4Q="messa";var c4Q="itle";var O6Q="formBu";var O9Y=f5x.x21;O9Y+=f5x.S21;O9Y+=m1T;var V1Y=E4Q;V1Y+=T4Q;V1Y+=Q21;var c1Y=M1T;c1Y+=O7T;c1Y+=Y4Q;c1Y+=c4Q;var Y1Y=V4Q;Y1Y+=I0T;Y1Y+=f5x.x21;var E1Y=f5x.x21;E1Y+=f5x.S21;E1Y+=G5T;E1Y+=T21;var q1Y=O6Q;q1Y+=V6B;var B1Y=c7T;B1Y+=C3T;B1Y+=I0T;var r1Y=w7T;r1Y+=g5X;var K1Y=x7Q;K1Y+=i6Q;var that=this;var editor=config[X21];var rows=dt[e5B]({selected:z3T})[B9Q]();var columns=dt[N0Q]({selected:z3T})[B9Q]();var cells=dt[r9Q]({selected:z3T})[K1Y]();var items=columns[r1Y]||cells[G3T]?{rows:rows,columns:columns,cells:cells}:rows;this[B1Y](z3T);editor[r1Q](T5Q,function(){var v6Q="essing";var e6Q="roc";var n1Y=g1T;n1Y+=e6Q;n1Y+=v6Q;that[n1Y](y3T);})[b5B](items,{buttons:config[q1Y],message:config[r4Q]||editor[I4T][E1Y][Y1Y],title:config[c1Y]||editor[V1Y][O9Y][t6X]});}},remove:{extend:n4Q,limitTo:[m6Q],text:function(dt,node,config){var g6Q="buttons.r";var h6Q="emo";var m9Y=V9T;m9Y+=A6Q;var v9Y=O7T;v9Y+=h6Q;v9Y+=E6T;v9Y+=f5x.x21;var e9Y=b5B;e9Y+=x5T;var i9Y=g6Q;i9Y+=F9B;i9Y+=R7Q;f5x[O3T]();return dt[I4T](i9Y,config[e9Y][I4T][v9Y][m9Y]);},className:A9Y,editor:j6T,formButtons:{text:function(editor){var H6Q="bmi";var h9Y=u21;h9Y+=V5T;h9Y+=H6Q;h9Y+=T21;f5x[O3T]();return editor[I4T][W5X][h9Y];},action:function(e){this[j5X]();}},formMessage:function(editor,dt){var Z9Y=w7T;Z9Y+=f5x.x21;Z9Y+=c2X;Z9Y+=e7T;var M9Y=o2T;M9Y+=s5Q;M9Y+=e7T;var N9Y=j9T;N9Y+=c2X;N9Y+=e7T;var l9Y=I9X;l9Y+=G5T;l9Y+=O7T;l9Y+=f5x.p21;var L9Y=G5T;L9Y+=T3B;var H9Y=O7T;H9Y+=b5T;H9Y+=P7T;H9Y+=u21;var g9Y=B9T;g9Y+=f5x.l21;f5x[g9Y]();var rows=dt[H9Y]({selected:z3T})[B9Q]();var i18n=editor[L9Y][W5X];var question=typeof i18n[D9B]===E2T?i18n[D9B]:i18n[l9Y][rows[N9Y]]?i18n[D9B][rows[M9Y]]:i18n[D9B][T7T];return question[Y2T](/%d/g,rows[Z9Y]);},formTitle:j6T,action:function(e,dt,node,config){var N6Q="dex";var L6Q="ormTitl";var l6Q="Message";var M6Q="reO";var Z6Q="roce";var D9Y=M9T;D9Y+=h0T;D9Y+=m2X;var W9Y=E4Q;W9Y+=z4Q;var z9Y=f5x.J21;z9Y+=L6Q;z9Y+=f5x.x21;var y9Y=t5T;y9Y+=l6Q;var G9Y=y4Q;G9Y+=u21;var J9Y=z4T;J9Y+=N6Q;J9Y+=f5x.x21;J9Y+=u21;var S9Y=O7T;S9Y+=b5T;S9Y+=P7T;S9Y+=u21;var p9Y=k4Q;p9Y+=R7Q;var f9Y=g1T;f9Y+=M6Q;f9Y+=g1T;f9Y+=l6X;var o9Y=T6T;o9Y+=f5x.x21;var x9Y=g1T;x9Y+=Z6Q;x9Y+=I0B;var s9Y=f5x.x21;s9Y+=n0Q;var that=this;var editor=config[s9Y];f5x[O3T]();this[x9Y](z3T);editor[o9Y](f9Y,function(){that[L9B](y3T);})[p9Y](dt[S9Y]({selected:z3T})[J9Y](),{buttons:config[G9Y],message:config[y9Y],title:config[z9Y]||editor[W9Y][D9Y][t6X]});}}});_buttons[s6Q]=$[w9Y]({},_buttons[C9Y]);_buttons[s6Q][b9Y]=F9Y;_buttons[j9Y]=$[n4T]({},_buttons[W5X]);_buttons[a9Y][U9Y]=R9Y;}());Editor[X9Y]={};Editor[x6Q]=function(input,opts){var T6Q="<s";var B6Q="ton>";var Y6Q="previo";var R6Q="<div";var C6Q="-c";var e8Q="-title";var E6Q="utton>";var b6Q="alendar";var p8Q='-label">';var i8Q="class=\"";var f6Q="structor";var q6Q="</b";var S8Q='<span/>';var G8Q='-calendar"/>';var D6Q="rro";var F6Q="r\"/>";var w6Q="-ti";var W6Q="e-";var P6Q="select class=\"";var K6Q="ect class=\"";var z8Q='-minutes"/>';var u6Q="ar\"";var v8Q="-dat";var d6Q="-ye";var Q6Q="n/>";var X6Q="las";var w8Q=/[Hhm]|LT|LTS/;var c6Q="conLeft";var h8Q="assPref";var r6Q="</bu";var J6Q="ndex";var n6Q="<bu";var I6Q="label\">";var o8Q='<button>';var J8Q='-month"/>';var k6Q="me\">";var m8Q="e\">";var C8Q=/[haA]/;var U6Q="\"/";var H8Q="moment";var N8Q="ormat 'YYYY-MM-DD' can be used";var j6Q="-sec";var f8Q='-iconRight">';var O8Q="div ";var o6Q="_con";var G6Q="Of";var A8Q="YYYY-MM-";var l8Q="Editor datetime: Without momentjs only the f";var t6Q="<sel";var y8Q='-hours"/>';var W8Q="_instance";var D8Q=/[YMD]|L(?!T)|l/;var S6Q="nda";var z6Q="eim";var I0Y=o6Q;I0Y+=f6Q;var Q0Y=Q5T;Q0Y+=p6Q;Q0Y+=S6Q;Q0Y+=O7T;var T0Y=f5x.f21;T0Y+=g1T;T0Y+=k7B;var P0Y=f5x.S21;P0Y+=X8T;var u0Y=d6X;u0Y+=g1T;u0Y+=f5x.x21;u0Y+=i5T;var d0Y=f5x.S21;d0Y+=f5x.f21;d0Y+=T21;d0Y+=f5x.x21;var k0Y=U9T;k0Y+=x5T;var X0Y=T21;X0Y+=G5T;X0Y+=f5x.p21;X0Y+=f5x.x21;var R0Y=f5x.S21;R0Y+=b5T;R0Y+=f5x.p21;var U0Y=f5x.f21;U0Y+=m1X;U0Y+=n5T;var a0Y=f5x.S21;a0Y+=X8T;var j0Y=f5x.p21;j0Y+=f5x.f21;j0Y+=T21;j0Y+=N6X;var F0Y=G5T;F0Y+=J6Q;F0Y+=G6Q;var b0Y=M1T;b0Y+=O7T;b0Y+=y6Q;var C0Y=y6Q;C0Y+=Q5T;C0Y+=e7T;var w0Y=v6X;w0Y+=T21;w0Y+=N6X;var D0Y=f5x.J21;D0Y+=b5T;D0Y+=g2X;D0Y+=g9T;var W0Y=K21;W0Y+=A5B;W0Y+=z6Q;W0Y+=W6Q;var z0Y=f5T;z0Y+=f5x.x21;z0Y+=D6Q;z0Y+=O7T;var y0Y=F9T;y0Y+=i5T;var G0Y=w6Q;G0Y+=f5x.p21;G0Y+=f5x.x21;var J0Y=f5x.J21;J0Y+=G5T;J0Y+=Q21;J0Y+=f5x.S21;var S0Y=C6Q;S0Y+=b6Q;var p0Y=f5T;p0Y+=z2B;p0Y+=j9T;var f0Y=f5T;f0Y+=u2X;var o0Y=f5x.J21;o0Y+=G5T;o0Y+=Q21;o0Y+=f5x.S21;var x0Y=f5T;x0Y+=c0B;x0Y+=F6Q;var s0Y=C7X;s0Y+=w7T;s0Y+=U8T;s0Y+=H4T;var Z0Y=j6Q;Z0Y+=a6Q;Z0Y+=U6Q;Z0Y+=i4T;var M0Y=C3B;M0Y+=k3B;var N0Y=R6Q;N0Y+=W7B;N0Y+=X6Q;N0Y+=N4T;var l0Y=f5T;l0Y+=o4T;l0Y+=k6Q;var L0Y=J7B;L0Y+=k9T;L0Y+=E6T;L0Y+=i4T;var H0Y=J7B;H0Y+=f5x.S21;H0Y+=G7B;var g0Y=J7B;g0Y+=f5x.S21;g0Y+=x6X;g0Y+=i4T;var h0Y=d6Q;h0Y+=u6Q;h0Y+=y7B;var A0Y=M4T;A0Y+=P6Q;var m0Y=T6Q;m0Y+=g1T;m0Y+=f5x.f21;m0Y+=Q6Q;var v0Y=f5T;v0Y+=I6Q;var e0Y=M4T;e0Y+=w7B;e0Y+=G5T;e0Y+=n3T;var i0Y=t6Q;i0Y+=K6Q;var O0Y=M4T;O0Y+=r3T;O0Y+=f5x.S21;O0Y+=G7B;var V9Y=r6Q;V9Y+=T21;V9Y+=B6Q;var c9Y=Q21;c9Y+=f5x.x21;c9Y+=P21;c9Y+=T21;var Y9Y=n6Q;Y9Y+=E3B;Y9Y+=T6T;Y9Y+=i4T;var E9Y=M4T;E9Y+=r3T;E9Y+=B9X;var q9Y=q6Q;q9Y+=E6Q;var n9Y=Y6Q;n9Y+=x9B;var B9Y=f5T;B9Y+=G5T;B9Y+=c6Q;B9Y+=V6Q;var r9Y=M4T;r9Y+=O8Q;r9Y+=i8Q;var K9Y=e8Q;K9Y+=V6Q;var t9Y=v8Q;t9Y+=m8Q;var I9Y=m3T;I9Y+=i4T;var u9Y=A8Q;u9Y+=c21;u9Y+=c21;var d9Y=Q5T;d9Y+=w7T;d9Y+=h8Q;d9Y+=g8Q;var k9Y=B5T;k9Y+=n5T;this[Q5T]=$[k9Y](z3T,{},Editor[x6Q][c3B],opts);var classPrefix=this[Q5T][d9Y];var i18n=this[Q5T][I4T];if(!window[H8Q]&&this[Q5T][L8Q]!==u9Y){var P9Y=l8Q;P9Y+=N8Q;throw P9Y;}var timeBlock=function(type){var M8Q='-timeblock">';var T9Y=M4T;T9Y+=R7B;return T9Y+classPrefix+M8Q+f6T;};var gap=function(){var s8Q="/s";var Z8Q="<span>:<";var Q9Y=Z8Q;Q9Y+=s8Q;Q9Y+=U2B;Q9Y+=x8Q;f5x[f5x.z21]();return Q9Y;};var structure=$(g6T+classPrefix+I9Y+g6T+classPrefix+t9Y+g6T+classPrefix+K9Y+r9Y+classPrefix+B9Y+o8Q+i18n[n9Y]+q9Y+E9Y+g6T+classPrefix+f8Q+Y9Y+i18n[c9Y]+V9Y+O0Y+g6T+classPrefix+p8Q+S8Q+i0Y+classPrefix+J8Q+e0Y+g6T+classPrefix+v0Y+m0Y+A0Y+classPrefix+h0Y+g0Y+H0Y+g6T+classPrefix+G8Q+L0Y+g6T+classPrefix+l0Y+g6T+classPrefix+y8Q+N0Y+classPrefix+z8Q+M0Y+classPrefix+Z0Y+f6T+s0Y+classPrefix+x0Y+f6T);this[d6T]={container:structure,date:structure[o0Y](Q7B+classPrefix+f0Y),title:structure[i5B](Q7B+classPrefix+p0Y),calendar:structure[i5B](Q7B+classPrefix+S0Y),time:structure[J0Y](Q7B+classPrefix+G0Y),error:structure[y0Y](Q7B+classPrefix+z0Y),input:$(input)};this[u21]={d:j6T,display:j6T,minutesRange:j6T,secondsRange:j6T,namespace:W0Y+Editor[x6Q][W8Q]++,parts:{date:this[Q5T][D0Y][w0Y](D8Q)!==j6T,time:this[Q5T][L8Q][C0Y](w8Q)!==j6T,seconds:this[Q5T][b0Y][F0Y](r0T)!==-G81,hours12:this[Q5T][L8Q][j0Y](C8Q)!==j6T}};this[a0Y][S8T][U0Y](this[d6T][u2X])[g2T](this[R0Y][X0Y])[g2T](this[d6T][k0Y]);this[d6T][d0Y][u0Y](this[P0Y][t6X])[T0Y](this[d6T][Q0Y]);this[I0Y]();};$[t0Y](Editor[x6Q][g7X],{destroy:function(){var F8Q="r-dateti";var b8Q=".edito";var n0Y=b8Q;n0Y+=F8Q;n0Y+=n21;var B0Y=Q3T;B0Y+=f5x.p21;var r0Y=J1X;r0Y+=G5T;r0Y+=f5x.S21;r0Y+=f5x.x21;var K0Y=f5x.L21;K0Y+=f5x.l21;f5x[K0Y]();this[r0Y]();this[d6T][S8T][N3X]()[j8Q]();this[B0Y][I8T][N3X](n0Y);},errorMsg:function(msg){var error=this[d6T][k8T];f5x[O3T]();if(msg){error[R5X](msg);}else{error[j8Q]();}},hide:function(){var q0Y=J1X;q0Y+=G5T;q0Y+=i0X;this[q0Y]();},max:function(date){var a8Q="_opt";var U8Q="ionsTitle";var Y0Y=a8Q;Y0Y+=U8Q;var E0Y=B9T;E0Y+=f5x.l21;this[Q5T][R8Q]=date;f5x[E0Y]();this[Y0Y]();this[X8Q]();},min:function(date){var k8Q="nDa";var d8Q="_optionsTitle";var c0Y=f5x.p21;c0Y+=G5T;c0Y+=k8Q;c0Y+=V21;this[Q5T][c0Y]=date;this[d8Q]();this[X8Q]();},owns:function(node){var u8Q="contai";var O3Y=u8Q;O3Y+=s5X;var V0Y=g1T;V0Y+=M5B;V0Y+=O0X;V0Y+=u21;return $(node)[V0Y]()[P8Q](this[d6T][O3Y])[G3T]>J81;},val:function(set,write){var c8Q="toDate";var O2Q="TC";var Q8Q="_setCa";var E8Q="tStrict";var i2Q="match";var t8Q="setUTCDat";var e2Q=/(\d{4})\-(\d{2})\-(\d{2})/;var T8Q="_set";var n8Q="lid";var K8Q="--n";var B8Q="isVa";var Y8Q="momentLocale";var o3Y=T8Q;o3Y+=O5T;var x3Y=Q8Q;x3Y+=I8Q;var s3Y=t8Q;s3Y+=f5x.x21;var Z3Y=h2X;Z3Y+=M5X;var e3Y=N5B;e3Y+=z4T;e3Y+=I0T;var i3Y=K8Q;i3Y+=b5T;i3Y+=P7T;if(set===undefined){return this[u21][f5x.S21];}if(set instanceof Date){this[u21][f5x.S21]=this[r8Q](set);}else if(set===j6T||set===K0T){this[u21][f5x.S21]=j6T;}else if(set===i3Y){this[u21][f5x.S21]=new Date();}else if(typeof set===e3Y){var v3Y=h0T;v3Y+=f5x.p21;v3Y+=l6X;v3Y+=T21;if(window[v3Y]){var H3Y=B8Q;H3Y+=n8Q;var g3Y=q8Q;g3Y+=Q21;g3Y+=E8Q;var h3Y=M1T;h3Y+=O7T;h3Y+=v6X;h3Y+=T21;var A3Y=V8B;A3Y+=Q5T;var m3Y=f5x.p21;m3Y+=X8T;m3Y+=f5x.x21;m3Y+=U5T;var m=window[m3Y][A3Y](set,this[Q5T][h3Y],this[Q5T][Y8Q],this[Q5T][g3Y]);this[u21][f5x.S21]=m[H3Y]()?m[c8Q]():j6T;}else{var L3Y=V8Q;L3Y+=O2Q;var match=set[i2Q](e2Q);this[u21][f5x.S21]=match?new Date(Date[L3Y](match[G81],match[y81]-G81,match[z81])):j6T;}}if(write||write===undefined){if(this[u21][f5x.S21]){var l3Y=v2Q;l3Y+=V5T;l3Y+=T21;this[l3Y]();}else{var M3Y=E6T;M3Y+=f5x.f21;M3Y+=w7T;var N3Y=G5T;N3Y+=Q21;N3Y+=g1T;N3Y+=V8B;this[d6T][N3Y][M3Y](set);}}if(!this[u21][f5x.S21]){this[u21][f5x.S21]=this[r8Q](new Date());}this[u21][Z3Y]=new Date(this[u21][f5x.S21][W8B]());this[u21][e2T][s3Y](G81);this[m2Q]();this[x3Y]();this[o3Y]();},_constructor:function(){var Y2Q="_setTime";var D2Q=":v";var h2Q="keyup";var M2Q="rts";var p2Q="childre";var N2Q="tl";var H2Q="focus.editor-datetime click.editor-";var P2Q="_correctMonth";var l2Q="_optionsT";var L2Q="autocom";var g2Q=".editor-dateti";var T2Q="_se";var f2Q="seconds";var J2Q="econds";var X2Q="ha";var S2Q="-s";var b4Y=b1T;b4Y+=G5T;b4Y+=D3T;var C4Y=b5T;C4Y+=Q21;var A4Y=A2Q;A4Y+=Q5T;A4Y+=T21;var m4Y=b5T;m4Y+=Q21;var v4Y=f5x.S21;v4Y+=b5T;v4Y+=f5x.p21;var n3Y=h2Q;n3Y+=g2Q;n3Y+=n21;var P3Y=H2Q;P3Y+=r21;var u3Y=b5T;u3Y+=Q21;var d3Y=W2X;d3Y+=f5x.J21;var k3Y=L2Q;k3Y+=K1Q;var X3Y=f5x.S21;X3Y+=b5T;X3Y+=f5x.p21;var R3Y=l2Q;R3Y+=G5T;R3Y+=N2Q;R3Y+=f5x.x21;var U3Y=f5x.L21;U3Y+=f5x.l21;var b3Y=g1T;b3Y+=f5x.f21;b3Y+=O7T;b3Y+=h8T;var G3Y=g1T;G3Y+=f5x.f21;G3Y+=M2Q;var that=this;var classPrefix=this[Q5T][Z2Q];var onChange=function(){var s2Q="hange";var J3Y=E6T;J3Y+=f5x.f21;J3Y+=w7T;var S3Y=G5T;S3Y+=Q21;S3Y+=V0B;S3Y+=T21;var p3Y=Q3T;p3Y+=f5x.p21;var f3Y=D7Q;f3Y+=s2Q;f5x[O3T]();that[Q5T][f3Y][m8T](that,that[p3Y][S3Y][J3Y](),that[u21][f5x.S21],that[d6T][I8T]);};if(!this[u21][G3Y][u2X]){var y3Y=S5X;y3Y+=u21;this[d6T][u2X][y3Y](X6T,T2T);}if(!this[u21][x2Q][o2Q]){var C3Y=K5X;C3Y+=f9T;var w3Y=P9T;w3Y+=j4B;var D3Y=Q5T;D3Y+=u21;D3Y+=u21;var W3Y=T21;W3Y+=G5T;W3Y+=f5x.p21;W3Y+=f5x.x21;var z3Y=Q3T;z3Y+=f5x.p21;this[z3Y][W3Y][D3Y](w3Y,C3Y);}if(!this[u21][b3Y][f2Q]){var a3Y=f5x.x21;a3Y+=u3B;var j3Y=p2Q;j3Y+=Q21;var F3Y=S2Q;F3Y+=J2Q;this[d6T][o2Q][m0X](T7B+classPrefix+F3Y)[W5X]();this[d6T][o2Q][j3Y](G2Q)[a3Y](G81)[W5X]();}f5x[U3Y]();this[R3Y]();this[X3Y][I8T][X8X](k3Y,d3Y)[u3Y](P3Y,function(){var C2Q="ont";var y2Q=":d";var w2Q="sibl";var B3Y=T7T;B3Y+=n7X;B3Y+=b5T;B3Y+=P7T;var r3Y=y2Q;r3Y+=z2Q;var K3Y=G5T;K3Y+=u21;var t3Y=W2Q;t3Y+=V8B;var I3Y=f5x.S21;I3Y+=b5T;I3Y+=f5x.p21;var Q3Y=D2Q;Q3Y+=G5T;Q3Y+=w2Q;Q3Y+=f5x.x21;var T3Y=Q5T;T3Y+=C2Q;T3Y+=f5x.f21;T3Y+=s8T;f5x[f5x.z21]();if(that[d6T][T3Y][v0T](Q3Y)||that[I3Y][t3Y][K3Y](r3Y)){return;}that[S2T](that[d6T][I8T][S2T](),y3T);that[B3Y]();})[T6T](n3Y,function(){var F2Q="tainer";var b2Q="sible";var c3Y=D2Q;c3Y+=G5T;c3Y+=b2Q;var Y3Y=G5T;Y3Y+=u21;var E3Y=y8T;E3Y+=Q21;E3Y+=F2Q;var q3Y=f5x.S21;q3Y+=X8T;f5x[O3T]();if(that[q3Y][E3Y][Y3Y](c3Y)){var e4Y=E6T;e4Y+=f5x.f21;e4Y+=w7T;var i4Y=G5T;i4Y+=j2Q;i4Y+=V5T;i4Y+=T21;var O4Y=f5x.S21;O4Y+=b5T;O4Y+=f5x.p21;var V3Y=E6T;V3Y+=f5x.f21;V3Y+=w7T;that[V3Y](that[O4Y][i4Y][e4Y](),y3T);}});this[v4Y][S8T][m4Y](U2X,A4Y,function(){var a2Q="sition";var A5a="setSeco";var V2Q="_s";var K2Q='-ampm';var B2Q="hours12";var Q2Q="tC";var e5a="TCMinutes";var u2Q="_setTi";var t2Q="setUTCFullYear";var i5a="setU";var r2Q="arts";var m5a="utpu";var v5a="_writeO";var c2Q="_writeOutput";var n2Q="amp";var d2Q='-month';var U2Q="-m";var I2Q="alan";var O5a="Ti";var w4Y=T7T;w4Y+=g1T;w4Y+=b5T;w4Y+=a2Q;var D4Y=z4T;D4Y+=g1T;D4Y+=V5T;D4Y+=T21;var y4Y=f5T;y4Y+=f2Q;var S4Y=U2Q;S4Y+=z4T;S4Y+=R2Q;var p4Y=s3T;p4Y+=u6B;p4Y+=u21;var M4Y=X2Q;M4Y+=u21;M4Y+=u6B;M4Y+=u21;var N4Y=f5T;N4Y+=k2Q;var L4Y=f5T;L4Y+=o7T;L4Y+=R7T;L4Y+=O7T;var h4Y=f5x.L21;h4Y+=f5x.l21;var select=$(this);var val=select[S2T]();f5x[h4Y]();if(select[T8T](classPrefix+d2Q)){var H4Y=u2Q;H4Y+=N2Q;H4Y+=f5x.x21;var g4Y=f5x.S21;g4Y+=S8B;g4Y+=w7T;g4Y+=O1B;that[P2Q](that[u21][g4Y],val);that[H4Y]();that[X8Q]();}else if(select[T8T](classPrefix+L4Y)){var l4Y=T2Q;l4Y+=Q2Q;l4Y+=I2Q;l4Y+=j6B;that[u21][e2T][t2Q](val);that[m2Q]();that[l4Y]();}else if(select[T8T](classPrefix+N4Y)||select[M4Y](classPrefix+K2Q)){var Z4Y=g1T;Z4Y+=r2Q;if(that[u21][Z4Y][B2Q]){var f4Y=f5T;f4Y+=n2Q;f4Y+=f5x.p21;var o4Y=Q3T;o4Y+=f5x.p21;var x4Y=f5T;x4Y+=L9T;x4Y+=q2Q;var s4Y=f5x.J21;s4Y+=G5T;s4Y+=Q21;s4Y+=f5x.S21;var hours=$(that[d6T][S8T])[s4Y](Q7B+classPrefix+x4Y)[S2T]()*G81;var pm=$(that[o4Y][S8T])[i5B](Q7B+classPrefix+f4Y)[S2T]()===x9Q;that[u21][f5x.S21][E2Q](hours===j81&&!pm?J81:pm&&hours!==j81?hours+j81:hours);}else{that[u21][f5x.S21][E2Q](val);}that[Y2Q]();that[c2Q](z3T);onChange();}else if(select[p4Y](classPrefix+S4Y)){var G4Y=V2Q;G4Y+=f4X;G4Y+=O5a;G4Y+=n21;var J4Y=i5a;J4Y+=e5a;that[u21][f5x.S21][J4Y](val);that[G4Y]();that[c2Q](z3T);onChange();}else if(select[T8T](classPrefix+y4Y)){var W4Y=v5a;W4Y+=m5a;W4Y+=T21;var z4Y=A5a;z4Y+=i5T;z4Y+=u21;that[u21][f5x.S21][z4Y](val);that[Y2Q]();that[W4Y](z3T);onChange();}that[d6T][D4Y][r8T]();that[w4Y]();})[C4Y](b4Y,function(e){var L5a="Case";var F5a="Range";var B5a="CHours";var U5a="ang";var t5a="UTCH";var w5a='minutes';var Y5a="part";var E5a='setSeconds';var X5a="isa";var k5a="sCla";var i7a="setUTCFullYe";var f5a="etUTCMonth";var b5a="minutes";var o5a="cus";var n5a='setUTCHours';var j5a="minutesR";var q5a='setUTCMinutes';var R5a="hasCla";var g5a="L";var Q5a='am';var W5a="teOut";var N5a="-iconR";var r5a="getUT";var z5a="wri";var Z5a="sC";var H5a="ower";var V5a="Date";var c5a="setUTC";var K5a="ours";var P5a="seco";var T5a="dsRange";var y5a='-time';var m7a='day';var M5a="Cl";var I5a="getUTCHours";var J5a="tTit";var U4Y=h5a;U4Y+=M4Q;U4Y+=T21;var a4Y=t9T;a4Y+=g5a;a4Y+=H5a;a4Y+=L5a;var j4Y=d5X;j4Y+=u7T;j4Y+=O5B;var F4Y=T21;F4Y+=M5B;F4Y+=J5X;var d=that[u21][f5x.S21];var nodeName=e[F4Y][c9Q][P8B]();var target=nodeName===G2Q?e[Q1X][j4Y]:e[Q1X];f5x[f5x.z21]();nodeName=target[c9Q][a4Y]();if(nodeName===U4Y){return;}e[l5a]();if(nodeName===Y2B){var r4Y=w7T;r4Y+=f5x.x21;r4Y+=o8T;var Q4Y=N5a;Q4Y+=z7X;var T4Y=s3T;T4Y+=M5a;T4Y+=U8T;var X4Y=X2Q;X4Y+=Z5a;X4Y+=U9Q;var R4Y=Q6T;R4Y+=I6T;var button=$(target);var parent=button[d5X]();if(parent[T8T](R4Y)&&!parent[X4Y](s5a)){var k4Y=V9T;k4Y+=w7T;k4Y+=V5T;k4Y+=O7T;button[k4Y]();return;}if(parent[T8T](classPrefix+x5a)){var P4Y=M1T;P4Y+=o5a;var u4Y=G5T;u4Y+=j2Q;u4Y+=V8B;var d4Y=I0T;d4Y+=f5a;that[u21][e2T][p5a](that[u21][e2T][d4Y]()-G81);that[m2Q]();that[X8Q]();that[d6T][u4Y][P4Y]();}else if(parent[T4Y](classPrefix+Q4Y)){var K4Y=S5a;K4Y+=T21;var t4Y=T7T;t4Y+=l9T;t4Y+=J5a;t4Y+=j9T;var I4Y=h2X;I4Y+=M5X;that[P2Q](that[u21][I4Y],that[u21][e2T][G5a]()+G81);that[t4Y]();that[X8Q]();that[d6T][K4Y][r8T]();}else if(button[R5Q](Q7B+classPrefix+y5a)[r4Y]){var l6Y=T7T;l6Y+=z5a;l6Y+=W5a;l6Y+=D5a;var L6Y=e7T;L6Y+=P3X;L6Y+=B0B;var g6Y=g1T;g6Y+=f5x.p21;var V4Y=u21;V4Y+=J2Q;var n4Y=V5T;n4Y+=Q21;n4Y+=G5T;n4Y+=T21;var B4Y=f5x.S21;B4Y+=f5x.f21;B4Y+=T21;B4Y+=f5x.f21;var val=button[i6T](B9B);var unit=button[B4Y](n4Y);if(unit===w5a){var E4Y=O7T;E4Y+=c6B;E4Y+=p0T;var q4Y=k9T;q4Y+=C5a;q4Y+=f5x.x21;q4Y+=f5x.S21;if(parent[T8T](q4Y)&&parent[T8T](E4Y)){var Y4Y=b5a;Y4Y+=F5a;that[u21][Y4Y]=val;that[Y2Q]();return;}else{var c4Y=j5a;c4Y+=a5a;that[u21][c4Y]=j6T;}}if(unit===V4Y){var v6Y=O7T;v6Y+=U5a;v6Y+=f5x.x21;var e6Y=R5a;e6Y+=g6X;var i6Y=f5x.S21;i6Y+=X5a;i6Y+=c5X;i6Y+=u9T;var O6Y=X2Q;O6Y+=k5a;O6Y+=u21;O6Y+=u21;if(parent[O6Y](i6Y)&&parent[e6Y](v6Y)){var m6Y=d5a;m6Y+=u5a;that[u21][m6Y]=val;that[Y2Q]();return;}else{var A6Y=P5a;A6Y+=Q21;A6Y+=T5a;that[u21][A6Y]=j6T;}}if(val===Q5a){if(d[I5a]()>=j81){var h6Y=I0T;h6Y+=f4X;h6Y+=t5a;h6Y+=K5a;val=d[h6Y]()-j81;}else{return;}}else if(val===g6Y){var H6Y=r5a;H6Y+=B5a;if(d[H6Y]()<j81){val=d[I5a]()+j81;}else{return;}}var set=unit===L6Y?n5a:unit===w5a?q5a:E5a;d[set](val);that[Y2Q]();that[l6Y](z3T);onChange();}else{var f6Y=T21;f6Y+=G5T;f6Y+=f5x.p21;f6Y+=f5x.x21;var o6Y=Y5a;o6Y+=u21;var x6Y=v2Q;x6Y+=V8B;var s6Y=f5x.S21;s6Y+=f5x.f21;s6Y+=X4T;var Z6Y=c5a;Z6Y+=V5a;var M6Y=f5x.p21;M6Y+=b5T;M6Y+=O7a;var N6Y=i7a;N6Y+=M5B;if(!d){d=that[r8Q](new Date());}d[e7a](G81);d[N6Y](button[i6T](v7a));d[p5a](button[i6T](M6Y));d[Z6Y](button[s6Y](m7a));that[x6Y](z3T);if(!that[u21][o6Y][f6Y]){setTimeout(function(){var S6Y=T7T;S6Y+=K5B;var p6Y=B9T;p6Y+=f5x.l21;f5x[p6Y]();that[S6Y]();},b81);}else{var J6Y=T2Q;J6Y+=U3X;J6Y+=I8Q;that[J6Y]();}onChange();}}else{var G6Y=f5x.J21;G6Y+=b5T;G6Y+=Q5T;G6Y+=x9B;that[d6T][I8T][G6Y]();}});},_compareDates:function(a,b){var A7a="_dateToUtcString";var y6Y=B9T;y6Y+=f5x.l21;f5x[y6Y]();return this[A7a](a)===this[A7a](b);},_correctMonth:function(date,month){var g7a="TCDat";var L7a="Month";var H7a="ysIn";var D6Y=f5x.L21;D6Y+=f5x.l21;var W6Y=I0T;W6Y+=h7a;W6Y+=g7a;W6Y+=f5x.x21;var z6Y=y1Q;z6Y+=H7a;z6Y+=L7a;var days=this[z6Y](date[l7a](),month);var correctDays=date[W6Y]()>days;f5x[D6Y]();date[p5a](month);if(correctDays){date[e7a](days);date[p5a](month);}},_daysInMonth:function(year,month){var Q81=29;var t81=31;var T81=28;var I81=30;var isLeap=year%W81===J81&&(year%V81!==J81||year%i21===J81);var months=[t81,isLeap?Q81:T81,t81,I81,t81,I81,t81,t81,I81,t81,I81,t81];return months[month];},_dateToUtc:function(s){var Z7a="getHo";var o7a="getMonth";var M7a="nutes";var N7a="getMi";var s7a="getF";var f7a="getDate";var j6Y=N7a;j6Y+=M7a;var F6Y=Z7a;F6Y+=q2Q;var b6Y=s7a;b6Y+=x7a;var C6Y=V8Q;C6Y+=i7T;C6Y+=X7T;var w6Y=B9T;w6Y+=f5x.l21;f5x[w6Y]();return new Date(Date[C6Y](s[b6Y](),s[o7a](),s[f7a](),s[F6Y](),s[j6Y](),s[p7a]()));},_dateToUtcString:function(d){var S7a="tUTCD";var U6Y=p0T;U6Y+=S7a;U6Y+=g9T;U6Y+=f5x.x21;var a6Y=T7T;a6Y+=g1T;a6Y+=j0X;return d[l7a]()+K1B+this[J7a](d[G5a]()+G81)+K1B+this[a6Y](d[U6Y]());},_hide:function(){var w7a="ollB";var W7a="div.da";var C7a="ntaine";var G7a="scr";var y7a="oll.";var D7a="taTables_scr";var b7a='keydown.';var T6Y=W2X;T6Y+=f5x.J21;var P6Y=G7a;P6Y+=y7a;var u6Y=z7a;u6Y+=w7T;u6Y+=z2X;var d6Y=W7a;d6Y+=D7a;d6Y+=w7a;d6Y+=u6X;var k6Y=b5T;k6Y+=f5x.J21;k6Y+=f5x.J21;var X6Y=Q5T;X6Y+=b5T;X6Y+=C7a;X6Y+=O7T;var R6Y=f5x.S21;R6Y+=b5T;R6Y+=f5x.p21;var namespace=this[u21][d9B];this[R6Y][X6Y][r7X]();$(window)[k6Y](Q7B+namespace);$(document)[N3X](b7a+namespace);$(d6Y)[N3X](u6Y+namespace);$(Z9X)[N3X](P6Y+namespace);f5x[f5x.z21]();$(J8T)[T6Y](F7a+namespace);},_hours24To12:function(val){f5x[O3T]();return val===J81?j81:val>j81?val-j81:val;},_htmlDay:function(day){var Y7a='</span>';var K7a='" class="';var B7a='-day" type="button" ';var k7a="<td d";var E7a='<span>';var t7a='now';var I7a="today";var j7a="\" da";var d7a="ata-day=\"";var u7a="cte";var n7a='" data-month="';var q7a="month";var Q7a='selectable';var T7a="pty\"></td>";var P7a="<td class=\"em";var R7a="ta-year=\"";var U7a="=";var a7a="ta-day";var X7a="<button class=";var e8Y=f5x.S21;e8Y+=f5x.f21;e8Y+=o7T;var i8Y=f5x.S21;i8Y+=f5x.f21;i8Y+=o7T;var O8Y=j7a;O8Y+=a7a;O8Y+=U7a;O8Y+=m3T;var V6Y=o7T;V6Y+=R7T;V6Y+=O7T;var c6Y=R4T;c6Y+=R7a;var Y6Y=X7a;Y6Y+=m3T;var E6Y=f5x.S21;E6Y+=f5x.f21;E6Y+=o7T;var q6Y=k7a;q6Y+=d7a;var n6Y=A2Q;n6Y+=u7a;n6Y+=f5x.S21;var K6Y=J5B;K6Y+=f5x.S21;var t6Y=B9T;t6Y+=f5x.l21;var Q6Y=f5x.x21;Q6Y+=f5x.p21;Q6Y+=g1T;Q6Y+=a4T;if(day[Q6Y]){var I6Y=P7a;I6Y+=T7a;return I6Y;}f5x[t6Y]();var classes=[Q7a];var classPrefix=this[Q5T][Z2Q];if(day[K6Y]){var r6Y=k9T;r6Y+=C5a;r6Y+=f5x.x21;r6Y+=f5x.S21;classes[f3T](r6Y);}if(day[I7a]){var B6Y=g1T;B6Y+=x9B;B6Y+=e7T;classes[B6Y](t7a);}if(day[n6Y]){classes[f3T](n4Q);}return q6Y+day[E6Y]+K7a+classes[t1B](L6T)+x6T+Y6Y+classPrefix+r7a+classPrefix+B7a+c6Y+day[V6Y]+n7a+day[q7a]+O8Y+day[i8Y]+x6T+E7a+day[e8Y]+Y7a+c7a+V7a;},_htmlMonth:function(year,month){var J1a="_htm";var U1a='-table';var z1a="_comp";var Z1a="UTC";var m1a="htmlMonthHead";var L1a="tUTC";var p1a="setSeconds";var k81=23;var b1a="tr>";var W1a="areD";var X1a="ekNu";var w1a="_compareDates";var u1a='-iconRight';var g1a="efix";var s1a="firstDay";var H1a="minD";var S1a="setUTCMinutes";var o1a="setUT";var F1a="showWeekNumber";var k1a="mber";var Q1a='</table>';var R1a=" w";var e1a="</t";var l1a="Da";var j1a="_htmlWeekOfYear";var C1a="getUTCDay";var M1a="nM";var G1a="lDay";var y1a="ableDa";var v1a="head";var h1a="classPr";var D1a="ates";var i1a="y>";var x1a="Minute";var N1a="_daysI";var O1a="/t";var A1a="ead>";var f1a="CHo";var U8Y=M4T;U8Y+=O1a;U8Y+=L1Q;U8Y+=i1a;var a8Y=e1a;a8Y+=v1a;a8Y+=i4T;var j8Y=T7T;j8Y+=m1a;var F8Y=M4T;F8Y+=p3T;F8Y+=A1a;var b8Y=m3T;b8Y+=i4T;var p8Y=h1a;p8Y+=g1a;var A8Y=H1a;A8Y+=f5x.f21;A8Y+=T21;A8Y+=f5x.x21;var m8Y=p0T;m8Y+=L1a;m8Y+=l1a;m8Y+=o7T;var v8Y=N1a;v8Y+=M1a;v8Y+=b5T;v8Y+=O7a;var now=this[r8Q](new Date()),days=this[v8Y](year,month),before=new Date(Date[Z1a](year,month,G81))[m8Y](),data=[],row=[];if(this[Q5T][s1a]>J81){before-=this[Q5T][s1a];if(before<J81){before+=w81;}}var cells=days+before,after=cells;while(after>w81){after-=w81;}cells+=w81-after;var minDate=this[Q5T][A8Y];var maxDate=this[Q5T][R8Q];if(minDate){var g8Y=l9T;g8Y+=L1a;g8Y+=x1a;g8Y+=u21;var h8Y=o1a;h8Y+=f1a;h8Y+=V5T;h8Y+=B0B;minDate[h8Y](J81);minDate[g8Y](J81);minDate[p1a](J81);}if(maxDate){maxDate[E2Q](k81);maxDate[S1a](n81);maxDate[p1a](n81);}for(var i=J81,r=J81;i<cells;i++){var Z8Y=J1a;Z8Y+=G1a;var M8Y=g1T;M8Y+=x9B;M8Y+=e7T;var N8Y=z6B;N8Y+=T6T;var l8Y=G5T;l8Y+=m0Q;l8Y+=f5x.f21;l8Y+=o7T;var L8Y=P9T;L8Y+=y1a;L8Y+=o7T;L8Y+=u21;var H8Y=z1a;H8Y+=W1a;H8Y+=D1a;var day=new Date(Date[Z1a](year,month,G81+(i-before))),selected=this[u21][f5x.S21]?this[H8Y](day,this[u21][f5x.S21]):y3T,today=this[w1a](day,now),empty=i<before||i>=days+before,disabled=minDate&&day<minDate||maxDate&&day>maxDate;var disableDays=this[Q5T][L8Y];if($[l8Y](disableDays)&&$[W4X](day[C1a](),disableDays)!==-G81){disabled=z3T;}else if(typeof disableDays===N8Y&&disableDays(day)===z3T){disabled=z3T;}var dayConfig={day:G81+(i-before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[M8Y](this[Z8Y](dayConfig));if(++r===w81){var f8Y=f5x.s21;f8Y+=b5T;f8Y+=z4T;var o8Y=M4T;o8Y+=b1a;var x8Y=g1T;x8Y+=V5T;x8Y+=u21;x8Y+=e7T;if(this[Q5T][F1a]){var s8Y=M7T;s8Y+=u21;s8Y+=A7X;row[s8Y](this[j1a](i-before,month,year));}data[x8Y](o8Y+row[f8Y](K0T)+a1a);row=[];r=J81;}}f5x[f5x.z21]();var classPrefix=this[Q5T][p8Y];var className=classPrefix+U1a;if(this[Q5T][F1a]){var S8Y=R1a;S8Y+=f5x.x21;S8Y+=X1a;S8Y+=k1a;className+=S8Y;}if(minDate){var W8Y=Q21;W8Y+=b5T;W8Y+=Q21;W8Y+=f5x.x21;var z8Y=Q5T;z8Y+=u21;z8Y+=u21;var y8Y=f5x.J21;y8Y+=G5T;y8Y+=Q21;y8Y+=f5x.S21;var G8Y=f5x.S21;G8Y+=b5T;G8Y+=f5x.p21;var J8Y=V8Q;J8Y+=i7T;J8Y+=X7T;var underMin=minDate>=new Date(Date[J8Y](year,month,G81,J81,J81,J81));this[G8Y][t6X][y8Y](T7B+classPrefix+x5a)[z8Y](X6T,underMin?W8Y:T5X);}if(maxDate){var C8Y=c5X;C8Y+=d1a;C8Y+=E5X;var w8Y=K5X;w8Y+=f9T;var D8Y=f5x.S21;D8Y+=G5T;D8Y+=X0X;D8Y+=O1B;var overMax=maxDate<new Date(Date[Z1a](year,month+G81,G81,J81,J81,J81));this[d6T][t6X][i5B](T7B+classPrefix+u1a)[R6T](D8Y,overMax?w8Y:C8Y);}return P1a+className+b8Y+F8Y+this[j8Y]()+a8Y+T1a+data[t1B](K0T)+U8Y+Q1a;},_htmlMonthHead:function(){var q1a='</th>';var t1a="rstDay";var r1a="<th></t";var n1a='<th>';var B1a="h>";var I1a="howWeekNu";var X8Y=u21;X8Y+=I1a;X8Y+=f5x.p21;X8Y+=A7T;var R8Y=f5x.J21;R8Y+=G5T;R8Y+=t1a;var a=[];var firstDay=this[Q5T][R8Y];var i18n=this[Q5T][I4T];var dayName=function(day){var K1a="weekdays";day+=firstDay;while(day>=w81){day-=w81;}f5x[f5x.z21]();return i18n[K1a][day];};if(this[Q5T][X8Y]){var d8Y=r1a;d8Y+=B1a;var k8Y=g1T;k8Y+=V5T;k8Y+=u21;k8Y+=e7T;a[k8Y](d8Y);}for(var i=J81;i<w81;i++){var u8Y=g1T;u8Y+=y8B;a[u8Y](n1a+dayName(i)+q1a);}return a[t1B](K0T);},_htmlWeekOfYear:function(d,m,y){var c1a="getDay";var O9a='<td class="';var V1a="ceil";var i9a='-week">';var g21=86400000;var Y1a="setDate";var T8Y=J7B;T8Y+=T21;T8Y+=f5x.S21;T8Y+=i4T;var P8Y=p0T;P8Y+=E1a;P8Y+=g9T;P8Y+=f5x.x21;var date=new Date(y,m,d,J81,J81,J81,J81);date[Y1a](date[P8Y]()+W81-(date[c1a]()||w81));var oneJan=new Date(y,J81,G81);var weekNum=Math[V1a](((date-oneJan)/g21+G81)/w81);return O9a+this[Q5T][Z2Q]+i9a+weekNum+T8Y;},_options:function(selector,values,labels){var e9a="ect.";var v9a='<option value="';var m9a='</option>';var K8Y=W0B;K8Y+=T21;K8Y+=e7T;var t8Y=h5a;t8Y+=e9a;var I8Y=f5x.J21;I8Y+=z4T;I8Y+=f5x.S21;var Q8Y=Q5T;Q8Y+=d2T;Q8Y+=r7B;Q8Y+=O7T;if(!labels){labels=values;}var select=this[d6T][Q8Y][I8Y](t8Y+this[Q5T][Z2Q]+K1B+selector);select[j8Q]();for(var i=J81,ien=values[K8Y];i<ien;i++){var B8Y=m3T;B8Y+=i4T;var r8Y=S1X;r8Y+=i5T;select[r8Y](v9a+values[i]+B8Y+labels[i]+m9a);}},_optionSet:function(selector,val){var A9a="unkno";var L9a="contain";var H9a="assPr";var l9a='select.';var h9a="optio";var g9a="n:select";var v2Y=A9a;v2Y+=P7T;v2Y+=Q21;var e2Y=w7T;e2Y+=w5Q;e2Y+=e7T;var i2Y=h9a;i2Y+=g9a;i2Y+=u9T;var O2Y=F9T;O2Y+=i5T;var V8Y=E6T;V8Y+=p2T;var c8Y=N6X;c8Y+=s0X;c8Y+=M6X;var Y8Y=b1T;Y8Y+=H9a;Y8Y+=H8T;Y8Y+=g8Q;var E8Y=L9a;E8Y+=d5T;var q8Y=Q3T;q8Y+=f5x.p21;var n8Y=B9T;n8Y+=f5x.l21;f5x[n8Y]();var select=this[q8Y][E8Y][i5B](l9a+this[Q5T][Y8Y]+K1B+selector);var span=select[d5X]()[c8Y](G2Q);select[V8Y](val);var selected=select[O2Y](i2Y);span[R5X](selected[e2Y]!==J81?selected[a8X]():this[Q5T][I4T][v2Y]);},_optionsTime:function(unit,count,val,allowed,range){var D9a='<tr>';var Z9a="<thead><t";var U9a="table class=\"";var a9a="</tbody></thead><";var X9a='</th></tr></thead>';var D81=6;var j9a="dy>";var o9a="_pa";var s9a="><th colspan=\"";var M9a="/tbody>";var R9a="floor";var w9a="amPm";var b9a="-nospa";var C9a="<t";var x9a="-t";var N9a="/ta";var F9a="ce\"><tbo";var z2Y=M4T;z2Y+=N9a;z2Y+=I9T;z2Y+=i4T;var y2Y=M4T;y2Y+=M9a;var G2Y=Z9a;G2Y+=O7T;G2Y+=s9a;var J2Y=f5x.f21;J2Y+=g1T;J2Y+=R1T;J2Y+=i5T;var S2Y=F9B;S2Y+=g1T;S2Y+=T21;S2Y+=o7T;var g2Y=f5x.L21;g2Y+=f5x.l21;var h2Y=x9a;h2Y+=f5x.f21;h2Y+=c5X;h2Y+=f5x.x21;var A2Y=o9a;A2Y+=f5x.S21;var classPrefix=this[Q5T][Z2Q];var container=this[d6T][S8T][i5B](T7B+classPrefix+K1B+unit);var i,j;var render=count===j81?function(i){var m2Y=B9T;m2Y+=f5x.l21;f5x[m2Y]();return i;}:this[A2Y];var classPrefix=this[Q5T][Z2Q];var className=classPrefix+h2Y;var i18n=this[Q5T][I4T];f5x[g2Y]();if(!container[G3T]){return;}var a=K0T;var span=b81;var button=function(value,label,className){var W9a='" data-value="';var p9a="<sp";var J9a=' disabled';var G9a='<td class="selectable ';var f9a="span";var y9a='<button class="';var z9a='-day" type="button" data-unit="';var S9a="um";var N2Y=J7B;N2Y+=f9a;N2Y+=i4T;var l2Y=p9a;l2Y+=f5x.f21;l2Y+=x8Q;var L2Y=f5x.f21;L2Y+=f5x.p21;var H2Y=Q21;H2Y+=S9a;H2Y+=A7T;if(count===j81&&val>=j81&&typeof value===H2Y){value+=j81;}var selected=val===value||value===L2Y&&val<j81||value===x9Q&&val>=j81?n4Q:K0T;if(allowed&&$[W4X](value,allowed)===-G81){selected+=J9a;}if(className){selected+=L6T+className;}return G9a+selected+x6T+y9a+classPrefix+r7a+classPrefix+z9a+unit+W9a+value+x6T+l2Y+label+N2Y+c7a+V7a;};if(count===j81){var s2Y=o1Q;s2Y+=B9T;s2Y+=f5x.p21;var Z2Y=M4T;Z2Y+=T21;Z2Y+=O7T;Z2Y+=i4T;var M2Y=f5x.f21;M2Y+=f5x.p21;a+=D9a;for(i=G81;i<=D81;i++){a+=button(i,render(i));}a+=button(M2Y,i18n[w9a][J81]);a+=a1a;a+=Z2Y;for(i=w81;i<=j81;i++){a+=button(i,render(i));}a+=button(x9Q,i18n[s2Y][G81]);a+=a1a;span=w81;}else if(count===d81){var c=J81;for(j=J81;j<W81;j++){var o2Y=J7B;o2Y+=T21;o2Y+=O7T;o2Y+=i4T;var x2Y=C9a;x2Y+=i1Q;a+=x2Y;for(i=J81;i<D81;i++){a+=button(c,render(c));c++;}a+=o2Y;}span=D81;}else{var p2Y=b9a;p2Y+=F9a;p2Y+=j9a;var f2Y=a9a;f2Y+=U9a;a+=D9a;for(j=J81;j<q81;j+=b81){a+=button(j,render(j),s5a);}a+=a1a;a+=f2Y+className+L6T+className+p2Y;var start=range!==j6T?range:Math[R9a](val/b81)*b81;a+=D9a;for(j=start+G81;j<start+b81;j++){a+=button(j,render(j));}a+=a1a;span=D81;}container[S2Y]()[J2Y](P1a+className+x6T+G2Y+span+x6T+i18n[unit]+X9a+T1a+a+y2Y+z2Y);},_optionsTitle:function(){var Q9a="getFullYear";var d9a="getFullYe";var k9a="_rang";var u9a="etFullYear";var t9a="_options";var I9a="yearRange";var P9a="getFullYea";var T9a="minDate";var a2Y=f5x.p21;a2Y+=b5T;a2Y+=O7a;a2Y+=u21;var j2Y=k9a;j2Y+=f5x.x21;var F2Y=h0T;F2Y+=Q21;F2Y+=p3T;var b2Y=s1T;b2Y+=g1T;b2Y+=I4X;var C2Y=d9a;C2Y+=M5B;var w2Y=I0T;w2Y+=u9a;var D2Y=P9a;D2Y+=O7T;var W2Y=G5T;W2Y+=t4Q;W2Y+=Q21;var i18n=this[Q5T][W2Y];var min=this[Q5T][T9a];var max=this[Q5T][R8Q];var minYear=min?min[D2Y]():j6T;var maxYear=max?max[w2Y]():j6T;var i=minYear!==j6T?minYear:new Date()[Q9a]()-this[Q5T][I9a];var j=maxYear!==j6T?maxYear:new Date()[C2Y]()+this[Q5T][I9a];this[b2Y](F2Y,this[j2Y](J81,F81),i18n[a2Y]);this[t9a](v7a,this[K9a](i,j));},_pad:function(i){var r9a='0';return i<b81?r9a+i:i;},_position:function(){var O0a="tal";var V9a="horizo";var q9a="lTop";var B9a="eft";var Y9a="horizont";var e0a="widt";var n9a="crol";var i0a="removeC";var E9a="rWidth";var i51=P7T;i51+=q4T;i51+=p3T;var O51=w7T;O51+=B9a;var Y2Y=T21;Y2Y+=b5T;Y2Y+=g1T;var E2Y=u21;E2Y+=n9a;E2Y+=q9a;var q2Y=P3X;q2Y+=V21;q2Y+=E9a;var n2Y=m9X;n2Y+=A9X;var B2Y=L1Q;B2Y+=o7T;var r2Y=w7T;r2Y+=f5x.x21;r2Y+=f5x.J21;r2Y+=T21;var K2Y=t9T;K2Y+=g1T;var t2Y=Q5T;t2Y+=u21;t2Y+=u21;var u2Y=H3X;u2Y+=f5x.S21;u2Y+=p3T;var d2Y=U2B;d2Y+=O7T;d2Y+=h8T;var k2Y=W2Q;k2Y+=V5T;k2Y+=T21;var X2Y=f5x.S21;X2Y+=b5T;X2Y+=f5x.p21;var R2Y=Z8T;R2Y+=Z5X;R2Y+=Q21;R2Y+=d5T;var U2Y=Q3T;U2Y+=f5x.p21;var offset=this[d6T][I8T][h3X]();var container=this[U2Y][R2Y];var inputHeight=this[X2Y][k2Y][M9X]();if(this[u21][d2Y][u2X]&&this[u21][x2Q][o2Q]&&$(window)[u2Y]()>v21){var T2Y=Y9a;T2Y+=p2T;var P2Y=f5x.f21;P2Y+=c9a;container[P2Y](T2Y);}else{var I2Y=V9a;I2Y+=Q21;I2Y+=O0a;var Q2Y=i0a;Q2Y+=H2T;Q2Y+=g6X;container[Q2Y](I2Y);}container[t2Y]({top:offset[K2Y]+inputHeight,left:offset[r2Y]})[P6X](B2Y);var calHeight=container[n2Y]();var calWidth=container[q2Y]();var scrollTop=$(window)[E2Y]();if(offset[Y2Y]+inputHeight+calHeight-scrollTop>$(window)[l9X]()){var V2Y=Q5T;V2Y+=u21;V2Y+=u21;var c2Y=T21;c2Y+=b5T;c2Y+=g1T;var newTop=offset[c2Y]-calHeight;container[V2Y](o8X,newTop<J81?J81:newTop);}if(calWidth+offset[O51]>$(window)[i51]()){var e51=e0a;e51+=e7T;var newLeft=$(window)[e51]()-calWidth;container[R6T](p8X,newLeft<J81?J81:newLeft);}},_range:function(start,end,inc){var a=[];f5x[O3T]();if(!inc){inc=G81;}for(var i=start;i<=end;i+=inc){var v51=g1T;v51+=y8B;a[v51](i);}return a;},_setCalander:function(){var v0a="etUTCFul";var g0a="_htmlMonth";var A0a="mpt";var m0a="lYea";var h0a="calendar";var m51=k9T;m51+=d9T;if(this[u21][m51]){var g51=I0T;g51+=v0a;g51+=m0a;g51+=O7T;var h51=f5x.x21;h51+=A0a;h51+=o7T;var A51=f5x.S21;A51+=b5T;A51+=f5x.p21;this[A51][h0a][h51]()[g2T](this[g0a](this[u21][e2T][g51](),this[u21][e2T][G5a]()));}},_setTitle:function(){var H0a="TCF";var L0a="getUTCMon";var N0a='month';var l0a="_optionSet";var N51=I0T;N51+=h7a;N51+=H0a;N51+=x7a;var l51=f5x.S21;l51+=S8B;l51+=H2T;l51+=o7T;var L51=W5B;L51+=M5B;var H51=L0a;H51+=p3T;this[l0a](N0a,this[u21][e2T][H51]());this[l0a](L51,this[u21][l51][N51]());},_setTime:function(){var b0a='hours';var J0a="Ava";var D0a="etUTCHours";var F0a="_optionsTime";var W0a="onsTime";var s0a="esRange";var M0a="ond";var Z0a="minut";var G0a="ila";var x0a="UTCMi";var f0a="minute";var o0a="nut";var p0a="_op";var y0a="urs12";var S0a="ionsTim";var D51=l9T;D51+=Q5T;D51+=u5a;var W51=d5a;W51+=a6Q;var z51=d5a;z51+=M0a;z51+=u21;var y51=Z0a;y51+=s0a;var G51=f5x.p21;G51+=G5T;G51+=Q21;G51+=R2Q;var J51=J5X;J51+=x0a;J51+=o0a;J51+=v5T;var S51=f0a;S51+=u21;var p51=p0a;p51+=T21;p51+=S0a;p51+=f5x.x21;var f51=k2Q;f51+=J0a;f51+=G0a;f51+=I9T;var o51=L9T;o51+=y0a;var x51=T7T;x51+=z0a;x51+=G5T;x51+=W0a;var M51=I0T;M51+=D0a;var that=this;var d=this[u21][f5x.S21];var hours=d?d[M51]():J81;var allowed=function(prop){var C0a='Available';var w0a="ment";var s51=a0X;s51+=W1Q;s51+=w0a;var Z51=f5x.L21;Z51+=f5x.l21;f5x[Z51]();return that[Q5T][prop+C0a]?that[Q5T][prop+C0a]:that[K9a](J81,n81,that[Q5T][prop+s51]);};this[x51](b0a,this[u21][x2Q][o51]?j81:d81,hours,this[Q5T][f51]);this[p51](S51,q81,d?d[J51]():J81,allowed(G51),this[u21][y51]);this[F0a](z51,q81,d?d[p7a]():J81,allowed(W51),this[u21][D51]);},_show:function(){var P0a="_position";var u0a="space";var Q0a='div.dataTables_scrollBody';var j0a="keydo";var a0a="l.";var d0a="ze.";var U0a="div.D";var X0a="ody_Content";var R0a="TE_B";var k0a="res";var I0a='scroll.';var k51=j0a;k51+=u7X;k51+=z2X;var X51=b5T;X51+=Q21;var U51=z7a;U51+=a0a;var a51=U0a;a51+=R0a;a51+=X0a;var F51=N3T;F51+=k0a;F51+=G5T;F51+=d0a;var b51=z7a;b51+=a0a;var C51=b5T;C51+=Q21;var w51=Q21;w51+=M3Q;w51+=u0a;var that=this;var namespace=this[u21][w51];this[P0a]();f5x[f5x.z21]();$(window)[C51](b51+namespace+F51+namespace,function(){var T0a="_hi";var j51=T0a;j51+=i0X;that[j51]();});$(a51)[T6T](U51+namespace,function(){f5x[f5x.z21]();that[Y7X]();});$(Q0a)[T6T](I0a+namespace,function(){var R51=T7T;R51+=y4X;R51+=f5x.S21;R51+=f5x.x21;f5x[f5x.z21]();that[R51]();});$(document)[X51](k51+namespace,function(e){var K0a="yCo";var t0a="Cod";var C81=9;var u51=Y8B;u51+=t0a;u51+=f5x.x21;var d51=G3Q;d51+=K0a;d51+=i0X;if(e[d51]===C81||e[P8X]===P81||e[u51]===a81){var P51=T7T;P51+=K5B;that[P51]();}});setTimeout(function(){var I51=b5T;I51+=Q21;var Q51=V9T;Q51+=b5T;Q51+=f5x.S21;Q51+=o7T;var T51=f5x.L21;T51+=f5x.l21;f5x[T51]();$(Q51)[I51](F7a+namespace,function(e){var B0a="targe";var n51=G5T;n51+=j2Q;n51+=V5T;n51+=T21;var B51=Q3T;B51+=f5x.p21;var r51=X4T;r51+=C5B;r51+=f5x.x21;r51+=T21;var K51=r0a;K51+=f5x.x21;K51+=U5T;K51+=u21;var t51=B0a;t51+=T21;f5x[f5x.z21]();var parents=$(e[t51])[K51]();if(!parents[P8Q](that[d6T][S8T])[G3T]&&e[r51]!==that[B51][n51][J81]){that[Y7X]();}});},b81);},_writeOutput:function(focus){var q0a="orma";var Y0a="oment";var c0a="utc";var O3a="getUTCDate";var n0a="UTCM";var E0a="omentL";var i71=f5x.S21;i71+=b5T;i71+=f5x.p21;var O71=J5X;O71+=n0a;O71+=b5T;O71+=O7a;var V51=T7T;V51+=g1T;V51+=j0X;var c51=f5x.J21;c51+=q0a;c51+=T21;var Y51=f5x.p21;Y51+=E0a;Y51+=d1a;Y51+=p6Q;var E51=q8Q;E51+=Q21;E51+=T21;var q51=f5x.p21;q51+=Y0a;var date=this[u21][f5x.S21];var out=window[q51]?window[E51][c0a](date,undefined,this[Q5T][Y51],this[Q5T][V0a])[c51](this[Q5T][L8Q]):date[l7a]()+K1B+this[V51](date[O71]()+G81)+K1B+this[J7a](date[O3a]());f5x[O3T]();this[i71][I8T][S2T](out);if(focus){var v71=W2Q;v71+=V5T;v71+=T21;var e71=f5x.S21;e71+=b5T;e71+=f5x.p21;this[e71][v71][r8T]();}}});Editor[m71][A71]=J81;Editor[h71][c3B]={classPrefix:g71,disableDays:j6T,firstDay:G81,format:H71,hoursAvailable:j6T,i18n:Editor[c3B][I4T][r21],maxDate:j6T,minDate:j6T,minutesAvailable:j6T,minutesIncrement:G81,momentStrict:z3T,momentLocale:L71,onChange:function(){},secondsAvailable:j6T,secondsIncrement:G81,showWeekNumber:y3T,yearRange:b81};(function(){var m3a="tex";var Q3a="_enabled";var T8a="nput";var x3a="_input";var G2a="uploadMany";var z6a="checkbox";var P6a='disabled';var M4a="led";var U6a="eck";var i3a="che";var Q4a="or_val";var h3a="swor";var c8a="_p";var S6a='_';var G6a='input:last';var w2a="_container";var b8a="enab";var D8a="ker";var w4a="placeholder";var T6a="radio";var v3a="elect";var e3a="ckbox";var d4a="_editor_val";var d6a="checked";var x4a="_va";var l6a="_inp";var L2a="_val";var E4a="_lastSet";var W6a="_addOptions";var N6a="npu";var g3a="onl";var v6a="separator";var s6a="eId";var H3a="dType";var A3a="pas";var E6a="_preChecked";var Z4a="prop";var m6a="opti";var s4a="hidden";var H8a="datepicker";var G4a="feId";var Q8a="_closeFn";var x8a="cker";var J2a='upload.editor';var d8a="_picker";var z8a="icker";var t8a='keydown';var p6a='<div>';var z31=I3T;z31+=t3T;var y31=f5x.S21;y31+=g9T;y31+=f5x.x21;var U01=E5T;U01+=i5T;var q91=i3a;q91+=e3a;var v91=u21;v91+=v3a;var V11=I3T;V11+=T21;V11+=n5T;var c11=m3a;c11+=X4T;c11+=N1B;var B11=A3a;B11+=h3a;B11+=f5x.S21;var a11=f5x.x21;a11+=Q4T;a11+=n5T;var j11=N1B;j11+=f5x.S21;j11+=g3a;j11+=o7T;var f11=c5B;f11+=H3a;var o11=Y3B;o11+=u21;var x11=f5x.x21;x11+=L3a;x11+=i5T;var fieldTypes=Editor[t4T];function _buttonText(conf,text){var s3a="Choose file...";var l3a="tm";var Z3a="dText";var N3a="div.u";var M3a="load b";var Z71=e7T;Z71+=l3a;Z71+=w7T;var M71=N3a;M71+=g1T;M71+=M3a;M71+=A6Q;var N71=L8B;N71+=f5x.S21;f5x[f5x.z21]();if(text===j6T||text===undefined){var l71=V5T;l71+=p5X;l71+=r0B;l71+=Z3a;text=conf[l71]||s3a;}conf[x3a][N71](M71)[Z71](text);}function _commonUpload(editor,conf,dropCallback,multiple){var e4a='dragleave dragexit';var y3a="<but";var r3a="FileReader";var z3a="ton c";var q3a="drop";var p3a="gDr";var w3a="e\" ";var R3a='<div class="cell upload limitHide">';var a3a='<div class="editor_upload">';var K3a="le]";var F3a="_table";var I3a="[type=fil";var E3a=" sp";var c3a="Drag and drop a file here to upload";var k3a='<div class="cell clearValue">';var X3a='/>';var U3a='<div class="row">';var f3a="ile]";var B3a="dro";var h4a=".rendered";var b3a="ass=\"eu";var o3a="input[type=f";var d3a='<div class="row second">';var H4a='div.clearValue button';var D3a="<input type=\"fil";var n3a="div.dr";var Y3a="dragDropText";var S3a="/di";var G3a=" /";var P3a='<div class="drop"><span/></div>';var g4a="noDro";var C3a="on class=\"";var W3a="iple";var T3a='<div class="rendered"/>';var A4a='dragover.DTE_Upload drop.DTE_Upload';var m4a='dragover';var j3a="buttonInternal";var u3a='<div class="cell limitHide">';var t3a="nput[type=";var J3a=" class=\"cell\">";var N11=Q5T;N11+=e7T;N11+=a5a;var l11=o3a;l11+=f3a;var H11=b5T;H11+=Q21;var T71=f5x.S21;T71+=e9X;T71+=p3a;T71+=s9T;var d71=f5x.f21;d71+=v3Q;var j71=G5T;j71+=f5x.S21;var F71=M4T;F71+=S3a;F71+=n3T;var b71=M4T;b71+=S3a;b71+=n3T;var C71=e4T;C71+=E6T;C71+=J3a;var w71=M4T;w71+=r3T;w71+=f5x.S21;w71+=G7B;var D71=J7B;D71+=k9T;D71+=E6T;D71+=i4T;var W71=s6X;W71+=G5T;W71+=E6T;W71+=i4T;var z71=m3T;z71+=G3a;z71+=i4T;var y71=y3a;y71+=z3a;y71+=D7B;var G71=s6X;G71+=G7B;var J71=S5T;J71+=J5T;J71+=W3a;var S71=D3a;S71+=w3a;var p71=m3T;p71+=N3T;p71+=r3T;p71+=i4T;var f71=y3a;f71+=T21;f71+=C3a;var o71=C3B;o71+=b3a;o71+=F3a;o71+=V6Q;var x71=f5x.J21;x71+=b5T;x71+=O7T;x71+=f5x.p21;var s71=b1T;s71+=U8T;s71+=v5T;var btnClass=editor[s71][x71][j3a];var container=$(a3a+o71+U3a+R3a+f71+btnClass+p71+S71+(multiple?J71:K0T)+X3a+G71+k3a+y71+btnClass+z71+W71+D71+d3a+u3a+P3a+w71+C71+T3a+b71+f6T+F71+f6T);conf[x3a]=container;conf[Q3a]=z3T;if(conf[j71]){var k71=G5T;k71+=f5x.S21;var X71=G5T;X71+=f5x.S21;var R71=q0Q;R71+=O7T;var U71=z4T;U71+=D5a;U71+=I3a;U71+=Y0Q;var a71=f5x.J21;a71+=G5T;a71+=Q21;a71+=f5x.S21;container[a71](U71)[R71](X71,Editor[s6T](conf[k71]));}if(conf[d71]){var P71=q0Q;P71+=O7T;var u71=G5T;u71+=t3a;u71+=F9T;u71+=K3a;container[i5B](u71)[P71](conf[X8X]);}_buttonText(conf);if(window[r3a]&&conf[T71]!==y3T){var O11=b5T;O11+=g1T;O11+=l6X;var B71=b5T;B71+=Q21;var t71=B3a;t71+=g1T;var I71=n3a;I71+=s9T;var Q71=U9X;Q71+=q3a;Q71+=E3a;Q71+=c6B;container[i5B](Q71)[a8X](conf[Y3a]||c3a);var dragDrop=container[i5B](I71);dragDrop[T6T](t71,function(e){var O4a="originalEvent";var i4a='over';var V3a="Transfer";if(conf[Q3a]){var r71=f5x.J21;r71+=G5T;r71+=w7T;r71+=v5T;var K71=f5x.S21;K71+=E2X;K71+=V3a;Editor[c9B](editor,conf,e[O4a][K71][r71],_buttonText,dropCallback);dragDrop[k9X](i4a);}return y3T;})[B71](e4a,function(e){var v4a="_enable";var E71=f5x.L21;E71+=f5x.l21;var n71=v4a;n71+=f5x.S21;if(conf[n71]){var q71=b5T;q71+=E6T;q71+=d5T;dragDrop[k9X](q71);}f5x[E71]();return y3T;})[T6T](m4a,function(e){var Y71=i7B;Y71+=Q21;Y71+=f5x.f21;Y71+=I6T;if(conf[Y71]){var V71=b5T;V71+=m2X;V71+=O7T;var c71=Q4B;c71+=g6X;dragDrop[c71](V71);}return y3T;});editor[T6T](O11,function(){var i11=b5T;i11+=Q21;f5x[f5x.z21]();$(J8T)[i11](A4a,function(e){return y3T;});})[T6T](o7X,function(){var e11=b5T;e11+=f5x.J21;e11+=f5x.J21;f5x[O3T]();$(J8T)[e11](A4a);});}else{var g11=f5x.S21;g11+=x6X;g11+=h4a;var h11=F9T;h11+=Q21;h11+=f5x.S21;var A11=f5x.f21;A11+=m1X;A11+=f5x.x21;A11+=i5T;var m11=g4a;m11+=g1T;var v11=Q4B;v11+=g6X;container[v11](m11);container[A11](container[h11](g11));}container[i5B](H4a)[H11](c6T,function(e){var L4a="uploa";e[a2B]();f5x[f5x.z21]();if(conf[Q3a]){var L11=L4a;L11+=f5x.S21;Editor[t4T][L11][G5X][m8T](editor,conf,K0T);}});container[i5B](l11)[T6T](N11,function(){Editor[c9B](editor,conf,this[L3T],_buttonText,function(ids){var l4a='input[type=file]';var M11=E6T;M11+=f5x.f21;M11+=w7T;dropCallback[m8T](editor,ids);f5x[f5x.z21]();container[i5B](l4a)[M11](K0T);});});return container;}function _triggerChange(input){setTimeout(function(){var N4a="trigg";var s11=N6X;s11+=a5a;var Z11=N4a;Z11+=f5x.x21;Z11+=O7T;input[Z11](s11,{editor:z3T,editorSet:z3T});f5x[O3T]();;},J81);}var baseFieldType=$[x11](z3T,{},Editor[o11][f11],{get:function(conf){return conf[x3a][S2T]();},set:function(conf,val){var J11=E9B;J11+=w7T;var S11=T7T;S11+=z4T;S11+=g1T;S11+=V8B;var p11=f5x.L21;p11+=f5x.l21;f5x[p11]();conf[S11][J11](val);_triggerChange(conf[x3a]);},enable:function(conf){var z11=k9T;z11+=Q9T;z11+=V9T;z11+=M4a;var y11=c7T;y11+=g1T;var G11=f5x.L21;G11+=f5x.l21;f5x[G11]();conf[x3a][y11](z11,y3T);},disable:function(conf){var D11=k9T;D11+=u21;D11+=f5x.f21;D11+=I6T;var W11=T7T;W11+=G5T;W11+=j2Q;W11+=V8B;f5x[O3T]();conf[W11][Z4a](D11,z3T);},canReturnSubmit:function(conf,node){f5x[O3T]();return z3T;}});fieldTypes[s4a]={create:function(conf){var C11=E9B;C11+=X3T;var w11=x4a;w11+=w7T;conf[w11]=conf[C11];return j6T;},get:function(conf){var b11=T7T;b11+=E6T;b11+=p2T;f5x[O3T]();return conf[b11];},set:function(conf,val){var F11=T7T;F11+=E6T;F11+=f5x.f21;F11+=w7T;conf[F11]=val;}};fieldTypes[j11]=$[a11](z3T,{},baseFieldType,{create:function(conf){var p4a="<input";var o4a="reado";var f4a="afeId";var T11=o4a;T11+=Q21;T11+=N7T;var P11=T21;P11+=f5x.x21;P11+=P21;P11+=T21;var u11=G5T;u11+=f5x.S21;var d11=u21;d11+=f4a;var k11=f5x.f21;k11+=v3Q;var X11=p4a;X11+=r3T;X11+=i4T;var R11=k7X;R11+=D5a;var U11=f5x.L21;U11+=f5x.l21;f5x[U11]();conf[R11]=$(X11)[k11]($[n4T]({id:Editor[d11](conf[u11]),type:P11,readonly:T11},conf[X8X]||{}));return conf[x3a][J81];}});fieldTypes[a8X]=$[n4T](z3T,{},baseFieldType,{create:function(conf){var S4a='<input/>';var r11=T7T;r11+=W2Q;r11+=V8B;var K11=f5x.f21;K11+=T21;K11+=T21;K11+=O7T;var t11=T21;t11+=I3T;t11+=T21;var I11=E5T;I11+=i5T;var Q11=q21;Q11+=j2Q;Q11+=V8B;conf[Q11]=$(S4a)[X8X]($[I11]({id:Editor[s6T](conf[q4T]),type:t11},conf[K11]||{}));return conf[r11][J81];}});fieldTypes[B11]=$[n4T](z3T,{},baseFieldType,{create:function(conf){var y4a="t/>";var J4a="assword";var Y11=q0Q;Y11+=O7T;var E11=g1T;E11+=J4a;var q11=u21;q11+=f5x.f21;q11+=G4a;var n11=M4T;n11+=W2Q;n11+=V5T;n11+=y4a;conf[x3a]=$(n11)[X8X]($[n4T]({id:Editor[q11](conf[q4T]),type:E11},conf[Y11]||{}));f5x[f5x.z21]();return conf[x3a][J81];}});fieldTypes[c11]=$[V11](z3T,{},baseFieldType,{create:function(conf){var z4a="safeI";var W4a="xten";var D4a='<textarea/>';var e91=z4a;e91+=f5x.S21;var i91=f5x.x21;i91+=W4a;i91+=f5x.S21;var O91=g9T;O91+=I8B;conf[x3a]=$(D4a)[O91]($[i91]({id:Editor[e91](conf[q4T])},conf[X8X]||{}));return conf[x3a][J81];},canReturnSubmit:function(conf,node){f5x[f5x.z21]();return y3T;}});fieldTypes[v91]=$[n4T](z3T,{},baseFieldType,{_addOptions:function(conf,opts,append){var U4a="placeho";var X4a="eholderValue";var a4a="laceholderDisabled";var C4a="hid";var F4a="holderD";var b4a="place";var R4a="lde";var P4a="optionsPair";var j4a="sabled";var k4a="placeholderValue";var u4a="ir";var A91=z0a;A91+=s0B;A91+=Q21;A91+=u21;var m91=f5x.L21;m91+=f5x.l21;f5x[m91]();var elOpts=conf[x3a][J81][A91];var countOffset=J81;if(!append){elOpts[G3T]=J81;if(conf[w4a]!==undefined){var N91=X2X;N91+=w7T;N91+=f5x.x21;N91+=f5x.S21;var l91=C4a;l91+=f5x.S21;l91+=l6X;var L91=b4a;L91+=F4a;L91+=G5T;L91+=j4a;var H91=g1T;H91+=a4a;var g91=U4a;g91+=R4a;g91+=O7T;var h91=Z7Q;h91+=X4a;var placeholderValue=conf[h91]!==undefined?conf[k4a]:K0T;countOffset+=G81;elOpts[J81]=new Option(conf[g91],placeholderValue);var disabled=conf[H91]!==undefined?conf[L91]:z3T;elOpts[J81][l91]=disabled;elOpts[J81][N91]=disabled;elOpts[J81][d4a]=placeholderValue;}}else{var M91=w7T;M91+=f5x.x21;M91+=o8T;countOffset=elOpts[M91];}if(opts){var Z91=g1T;Z91+=f5x.f21;Z91+=u4a;Z91+=u21;Editor[Z91](opts,conf[P4a],function(val,label,i,attr){var T4a="_ed";var s91=T4a;s91+=m1T;s91+=Q4a;var option=new Option(label,val);option[s91]=val;if(attr){var x91=g9T;x91+=T21;x91+=O7T;$(option)[x91](attr);}f5x[O3T]();elOpts[i+countOffset]=option;});}},create:function(conf){var I4a="ipO";var t4a="addO";var r4a="dt";var B4a="tiple";var n4a='<select/>';var K4a="hange.";var Y4a="select";var y91=I4a;y91+=g1T;y91+=h8T;var G91=T7T;G91+=t4a;G91+=F5X;G91+=h7B;var p91=Q5T;p91+=K4a;p91+=r4a;p91+=f5x.x21;var f91=f5x.p21;f91+=V5T;f91+=w7T;f91+=B4a;var o91=q21;o91+=j2Q;o91+=V8B;conf[o91]=$(n4a)[X8X]($[n4T]({id:Editor[s6T](conf[q4T]),multiple:conf[f91]===z3T},conf[X8X]||{}))[T6T](p91,function(e,d){var q4a="elec";if(!d||!d[X21]){var J91=p0T;J91+=T21;var S91=u21;S91+=q4a;S91+=T21;conf[E4a]=fieldTypes[S91][J91](conf);}});fieldTypes[Y4a][G91](conf,conf[A5Q]||conf[y91]);return conf[x3a][J81];},update:function(conf,options,append){var c4a="stSe";var O6a="dOpt";var V4a="_ad";var F91=T7T;F91+=z4T;F91+=V0B;F91+=T21;var w91=O0B;w91+=f5x.f21;w91+=c4a;w91+=T21;var D91=B9T;D91+=f5x.l21;var W91=V4a;W91+=O6a;W91+=h7B;var z91=O4Q;z91+=T21;fieldTypes[z91][W91](conf,options,append);f5x[D91]();var lastSet=conf[w91];if(lastSet!==undefined){var b91=u21;b91+=f5x.x21;b91+=T21;var C91=h5a;C91+=f5x.x21;C91+=Q5T;C91+=T21;fieldTypes[C91][b91](conf,lastSet,z3T);}_triggerChange(conf[F91]);},get:function(conf){var e6a='option:selected';var i6a="oArr";var d91=j9T;d91+=B8X;d91+=p3T;var R91=o5T;R91+=p5X;R91+=f5x.x21;var U91=T21;U91+=i6a;U91+=O1B;var a91=f5x.p21;a91+=f5x.f21;a91+=g1T;var j91=k7X;j91+=D5a;var val=conf[j91][i5B](e6a)[a91](function(){return this[d4a];})[U91]();if(conf[R91]){var k91=f5x.s21;k91+=b5T;k91+=G5T;k91+=Q21;var X91=l9T;X91+=U2B;X91+=O7T;X91+=a3B;return conf[X91]?val[k91](conf[v6a]):val;}return val[d91]?val[J81]:j6T;},set:function(conf,val,localUpdate){var h6a="multiple";var A6a="separato";var g6a='option';var I91=m6a;I91+=T6T;var Q91=o2T;Q91+=s5Q;Q91+=e7T;var T91=v0T;T91+=s2X;T91+=R2T;var u91=A6a;u91+=O7T;if(!localUpdate){conf[E4a]=val;}if(conf[h6a]&&conf[u91]&&!$[h5X](val)){var P91=l9T;P91+=r0a;P91+=a3B;val=typeof val===E2T?val[o6B](conf[P91]):[];}else if(!$[T91](val)){val=[val];}var i,len=val[Q91],found,allFound=y3T;var options=conf[x3a][i5B](g6a);conf[x3a][i5B](I91)[X2T](function(){var H6a="cted";var K91=A2Q;K91+=H6a;var t91=B9T;t91+=f5x.l21;f5x[t91]();found=y3T;for(i=J81;i<len;i++){if(this[d4a]==val[i]){found=z3T;allFound=z3T;break;}}this[K91]=found;});if(conf[w4a]&&!allFound&&!conf[h6a]&&options[G3T]){var r91=A2Q;r91+=f5x.o21;r91+=f5x.x21;r91+=f5x.S21;options[J81][r91]=z3T;}if(!localUpdate){_triggerChange(conf[x3a]);}return allFound;},destroy:function(conf){var L6a=".dte";var n91=N6X;n91+=c6B;n91+=p0T;n91+=L6a;var B91=l6a;B91+=V5T;B91+=T21;f5x[O3T]();conf[B91][N3X](n91);}});fieldTypes[q91]=$[n4T](z3T,{},baseFieldType,{_addOptions:function(conf,opts,append){var Z6a="irs";var M6a="onsPair";var Y91=B9T;Y91+=f5x.l21;var E91=q21;E91+=N6a;E91+=T21;var val,label;var jqInput=conf[E91];var offset=J81;f5x[Y91]();if(!append){var c91=f5x.x21;c91+=f5x.p21;c91+=F5X;c91+=o7T;jqInput[c91]();}else{var V91=w7T;V91+=g5X;offset=$(t8T,jqInput)[V91];}if(opts){var i01=z0a;i01+=G5T;i01+=M6a;var O01=g1T;O01+=f5x.f21;O01+=Z6a;Editor[O01](opts,conf[i01],function(val,label,i,attr){var o6a="\"checkbox\" />";var x6a="\" type=";var J6a='<label for="';var f6a="nput id=\"";var g01=f5x.L21;g01+=f5x.l21;var h01=f5x.f21;h01+=E3B;h01+=O7T;var A01=u21;A01+=H8B;A01+=s6a;var m01=x6a;m01+=o6a;var v01=M4T;v01+=G5T;v01+=f6a;var e01=S1X;e01+=Q21;e01+=f5x.S21;jqInput[e01](p6a+v01+Editor[s6T](conf[q4T])+S6a+(i+offset)+m01+J6a+Editor[A01](conf[q4T])+S6a+(i+offset)+x6T+label+p6T+f6T);$(G6a,jqInput)[h01](B9B,val)[J81][d4a]=val;f5x[g01]();if(attr){var H01=q0Q;H01+=O7T;$(G6a,jqInput)[H01](attr);}});}},create:function(conf){var y6a='<div />';var D6a="ipOpts";var L01=k7X;L01+=V0B;L01+=T21;conf[L01]=$(y6a);fieldTypes[z6a][W6a](conf,conf[A5Q]||conf[D6a]);return conf[x3a][J81];},get:function(conf){var F6a="rator";var a6a="input:ch";var j6a="unselect";var w6a="oin";var C6a="parator";var R6a="lectedValue";var b6a="epa";var S01=f5x.s21;S01+=w6a;var p01=l9T;p01+=C6a;var f01=u21;f01+=b6a;f01+=F6a;var x01=j6a;x01+=u9T;x01+=G2T;var M01=w7T;M01+=f5x.x21;M01+=Q21;M01+=f2T;var N01=a6a;N01+=U6a;N01+=u9T;var l01=q21;l01+=Q21;l01+=g1T;l01+=V8B;var out=[];var selected=conf[l01][i5B](N01);if(selected[M01]){var Z01=f5x.x21;Z01+=g3T;Z01+=e7T;selected[Z01](function(){var s01=g1T;s01+=V5T;s01+=u21;s01+=e7T;out[s01](this[d4a]);});}else if(conf[x01]!==undefined){var o01=M7T;o01+=l9T;o01+=R6a;out[f3T](conf[o01]);}return conf[f01]===undefined||conf[p01]===j6T?out:out[S01](conf[v6a]);},set:function(conf,val){var k6a='|';var X6a="epara";var G01=W0B;G01+=p3T;var jqInputs=conf[x3a][i5B](t8T);if(!$[h5X](val)&&typeof val===E2T){var J01=u21;J01+=X6a;J01+=P1T;val=val[o6B](conf[J01]||k6a);}else if(!$[h5X](val)){val=[val];}var i,len=val[G01],found;jqInputs[X2T](function(){found=y3T;for(i=J81;i<len;i++){if(this[d4a]==val[i]){found=z3T;break;}}this[d6a]=found;});_triggerChange(jqInputs);},enable:function(conf){var u6a="disabl";var w01=u6a;w01+=u9T;var D01=g1T;D01+=O7T;D01+=b5T;D01+=g1T;var W01=G5T;W01+=j2Q;W01+=V5T;W01+=T21;var z01=f5x.J21;z01+=o9X;var y01=k7X;y01+=D5a;conf[y01][z01](W01)[D01](w01,y3T);},disable:function(conf){var F01=n7T;F01+=b5T;F01+=g1T;var b01=S5a;b01+=T21;var C01=l6a;C01+=V5T;C01+=T21;f5x[O3T]();conf[C01][i5B](b01)[F01](P6a,z3T);},update:function(conf,options,append){var a01=u21;a01+=f5x.x21;a01+=T21;var j01=f5x.L21;j01+=f5x.l21;var checkbox=fieldTypes[z6a];f5x[j01]();var currVal=checkbox[J5X](conf);checkbox[W6a](conf,options,append);checkbox[a01](conf,currVal);}});fieldTypes[T6a]=$[U01](z3T,{},baseFieldType,{_addOptions:function(conf,opts,append){var Q6a="sPair";var val,label;f5x[f5x.z21]();var jqInput=conf[x3a];var offset=J81;if(!append){jqInput[j8Q]();}else{offset=$(t8T,jqInput)[G3T];}if(opts){var R01=m6a;R01+=T6T;R01+=Q6a;Editor[I9B](opts,conf[R01],function(val,label,i,attr){var t6a=" for=\"";var n6a="nput:l";var r6a="ut ";var I6a="<lab";var K6a="<inp";var B6a='" type="radio" name="';var Q01=c4X;Q01+=Q4a;var T01=m3T;T01+=i4T;var P01=I6a;P01+=f5x.x21;P01+=w7T;P01+=t6a;var u01=G5T;u01+=f5x.S21;var d01=u21;d01+=f5x.f21;d01+=G4a;var k01=K6a;k01+=r6a;k01+=q4T;k01+=H4T;var X01=O8T;X01+=l6X;X01+=f5x.S21;jqInput[X01](p6a+k01+Editor[d01](conf[u01])+S6a+(i+offset)+B6a+conf[c4T]+k6X+P01+Editor[s6T](conf[q4T])+S6a+(i+offset)+T01+label+p6T+f6T);f5x[O3T]();$(G6a,jqInput)[X8X](B9B,val)[J81][Q01]=val;if(attr){var I01=G5T;I01+=n6a;I01+=Q3B;I01+=T21;$(I01,jqInput)[X8X](attr);}});}},create:function(conf){var q6a="v /";var E01=f5x.L21;E01+=f5x.l21;var B01=b5T;B01+=R1T;B01+=Q21;var r01=b5T;r01+=Q21;var K01=S7T;K01+=Q4X;K01+=h8T;var t01=e4T;t01+=q6a;t01+=i4T;conf[x3a]=$(t01);fieldTypes[T6a][W6a](conf,conf[A5Q]||conf[K01]);this[r01](B01,function(){var n01=L8B;n01+=f5x.S21;f5x[O3T]();conf[x3a][n01](t8T)[X2T](function(){f5x[O3T]();if(this[E6a]){var q01=i3a;q01+=D3T;q01+=f5x.x21;q01+=f5x.S21;this[q01]=z3T;}});});f5x[E01]();return conf[x3a][J81];},get:function(conf){var Y6a="ut:check";var c01=f5x.L21;c01+=f5x.l21;var Y01=W2Q;Y01+=Y6a;Y01+=u9T;var el=conf[x3a][i5B](Y01);f5x[c01]();return el[G3T]?el[J81][d4a]:undefined;},set:function(conf,val){var O8a="ked";var c6a="ut:c";var V6a="hec";var h31=W2Q;h31+=c6a;h31+=V6a;h31+=O8a;var A31=f5x.J21;A31+=G5T;A31+=i5T;var i31=f5x.x21;i31+=f5x.f21;i31+=N6X;var O31=S5a;O31+=T21;var V01=T7T;V01+=G5T;V01+=Q21;V01+=D5a;var that=this;conf[V01][i5B](O31)[i31](function(){var v8a="_preCh";var e8a="chec";var i8a="ditor_val";var e31=i7B;e31+=i8a;this[E6a]=y3T;f5x[f5x.z21]();if(this[e31]==val){var v31=e8a;v31+=O8a;this[v31]=z3T;this[E6a]=z3T;}else{var m31=v8a;m31+=U6a;m31+=f5x.x21;m31+=f5x.S21;this[d6a]=y3T;this[m31]=y3T;}});_triggerChange(conf[x3a][A31](h31));},enable:function(conf){var N31=X2X;N31+=w7T;N31+=f5x.x21;N31+=f5x.S21;var l31=g1T;l31+=O7T;l31+=b5T;l31+=g1T;var L31=L8B;L31+=f5x.S21;var H31=T7T;H31+=W2Q;H31+=V5T;H31+=T21;var g31=f5x.L21;g31+=f5x.l21;f5x[g31]();conf[H31][L31](t8T)[l31](N31,y3T);},disable:function(conf){var s31=X2X;s31+=w7T;s31+=f5x.x21;s31+=f5x.S21;var Z31=g1T;Z31+=O7T;Z31+=b5T;Z31+=g1T;var M31=f5x.J21;M31+=G5T;M31+=Q21;M31+=f5x.S21;conf[x3a][M31](t8T)[Z31](s31,z3T);},update:function(conf,options,append){var A8a='[value="';var m8a="addOptions";var G31=O3Q;G31+=f5x.x21;var J31=g9T;J31+=I8B;var S31=f5x.x21;S31+=u3B;var p31=u21;p31+=f5x.x21;p31+=T21;var f31=T7T;f31+=S5a;f31+=T21;var o31=T7T;o31+=m8a;var x31=I0T;x31+=f5x.x21;x31+=T21;var radio=fieldTypes[T6a];var currVal=radio[x31](conf);radio[o31](conf,options,append);var inputs=conf[f31][i5B](t8T);radio[p31](conf,inputs[P8Q](A8a+currVal+N8B)[G3T]?currVal:inputs[S31](J81)[J31](G31));}});fieldTypes[y31]=$[z31](z3T,{},baseFieldType,{create:function(conf){var M8a="C_2";var s8a="datep";var l8a="dateFormat";var Z8a="822";var f8a="rma";var L8a='jqueryui';var N8a="RF";var g8a="put />";var o8a="dateFo";var h8a="<in";var F31=m3a;F31+=T21;var b31=G5T;b31+=f5x.S21;var C31=u21;C31+=f5x.f21;C31+=f5x.J21;C31+=s6a;var w31=I3T;w31+=T21;w31+=l6X;w31+=f5x.S21;var D31=h8a;D31+=g8a;var W31=l6a;W31+=V5T;W31+=T21;conf[W31]=$(D31)[X8X]($[w31]({id:Editor[C31](conf[b31]),type:F31},conf[X8X]));if($[H8a]){var a31=a8T;a31+=U8T;var j31=T7T;j31+=W2Q;j31+=V5T;j31+=T21;conf[j31][a31](L8a);if(!conf[l8a]){var X31=N8a;X31+=M8a;X31+=Z8a;var R31=s8a;R31+=G5T;R31+=x8a;var U31=o8a;U31+=f8a;U31+=T21;conf[U31]=$[R31][X31];}setTimeout(function(){var J8a="picker";var p8a="#ui-dat";var S8a="epicker-div";var G8a="dateImage";var u31=p8a;u31+=S8a;var k31=f5x.S21;k31+=g9T;k31+=f5x.x21;k31+=J8a;$(conf[x3a])[k31]($[n4T]({dateFormat:conf[l8a],buttonImage:conf[G8a],buttonImageOnly:z3T,onSelect:function(){var d31=Q5T;d31+=W3T;d31+=D3T;conf[x3a][r8T]()[d31]();}},conf[B6T]));$(u31)[R6T](X6T,T2T);},b81);}else{var Q31=f5x.S21;Q31+=f5x.f21;Q31+=V21;var T31=a4T;T31+=R1T;var P31=k7X;P31+=D5a;conf[P31][X8X](T31,Q31);}return conf[x3a][J81];},set:function(conf,val){var W8a="pic";var y8a="hasDatep";var C8a="change";var w8a="_inpu";var t31=y8a;t31+=z8a;var I31=f5x.L21;I31+=f5x.l21;f5x[I31]();if($[H8a]&&conf[x3a][T8T](t31)){var B31=l9T;B31+=E1a;B31+=M5T;var r31=A5B;r31+=f5x.x21;r31+=W8a;r31+=D8a;var K31=w8a;K31+=T21;conf[K31][r31](B31,val)[C8a]();}else{var q31=E9B;q31+=w7T;var n31=k7X;n31+=D5a;$(conf[n31])[q31](val);}},enable:function(conf){f5x[f5x.z21]();if($[H8a]){var E31=b8a;E31+=j9T;conf[x3a][H8a](E31);}else{var c31=g1T;c31+=O7T;c31+=b5T;c31+=g1T;var Y31=q21;Y31+=Q21;Y31+=V0B;Y31+=T21;$(conf[Y31])[c31](P6a,y3T);}},disable:function(conf){var F8a="tep";if($[H8a]){var O41=P9T;O41+=f5x.f21;O41+=V9T;O41+=j9T;var V31=R4T;V31+=F8a;V31+=z8a;conf[x3a][V31](O41);}else{var i41=Q6T;i41+=I6T;$(conf[x3a])[Z4a](i41,z3T);}},owns:function(conf,node){var a8a="epi";var U8a="rents";var j8a="iv.ui-dat";var R8a='div.ui-datepicker-header';var A41=F5Q;A41+=h8T;var m41=o2T;m41+=f2T;var v41=f5x.S21;v41+=j8a;v41+=a8a;v41+=x8a;var e41=U2B;e41+=U8a;f5x[f5x.z21]();return $(node)[e41](v41)[m41]||$(node)[A41](R8a)[G3T]?z3T:y3T;}});fieldTypes[r21]=$[n4T](z3T,{},baseFieldType,{create:function(conf){var X8a="DateT";var k8a='<input />';var I8a="keyInput";var u8a="displayFormat";var W41=T7T;W41+=W2Q;W41+=V5T;W41+=T21;var z41=f5x.L21;z41+=f5x.l21;var y41=T7T;y41+=b1T;y41+=X4X;y41+=m6T;var G41=b5T;G41+=Q21;var o41=z0a;o41+=u21;var Z41=G5T;Z41+=G0T;Z41+=T4Q;Z41+=Q21;var M41=t5T;M41+=g9T;var N41=k7X;N41+=V0B;N41+=T21;var l41=X8a;l41+=G5T;l41+=n21;var L41=V21;L41+=P21;L41+=T21;var H41=G5T;H41+=f5x.S21;var g41=f5x.f21;g41+=T21;g41+=I8B;var h41=k7X;h41+=g1T;h41+=V5T;h41+=T21;conf[h41]=$(k8a)[g41]($[n4T](z3T,{id:Editor[s6T](conf[H41]),type:L41},conf[X8X]));conf[d8a]=new Editor[l41](conf[N41],$[n4T]({format:conf[u8a]||conf[M41],i18n:this[Z41][r21],onChange:function(){setTimeout(function(){var P8a="hang";var x41=Q5T;x41+=P8a;x41+=f5x.x21;var s41=q21;s41+=T8a;conf[s41][d4B](x41);},J81);}},conf[o41]));conf[Q8a]=function(){var f41=y4X;f41+=f5x.S21;f41+=f5x.x21;f5x[O3T]();conf[d8a][f41]();};if(conf[I8a]===y3T){var S41=b5T;S41+=Q21;var p41=q21;p41+=Q21;p41+=D5a;conf[p41][S41](t8a,function(e){var K8a="entDefault";var J41=g1T;J41+=m4X;J41+=K8a;e[J41]();});}this[G41](o7X,conf[y41]);f5x[z41]();return conf[W41][J81];},get:function(conf){var V8a="icke";var Y8a="wireFor";var E8a="Local";var r8a="ire";var B8a="Form";var n8a="entStr";var q8a="ict";var a41=P7T;a41+=r8a;a41+=B8a;a41+=g9T;var j41=T4X;j41+=v6X;j41+=T21;var F41=h0T;F41+=f5x.p21;F41+=n8a;F41+=q8a;var b41=q8Q;b41+=U5T;b41+=E8a;b41+=f5x.x21;var C41=Y8a;C41+=y6Q;var w41=B9T;w41+=f5x.l21;var D41=c8a;D41+=V8a;D41+=O7T;let val=conf[x3a][S2T]();let inst=conf[D41][Q5T];f5x[w41]();return conf[C41]&&moment?moment(val,inst[L8Q],inst[b41],inst[F41])[j41](conf[a41]):val;},set:function(conf,val){var O2a="omentLocale";var i2a="_pic";var e2a="wireFormat";var X41=f5x.p21;X41+=O2a;var R41=E6T;R41+=f5x.f21;R41+=w7T;var U41=i2a;U41+=E5X;U41+=d5T;f5x[f5x.z21]();let inst=conf[U41][Q5T];conf[d8a][R41](conf[e2a]&&moment?moment(val,conf[e2a],inst[X41],inst[V0a])[L8Q](inst[L8Q]):val);_triggerChange(conf[x3a]);},owns:function(conf,node){var v2a="wns";var k41=b5T;k41+=v2a;return conf[d8a][k41](node);},errorMessage:function(conf,msg){var m2a="errorMsg";f5x[f5x.z21]();conf[d8a][m2a](msg);},destroy:function(conf){var P41=i0X;P41+=L7X;P41+=n1T;P41+=o7T;var u41=T7T;u41+=g1T;u41+=G5T;u41+=x8a;var d41=b5T;d41+=E7B;f5x[f5x.z21]();this[d41](o7X,conf[Q8a]);conf[x3a][N3X](t8a);conf[u41][P41]();},minDate:function(conf,min){var A2a="min";var T41=c8a;T41+=G5T;T41+=D3T;T41+=d5T;conf[T41][A2a](min);},maxDate:function(conf,max){var h2a="max";var Q41=c8a;Q41+=G5T;Q41+=Q5T;Q41+=D8a;conf[Q41][h2a](max);}});fieldTypes[c9B]=$[n4T](z3T,{},baseFieldType,{create:function(conf){var editor=this;var container=_commonUpload(editor,conf,function(val){var g2a="postUp";var H2a="cal";var K41=g2a;K41+=w7T;K41+=G0B;var t41=H2a;t41+=w7T;var I41=u21;I41+=f5x.x21;I41+=T21;Editor[t4T][c9B][I41][t41](editor,conf,val[J81]);editor[Y6X](K41,[conf[c4T],val[J81]]);});return container;},get:function(conf){f5x[O3T]();return conf[L2a];},set:function(conf,val){var p2a="clearText";var o2a="eTe";var M2a="e button";var s2a="spa";var f2a='No file';var Z2a='div.rendered';var l2a="clea";var N2a="div.clearValu";var S2a="noCl";var x2a="noF";var L61=T7T;L61+=E6T;L61+=f5x.f21;L61+=w7T;var H61=F9T;H61+=i5T;var g61=q21;g61+=Q21;g61+=D5a;var e61=l2a;e61+=O7T;e61+=K0B;var i61=N2a;i61+=M2a;var O61=F9T;O61+=i5T;var B41=q21;B41+=N6a;B41+=T21;var r41=T7T;r41+=E6T;r41+=f5x.f21;r41+=w7T;f5x[O3T]();conf[r41]=val;var container=conf[B41];if(conf[e2T]){var n41=T7T;n41+=S2T;var rendered=container[i5B](Z2a);if(conf[n41]){var E41=k9T;E41+=u21;E41+=T9T;E41+=o7T;var q41=e7T;q41+=T21;q41+=f5x.p21;q41+=w7T;rendered[q41](conf[E41](conf[L2a]));}else{var V41=J7B;V41+=s2a;V41+=x8Q;var c41=x2a;c41+=s0X;c41+=o2a;c41+=Q4T;var Y41=M4T;Y41+=u21;Y41+=Z4T;rendered[j8Q]()[g2T](Y41+(conf[c41]||f2a)+V41);}}var button=container[O61](i61);if(val&&conf[e61]){var m61=K5X;m61+=X7T;m61+=j9T;m61+=M5B;var v61=e7T;v61+=T21;v61+=f5x.p21;v61+=w7T;button[v61](conf[p2a]);container[k9X](m61);}else{var h61=S2a;h61+=f5x.x21;h61+=M5B;var A61=f5x.f21;A61+=c9a;container[A61](h61);}conf[g61][H61](t8T)[a8B](J2a,[conf[L61]]);},enable:function(conf){var N61=f5x.S21;N61+=z2Q;var l61=G5T;l61+=Q21;l61+=V0B;l61+=T21;conf[x3a][i5B](l61)[Z4a](N61,y3T);conf[Q3a]=z3T;},disable:function(conf){var Z61=z4T;Z61+=V0B;Z61+=T21;var M61=l6a;M61+=V8B;f5x[O3T]();conf[M61][i5B](Z61)[Z4a](P6a,z3T);conf[Q3a]=y3T;},canReturnSubmit:function(conf,node){f5x[O3T]();return y3T;}});fieldTypes[G2a]=$[n4T](z3T,{},baseFieldType,{_showHide:function(conf){var y2a="lim";var W2a="itLeft";var z2a="_lim";var D2a="limit";var C2a='div.limitHide';var J61=w7T;J61+=g5X;var S61=y2a;S61+=m1T;var p61=z2a;p61+=W2a;var f61=Q21;f61+=b5T;f61+=Q21;f61+=f5x.x21;var o61=x4a;o61+=w7T;var x61=k9T;x61+=X0X;x61+=O1B;var s61=Q5T;s61+=u21;s61+=u21;if(!conf[D2a]){return;}conf[w2a][i5B](C2a)[s61](x61,conf[o61][G3T]>=conf[D2a]?f61:T5X);conf[p61]=conf[S61]-conf[L2a][J61];},create:function(conf){var j2a='button.remove';var F61=S5T;F61+=w7T;F61+=o4T;var b61=f5x.f21;b61+=a9Q;b61+=U9Q;var editor=this;var container=_commonUpload(editor,conf,function(val){var F2a="_v";var b2a="stUplo";var C61=d4T;C61+=f5x.p21;C61+=f5x.x21;var w61=n7Q;w61+=b2a;w61+=j0X;var D61=f5x.L21;D61+=f5x.l21;var W61=u21;W61+=f4X;var z61=M4X;z61+=i7T;z61+=d1T;z61+=u21;var y61=y8T;y61+=C0Q;y61+=f5x.f21;y61+=T21;var G61=F2a;G61+=f5x.f21;G61+=w7T;conf[L2a]=conf[G61][y61](val);Editor[z61][G2a][W61][m8T](editor,conf,conf[L2a]);f5x[D61]();editor[Y6X](w61,[conf[C61],conf[L2a]]);},z3T);container[b61](F61)[T6T](c6T,j2a,function(e){var U2a='idx';var a2a="abl";var j61=T7T;j61+=l6X;j61+=a2a;j61+=u9T;e[l5a]();if(conf[j61]){var R61=T7T;R61+=E6T;R61+=f5x.f21;R61+=w7T;var U61=Y8X;U61+=f5x.x21;var a61=T7T;a61+=E6T;a61+=f5x.f21;a61+=w7T;var idx=$(this)[i6T](U2a);conf[a61][U61](idx,G81);Editor[t4T][G2a][G5X][m8T](editor,conf,conf[R61]);}});conf[w2a]=container;return container;},get:function(conf){var X61=T7T;X61+=E6T;X61+=f5x.f21;X61+=w7T;f5x[O3T]();return conf[X61];},set:function(conf,val){var u2a="st have ";var k2a="Typ";var V2a="an>";var O5x="No fi";var i5x="oFileT";var c2a="</sp";var Q2a="rende";var K2a='<ul/>';var T2a="emp";var e5x="<spa";var R2a="riggerH";var d2a="Upload collections mu";var t2a="appendT";var X2a="andler";var I2a="red";var v5x="_showHide";var P2a="an array as a value";var A81=T7T;A81+=E6T;A81+=f5x.f21;A81+=w7T;var m81=T21;m81+=R2a;m81+=X2a;var v81=f5x.J21;v81+=o9X;var e81=B9T;e81+=f5x.l21;var i81=M4X;i81+=k2a;i81+=v5T;var u61=P9T;u61+=g1T;u61+=H2T;u61+=o7T;var d61=T7T;d61+=E6T;d61+=f5x.f21;d61+=w7T;if(!val){val=[];}if(!$[h5X](val)){var k61=d2a;k61+=u2a;k61+=P2a;throw k61;}conf[d61]=val;var that=this;var container=conf[x3a];if(conf[u61]){var Q61=w7T;Q61+=w5Q;Q61+=e7T;var T61=T2a;T61+=T21;T61+=o7T;var P61=g9X;P61+=z2X;P61+=Q2a;P61+=I2a;var rendered=container[i5B](P61)[T61]();if(val[Q61]){var t61=R7T;t61+=Q5T;t61+=e7T;var I61=t2a;I61+=b5T;var list=$(K2a)[I61](rendered);$[t61](val,function(i,file){var Y2a='</li>';var q2a='<li>';var r2a="\">&";var n2a=" remove\" data-idx";var B2a="mes;</button>";var E2a=' <button class="';var q61=r2a;q61+=o4T;q61+=B2a;var n61=n2a;n61+=H4T;var B61=F8X;B61+=I7B;var r61=f5x.J21;r61+=b5T;r61+=O7T;r61+=f5x.p21;var K61=b1T;K61+=Q3B;K61+=u21;K61+=v5T;list[g2T](q2a+conf[e2T](file,i)+E2a+that[K61][r61][B61]+n61+i+q61+Y2a);});}else{var O81=c2a;O81+=V2a;var V61=O5x;V61+=O3B;var c61=Q21;c61+=i5x;c61+=B5T;var Y61=e5x;Y61+=x8Q;var E61=f5x.f21;E61+=j9X;E61+=i5T;rendered[E61](Y61+(conf[c61]||V61)+O81);}}Editor[i81][G2a][v5x](conf);f5x[e81]();conf[x3a][v81](t8T)[m81](J2a,[conf[A81]]);},enable:function(conf){var L81=T7T;L81+=b8a;L81+=M4a;var H81=n7T;H81+=s9T;var g81=W2Q;g81+=V8B;var h81=k7X;h81+=g1T;h81+=V5T;h81+=T21;conf[h81][i5B](g81)[H81](P6a,y3T);f5x[f5x.z21]();conf[L81]=z3T;},disable:function(conf){var M81=g1T;M81+=O7T;M81+=b5T;M81+=g1T;var N81=f5x.J21;N81+=G5T;N81+=Q21;N81+=f5x.S21;var l81=q21;l81+=T8a;conf[l81][N81](t8T)[M81](P6a,z3T);f5x[O3T]();conf[Q3a]=y3T;},canReturnSubmit:function(conf,node){f5x[O3T]();return y3T;}});}());if(DataTable[Z81][m5x]){var x81=A5x;x81+=h5x;var s81=f5x.x21;s81+=L3a;s81+=Q21;s81+=f5x.S21;$[s81](Editor[t4T],DataTable[B5T][x81]);}DataTable[B5T][o81]=Editor[f81];Editor[L3T]={};Editor[g7X][p81]=g5x;Editor[S81]=H5x;return Editor;}));

/*! Responsive 2.2.3
 * 2014-2018 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Responsive
 * @description Responsive tables plug-in for DataTables
 * @version     2.2.3
 * @file        dataTables.responsive.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2014-2018 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Responsive is a plug-in for the DataTables library that makes use of
 * DataTables' ability to change the visibility of columns, changing the
 * visibility of columns so the displayed columns fit into the table container.
 * The end result is that complex tables will be dynamically adjusted to fit
 * into the viewport, be it on a desktop, tablet or mobile browser.
 *
 * Responsive for DataTables has two modes of operation, which can used
 * individually or combined:
 *
 * * Class name based control - columns assigned class names that match the
 *   breakpoint logic can be shown / hidden as required for each breakpoint.
 * * Automatic control - columns are automatically hidden when there is no
 *   room left to display them. Columns removed from the right.
 *
 * In additional to column visibility control, Responsive also has built into
 * options to use DataTables' child row display to show / hide the information
 * from the table that has been hidden. There are also two modes of operation
 * for this child row display:
 *
 * * Inline - when the control element that the user can use to show / hide
 *   child rows is displayed inside the first column of the table.
 * * Column - where a whole column is dedicated to be the show / hide control.
 *
 * Initialisation of Responsive is performed by:
 *
 * * Adding the class `responsive` or `dt-responsive` to the table. In this case
 *   Responsive will automatically be initialised with the default configuration
 *   options when the DataTable is created.
 * * Using the `responsive` option in the DataTables configuration options. This
 *   can also be used to specify the configuration options, or simply set to
 *   `true` to use the defaults.
 *
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.3+
 *
 *  @example
 *      $('#example').DataTable( {
 *        responsive: true
 *      } );
 *    } );
 */
var Responsive = function ( settings, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.10' ) ) {
		throw 'DataTables Responsive requires DataTables 1.10.10 or newer';
	}

	this.s = {
		dt: new DataTable.Api( settings ),
		columns: [],
		current: []
	};

	// Check if responsive has already been initialised on this table
	if ( this.s.dt.settings()[0].responsive ) {
		return;
	}

	// details is an object, but for simplicity the user can give it as a string
	// or a boolean
	if ( opts && typeof opts.details === 'string' ) {
		opts.details = { type: opts.details };
	}
	else if ( opts && opts.details === false ) {
		opts.details = { type: false };
	}
	else if ( opts && opts.details === true ) {
		opts.details = { type: 'inline' };
	}

	this.c = $.extend( true, {}, Responsive.defaults, DataTable.defaults.responsive, opts );
	settings.responsive = this;
	this._constructor();
};

$.extend( Responsive.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the Responsive instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtPrivateSettings = dt.settings()[0];
		var oldWindowWidth = $(window).width();

		dt.settings()[0]._responsive = this;

		// Use DataTables' throttle function to avoid processor thrashing on
		// resize
		$(window).on( 'resize.dtr orientationchange.dtr', DataTable.util.throttle( function () {
			// iOS has a bug whereby resize can fire when only scrolling
			// See: http://stackoverflow.com/questions/8898412
			var width = $(window).width();

			if ( width !== oldWindowWidth ) {
				that._resize();
				oldWindowWidth = width;
			}
		} ) );

		// DataTables doesn't currently trigger an event when a row is added, so
		// we need to hook into its private API to enforce the hidden rows when
		// new data is added
		dtPrivateSettings.oApi._fnCallbackReg( dtPrivateSettings, 'aoRowCreatedCallback', function (tr, data, idx) {
			if ( $.inArray( false, that.s.current ) !== -1 ) {
				$('>td, >th', tr).each( function ( i ) {
					var idx = dt.column.index( 'toData', i );

					if ( that.s.current[idx] === false ) {
						$(this).css('display', 'none');
					}
				} );
			}
		} );

		// Destroy event handler
		dt.on( 'destroy.dtr', function () {
			dt.off( '.dtr' );
			$( dt.table().body() ).off( '.dtr' );
			$(window).off( 'resize.dtr orientationchange.dtr' );

			// Restore the columns that we've hidden
			$.each( that.s.current, function ( i, val ) {
				if ( val === false ) {
					that._setColumnVis( i, true );
				}
			} );
		} );

		// Reorder the breakpoints array here in case they have been added out
		// of order
		this.c.breakpoints.sort( function (a, b) {
			return a.width < b.width ? 1 :
				a.width > b.width ? -1 : 0;
		} );

		this._classLogic();
		this._resizeAuto();

		// Details handler
		var details = this.c.details;

		if ( details.type !== false ) {
			that._detailsInit();

			// DataTables will trigger this event on every column it shows and
			// hides individually
			dt.on( 'column-visibility.dtr', function () {
				// Use a small debounce to allow multiple columns to be set together
				if ( that._timer ) {
					clearTimeout( that._timer );
				}

				that._timer = setTimeout( function () {
					that._timer = null;

					that._classLogic();
					that._resizeAuto();
					that._resize();

					that._redrawChildren();
				}, 100 );
			} );

			// Redraw the details box on each draw which will happen if the data
			// has changed. This is used until DataTables implements a native
			// `updated` event for rows
			dt.on( 'draw.dtr', function () {
				that._redrawChildren();
			} );

			$(dt.table().node()).addClass( 'dtr-'+details.type );
		}

		dt.on( 'column-reorder.dtr', function (e, settings, details) {
			that._classLogic();
			that._resizeAuto();
			that._resize();
		} );

		// Change in column sizes means we need to calc
		dt.on( 'column-sizing.dtr', function () {
			that._resizeAuto();
			that._resize();
		});

		// On Ajax reload we want to reopen any child rows which are displayed
		// by responsive
		dt.on( 'preXhr.dtr', function () {
			var rowIds = [];
			dt.rows().every( function () {
				if ( this.child.isShown() ) {
					rowIds.push( this.id(true) );
				}
			} );

			dt.one( 'draw.dtr', function () {
				that._resizeAuto();
				that._resize();

				dt.rows( rowIds ).every( function () {
					that._detailsDisplay( this, false );
				} );
			} );
		});

		dt.on( 'init.dtr', function (e, settings, details) {
			that._resizeAuto();
			that._resize();

			// If columns were hidden, then DataTables needs to adjust the
			// column sizing
			if ( $.inArray( false, that.s.current ) ) {
				dt.columns.adjust();
			}
		} );

		// First pass - draw the table for the current viewport size
		this._resize();
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Calculate the visibility for the columns in a table for a given
	 * breakpoint. The result is pre-determined based on the class logic if
	 * class names are used to control all columns, but the width of the table
	 * is also used if there are columns which are to be automatically shown
	 * and hidden.
	 *
	 * @param  {string} breakpoint Breakpoint name to use for the calculation
	 * @return {array} Array of boolean values initiating the visibility of each
	 *   column.
	 *  @private
	 */
	_columnsVisiblity: function ( breakpoint )
	{
		var dt = this.s.dt;
		var columns = this.s.columns;
		var i, ien;

		// Create an array that defines the column ordering based first on the
		// column's priority, and secondly the column index. This allows the
		// columns to be removed from the right if the priority matches
		var order = columns
			.map( function ( col, idx ) {
				return {
					columnIdx: idx,
					priority: col.priority
				};
			} )
			.sort( function ( a, b ) {
				if ( a.priority !== b.priority ) {
					return a.priority - b.priority;
				}
				return a.columnIdx - b.columnIdx;
			} );

		// Class logic - determine which columns are in this breakpoint based
		// on the classes. If no class control (i.e. `auto`) then `-` is used
		// to indicate this to the rest of the function
		var display = $.map( columns, function ( col, i ) {
			if ( dt.column(i).visible() === false ) {
				return 'not-visible';
			}
			return col.auto && col.minWidth === null ?
				false :
				col.auto === true ?
					'-' :
					$.inArray( breakpoint, col.includeIn ) !== -1;
		} );

		// Auto column control - first pass: how much width is taken by the
		// ones that must be included from the non-auto columns
		var requiredWidth = 0;
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( display[i] === true ) {
				requiredWidth += columns[i].minWidth;
			}
		}

		// Second pass, use up any remaining width for other columns. For
		// scrolling tables we need to subtract the width of the scrollbar. It
		// may not be requires which makes this sub-optimal, but it would
		// require another full redraw to make complete use of those extra few
		// pixels
		var scrolling = dt.settings()[0].oScroll;
		var bar = scrolling.sY || scrolling.sX ? scrolling.iBarWidth : 0;
		var widthAvailable = dt.table().container().offsetWidth - bar;
		var usedWidth = widthAvailable - requiredWidth;

		// Control column needs to always be included. This makes it sub-
		// optimal in terms of using the available with, but to stop layout
		// thrashing or overflow. Also we need to account for the control column
		// width first so we know how much width is available for the other
		// columns, since the control column might not be the first one shown
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				usedWidth -= columns[i].minWidth;
			}
		}

		// Allow columns to be shown (counting by priority and then right to
		// left) until we run out of room
		var empty = false;
		for ( i=0, ien=order.length ; i<ien ; i++ ) {
			var colIdx = order[i].columnIdx;

			if ( display[colIdx] === '-' && ! columns[colIdx].control && columns[colIdx].minWidth ) {
				// Once we've found a column that won't fit we don't let any
				// others display either, or columns might disappear in the
				// middle of the table
				if ( empty || usedWidth - columns[colIdx].minWidth < 0 ) {
					empty = true;
					display[colIdx] = false;
				}
				else {
					display[colIdx] = true;
				}

				usedWidth -= columns[colIdx].minWidth;
			}
		}

		// Determine if the 'control' column should be shown (if there is one).
		// This is the case when there is a hidden column (that is not the
		// control column). The two loops look inefficient here, but they are
		// trivial and will fly through. We need to know the outcome from the
		// first , before the action in the second can be taken
		var showControl = false;

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( ! columns[i].control && ! columns[i].never && display[i] === false ) {
				showControl = true;
				break;
			}
		}

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				display[i] = showControl;
			}

			// Replace not visible string with false from the control column detection above
			if ( display[i] === 'not-visible' ) {
				display[i] = false;
			}
		}

		// Finally we need to make sure that there is at least one column that
		// is visible
		if ( $.inArray( true, display ) === -1 ) {
			display[0] = true;
		}

		return display;
	},


	/**
	 * Create the internal `columns` array with information about the columns
	 * for the table. This includes determining which breakpoints the column
	 * will appear in, based upon class names in the column, which makes up the
	 * vast majority of this method.
	 *
	 * @private
	 */
	_classLogic: function ()
	{
		var that = this;
		var calc = {};
		var breakpoints = this.c.breakpoints;
		var dt = this.s.dt;
		var columns = dt.columns().eq(0).map( function (i) {
			var column = this.column(i);
			var className = column.header().className;
			var priority = dt.settings()[0].aoColumns[i].responsivePriority;

			if ( priority === undefined ) {
				var dataPriority = $(column.header()).data('priority');

				priority = dataPriority !== undefined ?
					dataPriority * 1 :
					10000;
			}

			return {
				className: className,
				includeIn: [],
				auto:      false,
				control:   false,
				never:     className.match(/\bnever\b/) ? true : false,
				priority:  priority
			};
		} );

		// Simply add a breakpoint to `includeIn` array, ensuring that there are
		// no duplicates
		var add = function ( colIdx, name ) {
			var includeIn = columns[ colIdx ].includeIn;

			if ( $.inArray( name, includeIn ) === -1 ) {
				includeIn.push( name );
			}
		};

		var column = function ( colIdx, name, operator, matched ) {
			var size, i, ien;

			if ( ! operator ) {
				columns[ colIdx ].includeIn.push( name );
			}
			else if ( operator === 'max-' ) {
				// Add this breakpoint and all smaller
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width <= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'min-' ) {
				// Add this breakpoint and all larger
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width >= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'not-' ) {
				// Add all but this breakpoint
				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].name.indexOf( matched ) === -1 ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
		};

		// Loop over each column and determine if it has a responsive control
		// class
		columns.each( function ( col, i ) {
			var classNames = col.className.split(' ');
			var hasClass = false;

			// Split the class name up so multiple rules can be applied if needed
			for ( var k=0, ken=classNames.length ; k<ken ; k++ ) {
				var className = $.trim( classNames[k] );

				if ( className === 'all' ) {
					// Include in all
					hasClass = true;
					col.includeIn = $.map( breakpoints, function (a) {
						return a.name;
					} );
					return;
				}
				else if ( className === 'none' || col.never ) {
					// Include in none (default) and no auto
					hasClass = true;
					return;
				}
				else if ( className === 'control' ) {
					// Special column that is only visible, when one of the other
					// columns is hidden. This is used for the details control
					hasClass = true;
					col.control = true;
					return;
				}

				$.each( breakpoints, function ( j, breakpoint ) {
					// Does this column have a class that matches this breakpoint?
					var brokenPoint = breakpoint.name.split('-');
					var re = new RegExp( '(min\\-|max\\-|not\\-)?('+brokenPoint[0]+')(\\-[_a-zA-Z0-9])?' );
					var match = className.match( re );

					if ( match ) {
						hasClass = true;

						if ( match[2] === brokenPoint[0] && match[3] === '-'+brokenPoint[1] ) {
							// Class name matches breakpoint name fully
							column( i, breakpoint.name, match[1], match[2]+match[3] );
						}
						else if ( match[2] === brokenPoint[0] && ! match[3] ) {
							// Class name matched primary breakpoint name with no qualifier
							column( i, breakpoint.name, match[1], match[2] );
						}
					}
				} );
			}

			// If there was no control class, then automatic sizing is used
			if ( ! hasClass ) {
				col.auto = true;
			}
		} );

		this.s.columns = columns;
	},


	/**
	 * Show the details for the child row
	 *
	 * @param  {DataTables.Api} row    API instance for the row
	 * @param  {boolean}        update Update flag
	 * @private
	 */
	_detailsDisplay: function ( row, update )
	{
		var that = this;
		var dt = this.s.dt;
		var details = this.c.details;

		if ( details && details.type !== false ) {
			var res = details.display( row, update, function () {
				return details.renderer(
					dt, row[0], that._detailsObj(row[0])
				);
			} );

			if ( res === true || res === false ) {
				$(dt.table().node()).triggerHandler( 'responsive-display.dt', [dt, row, res, update] );
			}
		}
	},


	/**
	 * Initialisation for the details handler
	 *
	 * @private
	 */
	_detailsInit: function ()
	{
		var that    = this;
		var dt      = this.s.dt;
		var details = this.c.details;

		// The inline type always uses the first child as the target
		if ( details.type === 'inline' ) {
			details.target = 'td:first-child, th:first-child';
		}

		// Keyboard accessibility
		dt.on( 'draw.dtr', function () {
			that._tabIndexes();
		} );
		that._tabIndexes(); // Initial draw has already happened

		$( dt.table().body() ).on( 'keyup.dtr', 'td, th', function (e) {
			if ( e.keyCode === 13 && $(this).data('dtr-keyboard') ) {
				$(this).click();
			}
		} );

		// type.target can be a string jQuery selector or a column index
		var target   = details.target;
		var selector = typeof target === 'string' ? target : 'td, th';

		// Click handler to show / hide the details rows when they are available
		$( dt.table().body() )
			.on( 'click.dtr mousedown.dtr mouseup.dtr', selector, function (e) {
				// If the table is not collapsed (i.e. there is no hidden columns)
				// then take no action
				if ( ! $(dt.table().node()).hasClass('collapsed' ) ) {
					return;
				}

				// Check that the row is actually a DataTable's controlled node
				if ( $.inArray( $(this).closest('tr').get(0), dt.rows().nodes().toArray() ) === -1 ) {
					return;
				}

				// For column index, we determine if we should act or not in the
				// handler - otherwise it is already okay
				if ( typeof target === 'number' ) {
					var targetIdx = target < 0 ?
						dt.columns().eq(0).length + target :
						target;

					if ( dt.cell( this ).index().column !== targetIdx ) {
						return;
					}
				}

				// $().closest() includes itself in its check
				var row = dt.row( $(this).closest('tr') );

				// Check event type to do an action
				if ( e.type === 'click' ) {
					// The renderer is given as a function so the caller can execute it
					// only when they need (i.e. if hiding there is no point is running
					// the renderer)
					that._detailsDisplay( row, false );
				}
				else if ( e.type === 'mousedown' ) {
					// For mouse users, prevent the focus ring from showing
					$(this).css('outline', 'none');
				}
				else if ( e.type === 'mouseup' ) {
					// And then re-allow at the end of the click
					$(this).blur().css('outline', '');
				}
			} );
	},


	/**
	 * Get the details to pass to a renderer for a row
	 * @param  {int} rowIdx Row index
	 * @private
	 */
	_detailsObj: function ( rowIdx )
	{
		var that = this;
		var dt = this.s.dt;

		return $.map( this.s.columns, function( col, i ) {
			// Never and control columns should not be passed to the renderer
			if ( col.never || col.control ) {
				return;
			}

			return {
				title:       dt.settings()[0].aoColumns[ i ].sTitle,
				data:        dt.cell( rowIdx, i ).render( that.c.orthogonal ),
				hidden:      dt.column( i ).visible() && !that.s.current[ i ],
				columnIndex: i,
				rowIndex:    rowIdx
			};
		} );
	},


	/**
	 * Find a breakpoint object from a name
	 *
	 * @param  {string} name Breakpoint name to find
	 * @return {object}      Breakpoint description object
	 * @private
	 */
	_find: function ( name )
	{
		var breakpoints = this.c.breakpoints;

		for ( var i=0, ien=breakpoints.length ; i<ien ; i++ ) {
			if ( breakpoints[i].name === name ) {
				return breakpoints[i];
			}
		}
	},


	/**
	 * Re-create the contents of the child rows as the display has changed in
	 * some way.
	 *
	 * @private
	 */
	_redrawChildren: function ()
	{
		var that = this;
		var dt = this.s.dt;

		dt.rows( {page: 'current'} ).iterator( 'row', function ( settings, idx ) {
			var row = dt.row( idx );

			that._detailsDisplay( dt.row( idx ), true );
		} );
	},


	/**
	 * Alter the table display for a resized viewport. This involves first
	 * determining what breakpoint the window currently is in, getting the
	 * column visibilities to apply and then setting them.
	 *
	 * @private
	 */
	_resize: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var width = $(window).width();
		var breakpoints = this.c.breakpoints;
		var breakpoint = breakpoints[0].name;
		var columns = this.s.columns;
		var i, ien;
		var oldVis = this.s.current.slice();

		// Determine what breakpoint we are currently at
		for ( i=breakpoints.length-1 ; i>=0 ; i-- ) {
			if ( width <= breakpoints[i].width ) {
				breakpoint = breakpoints[i].name;
				break;
			}
		}
		
		// Show the columns for that break point
		var columnsVis = this._columnsVisiblity( breakpoint );
		this.s.current = columnsVis;

		// Set the class before the column visibility is changed so event
		// listeners know what the state is. Need to determine if there are
		// any columns that are not visible but can be shown
		var collapsedClass = false;
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columnsVis[i] === false && ! columns[i].never && ! columns[i].control && ! dt.column(i).visible() === false ) {
				collapsedClass = true;
				break;
			}
		}

		$( dt.table().node() ).toggleClass( 'collapsed', collapsedClass );

		var changed = false;
		var visible = 0;

		dt.columns().eq(0).each( function ( colIdx, i ) {
			if ( columnsVis[i] === true ) {
				visible++;
			}

			if ( columnsVis[i] !== oldVis[i] ) {
				changed = true;
				that._setColumnVis( colIdx, columnsVis[i] );
			}
		} );

		if ( changed ) {
			this._redrawChildren();

			// Inform listeners of the change
			$(dt.table().node()).trigger( 'responsive-resize.dt', [dt, this.s.current] );

			// If no records, update the "No records" display element
			if ( dt.page.info().recordsDisplay === 0 ) {
				$('td', dt.table().body()).eq(0).attr('colspan', visible);
			}
		}
	},


	/**
	 * Determine the width of each column in the table so the auto column hiding
	 * has that information to work with. This method is never going to be 100%
	 * perfect since column widths can change slightly per page, but without
	 * seriously compromising performance this is quite effective.
	 *
	 * @private
	 */
	_resizeAuto: function ()
	{
		var dt = this.s.dt;
		var columns = this.s.columns;

		// Are we allowed to do auto sizing?
		if ( ! this.c.auto ) {
			return;
		}

		// Are there any columns that actually need auto-sizing, or do they all
		// have classes defined
		if ( $.inArray( true, $.map( columns, function (c) { return c.auto; } ) ) === -1 ) {
			return;
		}

		// Need to restore all children. They will be reinstated by a re-render
		if ( ! $.isEmptyObject( _childNodeStore ) ) {
			$.each( _childNodeStore, function ( key ) {
				var idx = key.split('-');

				_childNodesRestore( dt, idx[0]*1, idx[1]*1 );
			} );
		}

		// Clone the table with the current data in it
		var tableWidth   = dt.table().node().offsetWidth;
		var columnWidths = dt.columns;
		var clonedTable  = dt.table().node().cloneNode( false );
		var clonedHeader = $( dt.table().header().cloneNode( false ) ).appendTo( clonedTable );
		var clonedBody   = $( dt.table().body() ).clone( false, false ).empty().appendTo( clonedTable ); // use jQuery because of IE8

		// Header
		var headerCells = dt.columns()
			.header()
			.filter( function (idx) {
				return dt.column(idx).visible();
			} )
			.to$()
			.clone( false )
			.css( 'display', 'table-cell' )
			.css( 'min-width', 0 );

		// Body rows - we don't need to take account of DataTables' column
		// visibility since we implement our own here (hence the `display` set)
		$(clonedBody)
			.append( $(dt.rows( { page: 'current' } ).nodes()).clone( false ) )
			.find( 'th, td' ).css( 'display', '' );

		// Footer
		var footer = dt.table().footer();
		if ( footer ) {
			var clonedFooter = $( footer.cloneNode( false ) ).appendTo( clonedTable );
			var footerCells = dt.columns()
				.footer()
				.filter( function (idx) {
					return dt.column(idx).visible();
				} )
				.to$()
				.clone( false )
				.css( 'display', 'table-cell' );

			$('<tr/>')
				.append( footerCells )
				.appendTo( clonedFooter );
		}

		$('<tr/>')
			.append( headerCells )
			.appendTo( clonedHeader );

		// In the inline case extra padding is applied to the first column to
		// give space for the show / hide icon. We need to use this in the
		// calculation
		if ( this.c.details.type === 'inline' ) {
			$(clonedTable).addClass( 'dtr-inline collapsed' );
		}
		
		// It is unsafe to insert elements with the same name into the DOM
		// multiple times. For example, cloning and inserting a checked radio
		// clears the chcecked state of the original radio.
		$( clonedTable ).find( '[name]' ).removeAttr( 'name' );

		// A position absolute table would take the table out of the flow of
		// our container element, bypassing the height and width (Scroller)
		$( clonedTable ).css( 'position', 'relative' )
		
		var inserted = $('<div/>')
			.css( {
				width: 1,
				height: 1,
				overflow: 'hidden',
				clear: 'both'
			} )
			.append( clonedTable );

		inserted.insertBefore( dt.table().node() );

		// The cloned header now contains the smallest that each column can be
		headerCells.each( function (i) {
			var idx = dt.column.index( 'fromVisible', i );
			columns[ idx ].minWidth =  this.offsetWidth || 0;
		} );

		inserted.remove();
	},

	/**
	 * Set a column's visibility.
	 *
	 * We don't use DataTables' column visibility controls in order to ensure
	 * that column visibility can Responsive can no-exist. Since only IE8+ is
	 * supported (and all evergreen browsers of course) the control of the
	 * display attribute works well.
	 *
	 * @param {integer} col      Column index
	 * @param {boolean} showHide Show or hide (true or false)
	 * @private
	 */
	_setColumnVis: function ( col, showHide )
	{
		var dt = this.s.dt;
		var display = showHide ? '' : 'none'; // empty string will remove the attr

		$( dt.column( col ).header() ).css( 'display', display );
		$( dt.column( col ).footer() ).css( 'display', display );
		dt.column( col ).nodes().to$().css( 'display', display );

		// If the are child nodes stored, we might need to reinsert them
		if ( ! $.isEmptyObject( _childNodeStore ) ) {
			dt.cells( null, col ).indexes().each( function (idx) {
				_childNodesRestore( dt, idx.row, idx.column );
			} );
		}
	},


	/**
	 * Update the cell tab indexes for keyboard accessibility. This is called on
	 * every table draw - that is potentially inefficient, but also the least
	 * complex option given that column visibility can change on the fly. Its a
	 * shame user-focus was removed from CSS 3 UI, as it would have solved this
	 * issue with a single CSS statement.
	 *
	 * @private
	 */
	_tabIndexes: function ()
	{
		var dt = this.s.dt;
		var cells = dt.cells( { page: 'current' } ).nodes().to$();
		var ctx = dt.settings()[0];
		var target = this.c.details.target;

		cells.filter( '[data-dtr-keyboard]' ).removeData( '[data-dtr-keyboard]' );

		if ( typeof target === 'number' ) {
			dt.cells( null, target, { page: 'current' } ).nodes().to$()
				.attr( 'tabIndex', ctx.iTabIndex )
				.data( 'dtr-keyboard', 1 );
		}
		else {
			// This is a bit of a hack - we need to limit the selected nodes to just
			// those of this table
			if ( target === 'td:first-child, th:first-child' ) {
				target = '>td:first-child, >th:first-child';
			}

			$( target, dt.rows( { page: 'current' } ).nodes() )
				.attr( 'tabIndex', ctx.iTabIndex )
				.data( 'dtr-keyboard', 1 );
		}
	}
} );


/**
 * List of default breakpoints. Each item in the array is an object with two
 * properties:
 *
 * * `name` - the breakpoint name.
 * * `width` - the breakpoint width
 *
 * @name Responsive.breakpoints
 * @static
 */
Responsive.breakpoints = [
	{ name: 'desktop',  width: Infinity },
	{ name: 'tablet-l', width: 1024 },
	{ name: 'tablet-p', width: 768 },
	{ name: 'mobile-l', width: 480 },
	{ name: 'mobile-p', width: 320 }
];


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.display = {
	childRow: function ( row, update, render ) {
		if ( update ) {
			if ( $(row.node()).hasClass('parent') ) {
				row.child( render(), 'child' ).show();

				return true;
			}
		}
		else {
			if ( ! row.child.isShown()  ) {
				row.child( render(), 'child' ).show();
				$( row.node() ).addClass( 'parent' );

				return true;
			}
			else {
				row.child( false );
				$( row.node() ).removeClass( 'parent' );

				return false;
			}
		}
	},

	childRowImmediate: function ( row, update, render ) {
		if ( (! update && row.child.isShown()) || ! row.responsive.hasHidden() ) {
			// User interaction and the row is show, or nothing to show
			row.child( false );
			$( row.node() ).removeClass( 'parent' );

			return false;
		}
		else {
			// Display
			row.child( render(), 'child' ).show();
			$( row.node() ).addClass( 'parent' );

			return true;
		}
	},

	// This is a wrapper so the modal options for Bootstrap and jQuery UI can
	// have options passed into them. This specific one doesn't need to be a
	// function but it is for consistency in the `modal` name
	modal: function ( options ) {
		return function ( row, update, render ) {
			if ( ! update ) {
				// Show a modal
				var close = function () {
					modal.remove(); // will tidy events for us
					$(document).off( 'keypress.dtr' );
				};

				var modal = $('<div class="dtr-modal"/>')
					.append( $('<div class="dtr-modal-display"/>')
						.append( $('<div class="dtr-modal-content"/>')
							.append( render() )
						)
						.append( $('<div class="dtr-modal-close">&times;</div>' )
							.click( function () {
								close();
							} )
						)
					)
					.append( $('<div class="dtr-modal-background"/>')
						.click( function () {
							close();
						} )
					)
					.appendTo( 'body' );

				$(document).on( 'keyup.dtr', function (e) {
					if ( e.keyCode === 27 ) {
						e.stopPropagation();

						close();
					}
				} );
			}
			else {
				$('div.dtr-modal-content')
					.empty()
					.append( render() );
			}

			if ( options && options.header ) {
				$('div.dtr-modal-content').prepend(
					'<h2>'+options.header( row )+'</h2>'
				);
			}
		};
	}
};


var _childNodeStore = {};

function _childNodes( dt, row, col ) {
	var name = row+'-'+col;

	if ( _childNodeStore[ name ] ) {
		return _childNodeStore[ name ];
	}

	// https://jsperf.com/childnodes-array-slice-vs-loop
	var nodes = [];
	var children = dt.cell( row, col ).node().childNodes;
	for ( var i=0, ien=children.length ; i<ien ; i++ ) {
		nodes.push( children[i] );
	}

	_childNodeStore[ name ] = nodes;

	return nodes;
}

function _childNodesRestore( dt, row, col ) {
	var name = row+'-'+col;

	if ( ! _childNodeStore[ name ] ) {
		return;
	}

	var node = dt.cell( row, col ).node();
	var store = _childNodeStore[ name ];
	var parent = store[0].parentNode;
	var parentChildren = parent.childNodes;
	var a = [];

	for ( var i=0, ien=parentChildren.length ; i<ien ; i++ ) {
		a.push( parentChildren[i] );
	}

	for ( var j=0, jen=a.length ; j<jen ; j++ ) {
		node.appendChild( a[j] );
	}

	_childNodeStore[ name ] = undefined;
}


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.renderer = {
	listHiddenNodes: function () {
		return function ( api, rowIdx, columns ) {
			var ul = $('<ul data-dtr-index="'+rowIdx+'" class="dtr-details"/>');
			var found = false;

			var data = $.each( columns, function ( i, col ) {
				if ( col.hidden ) {
					$(
						'<li data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
							'<span class="dtr-title">'+
								col.title+
							'</span> '+
						'</li>'
					)
						.append( $('<span class="dtr-data"/>').append( _childNodes( api, col.rowIndex, col.columnIndex ) ) )// api.cell( col.rowIndex, col.columnIndex ).node().childNodes ) )
						.appendTo( ul );

					found = true;
				}
			} );

			return found ?
				ul :
				false;
		};
	},

	listHidden: function () {
		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				return col.hidden ?
					'<li data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<span class="dtr-title">'+
							col.title+
						'</span> '+
						'<span class="dtr-data">'+
							col.data+
						'</span>'+
					'</li>' :
					'';
			} ).join('');

			return data ?
				$('<ul data-dtr-index="'+rowIdx+'" class="dtr-details"/>').append( data ) :
				false;
		}
	},

	tableAll: function ( options ) {
		options = $.extend( {
			tableClass: ''
		}, options );

		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				return '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<td>'+col.title+':'+'</td> '+
						'<td>'+col.data+'</td>'+
					'</tr>';
			} ).join('');

			return $('<table class="'+options.tableClass+' dtr-details" width="100%"/>').append( data );
		}
	}
};

/**
 * Responsive default settings for initialisation
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.defaults = {
	/**
	 * List of breakpoints for the instance. Note that this means that each
	 * instance can have its own breakpoints. Additionally, the breakpoints
	 * cannot be changed once an instance has been creased.
	 *
	 * @type {Array}
	 * @default Takes the value of `Responsive.breakpoints`
	 */
	breakpoints: Responsive.breakpoints,

	/**
	 * Enable / disable auto hiding calculations. It can help to increase
	 * performance slightly if you disable this option, but all columns would
	 * need to have breakpoint classes assigned to them
	 *
	 * @type {Boolean}
	 * @default  `true`
	 */
	auto: true,

	/**
	 * Details control. If given as a string value, the `type` property of the
	 * default object is set to that value, and the defaults used for the rest
	 * of the object - this is for ease of implementation.
	 *
	 * The object consists of the following properties:
	 *
	 * * `display` - A function that is used to show and hide the hidden details
	 * * `renderer` - function that is called for display of the child row data.
	 *   The default function will show the data from the hidden columns
	 * * `target` - Used as the selector for what objects to attach the child
	 *   open / close to
	 * * `type` - `false` to disable the details display, `inline` or `column`
	 *   for the two control types
	 *
	 * @type {Object|string}
	 */
	details: {
		display: Responsive.display.childRow,

		renderer: Responsive.renderer.listHidden(),

		target: 0,

		type: 'inline'
	},

	/**
	 * Orthogonal data request option. This is used to define the data type
	 * requested when Responsive gets the data to show in the child row.
	 *
	 * @type {String}
	 */
	orthogonal: 'display'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
Api.register( 'responsive()', function () {
	return this;
} );

Api.register( 'responsive.index()', function ( li ) {
	li = $(li);

	return {
		column: li.data('dtr-index'),
		row:    li.parent().data('dtr-index')
	};
} );

Api.register( 'responsive.rebuild()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._classLogic();
		}
	} );
} );

Api.register( 'responsive.recalc()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._resizeAuto();
			ctx._responsive._resize();
		}
	} );
} );

Api.register( 'responsive.hasHidden()', function () {
	var ctx = this.context[0];

	return ctx._responsive ?
		$.inArray( false, ctx._responsive.s.current ) !== -1 :
		false;
} );

Api.registerPlural( 'columns().responsiveHidden()', 'column().responsiveHidden()', function () {
	return this.iterator( 'column', function ( settings, column ) {
		return settings._responsive ?
			settings._responsive.s.current[ column ] :
			false;
	}, 1 );
} );


/**
 * Version information
 *
 * @name Responsive.version
 * @static
 */
Responsive.version = '2.2.3';


$.fn.dataTable.Responsive = Responsive;
$.fn.DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtr', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	if ( $(settings.nTable).hasClass( 'responsive' ) ||
		 $(settings.nTable).hasClass( 'dt-responsive' ) ||
		 settings.oInit.responsive ||
		 DataTable.defaults.responsive
	) {
		var init = settings.oInit.responsive;

		if ( init !== false ) {
			new Responsive( settings, $.isPlainObject( init ) ? init : {}  );
		}
	}
} );


return Responsive;
}));


