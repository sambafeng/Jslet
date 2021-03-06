/*
This file is part of Jslet framework

Copyright (c) 2013 Jslet Team

GNU General Public License(GPL 3.0) Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please visit: http://www.jslet.com/license.
*/

/**
 * Inner Class for DBTable and DBTreeView control
 */
jslet.ui.ListViewModel = function (dataset, isTree) {
    var dataset = dataset;
    var visibleCount = 0;
    var visibleStartRow = 0;
    var visibleEndRow = 0;
    var needShowRows = null;//Array of all rows that need show, all of these rows's status will be 'expanded'
    var allRows;//Array of all rows, include 'expanded' and 'collapsed' rows
    var isTree = isTree;// boolean, identify if it's tree model
    var currentRowno = 0;
    this.onTopRownoChanged = null; //Event handler: function(rowno){}
    this.onVisibleCountChanged = null; //Event handler: function(visibleRowCount){}
    this.onCurrentRownoChanged = null; //Event handler: function(rowno){}
    this.onNeedShowRowsCountChanged = null; //Event handler: function(needShowCount){}
	this.onCheckStateChanged = null;  //Event handler: function(){}
	
    this.fixedRows = 0;
    var initial = function () {
        if (!isTree) {
            return false;
        }
        var ds = dataset;
        if (!ds._parentField || !ds._keyField) {
            return false;
        }
        return true
    }
	initial();
	
    this.refreshModel = function (expandLevel) {
        if (!isTree) {
            return;
        }
        if(expandLevel === undefined) {
        	expandLevel = -1;
        }
        var ds = dataset, hiddenCnt = 0, recno, allCnt = ds.recordCount(), childCnt, result = [], pId;
        var context = ds.startSilenceMove();
        try {
            ds.recno(this.fixedRows);
            var level = 0, pnodes = [], node, pnode, tmpNode, currRec, state;
            while (!ds.isEof()) {
                recno = ds.recno();
				keyValue = ds.keyValue();
                level = 0;
				pnode = null;
				pId = ds.parentValue();
				for(var m = pnodes.length - 1; m>=0; m--) {
					tmpNode = pnodes[m];
					if (tmpNode.keyvalue == pId) {
						level = tmpNode.level + 1;
						pnode = tmpNode;
						break;
					}
				}
				if (pnode){
					for(var k = pnodes.length - 1; k > m; k--) {
						pnodes.pop();
					}
				}
				currRec = ds.getRecord();
				state = ds.selected();
				if (!state) {
					state = 0;
				}
				var expanded = true;
				if(expandLevel >= 0 && level <= expandLevel) {
					expanded = true;
				} else { 
					expanded = currRec._expanded_;
				}
                node = { parent: pnode, recno: recno, keyvalue: keyValue, expanded: expanded, state: state, isbold: 0, level: level };
				pnodes.push(node);
				
                if (pnode){
					if (!pnode.children) {
						pnode.children = [];
					}
					pnode.children.push(node);
					this._updateParentNodeBoldByChecked(node);
                } else {
                    result.push(node);
				}

                ds.next();
            } //end while
            allRows = result;
			this._setLastFlag(result);
            this._refreshNeedShowRows();
        } finally {
            ds.endSilenceMove(context);
        }
    }
	
	this._updateParentNodeBoldByChecked = function(node){
		if (!node.state || !node.parent) {
			return;
		}
		var pnode = node.parent;
		while(true){
			if (pnode.isbold) {
				return;
			}
			pnode.isbold = 1;
			pnode = pnode.parent;
			if (!pnode) {
				return;
			}
		}
	}

	this._updateParentNodeBoldByNotChecked = function(node){
		if (node.state || !node.parent) {
			return;
		}
		var pnode = node.parent, cnode;
		while(true){
			if (pnode.children){
				for(var i = 0, cnt = pnode.children.length; i < cnt; i++){
					cnode = pnode.children[i];
					if (cnode.state) {
						return;
					}
				}
				pnode.isbold = 0;
			}
			pnode = pnode.parent;
			if (!pnode) {
				return;
			}
		}
	}
	
    this._setLastFlag = function (nodes) {
		if (!nodes || nodes.length == 0) {
			return;
		}
        var node;
		nodes[nodes.length - 1].islast = true;
        for (var i = 0, cnt = nodes.length; i < cnt; i++) {
            node = nodes[i];
           if (node.children && node.children.length > 0) {
               this._setLastFlag(node.children);
           }
        }
        return null;
    }

    this._refreshNeedShowRows = function (notFireChangedEvent) {
        if (!isTree) {
            return;
        }
        var result = [], node;
        if (!allRows) {
            this.refreshModel();
            return;
        }
		var preCnt = needShowRows ? needShowRows.length: 0;
        needShowRows = [];
        this._findVisibleNode(allRows);
		var currCnt = needShowRows.length;
		if (!notFireChangedEvent && this.onNeedShowRowsCountChanged){
			this.onNeedShowRowsCountChanged(currCnt);
		}
    }

    this.hasChildren = function (recno) {
        if (!isTree) {
            return false;
        }
        if (!recno) {
            recno = dataset.recno();
        }
        var node = this._innerFindNode(allRows, recno);
        if (node == null) {
            return;
        }
        return node.children && node.children.length > 0;
    }

    this.getLevel = function (recno) {
        if (!isTree) {
            return false;
        }
        if (!recno) {
            recno = dataset.recno();
        }
        var node = this._innerFindNode(allRows, recno);
        if (node == null) {
            return;
        }
        return node.level;
    }

    this._findVisibleNode = function (nodes) {
		if (!nodes) {
			return;
		}
        var node;
        for (var i = 0, cnt = nodes.length; i < cnt; i++) {
            node = nodes[i];
            needShowRows.push(node);
            if (node.expanded){
                this._findVisibleNode(node.children);
            }
        }
    }

    this.rownoToRecno = function (rowno) {
        if (!isTree) {
            return rowno + this.fixedRows;
        }
        if (rowno < 0) {
            rowno = rowno + this.fixedRows;
            return rowno >= 0 ? rowno : -1;
        }
        if (rowno >= needShowRows.length) {
            return -1;
        }
        return needShowRows[rowno].recno;
    }

    this.recnoToRowno = function (recno) {
        if (!isTree) {
            return recno - this.fixedRows;
        }
		for(var i = 0, cnt = needShowRows.length; i < cnt; i++){
			if (needShowRows[i].recno == recno) {
				return i;
			}
		}
        return -1;
    }

    this.setVisibleStartRow = function (rowno, notFireEvt) {
        if (rowno < 0) {
            rowno = 0;
        } else {
            var maxVisibleNo = this.getNeedShowRowCount() - visibleCount;
            if (rowno > maxVisibleNo) {
                rowno = maxVisibleNo;
            }
        }
        if (visibleStartRow == rowno) {
            return;
        }
        visibleStartRow = rowno;
        visibleEndRow = rowno + visibleCount - 1;
        if (!notFireEvt && this.onTopRownoChanged) {
            this.onTopRownoChanged(rowno);
        }
    }

    this.getVisibleStartRow = function () {
        return visibleStartRow;
    }

    this.setVisibleEndRow = function(endRow){
    	visibleEndRow = endRow;
    }
    
    this.getVisibleEndRow = function(){
    	return visibleEndRow;
    }
    
    this.setVisibleCount = function (count, notFireEvt) {
        if (visibleCount == count)
            return;
        visibleCount = count;
        visibleEndRow = visibleStartRow + count - 1;
        if (!notFireEvt && this.onVisibleCountChanged)
            this.onVisibleCountChanged(count)
    }

    this.getVisibleCount = function () {
        return visibleCount;
    }

    this.getNeedShowRowCount = function () {
        if (!isTree)
            return dataset.recordCount()- this.fixedRows;

        return needShowRows.length;
    }

	this.getCurrentRow = function(){
		return needShowRows[currentRowno];
	}
	
    this.setCurrentRowno = function (rowno, notFireEvt, checkVisible) {
//    	if (currentRowno == rowno)
//    		return needShowRows ? needShowRows[rowno]: null;
    	if(rowno === undefined) {
    		return null;
    	}
        var preRowno = currentRowno, recno = 0, currRow=null;
    	if (rowno < 0){//In the fixed row area
            var lowestRowno = -1 * this.fixedRows;
            if (rowno < lowestRowno) {
                rowno = lowestRowno;
            }
            recno = this.fixedRows + rowno;
    	} else {
            var maxRow = this.getNeedShowRowCount();
            if(maxRow == 0) {
            	return null;
            }
            if (rowno >= maxRow) {
                rowno = maxRow - 1;
            }
            if (!isTree) {
                recno = rowno + this.fixedRows;
            } else {
				currRow = needShowRows[rowno];
				recno = currRow.recno;
			}
            if (checkVisible) {
                if (rowno >= 0 && rowno < visibleStartRow){
                    this.setVisibleStartRow(rowno);
                } else {
                    if (rowno >= visibleStartRow + visibleCount) {
                        this.setVisibleStartRow(rowno - visibleCount + 1);
                    }
                }
            }
        }
        currentRowno = rowno;
        if (recno >= 0){
			dataset.recno(recno);
            if (dataset._isAborted) {
            	return null;
            }
        }
        if (!notFireEvt && this.onCurrentRownoChanged) {
            this.onCurrentRownoChanged(preRowno, currentRowno);
        }
		return currRow;
    }

    this.getCurrentRowno = function () {
        return currentRowno;
    }

    this.nextRow = function () {
        this.setCurrentRowno(currentRowno + 1, false, true);
    }

    this.priorRow = function (num) {
        this.setCurrentRowno(currentRowno - 1, false, true);
    }

    this.nextPage = function () {
        this.setVisibleStartRow(visibleStartRow + visibleCount);
        this.setCurrentRowno(visibleStartRow);
    }

    this.priorPage = function () {
        this.setVisibleStartRow(visibleStartRow - visibleCount);
        this.setCurrentRowno(visibleStartRow);
    }

    this._innerFindNode = function (nodes, recno) {
        var node, nextNode;
        for (var i = 0, cnt = nodes.length - 1; i <= cnt; i++) {
            node = nodes[i];
            if (node.recno == recno) {
                return node;
            }
            if (node.children) {
                var result = this._innerFindNode(node.children, recno);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    this.expand = function (callbackFn) {
        if (!isTree) {
            return;
        }
        var node = this._innerFindNode(allRows, dataset.recno());
        if (node == null) {
            return;
        }
        var context = dataset.startSilenceMove();
        try {
            node.expanded = node.children ? true : false;
            dataset.recno(node.recno);
            dataset.getRecord()._expanded_ = node.expanded;
            var p = node;
            while (true) {
                p = p.parent;
                if (!p) {
                    break;
                }
                if (!p.expanded) {
                    dataset.recno(p.recno);
                    dataset.getRecord()._expanded_ = true;
                    p.expanded = true;
                }
            }
        } finally {
            dataset.endSilenceMove(context)
        }
        this._refreshNeedShowRows();
        if (callbackFn) {
            callbackFn();
        }
    }

    this.collapse = function (callbackFn) {
        if (!isTree) {
            return;
        }
        var node = this._innerFindNode(allRows, dataset.recno());
        if (node == null) {
            return;
        }
        var context = dataset.startSilenceMove();
        try {
            dataset.recno(node.recno);
            dataset.getRecord()._expanded_ = false;
            node.expanded = false;
        } finally {
            dataset.endSilenceMove(context);
        }

        this._refreshNeedShowRows();
        if (callbackFn) {
            callbackFn();
        }
    }

    this._iterateNode = function (nodes, callbackFn) {
        var node;
        for (var i = 0, cnt = nodes.length; i < cnt; i++) {
            node = nodes[i];
            if (node.children) {
                if (callbackFn) {
                    callbackFn(node);
                }
                if (node.children && node.children.length > 0) {
                    this._iterateNode(node.children, callbackFn);
                }
            }
        }
        return null
    }

    this._callbackFn = function (node, state) {
        var context = dataset.startSilenceMove();
        try {
            dataset.recno(node.recno);
            dataset.getRecord()._expanded_ = state;
            node.expanded = state
        } finally {
            dataset.endSilenceMove(context)
        }
    }

    this.expandAll = function (callbackFn) {
        if (!isTree) {
            return;
        }
        
        var Z = this;
        Z._iterateNode(allRows, function (node) { Z._callbackFn(node, true) });
        Z._refreshNeedShowRows();
        if (callbackFn) {
            callbackFn();
        }
    }

    this.collapseAll = function (callbackFn) {
        if (!isTree) {
        	return;
        }
        var Z = this;
        Z._iterateNode(allRows, function (node) { Z._callbackFn(node, false) });
        Z._refreshNeedShowRows();
        if (callbackFn) {
            callbackFn();
        }
    }
	
	this.syncDataset = function(){
		var recno = dataset.recno();
		if(recno < 0) {
			return;
		}
		var node = this._innerFindNode(allRows, dataset.recno()),
			pnode = node.parent;
		if (pnode && !pnode.expanded){
			while(true){
				if (!pnode.expanded) {
					pnode.expanded = true;
				} else {
						break;
				}
				pnode = pnode.parent;
				if (!pnode) {
					break;
				}
			}
		}
		this._refreshNeedShowRows();
		var rowno = this.recnoToRowno(recno);
		this.setCurrentRowno(rowno, false, true);
	}
	
	this.checkNode = function(state, relativeCheck){
		var node = this.getCurrentRow();
//		if (node.state == state) {
//			return;
//		}
		node.state = state ? 1 : 0;
		dataset.selected(node.state);

		if (relativeCheck){
			if (node.children && node.children.length > 0) {
				this._updateChildState(node, state);
			}
			if (node.parent) {
				this._updateParentState(node, state);
			}
		}

		if (state) {
			this._updateParentNodeBoldByChecked(node);
		} else {
			this._updateParentNodeBoldByNotChecked(node);
		}
		
		if (this.onCheckStateChanged) {
			this.onCheckStateChanged();
		}
	}
	
	this._updateChildState = function(node, state){
		var b = dataset.startSilenceMove(),
			childNode;
		try{
			for(var i = 0, cnt = node.children.length; i < cnt; i++){
				childNode = node.children[i];
				childNode.state = state;
				dataset.recno(childNode.recno);
				dataset.selected(state);
				if (childNode.children && childNode.children.length > 0) {
					this._updateChildState(childNode, state);
				}
			}
		} finally {
			dataset.endSilenceMove(b);
		}
	}
	
	this._updateParentState = function(node, state){
		var pNode = node.parent;
		if (!pNode) {
			return;
		}
		var childNode, newState;
		if (state != 2){
			for(var i = 0, cnt = pNode.children.length; i < cnt; i++){
				childNode = pNode.children[i];
				if (childNode.state == 2){
					newState = 2;
					break;
				}
				if (i == 0){
					newState = childNode.state;
				} else if (newState != childNode.state){
						newState =2;
						break;
				}
				
			}//end for
		} else {
			newState = state;
		}
		if (pNode.state != newState){
			pNode.state = newState;
			var b = dataset.startSilenceMove();
			try{
				dataset.recno(pNode.recno);
				dataset.selected(newState);
			}finally{
				dataset.endSilenceMove(b);
			}
		}
		this._updateParentState(pNode, newState);
	}
	
	this.destroy = function(){
		dataset = null;
		allRows = null;
	
		this.onTopRownoChanged = null;
		this.onVisibleCountChanged = null;
		this.onCurrentRownoChanged = null;
		this.onNeedShowRowsCountChanged = null;
		this.onCheckStateChanged = null;
	}
}
