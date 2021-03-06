/*
This file is part of Jslet framework

Copyright (c) 2013 Jslet Team

GNU General Public License(GPL 3.0) Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please visit: http://www.jslet.com/license.
*/

/**
 * Jslet Loader
 */
if (window.jslet === undefined || jslet === undefined){
    jslet=window.jslet = function(id){
    	var ele = jQuery(id)[0];
    	return (ele && ele.jslet)? ele.jslet: null;
    };
}

/////////////////////////////////////////////////////////////
//jslet module configuration 
/////////////////////////////////////////////////////////////

//Debug configuration begin
jslet._initialModules = [
//css
     { name: 'jslet-style', src: '../src/resources/{theme}/jslet-style.css', baseOnLoader: true },
     { name: 'jslet-container', src: '../src/resources/{theme}/jslet-container.css', baseOnLoader: true },
     { name: 'jslet-calendar', src: '../src/resources/{theme}/jslet-calendar.css', baseOnLoader: true },
     { name: 'jslet-window', src: '../src/resources/{theme}/jslet-window.css', baseOnLoader: true },
     { name: 'jslet-menu', src: '../src/resources/{theme}/jslet-menu.css', baseOnLoader: true },
     { name: 'jslet-treeview', src: '../src/resources/{theme}/jslet-treeview.css', baseOnLoader: true },
     { name: 'jslet-table', src: '../src/resources/{theme}/jslet-table.css', baseOnLoader: true },
   //js-lib
     {name: 'jquery', src: '../src/lib/jquery-1.8.3.min.js', baseOnLoader: true },
     {name: 'jsonlib', src: '../src/lib/jquery.json-2.3.js', baseOnLoader: true },

   //Core
     { name: 'root', src: '../src/jslet.root.js', baseOnLoader: true },
     { name: 'common', src: '../src/core/jslet.common.js', deps: 'jquery', baseOnLoader: true },
     { name: 'class', src: '../src/core/jslet.class.js', deps: 'common', baseOnLoader: true },
     { name: 'cookie', src: '../src/core/jslet.cookie.js', deps: 'jquery', baseOnLoader: true },
     { name: 'resizeeventbus', src: '../src/core/jslet.resizeeventbus.js', deps: 'common', baseOnLoader: true },
     
     { name: 'core', deps: 'common,class,cookie,resizeeventbus,locale', baseOnLoader: true },
     
//message for i18n
    { name: 'locale', src: '../src/locale/{lang}/locale.js', deps: 'common', baseOnLoader: true },

//data
    { name: 'provider', src: '../src/data/jslet.provider.js', deps: 'core,jsonlib', baseOnLoader: true },
    { name: 'datacommon', src: '../src/data/jslet.datacommon.js', deps: 'core', baseOnLoader: true },
    { name: 'field', src: '../src/data/jslet.field.js', deps: 'datacommon', baseOnLoader: true },
    { name: 'dataset', src: '../src/data/jslet.dataset.js', deps: 'datacommon', baseOnLoader: true },
    { name: 'contextrule', src: '../src/data/jslet.contextrule.js', deps: 'core', baseOnLoader: true },
    
    { name: 'data', deps: 'provider,datacommon,dataset,field,contextrule', baseOnLoader: true },
    
//ui
    { name: 'basecontrol', src: '../src/ui/jslet.control.js', deps: 'class', baseOnLoader: true },
    { name: 'dnd', src: '../src/ui/jslet.dnd.js', deps: 'common', baseOnLoader: true },
    { name: 'editmask', src: '../src/ui/jslet.editmask.js', deps: 'common', baseOnLoader: true },
    { name: 'uicommon', src: '../src/ui/jslet.uicommon.js', deps: 'control,jslet-style', baseOnLoader: true },

    { name: 'uicore', deps: 'basecontrol,dnd,editmask,uicommon', baseOnLoader: true },

//control
    { name: 'overlaypanel', src: '../src/ui/control/jslet.overlaypanel.js', deps: 'uicore', baseOnLoader: true },
    { name: 'waitingbox', src: '../src/ui/control/jslet.waitingbox.js', deps: 'uicore,jslet-container,jslet-calendar', baseOnLoader: true },
    { name: 'calendar', src: '../src/ui/control/jslet.calendar.js', deps: 'uicore,jslet-calendar', baseOnLoader: true },
    { name: 'fieldset', src: '../src/ui/control/jslet.fieldset.js', deps: 'uicore', baseOnLoader: true },
    { name: 'tippanel', src: '../src/ui/control/jslet.tippanel.js', deps: 'uicore', baseOnLoader: true },
    { name: 'window', src: '../src/ui/control/jslet.window.js', deps: 'uicore,jslet-window', baseOnLoader: true },
    { name: 'accordion', src: '../src/ui/control/jslet.accordion.js', deps: 'uicore,jslet-container', baseOnLoader: true },
    { name: 'tabcontrol', src: '../src/ui/control/jslet.tabcontrol.js', deps: 'uicore,jslet-container', baseOnLoader: true },
    { name: 'splitpanel', src: '../src/ui/control/jslet.splitpanel.js', deps: 'uicore,jslet-container', baseOnLoader: true },
    { name: 'menu', src: '../src/ui/control/jslet.menu.js', deps: 'uicore,jslet-menu', baseOnLoader: true },
    
    { name: 'uicontrols', deps: 'overlaypanel,waitingbox,calendar,fieldset,tippanel,window,accordion,tabcontrol,splitpanel,menu', baseOnLoader: true },
//dbcontrol    
    { name: 'dbautocomplete', src: '../src/ui/dbcontrol/form/jslet.dbautocomplete.js', deps: 'dbtable', baseOnLoader: true },
    { name: 'dbbetweenedit', src: '../src/ui/dbcontrol/form/jslet.dbbetweenedit.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbcheckbox', src: '../src/ui/dbcontrol/form/jslet.dbcheckbox.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbcustomcombobox', src: '../src/ui/dbcontrol/form/jslet.dbcustomcombobox.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbcomboselect', src: '../src/ui/dbcontrol/form/jslet.dbcomboselect.js', deps: 'dbcustomcombobox,dbtable,dbtreeview', baseOnLoader: true },
    { name: 'dbdatepicker', src: '../src/ui/dbcontrol/form/jslet.dbdatepicker.js', deps: 'dbcustomcombobox,calendar', baseOnLoader: true },
    { name: 'dbtimepicker', src: '../src/ui/dbcontrol/form/jslet.dbtimepicker.js', deps: 'uicore', baseOnLoader: true },
    { name: 'dbdatalabel', src: '../src/ui/dbcontrol/form/jslet.dbdatalabel.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbhtml', src: '../src/ui/dbcontrol/form/jslet.dbhtml.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbimage', src: '../src/ui/dbcontrol/form/jslet.dbimage.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dblabel', src: '../src/ui/dbcontrol/form/jslet.dblabel.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dblookuplabel', src: '../src/ui/dbcontrol/form/jslet.dblookuplabel.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbcheckboxgroup', src: '../src/ui/dbcontrol/form/jslet.dbcheckboxgroup.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbradiogroup', src: '../src/ui/dbcontrol/form/jslet.dbradiogroup.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbrangeselect', src: '../src/ui/dbcontrol/form/jslet.dbrangeselect.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbrating', src: '../src/ui/dbcontrol/form/jslet.dbrating.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbselect', src: '../src/ui/dbcontrol/form/jslet.dbselect.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbspinedit', src: '../src/ui/dbcontrol/form/jslet.dbspinedit.js', deps: 'dbtext', baseOnLoader: true },
    { name: 'dbtext', src: '../src/ui/dbcontrol/form/jslet.dbtext.js', deps: 'data,uicore', baseOnLoader: true },
    
    { name: 'formcontrols', deps: 'dbautocomplete,dbbetweenedit,dbcheckbox,dbcheckboxgroup,dbcomboselect,dbdatepicker,dbtimepicker,dbdatalabel,dbhtml,dbimage,dblabel,dblookuplabel,dbradiogroup,dbrangeselect,dbrating,dbselect,dbspinedit,dbtext', baseOnLoader: true },
    
    { name: 'listviewmodel', src: '../src/ui/dbcontrol/jslet.listviewmodel.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbtable', src: '../src/ui/dbcontrol/jslet.dbtable.js', deps: 'jslet-table,listviewmodel', baseOnLoader: true },
    { name: 'dbinspector', src: '../src/ui/dbcontrol/jslet.dbinspector.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbtreeview', src: '../src/ui/dbcontrol/jslet.dbtreeview.js', deps: 'jslet-treeview,listviewmodel', baseOnLoader: true },
    { name: 'dbeditpanel', src: '../src/ui/dbcontrol/jslet.dbeditpanel.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'dbpagebar', src: '../src/ui/dbcontrol/jslet.dbpagebar.js', deps: 'data,uicore', baseOnLoader: true },
    { name: 'swfobject', src: '../src/lib/swfobject.js', baseOnLoader: true },
    { name: 'dbchart', src: '../src/ui/dbcontrol/jslet.dbchart.js', deps: 'data,uicore,swfobject', baseOnLoader: true },

    { name: 'dbcontrols', deps: 'formcontrols,dbtable,dbtreeview,dbeditpanel,dbinspector,dbpagebar,dbchart', baseOnLoader: true },
    
    { name: 'jslet', deps: 'core,uicontrols,data,dbcontrols,root', baseOnLoader: true }
];
//Debug configuration end
/////////////////////////////////////////////////////////////////
//End jslet module configuration 
/////////////////////////////////////////////////////////////////


//default theme and lang,used for css and message text
jslet._theme = 'default';
jslet._lang = 'zh-cn';


if (!jslet.loaderUri) {
    var ohead = document.getElementsByTagName('head')[0], 
    	uri = ohead.lastChild.src;
    uri = uri.substring(0, uri.lastIndexOf('/')	+ 1);
    jslet.loaderUri = uri;
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    }
}

