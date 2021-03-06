﻿/*
This file is part of Jslet framework

Copyright (c) 2013 Jslet Team

GNU General Public License(GPL 3.0) Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please visit: http://www.jslet.com/license.
*/

/**
 * @class DBInspector. 
 * Display&Edit fields in two columns: Label column and Value column. If in edit mode, this control takes the field editor configuration from dataset field object.
 * Example:
 * <pre><code>
 * 		var jsletParam = {type:"DBInspector",dataset:"employee",columnCount:1,columnWidth:100};
 * 
 * //1. Declaring:
 *      &lt;div id='ctrlId' data-jslet='type:"DBInspector",dataset:"employee",columnCount:1,columnWidth:100' />
 *      or
 *      &lt;div data-jslet='jsletParam' />
 *      
 *  //2. Binding
 *      &lt;div id="ctrlId"  />
 *  	//Js snippet
 * 		var el = document.getElementById('ctrlId');
 *  	jslet.ui.bindControl(el, jsletParam);
 *
 *  //3. Create dynamically
 *  	jslet.ui.createControl(jsletParam, document.body);
 *  	
 * </code></pre>
 */
jslet.ui.DBInspector = jslet.Class.create(jslet.ui.DBControl, {
	/**
	 * @override
	 */
    initialize: function ($super, el, params) {
        var Z = this;
        Z.allProperties = 'dataset,columnCount,rowHeight';
        Z.requiredProperties = null;

        Z.dataset = null;
        /**
         * {Integer} Column count
         */
        Z.columnCount = 1;
        /**
         * {Integer} Row height
         */
        Z.rowHeight = 30;
        
        $super(el, params);
    },

	/**
	 * @override
	 */
    isValidTemplateTag: function (el) {
        return el.tagName.toLowerCase() == 'div';
    },

	/**
	 * @override
	 */
    bind: function () {
        var Z = this;
        var colCnt = Z.columnCount;
        if (colCnt) {
            colCnt = parseInt(colCnt);
        }
        if (colCnt && colCnt > 0) {
            Z.columnCount = colCnt;
        } else {
            Z.columnCount = 1;
        }
        Z.renderAll();
    }, // end bind

	/**
	 * @override
	 */
    renderAll: function () {
        var Z = this,
        	jqEl = jQuery(Z.el);
        if (!jqEl.hasClass('jl-inspector'))
        	jqEl.addClass('jl-inspector');
        var totalWidth = jqEl.width(),
        	allFlds = Z.dataset.getFields();
        jqEl.html('<table cellpadding=0 cellspacing=0 style="margin:0;padding:0;table-layout:fixed;width:100%;height:100%"><tbody></tbody></table>');
        var oCol, fldObj, 
        	fcnt = allFlds.length,
        	visibleFlds = [];
        for (var i = 0; i < fcnt; i++) {
            fldObj = allFlds[i];
            if (fldObj.visible()) {
                visibleFlds.push(fldObj);
            }
        }
        fcnt = visibleFlds.length;
        if (fcnt == 0) {
            return;
        }
        var w, c, columnCnt = Math.min(fcnt, Z.columnCount), arrLabelWidth = [];
        for (var i = 0; i < columnCnt; i++) {
            arrLabelWidth[i] = 0;
        }
        var startWidth = jslet.ui.textMeasurer.getWidth('*');
        jslet.ui.textMeasurer.setElement(Z.el);
        for (var i = 0; i < fcnt; i++) {
            fldObj = visibleFlds[i];
            c = i % columnCnt;
            w = Math.round(jslet.ui.textMeasurer.getWidth(fldObj.label()) + startWidth) + 5;
            if (arrLabelWidth[c] < w) {
                arrLabelWidth[c] = w;
            }
        }
        jslet.ui.textMeasurer.setElement();

        var totalLabelWidth = 0;
        for (var i = 0; i < columnCnt; i++) {
            totalLabelWidth += arrLabelWidth[i];
        }

        var editorWidth = Math.round((totalWidth - totalLabelWidth) / columnCnt);

        var otable = Z.el.firstChild,
        tHead = otable.createTHead(), otd, otr = tHead.insertRow(-1);
        otr.style.height = '0';
        for (var i = 0; i < columnCnt; i++) {
            otd = otr.insertCell(-1);
            otd.style.width = arrLabelWidth[i] + 'px';
            otd.style.height = '0';
            otd = otr.insertCell(-1);
            otd.style.height = '0';
        }

        var oldRowNo = -1, oldC = -1, rowNo, odiv, oLabel, fldName, editor, fldCtrl;
        Z.preRowIndex = -1;
        for (var i = 0; i < fcnt; i++) {
            fldObj = visibleFlds[i];
            fldName = fldObj.name();
            rowNo = Math.floor(i / columnCnt);
            c = i % columnCnt;
            if (oldRowNo != rowNo) {
                otr = otable.insertRow(-1);
                if (Z.rowHeight)
                    otr.style.height = Z.rowHeight + 'px';

                oldRowNo = rowNo;
            }

            otd = otr.insertCell(-1);
            otd.noWrap = true;
            otd.className = jslet.ui.htmlclass.DBINSPECTOR.labelColCls;

            oLabel = document.createElement('label');
            otd.appendChild(oLabel);
            new jslet.ui.DBLabel(oLabel, {
                type: 'DBLabel',
                dataset: Z.dataset,
                field: fldName
            });

            otd = otr.insertCell(-1);
            otd.className = jslet.ui.htmlclass.DBINSPECTOR.editorColCls;
            otd.noWrap = true;
            otd.align = 'left';
            odiv = document.createElement('div');
            odiv.noWrap = true;
            otd.appendChild(odiv);
            fldCtrl = fldObj.editControl();
            fldCtrl.dataset = Z.dataset;
            fldCtrl.field = fldName;

            editor = jslet.ui.createControl(fldCtrl, odiv);
            if (!editor.isCheckBox) {
            	editor.el.style.width = '100%';//editorWidth - 10 + 'px';
            }
        } // end for
    },
    
	/**
	 * @override
	 */
    refreshControl: function (evt) {
        if (!evt) {
            evt = jslet.data.UpdateEvent.METACHANGE;
        }
        if (evt.eventType == jslet.data.UpdateEvent.METACHANGE) {
            this.renderAll();
        }
    },
    
	/**
	 * @override
	 */
    destroy: function($super){
    	$super();
    }
});

jslet.ui.htmlclass.DBINSPECTOR = {
	    labelColCls: 'jl-inspector-label',
	    editorColCls: 'jl-inspector-editor'
	};

jslet.ui.register('DBInspector', jslet.ui.DBInspector);
jslet.ui.DBInspector.htmlTemplate = '<div></div>';
