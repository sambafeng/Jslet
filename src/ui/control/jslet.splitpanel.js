﻿/*
This file is part of Jslet framework

Copyright (c) 2013 Jslet Team

GNU General Public License(GPL 3.0) Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please visit: http://www.jslet.com/license.
*/

/**
 * @class Split Panel. Example:
 * <pre><code>
 * var jsletParam = {type:"SplitPanel",direction:"hori",floatIndex: 1};
 * //1. Declaring:
 *     &lt;div data-jslet='jsletParam' style="width: 300px; height: 400px;">
 *       &lt;div>content1&lt;/div>
 *       &lt;div>content2&lt;/div>
 *      &lt;/div>
 *      
 *  //2. Binding
 *  	&lt;div id='ctrlId'>
 *  		&lt;div>content1&lt;/div>
 *          &lt;div>content2&lt;/div>
 *  	&lt;/div>
 *  	//Js snippet
 * 		var el = document.getElementById('ctrlId');
 *  	jslet.ui.bindControl(el, jsletParam);
 *  		
 *  //3. Create dynamically
 *  	jslet.ui.createControl(jsletParam, document.body);
 *  	
 * </code></pre>
 */
jslet.ui.SplitPanel = jslet.Class.create(jslet.ui.Control, {
	/**
	 * @override
	 */
    initialize: function ($super, el, params) {
        var Z = this;
        Z.el = el;
        Z.allProperties = 'direction,floatIndex,onExpanded,onSize';//{size:100, align:-1/0/1,minSize:10}
        /**
         * {String} Split direction, optional value: hori, vert
         * Default value is 'hori'
         */
        Z.direction = 'hori';
        /**
         * {Integer} Float panel index, only one panel can be a floating panel
         */
        Z.floatIndex = 1;
        
        /**
         * {Event} Fired when user expand/collapse one panel.
         *  Pattern: 
         *    function(panelIndex){} 
         *    //panelIndex: Integer
         */
        Z.onExpanded = null;
        
        /**
         * {Event} Fired after user change size of one panel.
         *  Pattern: 
         *    function(panelIndex, newSize){} 
         *    //panelIndex: Integer
         *    //newSize: Integer
         */
        Z.onSize = null;
        
		Z.panels = null; //Array, panel configuration
        Z.splitter = null;
        Z._oldSize;
        jslet.resizeEventBus.subscribe(Z);
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
        var Z = this, jqEl = jQuery(Z.el);
        if (!jqEl.hasClass('jl-splitpanel')) {
        	jqEl.addClass('jl-splitpanel jl-border-box');
        }
        Z.isHori = (Z.direction == 'hori');
        
        Z.width = jqEl.innerWidth();
        Z.height = jqEl.innerHeight();
        Z._oldSize = Z.isHori ? Z.width: Z.height;
        
        var panelDivs = jqEl.find('>div'),
        	lastIndex = panelDivs.length - 1;
        if (!Z.floatIndex || Z.floatIndex > lastIndex) {
        	Z.floatIndex = lastIndex;
        }
		if (Z.floatIndex > lastIndex) {
			Z.floatIndex = lastIndex;
		}
		if (!Z.panels) {
			Z.panels = [];
		}
		var containerSize = (Z.isHori ? Z.width : Z.height), sumSize = 0;

		panelDivs.each(function(k){
			var jqPanel = jQuery(panelDivs[k]),
				oPanel = Z.panels[k];
			if (!oPanel){
				oPanel = {};
				Z.panels[k] = oPanel;
			}

			var minSize = parseInt(jqPanel.css(Z.isHori ?'min-width': 'min-height'));
			oPanel.minSize = minSize ? minSize : 5;
			
			var maxSize = parseInt(jqPanel.css(Z.isHori ?'max-width': 'max-height'));
			oPanel.maxSize = maxSize ? maxSize : Infinity;
			oPanel.expanded = jqPanel.css('display') != 'none';
			
			var size = oPanel.size;
			if (size == null || size == undefined) {
				size = Z.isHori ? jqPanel.outerWidth(): jqPanel.outerHeight();
			} else {
				if (Z.isHori) {
					jqPanel.width(size);
				} else {
					jqPanel.height(size);
				}
			}
				
			if (k != Z.floatIndex){
				sumSize += size;
				oPanel.size = size;
			}
		});
		Z.panels[Z.floatIndex].size = containerSize - sumSize;
		
        Z.splitterTracker = document.createElement('div');
        var jqTracker = jQuery(Z.splitterTracker);
        jqTracker.addClass('jl-sp-splitter-tracker');
        var fixedSize = 0,
			clsName = Z.isHori ? 'jl-sp-panel-hori': 'jl-sp-panel-vert';
    	Z.splitterClsName = Z.isHori ? 'jl-sp-splitter-hori': 'jl-sp-splitter-vert';
    	Z.el.appendChild(Z.splitterTracker);
    	if (Z.isHori) {
    		Z.splitterTracker.style.height = '100%';
    	} else {
    		Z.splitterTracker.style.width = '100%';
    	}
        var splitterSize = parseInt(jslet.ui.getCssValue(Z.splitterClsName, Z.isHori? 'width' : 'height'));
        panelDivs.after(function(k){
        	var panel = panelDivs[k],
            jqPanel = jQuery(panel),
			expanded = Z.panels[k].expanded;
			
        	jqPanel.addClass(clsName);

        	if (k == Z.floatIndex) {
        		Z.floatPanel = panel;
        	} else {
				if (expanded) {
	        		fixedSize += splitterSize + Z.panels[k].size;
				} else {
					jqPanel.css('display', 'none');
					fixedSize += splitterSize;
				}
			}
            if (k == lastIndex){
            	if (Z.isHori) {
            		return '<div style="clear:both;width:0px"></div>';
            	}
        		return '';
            }
       		var id = jslet.nextId(),  
				minBtnCls = Z.isHori ? 'jl-sp-button-left' : 'jl-sp-button-top';
				
			if (Z.floatIndex <= k || !expanded) {
				minBtnCls += Z.isHori ? ' jl-sp-button-right' : ' jl-sp-button-bottom';
			}
        	return '<div class="'+ Z.splitterClsName + ' jl-unselectable" id = "' + id + '" jsletindex="'+ (k >= Z.floatIndex ? k+1: k)+ '"><div class="jl-sp-button ' + minBtnCls +'"'
				+ (expanded ? '': ' jsletcollapsed="1"') +'></div></div>';
        });
        if (Z.isHori) {
        	jQuery(Z.floatPanel).width(jqEl.innerWidth() - fixedSize - 4);
        } else {
        	jQuery(Z.floatPanel).height(jqEl.innerHeight() - fixedSize);
        }
        var splitters = jqEl.find('.'+Z.splitterClsName);
        splitters.on('mousedown', Z._splitterMouseDown);
        var splitBtns = splitters.children();
        splitBtns.on('mousedown', function(event){
			var jqBtn = jQuery(event.target),
		    	jqSplitter = jqBtn.parent(),
		    	index = parseInt(jqSplitter.attr('jsletindex'));
			Z.expand(index);
			event.stopPropagation();
		});
		
        var oSplitter;
        for(var i = 0, cnt = splitters.length; i < cnt; i++){
        	oSplitter = splitters[i];
        	oSplitter._doDragStart = Z._splitterDragStart;
        	oSplitter._doDragging = Z._splitterDragging;
        	oSplitter._doDragEnd = Z._splitterDragEnd;
        	oSplitter._doDragCancel = Z._splitterDragCancel;
        }
    },
    
    /**
     * Get float panel
     * 
     * @return {Html Element} 
     */
    floatPanel: function(){
    	return Z.panels[Z.floatIndex];	
    },
    
	changeSize: function(k, size){
		
	},
	
	/**
	 * Expand or collapse the specified panel
	 * 
	 * @param {Integer} index Panel index
	 * @param {Boolean} expanded True for expanded, false otherwise.
	 */
    expand: function(index, expanded){
        var Z = this, jqPanel, jqEl = jQuery(Z.el),
        	splitters = jqEl.find('.'+Z.splitterClsName);
        if (index < 0 || index > splitters.length) {
        	return;
        }
        var	jqSplitter = jQuery(splitters[(index >= Z.floatIndex ? index - 1: index)]),
        	jqBtn = jqSplitter.find(':first-child');
        	
        if (expanded === undefined) {
        	expanded  = jqBtn.attr('jsletcollapsed')=='1';
        }
		if (index < Z.floatIndex) {
			jqPanel = jqSplitter.prev();
		} else {
			jqPanel = jqSplitter.next();
		}
		if (Z.isHori){
			if (jqBtn.hasClass('jl-sp-button-right')) {
				jqBtn.removeClass('jl-sp-button-right');
			} else {
				jqBtn.addClass('jl-sp-button-right');
			}
    	} else {
			if (jqBtn.hasClass('jl-sp-button-bottom')) {
				jqBtn.removeClass('jl-sp-button-bottom');
			} else {
				jqBtn.addClass('jl-sp-button-bottom');
			}
		}

		if (expanded){
			jqPanel.css('display', 'block');
			jqBtn.attr('jsletcollapsed', '0');
		}else{
			jqPanel.css('display','none');
			jqBtn.attr('jsletcollapsed', '1');
		}
		var jqFp = jQuery(Z.floatPanel);
        if (Z.isHori) {
        	jqFp.width(jqFp.width()+jqPanel.width()*(expanded ? -1: 1));
        } else {
        	jqFp.height(jqFp.height()+jqPanel.height()*(expanded ? -1: 1));
        }
		Z.panels[index].expanded = expanded;
		if (Z.onExpanded) {
			Z.onExpanded.call(Z, panelIndex);
		}
		jslet.resizeEventBus.resize(Z.el);
    },
    
    /**
     * @private
     */
    _splitterMouseDown: function(event){
        var pos = jQuery(this).position(),
        	Z = this.parentNode.jslet;
        Z.splitterTracker.style.top = pos.top + 'px';
        Z.splitterTracker.style.left = pos.left + 'px';
        Z.draggingId = this.id;
        
        jslet.ui.dnd.bindControl(this);
    },
    	
    /**
     * @private
     */
    _splitterDragStart: function (oldX, oldY, x, y, deltaX, deltaY){
    	var Z = this.parentNode.jslet,
    		jqTracker = jQuery(Z.splitterTracker),
			jqSplitter = jQuery('#'+Z.draggingId),
			index = parseInt(jqSplitter.attr('jsletindex')),
			cfg = Z.panels[index],
    		jqFp = jQuery(Z.floatPanel);
		
		Z.dragRangeMin = cfg.size - cfg.minSize;
		Z.dragRangeMax = cfg.maxSize - cfg.size;
		var fpMax = (Z.isHori ? jqFp.width() : jqFp.height()) - Z.panels[Z.floatIndex].minSize;
		if (Z.dragRangeMax > fpMax) {
			Z.dragRangeMax = fpMax;
		}
    	jqTracker.show();
    },
    
    /**
     * @private
     */
    _splitterDragging: function (oldX, oldY, x, y, deltaX, deltaY){
    	var Z = this.parentNode.jslet,
			jqTracker = jQuery(Z.splitterTracker),
    		jqSplitter = jQuery('#'+Z.draggingId),
			index = parseInt(jqSplitter.attr('jsletindex')),
			delta = Math.abs(Z.isHori ? deltaX : deltaY),
			expanded;
			
		if (Z.isHori) {
			expanded = index < Z.floatIndex && deltaX >= 0 || index > Z.floatIndex && deltaX < 0;
		} else {
			expanded = index < Z.floatIndex && deltaY >= 0 || index > Z.floatIndex && deltaY < 0;
		}
		if (expanded && delta > Z.dragRangeMax){
			Z.endDelta = Z.dragRangeMax;
			return;
		}
		
		if (!expanded && delta > Z.dragRangeMin){
			Z.endDelta = Z.dragRangeMin;
			return;
		}
		
		Z.endDelta = Math.abs(Z.isHori ? deltaX : deltaY);
    	var pos = jqTracker.offset();
    	if (Z.isHori) {
    		pos.left = x;
    	} else {
            pos.top = y;
    	}
    	jqTracker.offset(pos);
    },
    
    /**
     * @private
     */
    _splitterDragEnd: function (oldX, oldY, x, y, deltaX, deltaY){
    	var Z = this.parentNode.jslet,
    		jqTracker = jQuery(Z.splitterTracker),
    		jqSplitter = jQuery('#'+Z.draggingId),
			index = parseInt(jqSplitter.attr('jsletindex')),
			jqPanel = index < Z.floatIndex ? jqSplitter.prev(): jqSplitter.next(),
			expanded,
	   		jqFp = jQuery(Z.floatPanel);

		if (Z.isHori) {
			expanded = index < Z.floatIndex && deltaX >= 0 || index > Z.floatIndex && deltaX < 0;
		} else {
			expanded = index < Z.floatIndex && deltaY >= 0 || index > Z.floatIndex && deltaY < 0;
		}
		var delta = Z.endDelta * (expanded ? 1: -1);
		var newSize = Z.panels[index].size + delta;
		Z.panels[index].size = newSize;
		
		if (Z.isHori){
			jqPanel.width(newSize);
			jqFp.width(jqFp.width() - delta);
		}else{
			jqPanel.height(newSize);
			jqFp.height(jqFp.height() - delta);
		}
		if (Z.onSize) {
			Z.onSize.call(Z, index, newSize);
		}
		jslet.resizeEventBus.resize(Z.el);
    	jqTracker.hide();
    },
    
    /**
     * @private
     */
    _splitterDragCancel: function (oldX, oldY, x, y, deltaX, deltaY){
    	var Z = this.parentNode.jslet,
    		jqTracker = jQuery(Z.splitterTracker);
    	jqTracker.hide();
    },
    
    /**
     * Run when container size changed, it's revoked by jslet.resizeeventbus.
     * 
     */
    checkSizeChanged: function(){
    	var Z = this,
    		jqEl = jQuery(Z.el),
			currSize = Z.isHori ? jqEl.width() : jqEl.height();
        if ( Z._oldSize != currSize){
        	var delta = currSize - Z._oldSize;
        	Z._oldSize = currSize;
        	var oFp = Z.panels[Z.floatIndex],
        		jqFp = jQuery(Z.floatPanel),
        		newSize = delta + (Z.isHori ? jqFp.width(): jqFp.height());

        	if (newSize < oFp.minSize) {
        		newSize = oFp.minSize;
        	}
    		if (Z.isHori) {
    			jqFp.width(newSize);
    		} else {
    			jqFp.height(newSize);
    		}
        }
		jslet.resizeEventBus.resize(Z.floatPanel);
    },
    
	/**
	 * @override
	 */
    destroy: function($super){
    	var Z = this;
    	Z.splitterTracker = null;
		Z.floatPanel = null;
        var splitters = jqEl.find('.'+Z.splitterClsName);
        splitters.off('mousedown', Z._splitterMouseDown);
        var item;
        for(var i = 0, cnt = splitters.length; i < cnt; i++){
        	item = splitters[i];
        	jslet.ui.dnd.unbindControl(item);
        	item._doDragStart = null;
        	item._doDragging = null;
        	item._doDragEnd = null;
        	item._doDragCancel = null;
        }
        jslet.resizeEventBus.unsubscribe(Z);
    	$super();
    }
});

jslet.ui.register('SplitPanel', jslet.ui.SplitPanel);
jslet.ui.SplitPanel.htmlTemplate = '<div></div>';
