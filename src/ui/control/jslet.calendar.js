/*
This file is part of Jslet framework

Copyright (c) 2013 Jslet Team

GNU General Public License(GPL 3.0) Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please visit: http://www.jslet.com/license.
*/

/**
 * @class Calendar. Example:
 * <pre><code>
 *  var jsletParam = {type:"Calendar"};
 *  //1. Declaring:
 *     &lt;div data-jslet='type:"Calendar"' />
 *      
 *  //2. Binding
 *  	&lt;div id='ctrlId' />
 * 		//js snippet 
 *  	var el = document.getElementById('ctrlId');
 *  	jslet.ui.bindControl(el, jsletParam);
 *  		
 *  //3. Create dynamically
 *  	jslet.ui.createControl(jsletParam, document.body);
 *  	
 * </code></pre>
 */
jslet.ui.Calendar = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
    initialize: function ($super, el, params) {
		var Z = this;
        Z.el = el;
        Z.allProperties = 'value,onDateSelected,minDate,maxDate';
        /**
         * {Date} Calendar value
         */
        Z.value;
        
        /**
         * {Event Handler}  Fired when user select a date.
         * Pattern: 
         *    function(value){}
         *    //value: Date
         */
        Z.onDateSelected = null;
        
        /**
         * {Date} minDate Minimized date of calendar range 
         */
        Z.minDate = null;

        /**
         * {Date} maxDate Maximized date of calendar range 
         */
        Z.maxDate = null;
        
        Z._currYear = 0;
        Z._currMonth = 0;
        Z._currDate = 0;
        
        $super(el, params);
    },

	/**
	 * @override
	 */
    bind: function () {
        this.renderAll();
    },

	/**
	 * @override
	 */
    renderAll: function () {
        var Z = this;
        jqEl = jQuery(Z.el);
        if (!jqEl.hasClass('jl-calendar')) {
        	jqEl.addClass('jl-calendar jl-border-box');
        }
        var template = ['<div class="jl-cal-header">',
            '<a class="jl-cal-btn jl-cal-yprev" title="', jslet.locale.Calendar.yearPrev,
            '" href="javascript:;">&lt;&lt;</a><a href="javascript:;" class="jl-cal-btn jl-cal-mprev" title="', jslet.locale.Calendar.monthPrev, '">&lt;',
            '</a><a href="javascript:;" class="jl-cal-title"></a><a href="javascript:;" class="jl-cal-btn jl-cal-mnext" title="', jslet.locale.Calendar.monthNext, '">&gt;',
            '</a><a href="javascript:;" class="jl-cal-btn jl-cal-ynext" title="', jslet.locale.Calendar.yearNext, '">&gt;&gt;</a>',
        '</div>',
        '<div class="jl-cal-body">',
            '<table cellpadding="0" cellspacing="0">',
                '<thead><tr><th class="jl-cal-weekend">',
                jslet.locale.Calendar.Sun,
                    '</th><th>',
                    jslet.locale.Calendar.Mon,
                        '</th><th>',
                    jslet.locale.Calendar.Tue,
                        '</th><th>',
                    jslet.locale.Calendar.Wed,
                        '</th><th>',
                    jslet.locale.Calendar.Thu,
                        '</th><th>',
                    jslet.locale.Calendar.Fri,
                        '</th><th class="jl-cal-weekend">',
                    jslet.locale.Calendar.Sat,
                        '</th></tr></thead><tbody>',
                        '<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
                        '<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
                        '<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
                        '<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;" class="jl-cal-disable"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
                        '<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;" class="jl-cal-disable"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
                        '<tr><td class="jl-cal-weekend"><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td><a href="javascript:;"></a></td><td class="jl-cal-weekend"><a href="javascript:;"></a></td></tr>',
                        '</tbody></table></div><div class="jl-cal-footer"><a class="jl-cal-today" href="javascript:;">', jslet.locale.Calendar.today, '</a></div>'];

        jqEl.html(template.join(''));
        var jqTable = jqEl.find('.jl-cal-body table');
        Z._currYear = -1;
        jqTable.on('click', Z._doTableClick);
        
        var dvalue = Z.value && jslet.isDate(Z.value) ? Z.value : new Date();
        this.setValue(dvalue);
        jqEl.find('.jl-cal-today').click(function (event) {
            var d = new Date();
            Z.setValue(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
            Z._fireSelectedEvent();
        });
        
        jqEl.find('.jl-cal-yprev').click(function (event) {
        	Z.incYear(-1);
        });
        
        jqEl.find('.jl-cal-mprev').click(function (event) {
        	Z.incMonth(-1);
        });
        
        jqEl.find('.jl-cal-ynext').click(function (event) {
        	Z.incYear(1);
        });
        
        jqEl.find('.jl-cal-mnext').click(function (event) {
        	Z.incMonth(1);
        });
        
        jqEl.on('keydown', function(event){
        	var ctrlKey = event.ctrlKey,
        		keyCode = event.keyCode;
        	var delta = 0;
        	if(keyCode == jslet.ui.KeyCode.UP) {
	        	if(ctrlKey) {
	        		Z.incYear(-1);
	        	} else {
	        		Z.incDate(-7);
	        	}
	        	event.preventDefault();
	        	return;
        	} 
        	if(keyCode == jslet.ui.KeyCode.DOWN) {
	        	if(ctrlKey) {
	        		Z.incYear(1);
	        	} else {
	        		Z.incDate(7);
	        	}
	        	event.preventDefault();
	        	return;
        	}
        	if(keyCode == jslet.ui.KeyCode.LEFT) {
	        	if(ctrlKey) {
	        		Z.incMonth(-1);
	        	} else {
	        		Z.incDate(-1);
	        	}
	        	event.preventDefault();
	        	return;
        	}
        	if(keyCode == jslet.ui.KeyCode.RIGHT) {
	        	if(ctrlKey) {
	        		Z.incMonth(1);
	        	} else {
	        		Z.incDate(1);
	        	}
	        	event.preventDefault();
	        	return;
        	}
        });
    },
    
    _getNotNullDate: function() {
    	var value =this.value;
    	if(!value) {
    		value = new Date();
    	}
    	return value;
    },
    
    incDate: function(deltaDay) {
    	var value = this._getNotNullDate();
    	value.setDate(value.getDate() + deltaDay);
    	this.setValue(value);
    },
    
    incMonth: function(deltaMonth) {
    	var value = this._getNotNullDate();
    	value.setMonth(value.getMonth() + deltaMonth);
    	this.setValue(value);
    },
    
    incYear: function(deltaYear) {
    	var value = this._getNotNullDate();
    	value.setFullYear(value.getFullYear() + deltaYear);
    	this.setValue(value);
    },
    
    /**
     * Set date value of calendar.
     * 
     * @param {Date} value Calendar date
     */
    setValue: function (value) {
        if (!value) {
            return;
        }

        var Z = this;
        if (Z.minDate && value < Z.minDate) {
            value = new Date(Z.minDate.getTime());
        }
        if (Z.maxDate && value > Z.maxDate) {
            value = new Date(Z.maxDate.getTime());
        }
        Z.value = value;
        var y = value.getFullYear(), 
        	m = value.getMonth();
        if (Z._currYear == y && Z._currMonth == m) {
            Z._setCurrDateCls();
        } else {
            Z._refreshDateCell(y, m);
        }
    },

    _checkNaviState: function () {
        var Z = this,
        	jqEl = jQuery(Z.el);
        if (Z.minDate) {
            var minY = Z.minDate.getFullYear(),
            	minM = Z.minDate.getMonth(),
            	flag = (Z._currYear <= minY),
            	btnYearPrev = jqEl.find('.jl-cal-yprev')[0];
            btnYearPrev.style.visibility = (flag ? 'hidden' : 'visible');

            var flag = (Z._currYear == minY && Z._currMonth <= minM),
            	btnMonthPrev = jqEl.find('.jl-cal-mprev')[0];
            btnMonthPrev.style.visibility = (flag ? 'hidden' : 'visible');

            flag = (Z.minDate > new Date());
            var btnToday = jqEl.find('.jl-cal-today')[0];
            btnToday.style.visibility = (flag ? 'hidden' : 'visible');
        }

        if (Z.maxDate) {
            var maxY = Z.maxDate.getFullYear(),
            	maxM = Z.maxDate.getMonth(),
            	flag = (Z._currYear >= maxY),
            	btnYearNext = jqEl.find('.jl-cal-ynext')[0];
            btnYearNext.jslet_disabled = flag;
            btnYearNext.style.visibility = (flag ? 'hidden' : 'visible');

            var flag = (Z._currYear == maxY && Z._currMonth >= maxM),
            	btnMonthNext = jqEl.find('.jl-cal-mnext')[0];
            btnMonthNext.jslet_disabled = flag;
            btnMonthNext.style.visibility = (flag ? 'hidden' : 'visible');

            flag = (Z.maxDate < new Date());
            var btnToday = jqEl.find('.jl-cal-today')[0];
            btnToday.style.visibility = (flag ? 'hidden' : 'visible');
        }
    },

    _refreshDateCell: function (year, month) {
        var Z = this,
        	jqEl = jQuery(Z.el),
        	monthnames = jslet.locale.Calendar.monthNames,
        	mname = monthnames[month],
        	otitle = jqEl.find('.jl-cal-title')[0];
        otitle.innerHTML = mname + ',' + year;
        var otable = jqEl.find('.jl-cal-body table')[0],
        	rows = otable.tBodies[0].rows,
        	firstDay = new Date(year, month, 1),
        	w1 = firstDay.getDay(),
        	oneDayMs = 86400000, //24 * 60 * 60 * 1000
        	date = new Date(firstDay.getTime() - (w1 + 1) * oneDayMs);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        var rowCnt = rows.length, otr, otd, m, date, oa;
        for (var i = 1; i <= rowCnt; i++) {
            otr = rows[i - 1];
            for (var j = 1, tdCnt = otr.cells.length; j <= tdCnt; j++) {
                otd = otr.cells[j - 1];
                date = new Date(date.getTime() + oneDayMs);
                oa = otd.firstChild;
                if (Z.minDate && date < Z.minDate || Z.maxDate && date > Z.maxDate) {
                    oa.innerHTML = '';
                    otd.jslet_date_value = null;
                    continue;
                } else {
                    oa.innerHTML = date.getDate();
                    otd.jslet_date_value = date;
                }
                m = date.getMonth();
                if (m != month) {
                    jQuery(otd).addClass('jl-cal-disable');
                } else {
                	jQuery(otd).removeClass('jl-cal-disable');
                }
            } //end for j
        } //end for i
        Z._currYear = year;
        Z._currMonth = month;
        Z._setCurrDateCls();
        Z._checkNaviState();
    },
    
    _fireSelectedEvent: function() {
    	var Z = this;
        if (Z.onDateSelected) {
            Z.onDateSelected.call(Z, Z.value);
        }
    },
    
    _doTableClick: function (event) {
		event = jQuery.event.fix( event || window.event );
		if(event.which != 1) {
			return;
		}
        var node = event.target,
        	otd = node.parentNode;
        
        if (otd && otd.tagName && otd.tagName.toLowerCase() == 'td') {
            if (!otd.jslet_date_value) {
                return;
            }
            var el = jslet.ui.findFirstParent(otd, function (node) { return node.jslet; });
            var Z = el.jslet;
            Z.value = otd.jslet_date_value;
            Z._setCurrDateCls();
            otd.firstChild.focus();
            Z._fireSelectedEvent();
        }
    },

    _setCurrDateCls: function () {
        var Z = this;
        if (!jslet.isDate(Z.value)) {
            return;
        }
        var currM = Z.value.getMonth(),
        	currY = Z.value.getFullYear(),
        	currD = Z.value.getDate(),
        	otable = jqEl.find('.jl-cal-body table')[0],
        	rows = otable.tBodies[0].rows,
        	rowCnt = rows.length, otr, otd, m, d, y, date, jqLink;
        for (var i = 0; i < rowCnt; i++) {
            otr = rows[i];
            for (var j = 0, tdCnt = otr.cells.length; j < tdCnt; j++) {
                otd = otr.cells[j];
                date = otd.jslet_date_value;
                if (!date) {
                    continue;
                }
                m = date.getMonth();
                y = date.getFullYear();
                d = date.getDate();
                jqLink = jQuery(otd.firstChild);
                if (y == currY && m == currM && d == currD) {
                    if (!jqLink.hasClass('jl-cal-current')) {
                        jqLink.addClass('jl-cal-current');
                    }
                    otd.firstChild.focus();
                } else {
                    jqLink.removeClass('jl-cal-current');
                }
            }
        }
    },
    
	/**
	 * @override
	 */
    destroy: function($super){
    	var jqEl = jQuery(this.el);
    	jqEl.off();
    	jqEl.find('.jl-cal-body table').off();
    	jqEl.find('.jl-cal-today').off();
    	jqEl.find('.jl-cal-yprev').off();
    	jqEl.find('.jl-cal-mprev').off();
    	jqEl.find('.jl-cal-mnext').off();
    	jqEl.find('.jl-cal-ynext').off();
    	$super();
    }
});
jslet.ui.register('Calendar', jslet.ui.Calendar);
jslet.ui.Calendar.htmlTemplate = '<div></div>';