jslet.ModuleManager = function () {
    var _modules = [];

    var _sortfunc = function (mod1, mod2) {
        return mod1.level - mod2.level;
    }

    var _checkModule = function (omod) {
        var src = omod.src;
        if (src) {
            omod.isCss = src.slice(-4).toLowerCase() == '.css';
            omod.isTheme = (src.indexOf('{theme}') >= 0);
            omod.isI18n = (src.indexOf('{lang}') >= 0);
        }
    };


    this.define = function (name, src, deps, baseOnLoader) {
        var omod;
        if (name && Object.prototype.toString.apply(name) === '[object Array]') {
            var initialModules = name, len = initialModules.length;
            for (var i = 0; i < len; i++) {
                omod = initialModules[i];
                _checkModule(omod);
                _modules[_modules.length] = omod;
            }
        }
        else {
            omod = { 'name': name.toLowerCase().trim(), 'deps': deps, 'src': src.trim(), 'baseOnLoader': baseOnLoader ? true : false };
            _checkModule(omod);
            _modules[_modules.length] = omod;
        }
    }

    this.require = function (moduleNames, callbackFn) {
        if (typeof (moduleNames) == 'string') {
            moduleNames = moduleNames.split(',');
        }
        jslet.ModuleManager._runingCount = 0;
        var uniqueModules = [];
        this._getModuleWithChild(moduleNames, uniqueModules, 0);
        uniqueModules.sort(_sortfunc);

        this._loadCss(uniqueModules);

        this._loadScripts(uniqueModules, -99, callbackFn, jslet._lang);
    }

    var self = this;

    this._loadScripts = function (uniqueModules, level, complete, currLang) {
        var len = uniqueModules.length - 1, module, loadingModules = [];
        for (var i = len; i >= 0; i--) {
            module = uniqueModules[i];
            if (module.isCss) {
                continue;
            }
            if (level == -99) {
                level = module.level;
            }

            if (level < module.level) {
                continue;
            }
            if (level > module.level) {
                break;
            }
            var src = module.src;
            if (src) {
                if (module.isI18n) {
                    src = src.replace(/{lang}/g, currLang);
                }
                loadingModules.push(module.baseOnLoader ? jslet.loaderUri + src : src);
            }
        }

        if (loadingModules.length == 0) {
            level--;
            if (level >= 0) {
                self._loadScripts(uniqueModules, level, complete);
            } else {
                if (complete) {
                    complete();
                }
                jslet.ui.install();
            }
        } else {
            //            window.ensure({ 'js': loadingModules }, function () {
            //                level--;
            //                if (level >= 0)
            //                    _loadScripts(uniqueModules, level, complete);
            //                else
            //                    if (complete)
            //                        complete();
            //            });

            this._innerloadjs(loadingModules, function () {
                level--;
                if (level >= 0) {
                    self._loadScripts(uniqueModules, level, complete, currLang);
                } else {
                    if (complete) {
                        complete();
                    }
                    jslet.ui.install();
                }
            })
        }
    }
    this.getHead = function () {
        return document.getElementsByTagName('head')[0] || document.documentElement;
    }

    function DownCounter(size, callback) {
        var counter = size,
        	fcallback = callback;

        this.down = function () {
            counter--;
            if (counter == 0) {
                window.setTimeout(callback, 5);
            }
        }
    }

    this._innerloadjs = function (jsfiles, callback) {
        var counter = new DownCounter(jsfiles.length, callback), 
        	url, 
        	scriptTag,
        	ohead = this.getHead();
        for (var i = 0, len = jsfiles.length; i < len; i++) {
            url = jsfiles[i];
            scriptTag = document.createElement('script');
            scriptTag.setAttribute('type', 'text/javascript');
            scriptTag.setAttribute('src', url);
            scriptTag.onload = scriptTag.onreadystatechange = function () {
                if ((!this.readyState ||
					  this.readyState == 'loaded' || 
					  this.readyState == 'complete')) {
                    counter.down();
                }
            };
            scriptTag.onerror = function () {
                counter.down();
            };
            ohead.appendChild(scriptTag);
        }
    }

    this._loadCss = function (uniqueModules) {
        var ohead = this.getHead(), len = uniqueModules.length - 1, ocss;
        for (var i = len; i >= 0; i--) {
            module = uniqueModules[i];
            if (module.isCss) {
                ocss = document.createElement('link');
                ocss.type = 'text/css';
                ocss.rel = 'stylesheet';
                var src = module.src;
                if (module.isTheme) {
                    src = src.replace(/{theme}/g, jslet._theme);
                }
                ocss.href = module.baseOnLoader ? jslet.loaderUri + src : src;
                ohead.appendChild(ocss);
            }
        }
    }

    this._getModuleWithChild = function (moduleNames, uniqueModules, level) {
        if (typeof (moduleNames) == 'string')
            moduleNames = moduleNames.split(',');
        jslet.ModuleManager._runingCount++;
        if (jslet.ModuleManager._runingCount > 20000) {
            throw new Error('Cycle reference in module configuration!');
        }
        var len = moduleNames.length, m, name, um, omod, cnt;
        for (var i = 0; i < len; i++) {
            name = moduleNames[i].trim();
            omod = this._findModule(name);
            if (!omod) {
                continue;
            }
            um = null;
            cnt = uniqueModules.length;
            for (var j = 0; j < cnt; j++) {
                if (uniqueModules[j].name == name) {
                    um = uniqueModules[j];
                    break;
                }
            }
            if (um == null) {
                omod.level = omod.isCss ? 0 : level;
                uniqueModules.push(omod);
            } else {
                if (um.level < level && !omod.isCss) {
                    um.level = level;
                }
            }
            if (omod.deps && omod.deps.length > 0) {
                this._getModuleWithChild(omod.deps, uniqueModules, level + 1);
            }
        }
    }

    this._findModule = function (name) {
        var len = _modules.length;
        for (var i = 0; i < len; i++) {
            m = _modules[i];
            if (m.name == name.toLowerCase()) {
                return m;
            }
        }
        return null;
    }
}

jslet.getCookie = function( name ) {
      var start = document.cookie.indexOf( name + '=' ),
      	  len = start + name.length + 1;
      
      if ((!start) && (name != document.cookie.substring(0, name.length))) {
        return null;
      }
      if (start == -1) {
    	  return null;
      }
      var end = document.cookie.indexOf(';', len);
      if (end == -1) {
    	  end = document.cookie.length;
      }
      return unescape(document.cookie.substring(len, end));
}

jslet.setCookie = function(name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + '=' + escape(value) +
	    ((expires) ? ';expires=' + expires_date.toGMTString() : '') + //expires.toGMTString()
	    ((path) ? ';path=' + path : '') +
	    ((domain) ? ';domain=' + domain : '') +
	    ((secure) ? ';secure' : '');
}

jslet.module = new jslet.ModuleManager();

jslet.define = function (name, src, deps, baseOnLoader) {
	if(deps === undefined) {
		deps = "jslet";
	}
    jslet.module.define(name, src, deps, baseOnLoader);
}

jslet.require = function (moduleNames, callbackFn) {
    jslet.module.require(moduleNames, callbackFn);
};

jslet.setTheme = function (theme, saveToCookie) {
    if (theme){
        jslet._theme = theme.trim();
        if(saveToCookie) {
        	jslet.setCookie('jslet.theme', jslet._theme);
        }
    }
}

jslet.setLang = function (lang, saveToCookie) {
    if (lang){
        jslet._lang = lang.trim();
        if(saveToCookie) {
        	jslet.setCookie('jslet.lang', jslet._lang);
        }
    }
};

(function () {
    jslet.module.define(jslet._initialModules);
    jslet._initialModules = null;
    delete jslet._initialModules;

    var lang = jslet.getCookie('jslet.lang');
    if (lang) {
        jslet._lang = lang;
    }
    var theme = jslet.getCookie('jslet.theme');
    if (theme) {
        jslet._theme = theme;
    }
})();
