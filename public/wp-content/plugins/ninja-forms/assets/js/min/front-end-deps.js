/*!
* Includes BabySitter
* https://github.com/marionettejs/backbone.babysitter/
*
* Includes Wreqr
* https://github.com/marionettejs/backbone.wreqr/
*/
(function(t, e) {
    if ("function" == typeof define && define.amd)
        define(["backbone", "underscore"], function(i, n) {
            return t.Marionette = t.Mn = e(t, i, n)
        });
    else if ("undefined" != typeof exports) {
        var i = require("backbone")
          , n = require("underscore");
        module.exports = e(t, i, n)
    } else
        t.Marionette = t.Mn = e(t, t.Backbone, t._)
}
)(this, function(t, e, i) {
    "use strict";
    (function(t, e) {
        var i = t.ChildViewContainer;
        return t.ChildViewContainer = function(t, e) {
            var i = function(t) {
                this._views = {},
                this._indexByModel = {},
                this._indexByCustom = {},
                this._updateLength(),
                e.each(t, this.add, this)
            };
            e.extend(i.prototype, {
                add: function(t, e) {
                    var i = t.cid;
                    return this._views[i] = t,
                    t.model && (this._indexByModel[t.model.cid] = i),
                    e && (this._indexByCustom[e] = i),
                    this._updateLength(),
                    this
                },
                findByModel: function(t) {
                    return this.findByModelCid(t.cid)
                },
                findByModelCid: function(t) {
                    var e = this._indexByModel[t];
                    return this.findByCid(e)
                },
                findByCustom: function(t) {
                    var e = this._indexByCustom[t];
                    return this.findByCid(e)
                },
                findByIndex: function(t) {
                    return e.values(this._views)[t]
                },
                findByCid: function(t) {
                    return this._views[t]
                },
                remove: function(t) {
                    var i = t.cid;
                    return t.model && delete this._indexByModel[t.model.cid],
                    e.any(this._indexByCustom, function(t, e) {
                        return t === i ? (delete this._indexByCustom[e],
                        !0) : void 0
                    }, this),
                    delete this._views[i],
                    this._updateLength(),
                    this
                },
                call: function(t) {
                    this.apply(t, e.tail(arguments))
                },
                apply: function(t, i) {
                    e.each(this._views, function(n) {
                        e.isFunction(n[t]) && n[t].apply(n, i || [])
                    })
                },
                _updateLength: function() {
                    this.length = e.size(this._views)
                }
            });
            var n = ["forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck", "reduce"];
            return e.each(n, function(t) {
                i.prototype[t] = function() {
                    var i = e.values(this._views)
                      , n = [i].concat(e.toArray(arguments));
                    return e[t].apply(e, n)
                }
            }),
            i
        }(t, e),
        t.ChildViewContainer.VERSION = "0.1.7",
        t.ChildViewContainer.noConflict = function() {
            return t.ChildViewContainer = i,
            this
        }
        ,
        t.ChildViewContainer
    }
    )(e, i),
    function(t, e) {
        var i = t.Wreqr
          , n = t.Wreqr = {};
        return t.Wreqr.VERSION = "1.3.3",
        t.Wreqr.noConflict = function() {
            return t.Wreqr = i,
            this
        }
        ,
        n.Handlers = function(t, e) {
            var i = function(t) {
                this.options = t,
                this._wreqrHandlers = {},
                e.isFunction(this.initialize) && this.initialize(t)
            };
            return i.extend = t.Model.extend,
            e.extend(i.prototype, t.Events, {
                setHandlers: function(t) {
                    e.each(t, function(t, i) {
                        var n = null;
                        e.isObject(t) && !e.isFunction(t) && (n = t.context,
                        t = t.callback),
                        this.setHandler(i, t, n)
                    }, this)
                },
                setHandler: function(t, e, i) {
                    var n = {
                        callback: e,
                        context: i
                    };
                    this._wreqrHandlers[t] = n,
                    this.trigger("handler:add", t, e, i)
                },
                hasHandler: function(t) {
                    return !!this._wreqrHandlers[t]
                },
                getHandler: function(t) {
                    var e = this._wreqrHandlers[t];
                    if (e)
                        return function() {
                            return e.callback.apply(e.context, arguments)
                        }
                },
                removeHandler: function(t) {
                    delete this._wreqrHandlers[t]
                },
                removeAllHandlers: function() {
                    this._wreqrHandlers = {}
                }
            }),
            i
        }(t, e),
        n.CommandStorage = function() {
            var i = function(t) {
                this.options = t,
                this._commands = {},
                e.isFunction(this.initialize) && this.initialize(t)
            };
            return e.extend(i.prototype, t.Events, {
                getCommands: function(t) {
                    var e = this._commands[t];
                    return e || (e = {
                        command: t,
                        instances: []
                    },
                    this._commands[t] = e),
                    e
                },
                addCommand: function(t, e) {
                    var i = this.getCommands(t);
                    i.instances.push(e)
                },
                clearCommands: function(t) {
                    var e = this.getCommands(t);
                    e.instances = []
                }
            }),
            i
        }(),
        n.Commands = function(t, e) {
            return t.Handlers.extend({
                storageType: t.CommandStorage,
                constructor: function(e) {
                    this.options = e || {},
                    this._initializeStorage(this.options),
                    this.on("handler:add", this._executeCommands, this),
                    t.Handlers.prototype.constructor.apply(this, arguments)
                },
                execute: function(t) {
                    t = arguments[0];
                    var i = e.rest(arguments);
                    this.hasHandler(t) ? this.getHandler(t).apply(this, i) : this.storage.addCommand(t, i)
                },
                _executeCommands: function(t, i, n) {
                    var r = this.storage.getCommands(t);
                    e.each(r.instances, function(t) {
                        i.apply(n, t)
                    }),
                    this.storage.clearCommands(t)
                },
                _initializeStorage: function(t) {
                    var i, n = t.storageType || this.storageType;
                    i = e.isFunction(n) ? new n : n,
                    this.storage = i
                }
            })
        }(n, e),
        n.RequestResponse = function(t, e) {
            return t.Handlers.extend({
                request: function(t) {
                    return this.hasHandler(t) ? this.getHandler(t).apply(this, e.rest(arguments)) : void 0
                }
            })
        }(n, e),
        n.EventAggregator = function(t, e) {
            var i = function() {};
            return i.extend = t.Model.extend,
            e.extend(i.prototype, t.Events),
            i
        }(t, e),
        n.Channel = function() {
            var i = function(e) {
                this.vent = new t.Wreqr.EventAggregator,
                this.reqres = new t.Wreqr.RequestResponse,
                this.commands = new t.Wreqr.Commands,
                this.channelName = e
            };
            return e.extend(i.prototype, {
                reset: function() {
                    return this.vent.off(),
                    this.vent.stopListening(),
                    this.reqres.removeAllHandlers(),
                    this.commands.removeAllHandlers(),
                    this
                },
                connectEvents: function(t, e) {
                    return this._connect("vent", t, e),
                    this
                },
                connectCommands: function(t, e) {
                    return this._connect("commands", t, e),
                    this
                },
                connectRequests: function(t, e) {
                    return this._connect("reqres", t, e),
                    this
                },
                _connect: function(t, i, n) {
                    if (i) {
                        n = n || this;
                        var r = "vent" === t ? "on" : "setHandler";
                        e.each(i, function(i, s) {
                            this[t][r](s, e.bind(i, n))
                        }, this)
                    }
                }
            }),
            i
        }(n),
        n.radio = function(t, e) {
            var i = function() {
                this._channels = {},
                this.vent = {},
                this.commands = {},
                this.reqres = {},
                this._proxyMethods()
            };
            e.extend(i.prototype, {
                channel: function(t) {
                    if (!t)
                        throw Error("Channel must receive a name");
                    return this._getChannel(t)
                },
                _getChannel: function(e) {
                    var i = this._channels[e];
                    return i || (i = new t.Channel(e),
                    this._channels[e] = i),
                    i
                },
                _proxyMethods: function() {
                    e.each(["vent", "commands", "reqres"], function(t) {
                        e.each(n[t], function(e) {
                            this[t][e] = r(this, t, e)
                        }, this)
                    }, this)
                }
            });
            var n = {
                vent: ["on", "off", "trigger", "once", "stopListening", "listenTo", "listenToOnce"],
                commands: ["execute", "setHandler", "setHandlers", "removeHandler", "removeAllHandlers"],
                reqres: ["request", "setHandler", "setHandlers", "removeHandler", "removeAllHandlers"]
            }
              , r = function(t, i, n) {
                return function(r) {
                    var s = t._getChannel(r)[i];
                    return s[n].apply(s, e.rest(arguments))
                }
            };
            return new i
        }(n, e),
        t.Wreqr
    }(e, i);
    var n = t.Marionette
      , r = t.Mn
      , s = e.Marionette = {};
    s.VERSION = "2.4.2",
    s.noConflict = function() {
        return t.Marionette = n,
        t.Mn = r,
        this
    }
    ,
    e.Marionette = s,
    s.Deferred = e.$.Deferred,
    s.extend = e.Model.extend,
    s.isNodeAttached = function(t) {
        return e.$.contains(document.documentElement, t)
    }
    ,
    s.mergeOptions = function(t, e) {
        t && i.extend(this, i.pick(t, e))
    }
    ,
    s.getOption = function(t, e) {
        return t && e ? t.options && void 0 !== t.options[e] ? t.options[e] : t[e] : void 0
    }
    ,
    s.proxyGetOption = function(t) {
        return s.getOption(this, t)
    }
    ,
    s._getValue = function(t, e, n) {
        return i.isFunction(t) && (t = n ? t.apply(e, n) : t.call(e)),
        t
    }
    ,
    s.normalizeMethods = function(t) {
        return i.reduce(t, function(t, e, n) {
            return i.isFunction(e) || (e = this[e]),
            e && (t[n] = e),
            t
        }, {}, this)
    }
    ,
    s.normalizeUIString = function(t, e) {
        return t.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(t) {
            return e[t.slice(4)]
        })
    }
    ,
    s.normalizeUIKeys = function(t, e) {
        return i.reduce(t, function(t, i, n) {
            var r = s.normalizeUIString(n, e);
            return t[r] = i,
            t
        }, {})
    }
    ,
    s.normalizeUIValues = function(t, e, n) {
        return i.each(t, function(r, o) {
            i.isString(r) ? t[o] = s.normalizeUIString(r, e) : i.isObject(r) && i.isArray(n) && (i.extend(r, s.normalizeUIValues(i.pick(r, n), e)),
            i.each(n, function(t) {
                var n = r[t];
                i.isString(n) && (r[t] = s.normalizeUIString(n, e))
            }))
        }),
        t
    }
    ,
    s.actAsCollection = function(t, e) {
        var n = ["forEach", "each", "map", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "toArray", "first", "initial", "rest", "last", "without", "isEmpty", "pluck"];
        i.each(n, function(n) {
            t[n] = function() {
                var t = i.values(i.result(this, e))
                  , r = [t].concat(i.toArray(arguments));
                return i[n].apply(i, r)
            }
        })
    }
    ;
    var o = s.deprecate = function(t, e) {
        i.isObject(t) && (t = t.prev + " is going to be removed in the future. " + "Please use " + t.next + " instead." + (t.url ? " See: " + t.url : "")),
        void 0 !== e && e || o._cache[t] || (o._warn("Deprecation warning: " + t),
        o._cache[t] = !0)
    }
    ;
    o._warn = "undefined" != typeof console && (console.warn || console.log) || function() {}
    ,
    o._cache = {},
    s._triggerMethod = function() {
        function t(t, e, i) {
            return i.toUpperCase()
        }
        var e = /(^|:)(\w)/gi;
        return function(n, r, s) {
            var o = 3 > arguments.length;
            o && (s = r,
            r = s[0]);
            var h, a = "on" + r.replace(e, t), d = n[a];
            return i.isFunction(d) && (h = d.apply(n, o ? i.rest(s) : s)),
            i.isFunction(n.trigger) && (o + s.length > 1 ? n.trigger.apply(n, o ? s : [r].concat(i.drop(s, 0))) : n.trigger(r)),
            h
        }
    }(),
    s.triggerMethod = function() {
        return s._triggerMethod(this, arguments)
    }
    ,
    s.triggerMethodOn = function(t) {
        var e = i.isFunction(t.triggerMethod) ? t.triggerMethod : s.triggerMethod;
        return e.apply(t, i.rest(arguments))
    }
    ,
    s.MonitorDOMRefresh = function(t) {
        function e() {
            t._isShown = !0,
            r()
        }
        function n() {
            t._isRendered = !0,
            r()
        }
        function r() {
            t._isShown && t._isRendered && s.isNodeAttached(t.el) && i.isFunction(t.triggerMethod) && t.triggerMethod("dom:refresh")
        }
        t.on({
            show: e,
            render: n
        })
    }
    ,
    function(t) {
        function e(e, n, r, s) {
            var o = s.split(/\s+/);
            i.each(o, function(i) {
                var s = e[i];
                if (!s)
                    throw new t.Error('Method "' + i + '" was configured as an event handler, but does not exist.');
                e.listenTo(n, r, s)
            })
        }
        function n(t, e, i, n) {
            t.listenTo(e, i, n)
        }
        function r(t, e, n, r) {
            var s = r.split(/\s+/);
            i.each(s, function(i) {
                var r = t[i];
                t.stopListening(e, n, r)
            })
        }
        function s(t, e, i, n) {
            t.stopListening(e, i, n)
        }
        function o(e, n, r, s, o) {
            if (n && r) {
                if (!i.isObject(r))
                    throw new t.Error({
                        message: "Bindings must be an object or function.",
                        url: "marionette.functions.html#marionettebindentityevents"
                    });
                r = t._getValue(r, e),
                i.each(r, function(t, r) {
                    i.isFunction(t) ? s(e, n, r, t) : o(e, n, r, t)
                })
            }
        }
        t.bindEntityEvents = function(t, i, r) {
            o(t, i, r, n, e)
        }
        ,
        t.unbindEntityEvents = function(t, e, i) {
            o(t, e, i, s, r)
        }
        ,
        t.proxyBindEntityEvents = function(e, i) {
            return t.bindEntityEvents(this, e, i)
        }
        ,
        t.proxyUnbindEntityEvents = function(e, i) {
            return t.unbindEntityEvents(this, e, i)
        }
    }(s);
    var h = ["description", "fileName", "lineNumber", "name", "message", "number"];
    return s.Error = s.extend.call(Error, {
        urlRoot: "http://marionettejs.com/docs/v" + s.VERSION + "/",
        constructor: function(t, e) {
            i.isObject(t) ? (e = t,
            t = e.message) : e || (e = {});
            var n = Error.call(this, t);
            i.extend(this, i.pick(n, h), i.pick(e, h)),
            this.captureStackTrace(),
            e.url && (this.url = this.urlRoot + e.url)
        },
        captureStackTrace: function() {
            Error.captureStackTrace && Error.captureStackTrace(this, s.Error)
        },
        toString: function() {
            return this.name + ": " + this.message + (this.url ? " See: " + this.url : "")
        }
    }),
    s.Error.extend = s.extend,
    s.Callbacks = function() {
        this._deferred = s.Deferred(),
        this._callbacks = []
    }
    ,
    i.extend(s.Callbacks.prototype, {
        add: function(t, e) {
            var n = i.result(this._deferred, "promise");
            this._callbacks.push({
                cb: t,
                ctx: e
            }),
            n.then(function(i) {
                e && (i.context = e),
                t.call(i.context, i.options)
            })
        },
        run: function(t, e) {
            this._deferred.resolve({
                options: t,
                context: e
            })
        },
        reset: function() {
            var t = this._callbacks;
            this._deferred = s.Deferred(),
            this._callbacks = [],
            i.each(t, function(t) {
                this.add(t.cb, t.ctx)
            }, this)
        }
    }),
    s.Controller = function(t) {
        this.options = t || {},
        i.isFunction(this.initialize) && this.initialize(this.options)
    }
    ,
    s.Controller.extend = s.extend,
    i.extend(s.Controller.prototype, e.Events, {
        destroy: function() {
            return s._triggerMethod(this, "before:destroy", arguments),
            s._triggerMethod(this, "destroy", arguments),
            this.stopListening(),
            this.off(),
            this
        },
        triggerMethod: s.triggerMethod,
        mergeOptions: s.mergeOptions,
        getOption: s.proxyGetOption
    }),
    s.Object = function(t) {
        this.options = i.extend({}, i.result(this, "options"), t),
        this.initialize.apply(this, arguments)
    }
    ,
    s.Object.extend = s.extend,
    i.extend(s.Object.prototype, e.Events, {
        initialize: function() {},
        destroy: function() {
            return this.triggerMethod("before:destroy"),
            this.triggerMethod("destroy"),
            this.stopListening(),
            this
        },
        triggerMethod: s.triggerMethod,
        mergeOptions: s.mergeOptions,
        getOption: s.proxyGetOption,
        bindEntityEvents: s.proxyBindEntityEvents,
        unbindEntityEvents: s.proxyUnbindEntityEvents
    }),
    s.Region = s.Object.extend({
        constructor: function(t) {
            if (this.options = t || {},
            this.el = this.getOption("el"),
            this.el = this.el instanceof e.$ ? this.el[0] : this.el,
            !this.el)
                throw new s.Error({
                    name: "NoElError",
                    message: 'An "el" must be specified for a region.'
                });
            this.$el = this.getEl(this.el),
            s.Object.call(this, t)
        },
        show: function(t, e) {
            if (this._ensureElement()) {
                this._ensureViewIsIntact(t);
                var n = e || {}
                  , r = t !== this.currentView
                  , o = !!n.preventDestroy
                  , h = !!n.forceShow
                  , a = !!this.currentView
                  , d = r && !o
                  , l = r || h;
                if (a && this.triggerMethod("before:swapOut", this.currentView, this, e),
                this.currentView && delete this.currentView._parent,
                d ? this.empty() : a && l && this.currentView.off("destroy", this.empty, this),
                l) {
                    t.once("destroy", this.empty, this),
                    t.render(),
                    t._parent = this,
                    a && this.triggerMethod("before:swap", t, this, e),
                    this.triggerMethod("before:show", t, this, e),
                    s.triggerMethodOn(t, "before:show", t, this, e),
                    a && this.triggerMethod("swapOut", this.currentView, this, e);
                    var c = s.isNodeAttached(this.el)
                      , u = []
                      , g = i.extend({
                        triggerBeforeAttach: this.triggerBeforeAttach,
                        triggerAttach: this.triggerAttach
                    }, n);
                    return c && g.triggerBeforeAttach && (u = this._displayedViews(t),
                    this._triggerAttach(u, "before:")),
                    this.attachHtml(t),
                    this.currentView = t,
                    c && g.triggerAttach && (u = this._displayedViews(t),
                    this._triggerAttach(u)),
                    a && this.triggerMethod("swap", t, this, e),
                    this.triggerMethod("show", t, this, e),
                    s.triggerMethodOn(t, "show", t, this, e),
                    this
                }
                return this
            }
        },
        triggerBeforeAttach: !0,
        triggerAttach: !0,
        _triggerAttach: function(t, e) {
            var n = (e || "") + "attach";
            i.each(t, function(t) {
                s.triggerMethodOn(t, n, t, this)
            }, this)
        },
        _displayedViews: function(t) {
            return i.union([t], i.result(t, "_getNestedViews") || [])
        },
        _ensureElement: function() {
            if (i.isObject(this.el) || (this.$el = this.getEl(this.el),
            this.el = this.$el[0]),
            !this.$el || 0 === this.$el.length) {
                if (this.getOption("allowMissingEl"))
                    return !1;
                throw new s.Error('An "el" ' + this.$el.selector + " must exist in DOM")
            }
            return !0
        },
        _ensureViewIsIntact: function(t) {
            if (!t)
                throw new s.Error({
                    name: "ViewNotValid",
                    message: "The view passed is undefined and therefore invalid. You must pass a view instance to show."
                });
            if (t.isDestroyed)
                throw new s.Error({
                    name: "ViewDestroyedError",
                    message: 'View (cid: "' + t.cid + '") has already been destroyed and cannot be used.'
                })
        },
        getEl: function(t) {
            return e.$(t, s._getValue(this.options.parentEl, this))
        },
        attachHtml: function(t) {
            this.$el.contents().detach(),
            this.el.appendChild(t.el)
        },
        empty: function(t) {
            var e = this.currentView
              , i = s._getValue(t, "preventDestroy", this);
            return e ? (e.off("destroy", this.empty, this),
            this.triggerMethod("before:empty", e),
            i || this._destroyView(),
            this.triggerMethod("empty", e),
            delete this.currentView,
            i && this.$el.contents().detach(),
            this) : void 0
        },
        _destroyView: function() {
            var t = this.currentView;
            t.destroy && !t.isDestroyed ? t.destroy() : t.remove && (t.remove(),
            t.isDestroyed = !0)
        },
        attachView: function(t) {
            return this.currentView = t,
            this
        },
        hasView: function() {
            return !!this.currentView
        },
        reset: function() {
            return this.empty(),
            this.$el && (this.el = this.getOption('el')),
            delete this.$el,
            this
        }
    }, {
        buildRegion: function(t, e) {
            if (i.isString(t))
                return this._buildRegionFromSelector(t, e);
            if (t.selector || t.el || t.regionClass)
                return this._buildRegionFromObject(t, e);
            if (i.isFunction(t))
                return this._buildRegionFromRegionClass(t);
            throw new s.Error({
                message: "Improper region configuration type.",
                url: "marionette.region.html#region-configuration-types"
            })
        },
        _buildRegionFromSelector: function(t, e) {
            return new e({
                el: t
            })
        },
        _buildRegionFromObject: function(t, e) {
            var n = t.regionClass || e
              , r = i.omit(t, "selector", "regionClass");
            return t.selector && !r.el && (r.el = t.selector),
            new n(r)
        },
        _buildRegionFromRegionClass: function(t) {
            return new t
        }
    }),
    s.RegionManager = s.Controller.extend({
        constructor: function(t) {
            this._regions = {},
            this.length = 0,
            s.Controller.call(this, t),
            this.addRegions(this.getOption("regions"))
        },
        addRegions: function(t, e) {
            return t = s._getValue(t, this, arguments),
            i.reduce(t, function(t, n, r) {
                return i.isString(n) && (n = {
                    selector: n
                }),
                n.selector && (n = i.defaults({}, n, e)),
                t[r] = this.addRegion(r, n),
                t
            }, {}, this)
        },
        addRegion: function(t, e) {
            var i;
            return i = e instanceof s.Region ? e : s.Region.buildRegion(e, s.Region),
            this.triggerMethod("before:add:region", t, i),
            i._parent = this,
            this._store(t, i),
            this.triggerMethod("add:region", t, i),
            i
        },
        get: function(t) {
            return this._regions[t]
        },
        getRegions: function() {
            return i.clone(this._regions)
        },
        removeRegion: function(t) {
            var e = this._regions[t];
            return this._remove(t, e),
            e
        },
        removeRegions: function() {
            var t = this.getRegions();
            return i.each(this._regions, function(t, e) {
                this._remove(e, t)
            }, this),
            t
        },
        emptyRegions: function() {
            var t = this.getRegions();
            return i.invoke(t, "empty"),
            t
        },
        destroy: function() {
            return this.removeRegions(),
            s.Controller.prototype.destroy.apply(this, arguments)
        },
        _store: function(t, e) {
            this._regions[t] || this.length++,
            this._regions[t] = e
        },
        _remove: function(t, e) {
            this.triggerMethod("before:remove:region", t, e),
            e.empty(),
            e.stopListening(),
            delete e._parent,
            delete this._regions[t],
            this.length--,
            this.triggerMethod("remove:region", t, e)
        }
    }),
    s.actAsCollection(s.RegionManager.prototype, "_regions"),
    s.TemplateCache = function(t) {
        this.templateId = t
    }
    ,
    i.extend(s.TemplateCache, {
        templateCaches: {},
        get: function(t, e) {
            var i = this.templateCaches[t];
            return i || (i = new s.TemplateCache(t),
            this.templateCaches[t] = i),
            i.load(e)
        },
        clear: function() {
            var t, e = i.toArray(arguments), n = e.length;
            if (n > 0)
                for (t = 0; n > t; t++)
                    delete this.templateCaches[e[t]];
            else
                this.templateCaches = {}
        }
    }),
    i.extend(s.TemplateCache.prototype, {
        load: function(t) {
            if (this.compiledTemplate)
                return this.compiledTemplate;
            var e = this.loadTemplate(this.templateId, t);
            return this.compiledTemplate = this.compileTemplate(e, t),
            this.compiledTemplate
        },
        loadTemplate: function(t) {
            var i = e.$(t).html();
            if (!i || 0 === i.length)
                throw new s.Error({
                    name: "NoTemplateError",
                    message: 'Could not find template: "' + t + '"'
                });
            return i
        },
        compileTemplate: function(t, e) {
            return i.template(t, e)
        }
    }),
    s.Renderer = {
        render: function(t, e) {
            if (!t)
                throw new s.Error({
                    name: "TemplateNotFoundError",
                    message: "Cannot render the template since its false, null or undefined."
                });
            var n = i.isFunction(t) ? t : s.TemplateCache.get(t);
            return n(e)
        }
    },
    s.View = e.View.extend({
        isDestroyed: !1,
        constructor: function(t) {
            i.bindAll(this, "render"),
            t = s._getValue(t, this),
            this.options = i.extend({}, i.result(this, "options"), t),
            this._behaviors = s.Behaviors(this),
            e.View.call(this, this.options),
            s.MonitorDOMRefresh(this)
        },
        getTemplate: function() {
            return this.getOption("template")
        },
        serializeModel: function(t) {
            return t.toJSON.apply(t, i.rest(arguments))
        },
        mixinTemplateHelpers: function(t) {
            t = t || {};
            var e = this.getOption("templateHelpers");
            return e = s._getValue(e, this),
            i.extend(t, e)
        },
        normalizeUIKeys: function(t) {
            var e = i.result(this, "_uiBindings");
            return s.normalizeUIKeys(t, e || i.result(this, "ui"))
        },
        normalizeUIValues: function(t, e) {
            var n = i.result(this, "ui")
              , r = i.result(this, "_uiBindings");
            return s.normalizeUIValues(t, r || n, e)
        },
        configureTriggers: function() {
            if (this.triggers) {
                var t = this.normalizeUIKeys(i.result(this, "triggers"));
                return i.reduce(t, function(t, e, i) {
                    return t[i] = this._buildViewTrigger(e),
                    t
                }, {}, this)
            }
        },
        delegateEvents: function(t) {
            return this._delegateDOMEvents(t),
            this.bindEntityEvents(this.model, this.getOption("modelEvents")),
            this.bindEntityEvents(this.collection, this.getOption("collectionEvents")),
            i.each(this._behaviors, function(t) {
                t.bindEntityEvents(this.model, t.getOption("modelEvents")),
                t.bindEntityEvents(this.collection, t.getOption("collectionEvents"))
            }, this),
            this
        },
        _delegateDOMEvents: function(t) {
            var n = s._getValue(t || this.events, this);
            n = this.normalizeUIKeys(n),
            i.isUndefined(t) && (this.events = n);
            var r = {}
              , o = i.result(this, "behaviorEvents") || {}
              , h = this.configureTriggers()
              , a = i.result(this, "behaviorTriggers") || {};
            i.extend(r, o, n, h, a),
            e.View.prototype.delegateEvents.call(this, r)
        },
        undelegateEvents: function() {
            return e.View.prototype.undelegateEvents.apply(this, arguments),
            this.unbindEntityEvents(this.model, this.getOption("modelEvents")),
            this.unbindEntityEvents(this.collection, this.getOption("collectionEvents")),
            i.each(this._behaviors, function(t) {
                t.unbindEntityEvents(this.model, t.getOption("modelEvents")),
                t.unbindEntityEvents(this.collection, t.getOption("collectionEvents"))
            }, this),
            this
        },
        _ensureViewIsIntact: function() {
            if (this.isDestroyed)
                throw new s.Error({
                    name: "ViewDestroyedError",
                    message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
                })
        },
        destroy: function() {
            if (this.isDestroyed)
                return this;
            var t = i.toArray(arguments);
            return this.triggerMethod.apply(this, ["before:destroy"].concat(t)),
            this.isDestroyed = !0,
            this.triggerMethod.apply(this, ["destroy"].concat(t)),
            this.unbindUIElements(),
            this.isRendered = !1,
            this.remove(),
            i.invoke(this._behaviors, "destroy", t),
            this
        },
        bindUIElements: function() {
            this._bindUIElements(),
            i.invoke(this._behaviors, this._bindUIElements)
        },
        _bindUIElements: function() {
            if (this.ui) {
                this._uiBindings || (this._uiBindings = this.ui);
                var t = i.result(this, "_uiBindings");
                this.ui = {},
                i.each(t, function(t, e) {
                    this.ui[e] = this.$(t)
                }, this)
            }
        },
        unbindUIElements: function() {
            this._unbindUIElements(),
            i.invoke(this._behaviors, this._unbindUIElements)
        },
        _unbindUIElements: function() {
            this.ui && this._uiBindings && (i.each(this.ui, function(t, e) {
                delete this.ui[e]
            }, this),
            this.ui = this._uiBindings,
            delete this._uiBindings)
        },
        _buildViewTrigger: function(t) {
            var e = i.isObject(t)
              , n = i.defaults({}, e ? t : {}, {
                preventDefault: !0,
                stopPropagation: !0
            })
              , r = e ? n.event : t;
            return function(t) {
                t && (t.preventDefault && n.preventDefault && t.preventDefault(),
                t.stopPropagation && n.stopPropagation && t.stopPropagation());
                var e = {
                    view: this,
                    model: this.model,
                    collection: this.collection
                };
                this.triggerMethod(r, e)
            }
        },
        setElement: function() {
            var t = e.View.prototype.setElement.apply(this, arguments);
            return i.invoke(this._behaviors, "proxyViewProperties", this),
            t
        },
        triggerMethod: function() {
            var t = s._triggerMethod(this, arguments);
            return this._triggerEventOnBehaviors(arguments),
            this._triggerEventOnParentLayout(arguments[0], i.rest(arguments)),
            t
        },
        _triggerEventOnBehaviors: function(t) {
            for (var e = s._triggerMethod, i = this._behaviors, n = 0, r = i && i.length; r > n; n++)
                e(i[n], t)
        },
        _triggerEventOnParentLayout: function(t, e) {
            var n = this._parentLayoutView();
            if (n) {
                var r = s.getOption(n, "childViewEventPrefix")
                  , o = r + ":" + t;
                s._triggerMethod(n, [o, this].concat(e));
                var h = s.getOption(n, "childEvents")
                  , a = n.normalizeMethods(h);
                a && i.isFunction(a[t]) && a[t].apply(n, [this].concat(e))
            }
        },
        _getImmediateChildren: function() {
            return []
        },
        _getNestedViews: function() {
            var t = this._getImmediateChildren();
            return t.length ? i.reduce(t, function(t, e) {
                return e._getNestedViews ? t.concat(e._getNestedViews()) : t
            }, t) : t
        },
        _getAncestors: function() {
            for (var t = [], e = this._parent; e; )
                t.push(e),
                e = e._parent;
            return t
        },
        _parentLayoutView: function() {
            var t = this._getAncestors();
            return i.find(t, function(t) {
                return t instanceof s.LayoutView
            })
        },
        normalizeMethods: s.normalizeMethods,
        mergeOptions: s.mergeOptions,
        getOption: s.proxyGetOption,
        bindEntityEvents: s.proxyBindEntityEvents,
        unbindEntityEvents: s.proxyUnbindEntityEvents
    }),
    s.ItemView = s.View.extend({
        constructor: function() {
            s.View.apply(this, arguments)
        },
        serializeData: function() {
            if (!this.model && !this.collection)
                return {};
            var t = [this.model || this.collection];
            return arguments.length && t.push.apply(t, arguments),
            this.model ? this.serializeModel.apply(this, t) : {
                items: this.serializeCollection.apply(this, t)
            }
        },
        serializeCollection: function(t) {
            return t.toJSON.apply(t, i.rest(arguments))
        },
        render: function() {
            return this._ensureViewIsIntact(),
            this.triggerMethod("before:render", this),
            this._renderTemplate(),
            this.isRendered = !0,
            this.bindUIElements(),
            this.triggerMethod("render", this),
            this
        },
        _renderTemplate: function() {
            var t = this.getTemplate();
            if (t !== !1) {
                if (!t)
                    throw new s.Error({
                        name: "UndefinedTemplateError",
                        message: "Cannot render the template since it is null or undefined."
                    });
                var e = this.mixinTemplateHelpers(this.serializeData())
                  , i = s.Renderer.render(t, e, this);
                return this.attachElContent(i),
                this
            }
        },
        attachElContent: function(t) {
            return this.$el.html(t),
            this
        }
    }),
    s.CollectionView = s.View.extend({
        childViewEventPrefix: "childview",
        sort: !0,
        constructor: function() {
            this.once("render", this._initialEvents),
            this._initChildViewStorage(),
            s.View.apply(this, arguments),
            this.on({
                "before:show": this._onBeforeShowCalled,
                show: this._onShowCalled,
                "before:attach": this._onBeforeAttachCalled,
                attach: this._onAttachCalled
            }),
            this.initRenderBuffer()
        },
        initRenderBuffer: function() {
            this._bufferedChildren = []
        },
        startBuffering: function() {
            this.initRenderBuffer(),
            this.isBuffering = !0
        },
        endBuffering: function() {
            var t, e = this._isShown && s.isNodeAttached(this.el);
            this.isBuffering = !1,
            this._isShown && this._triggerMethodMany(this._bufferedChildren, this, "before:show"),
            e && this._triggerBeforeAttach && (t = this._getNestedViews(),
            this._triggerMethodMany(t, this, "before:attach")),
            this.attachBuffer(this, this._createBuffer()),
            e && this._triggerAttach && (t = this._getNestedViews(),
            this._triggerMethodMany(t, this, "attach")),
            this._isShown && this._triggerMethodMany(this._bufferedChildren, this, "show"),
            this.initRenderBuffer()
        },
        _triggerMethodMany: function(t, e, n) {
            var r = i.drop(arguments, 3);
            i.each(t, function(t) {
                s.triggerMethodOn.apply(t, [t, n, t, e].concat(r))
            })
        },
        _initialEvents: function() {
            this.collection && (this.listenTo(this.collection, "add", this._onCollectionAdd),
            this.listenTo(this.collection, "remove", this._onCollectionRemove),
            this.listenTo(this.collection, "reset", this.render),
            this.getOption("sort") && this.listenTo(this.collection, "sort", this._sortViews))
        },
        _onCollectionAdd: function(t, e, n) {
            var r;
            if (r = void 0 !== n.at ? n.at : i.indexOf(this._filteredSortedModels(), t),
            this._shouldAddChild(t, r)) {
                this.destroyEmptyView();
                var s = this.getChildView(t);
                this.addChild(t, s, r)
            }
        },
        _onCollectionRemove: function(t) {
            var e = this.children.findByModel(t);
            this.removeChildView(e),
            this.checkEmpty()
        },
        _onBeforeShowCalled: function() {
            this._triggerBeforeAttach = this._triggerAttach = !1,
            this.children.each(function(t) {
                s.triggerMethodOn(t, "before:show", t)
            })
        },
        _onShowCalled: function() {
            this.children.each(function(t) {
                s.triggerMethodOn(t, "show", t)
            })
        },
        _onBeforeAttachCalled: function() {
            this._triggerBeforeAttach = !0
        },
        _onAttachCalled: function() {
            this._triggerAttach = !0
        },
        render: function() {
            return this._ensureViewIsIntact(),
            this.triggerMethod("before:render", this),
            this._renderChildren(),
            this.isRendered = !0,
            this.triggerMethod("render", this),
            this
        },
        reorder: function() {
            var t = this.children
              , e = this._filteredSortedModels()
              , n = i.find(e, function(e) {
                return !t.findByModel(e)
            });
            if (n)
                this.render();
            else {
                var r = i.map(e, function(e, i) {
                    var n = t.findByModel(e);
                    return n._index = i,
                    n.el
                });
                this.triggerMethod("before:reorder"),
                this._appendReorderedChildren(r),
                this.triggerMethod("reorder")
            }
        },
        resortView: function() {
            s.getOption(this, "reorderOnSort") ? this.reorder() : this.render()
        },
        _sortViews: function() {
            var t = this._filteredSortedModels()
              , e = i.find(t, function(t, e) {
                var i = this.children.findByModel(t);
                return !i || i._index !== e
            }, this);
            e && this.resortView()
        },
        _emptyViewIndex: -1,
        _appendReorderedChildren: function(t) {
            this.$el.append(t)
        },
        _renderChildren: function() {
            this.destroyEmptyView(),
            this.destroyChildren({
                checkEmpty: !1
            }),
            this.isEmpty(this.collection) ? this.showEmptyView() : (this.triggerMethod("before:render:collection", this),
            this.startBuffering(),
            this.showCollection(),
            this.endBuffering(),
            this.triggerMethod("render:collection", this),
            this.children.isEmpty() && this.showEmptyView())
        },
        showCollection: function() {
            var t, e = this._filteredSortedModels();
            i.each(e, function(e, i) {
                t = this.getChildView(e),
                this.addChild(e, t, i)
            }, this)
        },
        _filteredSortedModels: function() {
            var t, e = this.getViewComparator();
            return t = e ? i.isString(e) || 1 === e.length ? this.collection.sortBy(e, this) : i.clone(this.collection.models).sort(i.bind(e, this)) : this.collection.models,
            this.getOption("filter") && (t = i.filter(t, function(t, e) {
                return this._shouldAddChild(t, e)
            }, this)),
            t
        },
        showEmptyView: function() {
            var t = this.getEmptyView();
            if (t && !this._showingEmptyView) {
                this.triggerMethod("before:render:empty"),
                this._showingEmptyView = !0;
                var i = new e.Model;
                this.addEmptyView(i, t),
                this.triggerMethod("render:empty")
            }
        },
        destroyEmptyView: function() {
            this._showingEmptyView && (this.triggerMethod("before:remove:empty"),
            this.destroyChildren(),
            delete this._showingEmptyView,
            this.triggerMethod("remove:empty"))
        },
        getEmptyView: function() {
            return this.getOption("emptyView")
        },
        addEmptyView: function(t, e) {
            var n, r = this._isShown && !this.isBuffering && s.isNodeAttached(this.el), o = this.getOption("emptyViewOptions") || this.getOption("childViewOptions");
            i.isFunction(o) && (o = o.call(this, t, this._emptyViewIndex));
            var h = this.buildChildView(t, e, o);
            h._parent = this,
            this.proxyChildEvents(h),
            this._isShown && s.triggerMethodOn(h, "before:show", h),
            this.children.add(h),
            r && this._triggerBeforeAttach && (n = [h].concat(h._getNestedViews()),
            h.once("render", function() {
                this._triggerMethodMany(n, this, "before:attach")
            }, this)),
            this.renderChildView(h, this._emptyViewIndex),
            r && this._triggerAttach && (n = [h].concat(h._getNestedViews()),
            this._triggerMethodMany(n, this, "attach")),
            this._isShown && s.triggerMethodOn(h, "show", h)
        },
        getChildView: function() {
            var t = this.getOption("childView");
            if (!t)
                throw new s.Error({
                    name: "NoChildViewError",
                    message: 'A "childView" must be specified'
                });
            return t
        },
        addChild: function(t, e, i) {
            var n = this.getOption("childViewOptions");
            n = s._getValue(n, this, [t, i]);
            var r = this.buildChildView(t, e, n);
            return this._updateIndices(r, !0, i),
            this.triggerMethod("before:add:child", r),
            this._addChildView(r, i),
            this.triggerMethod("add:child", r),
            r._parent = this,
            r
        },
        _updateIndices: function(t, e, i) {
            this.getOption("sort") && (e && (t._index = i),
            this.children.each(function(i) {
                i._index >= t._index && (i._index += e ? 1 : -1)
            }))
        },
        _addChildView: function(t, e) {
            var i, n = this._isShown && !this.isBuffering && s.isNodeAttached(this.el);
            this.proxyChildEvents(t),
            this._isShown && !this.isBuffering && s.triggerMethodOn(t, "before:show", t),
            this.children.add(t),
            n && this._triggerBeforeAttach && (i = [t].concat(t._getNestedViews()),
            t.once("render", function() {
                this._triggerMethodMany(i, this, "before:attach")
            }, this)),
            this.renderChildView(t, e),
            n && this._triggerAttach && (i = [t].concat(t._getNestedViews()),
            this._triggerMethodMany(i, this, "attach")),
            this._isShown && !this.isBuffering && s.triggerMethodOn(t, "show", t)
        },
        renderChildView: function(t, e) {
            return t.render(),
            this.attachHtml(this, t, e),
            t
        },
        buildChildView: function(t, e, n) {
            var r = i.extend({
                model: t
            }, n);
            return new e(r)
        },
        removeChildView: function(t) {
            return t && (this.triggerMethod("before:remove:child", t),
            t.destroy ? t.destroy() : t.remove && t.remove(),
            delete t._parent,
            this.stopListening(t),
            this.children.remove(t),
            this.triggerMethod("remove:child", t),
            this._updateIndices(t, !1)),
            t
        },
        isEmpty: function() {
            return !this.collection || 0 === this.collection.length
        },
        checkEmpty: function() {
            this.isEmpty(this.collection) && this.showEmptyView()
        },
        attachBuffer: function(t, e) {
            t.$el.append(e)
        },
        _createBuffer: function() {
            var t = document.createDocumentFragment();
            return i.each(this._bufferedChildren, function(e) {
                t.appendChild(e.el)
            }),
            t
        },
        attachHtml: function(t, e, i) {
            t.isBuffering ? t._bufferedChildren.splice(i, 0, e) : t._insertBefore(e, i) || t._insertAfter(e)
        },
        _insertBefore: function(t, e) {
            var i, n = this.getOption("sort") && this.children.length - 1 > e;
            return n && (i = this.children.find(function(t) {
                return t._index === e + 1
            })),
            i ? (i.$el.before(t.el),
            !0) : !1
        },
        _insertAfter: function(t) {
            this.$el.append(t.el)
        },
        _initChildViewStorage: function() {
            this.children = new e.ChildViewContainer
        },
        destroy: function() {
            return this.isDestroyed ? this : (this.triggerMethod("before:destroy:collection"),
            this.destroyChildren({
                checkEmpty: !1
            }),
            this.triggerMethod("destroy:collection"),
            s.View.prototype.destroy.apply(this, arguments))
        },
        destroyChildren: function(t) {
            var e = t || {}
              , n = !0
              , r = this.children.map(i.identity);
            return i.isUndefined(e.checkEmpty) || (n = e.checkEmpty),
            this.children.each(this.removeChildView, this),
            n && this.checkEmpty(),
            r
        },
        _shouldAddChild: function(t, e) {
            var n = this.getOption("filter");
            return !i.isFunction(n) || n.call(this, t, e, this.collection)
        },
        proxyChildEvents: function(t) {
            var e = this.getOption("childViewEventPrefix");
            this.listenTo(t, "all", function() {
                var n = i.toArray(arguments)
                  , r = n[0]
                  , s = this.normalizeMethods(i.result(this, "childEvents"));
                n[0] = e + ":" + r,
                n.splice(1, 0, t),
                s !== void 0 && i.isFunction(s[r]) && s[r].apply(this, n.slice(1)),
                this.triggerMethod.apply(this, n)
            })
        },
        _getImmediateChildren: function() {
            return i.values(this.children._views)
        },
        getViewComparator: function() {
            return this.getOption("viewComparator")
        }
    }),
    s.CompositeView = s.CollectionView.extend({
        constructor: function() {
            s.CollectionView.apply(this, arguments)
        },
        _initialEvents: function() {
            this.collection && (this.listenTo(this.collection, "add", this._onCollectionAdd),
            this.listenTo(this.collection, "remove", this._onCollectionRemove),
            this.listenTo(this.collection, "reset", this._renderChildren),
            this.getOption("sort") && this.listenTo(this.collection, "sort", this._sortViews))
        },
        getChildView: function() {
            var t = this.getOption("childView") || this.constructor;
            return t
        },
        serializeData: function() {
            var t = {};
            return this.model && (t = i.partial(this.serializeModel, this.model).apply(this, arguments)),
            t
        },
        render: function() {
            return this._ensureViewIsIntact(),
            this._isRendering = !0,
            this.resetChildViewContainer(),
            this.triggerMethod("before:render", this),
            this._renderTemplate(),
            this._renderChildren(),
            this._isRendering = !1,
            this.isRendered = !0,
            this.triggerMethod("render", this),
            this
        },
        _renderChildren: function() {
            (this.isRendered || this._isRendering) && s.CollectionView.prototype._renderChildren.call(this)
        },
        _renderTemplate: function() {
            var t = {};
            t = this.serializeData(),
            t = this.mixinTemplateHelpers(t),
            this.triggerMethod("before:render:template");
            var e = this.getTemplate()
              , i = s.Renderer.render(e, t, this);
            this.attachElContent(i),
            this.bindUIElements(),
            this.triggerMethod("render:template")
        },
        attachElContent: function(t) {
            return this.$el.html(t),
            this
        },
        attachBuffer: function(t, e) {
            var i = this.getChildViewContainer(t);
            i.append(e)
        },
        _insertAfter: function(t) {
            var e = this.getChildViewContainer(this, t);
            e.append(t.el)
        },
        _appendReorderedChildren: function(t) {
            var e = this.getChildViewContainer(this);
            e.append(t)
        },
        getChildViewContainer: function(t) {
            if (t.$childViewContainer)
                return t.$childViewContainer;
            var e, i = s.getOption(t, "childViewContainer");
            if (i) {
                var n = s._getValue(i, t);
                if (e = "@" === n.charAt(0) && t.ui ? t.ui[n.substr(4)] : t.$(n),
                0 >= e.length)
                    throw new s.Error({
                        name: "ChildViewContainerMissingError",
                        message: 'The specified "childViewContainer" was not found: ' + t.childViewContainer
                    })
            } else
                e = t.$el;
            return t.$childViewContainer = e,
            e
        },
        resetChildViewContainer: function() {
            this.$childViewContainer && (this.$childViewContainer = void 0)
        }
    }),
    s.LayoutView = s.ItemView.extend({
        regionClass: s.Region,
        options: {
            destroyImmediate: !1
        },
        childViewEventPrefix: "childview",
        constructor: function(t) {
            t = t || {},
            this._firstRender = !0,
            this._initializeRegions(t),
            s.ItemView.call(this, t)
        },
        render: function() {
            return this._ensureViewIsIntact(),
            this._firstRender ? this._firstRender = !1 : this._reInitializeRegions(),
            s.ItemView.prototype.render.apply(this, arguments)
        },
        destroy: function() {
            return this.isDestroyed ? this : (this.getOption("destroyImmediate") === !0 && this.$el.remove(),
            this.regionManager.destroy(),
            s.ItemView.prototype.destroy.apply(this, arguments))
        },
        showChildView: function(t, e) {
            return this.getRegion(t).show(e)
        },
        getChildView: function(t) {
            return this.getRegion(t).currentView
        },
        addRegion: function(t, e) {
            var i = {};
            return i[t] = e,
            this._buildRegions(i)[t]
        },
        addRegions: function(t) {
            return this.regions = i.extend({}, this.regions, t),
            this._buildRegions(t)
        },
        removeRegion: function(t) {
            return delete this.regions[t],
            this.regionManager.removeRegion(t)
        },
        getRegion: function(t) {
            return this.regionManager.get(t)
        },
        getRegions: function() {
            return this.regionManager.getRegions()
        },
        _buildRegions: function(t) {
            var e = {
                regionClass: this.getOption("regionClass"),
                parentEl: i.partial(i.result, this, "el")
            };
            return this.regionManager.addRegions(t, e)
        },
        _initializeRegions: function(t) {
            var e;
            this._initRegionManager(),
            e = s._getValue(this.regions, this, [t]) || {};
            var n = this.getOption.call(t, "regions");
            n = s._getValue(n, this, [t]),
            i.extend(e, n),
            e = this.normalizeUIValues(e, ["selector", "el"]),
            this.addRegions(e)
        },
        _reInitializeRegions: function() {
            this.regionManager.invoke("reset")
        },
        getRegionManager: function() {
            return new s.RegionManager
        },
        _initRegionManager: function() {
            this.regionManager = this.getRegionManager(),
            this.regionManager._parent = this,
            this.listenTo(this.regionManager, "before:add:region", function(t) {
                this.triggerMethod("before:add:region", t)
            }),
            this.listenTo(this.regionManager, "add:region", function(t, e) {
                this[t] = e,
                this.triggerMethod("add:region", t, e)
            }),
            this.listenTo(this.regionManager, "before:remove:region", function(t) {
                this.triggerMethod("before:remove:region", t)
            }),
            this.listenTo(this.regionManager, "remove:region", function(t, e) {
                delete this[t],
                this.triggerMethod("remove:region", t, e)
            })
        },
        _getImmediateChildren: function() {
            return i.chain(this.regionManager.getRegions()).pluck("currentView").compact().value()
        }
    }),
    s.Behavior = s.Object.extend({
        constructor: function(t, e) {
            this.view = e,
            this.defaults = i.result(this, "defaults") || {},
            this.options = i.extend({}, this.defaults, t),
            this.ui = i.extend({}, i.result(e, "ui"), i.result(this, "ui")),
            s.Object.apply(this, arguments)
        },
        $: function() {
            return this.view.$.apply(this.view, arguments)
        },
        destroy: function() {
            return this.stopListening(),
            this
        },
        proxyViewProperties: function(t) {
            this.$el = t.$el,
            this.el = t.el
        }
    }),
    s.Behaviors = function(t, e) {
        function i(t, n) {
            return e.isObject(t.behaviors) ? (n = i.parseBehaviors(t, n || e.result(t, "behaviors")),
            i.wrap(t, n, e.keys(o)),
            n) : {}
        }
        function n(t, e) {
            this._view = t,
            this._behaviors = e,
            this._triggers = {}
        }
        function r(t) {
            return t._uiBindings || t.ui
        }
        var s = /^(\S+)\s*(.*)$/
          , o = {
            behaviorTriggers: function(t, e) {
                var i = new n(this,e);
                return i.buildBehaviorTriggers()
            },
            behaviorEvents: function(i, n) {
                var o = {};
                return e.each(n, function(i, n) {
                    var h = {}
                      , a = e.clone(e.result(i, "events")) || {};
                    a = t.normalizeUIKeys(a, r(i));
                    var d = 0;
                    e.each(a, function(t, r) {
                        var o = r.match(s)
                          , a = o[1] + "." + [this.cid, n, d++, " "].join("")
                          , l = o[2]
                          , c = a + l
                          , u = e.isFunction(t) ? t : i[t];
                        h[c] = e.bind(u, i)
                    }, this),
                    o = e.extend(o, h)
                }, this),
                o
            }
        };
        return e.extend(i, {
            behaviorsLookup: function() {
                throw new t.Error({
                    message: "You must define where your behaviors are stored.",
                    url: "marionette.behaviors.html#behaviorslookup"
                })
            },
            getBehaviorClass: function(e, n) {
                return e.behaviorClass ? e.behaviorClass : t._getValue(i.behaviorsLookup, this, [e, n])[n]
            },
            parseBehaviors: function(t, n) {
                return e.chain(n).map(function(n, r) {
                    var s = i.getBehaviorClass(n, r)
                      , o = new s(n,t)
                      , h = i.parseBehaviors(t, e.result(o, "behaviors"));
                    return [o].concat(h)
                }).flatten().value()
            },
            wrap: function(t, i, n) {
                e.each(n, function(n) {
                    t[n] = e.partial(o[n], t[n], i)
                })
            }
        }),
        e.extend(n.prototype, {
            buildBehaviorTriggers: function() {
                return e.each(this._behaviors, this._buildTriggerHandlersForBehavior, this),
                this._triggers
            },
            _buildTriggerHandlersForBehavior: function(i, n) {
                var s = e.clone(e.result(i, "triggers")) || {};
                s = t.normalizeUIKeys(s, r(i)),
                e.each(s, e.bind(this._setHandlerForBehavior, this, i, n))
            },
            _setHandlerForBehavior: function(t, e, i, n) {
                var r = n.replace(/^\S+/, function(t) {
                    return t + "." + "behaviortriggers" + e
                });
                this._triggers[r] = this._view._buildViewTrigger(i)
            }
        }),
        i
    }(s, i),
    s.AppRouter = e.Router.extend({
        constructor: function(t) {
            this.options = t || {},
            e.Router.apply(this, arguments);
            var i = this.getOption("appRoutes")
              , n = this._getController();
            this.processAppRoutes(n, i),
            this.on("route", this._processOnRoute, this)
        },
        appRoute: function(t, e) {
            var i = this._getController();
            this._addAppRoute(i, t, e)
        },
        _processOnRoute: function(t, e) {
            if (i.isFunction(this.onRoute)) {
                var n = i.invert(this.getOption("appRoutes"))[t];
                this.onRoute(t, n, e)
            }
        },
        processAppRoutes: function(t, e) {
            if (e) {
                var n = i.keys(e).reverse();
                i.each(n, function(i) {
                    this._addAppRoute(t, i, e[i])
                }, this)
            }
        },
        _getController: function() {
            return this.getOption("controller")
        },
        _addAppRoute: function(t, e, n) {
            var r = t[n];
            if (!r)
                throw new s.Error('Method "' + n + '" was not found on the controller');
            this.route(e, n, i.bind(r, t))
        },
        mergeOptions: s.mergeOptions,
        getOption: s.proxyGetOption,
        triggerMethod: s.triggerMethod,
        bindEntityEvents: s.proxyBindEntityEvents,
        unbindEntityEvents: s.proxyUnbindEntityEvents
    }),
    s.Application = s.Object.extend({
        constructor: function(t) {
            this._initializeRegions(t),
            this._initCallbacks = new s.Callbacks,
            this.submodules = {},
            i.extend(this, t),
            this._initChannel(),
            s.Object.call(this, t)
        },
        execute: function() {
            this.commands.execute.apply(this.commands, arguments)
        },
        request: function() {
            return this.reqres.request.apply(this.reqres, arguments)
        },
        addInitializer: function(t) {
            this._initCallbacks.add(t)
        },
        start: function(t) {
            this.triggerMethod("before:start", t),
            this._initCallbacks.run(t, this),
            this.triggerMethod("start", t)
        },
        addRegions: function(t) {
            return this._regionManager.addRegions(t)
        },
        emptyRegions: function() {
            return this._regionManager.emptyRegions()
        },
        removeRegion: function(t) {
            return this._regionManager.removeRegion(t)
        },
        getRegion: function(t) {
            return this._regionManager.get(t)
        },
        getRegions: function() {
            return this._regionManager.getRegions()
        },
        module: function(t, e) {
            var n = s.Module.getClass(e)
              , r = i.toArray(arguments);
            return r.unshift(this),
            n.create.apply(n, r)
        },
        getRegionManager: function() {
            return new s.RegionManager
        },
        _initializeRegions: function(t) {
            var e = i.isFunction(this.regions) ? this.regions(t) : this.regions || {};
            this._initRegionManager();
            var n = s.getOption(t, "regions");
            return i.isFunction(n) && (n = n.call(this, t)),
            i.extend(e, n),
            this.addRegions(e),
            this
        },
        _initRegionManager: function() {
            this._regionManager = this.getRegionManager(),
            this._regionManager._parent = this,
            this.listenTo(this._regionManager, "before:add:region", function() {
                s._triggerMethod(this, "before:add:region", arguments)
            }),
            this.listenTo(this._regionManager, "add:region", function(t, e) {
                this[t] = e,
                s._triggerMethod(this, "add:region", arguments)
            }),
            this.listenTo(this._regionManager, "before:remove:region", function() {
                s._triggerMethod(this, "before:remove:region", arguments)
            }),
            this.listenTo(this._regionManager, "remove:region", function(t) {
                delete this[t],
                s._triggerMethod(this, "remove:region", arguments)
            })
        },
        _initChannel: function() {
            this.channelName = i.result(this, "channelName") || "global",
            this.channel = i.result(this, "channel") || e.Wreqr.radio.channel(this.channelName),
            this.vent = i.result(this, "vent") || this.channel.vent,
            this.commands = i.result(this, "commands") || this.channel.commands,
            this.reqres = i.result(this, "reqres") || this.channel.reqres
        }
    }),
    s.Module = function(t, e, n) {
        this.moduleName = t,
        this.options = i.extend({}, this.options, n),
        this.initialize = n.initialize || this.initialize,
        this.submodules = {},
        this._setupInitializersAndFinalizers(),
        this.app = e,
        i.isFunction(this.initialize) && this.initialize(t, e, this.options)
    }
    ,
    s.Module.extend = s.extend,
    i.extend(s.Module.prototype, e.Events, {
        startWithParent: !0,
        initialize: function() {},
        addInitializer: function(t) {
            this._initializerCallbacks.add(t)
        },
        addFinalizer: function(t) {
            this._finalizerCallbacks.add(t)
        },
        start: function(t) {
            this._isInitialized || (i.each(this.submodules, function(e) {
                e.startWithParent && e.start(t)
            }),
            this.triggerMethod("before:start", t),
            this._initializerCallbacks.run(t, this),
            this._isInitialized = !0,
            this.triggerMethod("start", t))
        },
        stop: function() {
            this._isInitialized && (this._isInitialized = !1,
            this.triggerMethod("before:stop"),
            i.invoke(this.submodules, "stop"),
            this._finalizerCallbacks.run(void 0, this),
            this._initializerCallbacks.reset(),
            this._finalizerCallbacks.reset(),
            this.triggerMethod("stop"))
        },
        addDefinition: function(t, e) {
            this._runModuleDefinition(t, e)
        },
        _runModuleDefinition: function(t, n) {
            if (t) {
                var r = i.flatten([this, this.app, e, s, e.$, i, n]);
                t.apply(this, r)
            }
        },
        _setupInitializersAndFinalizers: function() {
            this._initializerCallbacks = new s.Callbacks,
            this._finalizerCallbacks = new s.Callbacks
        },
        triggerMethod: s.triggerMethod
    }),
    i.extend(s.Module, {
        create: function(t, e, n) {
            var r = t
              , s = i.drop(arguments, 3);
            e = e.split(".");
            var o = e.length
              , h = [];
            return h[o - 1] = n,
            i.each(e, function(e, i) {
                var o = r;
                r = this._getModule(o, e, t, n),
                this._addModuleDefinition(o, r, h[i], s)
            }, this),
            r
        },
        _getModule: function(t, e, n, r) {
            var s = i.extend({}, r)
              , o = this.getClass(r)
              , h = t[e];
            return h || (h = new o(e,n,s),
            t[e] = h,
            t.submodules[e] = h),
            h
        },
        getClass: function(t) {
            var e = s.Module;
            return t ? t.prototype instanceof e ? t : t.moduleClass || e : e
        },
        _addModuleDefinition: function(t, e, i, n) {
            var r = this._getDefine(i)
              , s = this._getStartWithParent(i, e);
            r && e.addDefinition(r, n),
            this._addStartWithParent(t, e, s)
        },
        _getStartWithParent: function(t, e) {
            var n;
            return i.isFunction(t) && t.prototype instanceof s.Module ? (n = e.constructor.prototype.startWithParent,
            i.isUndefined(n) ? !0 : n) : i.isObject(t) ? (n = t.startWithParent,
            i.isUndefined(n) ? !0 : n) : !0
        },
        _getDefine: function(t) {
            return !i.isFunction(t) || t.prototype instanceof s.Module ? i.isObject(t) ? t.define : null : t
        },
        _addStartWithParent: function(t, e, i) {
            e.startWithParent = e.startWithParent && i,
            e.startWithParent && !e.startWithParentIsConfigured && (e.startWithParentIsConfigured = !0,
            t.addInitializer(function(t) {
                e.startWithParent && e.start(t)
            }))
        }
    }),
    s
});
!function(e, n) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = n(require("underscore"), require("backbone")) : "function" == typeof define && define.amd ? define(["underscore", "backbone"], n) : e.Backbone.Radio = n(e._, e.Backbone)
}(this, function(e, n) {
    "use strict";
    function t(e, n, t, r) {
        var s = e[n];
        return t && t !== s.callback && t !== s.callback._callback || r && r !== s.context ? void 0 : (delete e[n],
        !0)
    }
    function r(n, r, s, i) {
        n || (n = {});
        for (var a = r ? [r] : e.keys(n), u = !1, o = 0, c = a.length; c > o; o++)
            r = a[o],
            n[r] && t(n, r, s, i) && (u = !0);
        return u
    }
    function s(n) {
        return c[n] || (c[n] = e.partial(u.log, n))
    }
    function i(n) {
        return e.isFunction(n) ? n : function() {
            return n
        }
    }
    var a = n.Radio
      , u = n.Radio = {};
    u.VERSION = "1.0.1",
    u.noConflict = function() {
        return n.Radio = a,
        this
    }
    ,
    u.DEBUG = !1,
    u._debugText = function(e, n, t) {
        return e + (t ? " on the " + t + " channel" : "") + ': "' + n + '"'
    }
    ,
    u.debugLog = function(e, n, t) {
        u.DEBUG && console && console.warn && console.warn(u._debugText(e, n, t))
    }
    ;
    var o = /\s+/;
    u._eventsApi = function(n, t, r, s) {
        if (!r)
            return !1;
        var i = {};
        if ("object" == typeof r) {
            for (var a in r) {
                var u = n[t].apply(n, [a, r[a]].concat(s));
                o.test(a) ? e.extend(i, u) : i[a] = u
            }
            return i
        }
        if (o.test(r)) {
            for (var c = r.split(o), l = 0, h = c.length; h > l; l++)
                i[c[l]] = n[t].apply(n, [c[l]].concat(s));
            return i
        }
        return !1
    }
    ,
    u._callHandler = function(e, n, t) {
        var r = t[0]
          , s = t[1]
          , i = t[2];
        switch (t.length) {
        case 0:
            return e.call(n);
        case 1:
            return e.call(n, r);
        case 2:
            return e.call(n, r, s);
        case 3:
            return e.call(n, r, s, i);
        default:
            return e.apply(n, t)
        }
    }
    ;
    var c = {};
    e.extend(u, {
        log: function(n, t) {
            var r = e.rest(arguments, 2);
            console.log("[" + n + '] "' + t + '"', r)
        },
        tuneIn: function(e) {
            var n = u.channel(e);
            return n._tunedIn = !0,
            n.on("all", s(e)),
            this
        },
        tuneOut: function(e) {
            var n = u.channel(e);
            return n._tunedIn = !1,
            n.off("all", s(e)),
            delete c[e],
            this
        }
    }),
    u.Requests = {
        request: function(n) {
            var t = e.rest(arguments)
              , r = u._eventsApi(this, "request", n, t);
            if (r)
                return r;
            var s = this.channelName
              , i = this._requests;
            if (s && this._tunedIn && u.log.apply(this, [s, n].concat(t)),
            i && (i[n] || i["default"])) {
                var a = i[n] || i["default"];
                return t = i[n] ? t : arguments,
                u._callHandler(a.callback, a.context, t)
            }
            u.debugLog("An unhandled request was fired", n, s)
        },
        reply: function(e, n, t) {
            return u._eventsApi(this, "reply", e, [n, t]) ? this : (this._requests || (this._requests = {}),
            this._requests[e] && u.debugLog("A request was overwritten", e, this.channelName),
            this._requests[e] = {
                callback: i(n),
                context: t || this
            },
            this)
        },
        replyOnce: function(n, t, r) {
            if (u._eventsApi(this, "replyOnce", n, [t, r]))
                return this;
            var s = this
              , a = e.once(function() {
                return s.stopReplying(n),
                i(t).apply(this, arguments)
            });
            return this.reply(n, a, r)
        },
        stopReplying: function(e, n, t) {
            return u._eventsApi(this, "stopReplying", e) ? this : (e || n || t ? r(this._requests, e, n, t) || u.debugLog("Attempted to remove the unregistered request", e, this.channelName) : delete this._requests,
            this)
        }
    },
    u._channels = {},
    u.channel = function(e) {
        if (!e)
            throw new Error("You must provide a name for the channel.");
        return u._channels[e] ? u._channels[e] : u._channels[e] = new u.Channel(e)
    }
    ,
    u.Channel = function(e) {
        this.channelName = e
    }
    ,
    e.extend(u.Channel.prototype, n.Events, u.Requests, {
        reset: function() {
            return this.off(),
            this.stopListening(),
            this.stopReplying(),
            this
        }
    });
    var l, h, f = [n.Events, u.Commands, u.Requests];
    e.each(f, function(n) {
        e.each(n, function(n, t) {
            u[t] = function(n) {
                return h = e.rest(arguments),
                l = this.channel(n),
                l[t].apply(l, h)
            }
        })
    }),
    u.reset = function(n) {
        var t = n ? [this._channels[n]] : this._channels;
        e.invoke(t, "reset")
    }
    ;
    var p = u;
    return p
});
!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Mexp = t()
}(this, (function() {
    "use strict";
    function e() {
        return e = Object.assign ? Object.assign.bind() : function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var a in n)
                    Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a])
            }
            return e
        }
        ,
        e.apply(this, arguments)
    }
    var t, n = {
        0: 11,
        1: 0,
        2: 3,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 11,
        8: 11,
        9: 1,
        10: 10,
        11: 0,
        12: 11,
        13: 0,
        14: -1
    };
    function a(e, t) {
        for (var n = 0; n < e.length; n++)
            e[n] += t;
        return e
    }
    !function(e) {
        e[e.FUNCTION_WITH_ONE_ARG = 0] = "FUNCTION_WITH_ONE_ARG",
        e[e.NUMBER = 1] = "NUMBER",
        e[e.BINARY_OPERATOR_HIGH_PRECENDENCE = 2] = "BINARY_OPERATOR_HIGH_PRECENDENCE",
        e[e.CONSTANT = 3] = "CONSTANT",
        e[e.OPENING_PARENTHESIS = 4] = "OPENING_PARENTHESIS",
        e[e.CLOSING_PARENTHESIS = 5] = "CLOSING_PARENTHESIS",
        e[e.DECIMAL = 6] = "DECIMAL",
        e[e.POSTFIX_FUNCTION_WITH_ONE_ARG = 7] = "POSTFIX_FUNCTION_WITH_ONE_ARG",
        e[e.FUNCTION_WITH_N_ARGS = 8] = "FUNCTION_WITH_N_ARGS",
        e[e.BINARY_OPERATOR_LOW_PRECENDENCE = 9] = "BINARY_OPERATOR_LOW_PRECENDENCE",
        e[e.BINARY_OPERATOR_PERMUTATION = 10] = "BINARY_OPERATOR_PERMUTATION",
        e[e.COMMA = 11] = "COMMA",
        e[e.EVALUATED_FUNCTION = 12] = "EVALUATED_FUNCTION",
        e[e.EVALUATED_FUNCTION_PARAMETER = 13] = "EVALUATED_FUNCTION_PARAMETER",
        e[e.SPACE = 14] = "SPACE"
    }(t || (t = {}));
    var o = {
        0: !0,
        1: !0,
        3: !0,
        4: !0,
        6: !0,
        8: !0,
        9: !0,
        12: !0,
        13: !0,
        14: !0
    }
      , h = {
        0: !0,
        1: !0,
        2: !0,
        3: !0,
        4: !0,
        5: !0,
        6: !0,
        7: !0,
        8: !0,
        9: !0,
        10: !0,
        11: !0,
        12: !0,
        13: !0
    }
      , r = {
        0: !0,
        3: !0,
        4: !0,
        8: !0,
        12: !0,
        13: !0
    }
      , u = {}
      , s = {
        0: !0,
        1: !0,
        3: !0,
        4: !0,
        6: !0,
        8: !0,
        12: !0,
        13: !0
    }
      , p = {
        1: !0
    }
      , i = [[], ["1", "2", "3", "7", "8", "9", "4", "5", "6", "+", "-", "*", "/", "(", ")", "^", "!", "P", "C", "e", "0", ".", ",", "n", " ", "&"], ["pi", "ln", "Pi"], ["sin", "cos", "tan", "Del", "int", "Mod", "log", "pow"], ["asin", "acos", "atan", "cosh", "root", "tanh", "sinh"], ["acosh", "atanh", "asinh", "Sigma"]];
    function l(e, t, n, a) {
        for (var o = 0; o < a; o++)
            if (e[n + o] !== t[o])
                return !1;
        return !0
    }
    function v(e) {
        for (var a = 0; a < e.length; a++) {
            var o = e[a].token.length
              , h = -1;
            e[a].type === t.FUNCTION_WITH_N_ARGS && void 0 === e[a].numberOfArguments && (e[a].numberOfArguments = 2),
            i[o] = i[o] || [];
            for (var r = 0; r < i[o].length; r++)
                if (e[a].token === i[o][r]) {
                    h = f(i[o][r], this.tokens);
                    break
                }
            -1 === h ? (this.tokens.push(e[a]),
            e[a].precedence = n[e[a].type],
            i.length <= e[a].token.length && (i[e[a].token.length] = []),
            i[e[a].token.length].push(e[a].token)) : (this.tokens[h] = e[a],
            e[a].precedence = n[e[a].type])
        }
    }
    function f(e, t) {
        for (var n = 0; n < t.length; n++)
            if (t[n].token === e)
                return n;
        return -1
    }
    var y = function(e, t) {
        var n, v = {
            value: this.math.changeSign,
            type: 0,
            precedence: 1,
            show: "-"
        }, y = {
            value: ")",
            show: ")",
            type: 5,
            precedence: 0
        }, c = {
            value: "(",
            type: 4,
            precedence: 0,
            show: "("
        }, w = [c], m = [], E = e, g = o, N = 0, d = u, A = "";
        void 0 !== t && this.addToken(t);
        var k = function(e, t) {
            for (var n, a, o, h = [], r = t.length, u = 0; u < r; u++)
                if (!(u < r - 1 && " " === t[u] && " " === t[u + 1])) {
                    for (n = "",
                    a = t.length - u > i.length - 2 ? i.length - 1 : t.length - u; a > 0; a--)
                        if (void 0 !== i[a])
                            for (o = 0; o < i[a].length; o++)
                                l(t, i[a][o], u, a) && (n = i[a][o],
                                o = i[a].length,
                                a = 0);
                    if (u += n.length - 1,
                    "" === n)
                        throw new Error("Can't understand after " + t.slice(u));
                    h.push(e.tokens[f(n, e.tokens)])
                }
            return h
        }(this, E);
        for (n = 0; n < k.length; n++) {
            var M = k[n];
            if (14 !== M.type) {
                var O, T = M.token, _ = M.type, I = M.value, P = M.precedence, R = M.show, C = w[w.length - 1];
                for (O = m.length; O-- && 0 === m[O]; )
                    if (-1 !== [0, 2, 3, 4, 5, 9, 10, 11, 12, 13].indexOf(_)) {
                        if (!0 !== g[_])
                            throw new Error(T + " is not allowed after " + A);
                        w.push(y),
                        g = h,
                        d = s,
                        m.pop()
                    }
                if (!0 !== g[_])
                    throw new Error(T + " is not allowed after " + A);
                !0 === d[_] && (_ = 2,
                I = this.math.mul,
                R = "&times;",
                P = 3,
                n -= 1);
                var S = {
                    value: I,
                    type: _,
                    precedence: P,
                    show: R,
                    numberOfArguments: M.numberOfArguments
                };
                if (0 === _)
                    g = o,
                    d = u,
                    a(m, 2),
                    w.push(S),
                    4 !== k[n + 1].type && (w.push(c),
                    m.push(2));
                else if (1 === _)
                    1 === C.type ? (C.value += I,
                    a(m, 1)) : w.push(S),
                    g = h,
                    d = r;
                else if (2 === _)
                    g = o,
                    d = u,
                    a(m, 2),
                    w.push(S);
                else if (3 === _)
                    w.push(S),
                    g = h,
                    d = s;
                else if (4 === _)
                    a(m, 1),
                    N++,
                    g = o,
                    d = u,
                    w.push(S);
                else if (5 === _) {
                    if (!N)
                        throw new Error("Closing parenthesis are more than opening one, wait What!!!");
                    N--,
                    g = h,
                    d = s,
                    w.push(S),
                    a(m, 1)
                } else if (6 === _) {
                    if (C.hasDec)
                        throw new Error("Two decimals are not allowed in one number");
                    1 !== C.type && (C = {
                        show: "0",
                        value: 0,
                        type: 1,
                        precedence: 0
                    },
                    w.push(C)),
                    g = p,
                    a(m, 1),
                    d = u,
                    C.value += I,
                    C.hasDec = !0
                } else
                    7 === _ && (g = h,
                    d = s,
                    a(m, 1),
                    w.push(S));
                8 === _ ? (g = o,
                d = u,
                a(m, M.numberOfArguments + 2),
                w.push(S),
                4 !== k[n + 1].type && (w.push(c),
                m.push(M.numberOfArguments + 2))) : 9 === _ ? (9 === C.type ? C.value === this.math.add ? (C.value = I,
                C.show = R,
                a(m, 1)) : C.value === this.math.sub && "-" === R && (C.value = this.math.add,
                C.show = "+",
                a(m, 1)) : 5 !== C.type && 7 !== C.type && 1 !== C.type && 3 !== C.type && 13 !== C.type ? "-" === T && (g = o,
                d = u,
                a(m, 2).push(2),
                w.push(v),
                w.push(c)) : (w.push(S),
                a(m, 2)),
                g = o,
                d = u) : 10 === _ ? (g = o,
                d = u,
                a(m, 2),
                w.push(S)) : 11 === _ ? (g = o,
                d = u,
                w.push(S)) : 12 === _ ? (g = o,
                d = u,
                a(m, 6),
                w.push(S),
                4 !== k[n + 1].type && (w.push(c),
                m.push(6))) : 13 === _ && (g = h,
                d = s,
                w.push(S)),
                a(m, -1),
                A = T
            } else if (n > 0 && n < k.length - 1 && 1 === k[n + 1].type && (1 === k[n - 1].type || 6 === k[n - 1].type))
                throw new Error("Unexpected Space")
        }
        for (O = m.length; O--; )
            w.push(y);
        if (!0 !== g[5])
            throw new Error("complete the expression");
        for (; N--; )
            w.push(y);
        return w.push(y),
        w
    };
    function c(e) {
        for (var t, n, a, o = [], h = -1, r = -1, u = [{
            value: "(",
            type: 4,
            precedence: 0,
            show: "("
        }], s = 1; s < e.length; s++)
            if (1 === e[s].type || 3 === e[s].type || 13 === e[s].type)
                1 === e[s].type && (e[s].value = Number(e[s].value)),
                o.push(e[s]);
            else if (4 === e[s].type)
                u.push(e[s]);
            else if (5 === e[s].type)
                for (; 4 !== (null == (p = n = u.pop()) ? void 0 : p.type); ) {
                    var p;
                    n && o.push(n)
                }
            else if (11 === e[s].type) {
                for (; 4 !== (null == (i = n = u.pop()) ? void 0 : i.type); ) {
                    var i;
                    n && o.push(n)
                }
                u.push(n)
            } else {
                r = (t = e[s]).precedence,
                h = (a = u[u.length - 1]).precedence;
                var l = "Math.pow" == a.value && "Math.pow" == t.value;
                if (r > h)
                    u.push(t);
                else {
                    for (; h >= r && !l || l && r < h; )
                        n = u.pop(),
                        a = u[u.length - 1],
                        n && o.push(n),
                        h = a.precedence,
                        l = "Math.pow" == t.value && "Math.pow" == a.value;
                    u.push(t)
                }
            }
        return o
    }
    function w(e, t) {
        (t = t || {}).PI = Math.PI,
        t.E = Math.E;
        for (var n, a, o, h = [], r = void 0 !== t.n, u = 0; u < e.length; u++)
            if (1 === e[u].type)
                h.push({
                    value: e[u].value,
                    type: 1
                });
            else if (3 === e[u].type)
                h.push({
                    value: t[e[u].value],
                    type: 1
                });
            else if (0 === e[u].type) {
                var s = h[h.length - 1];
                Array.isArray(s) ? s.push(e[u]) : s.value = e[u].value(s.value)
            } else if (7 === e[u].type) {
                var p = h[h.length - 1];
                Array.isArray(p) ? p.push(e[u]) : p.value = e[u].value(p.value)
            } else if (8 === e[u].type) {
                for (var i = [], l = 0; l < e[u].numberOfArguments; l++) {
                    var v = h.pop();
                    v && i.push(v.value)
                }
                h.push({
                    type: 1,
                    value: e[u].value.apply(e[u], i.reverse())
                })
            } else if (10 === e[u].type)
                n = h.pop(),
                a = h.pop(),
                Array.isArray(a) ? ((a = a.concat(n)).push(e[u]),
                h.push(a)) : Array.isArray(n) ? (n.unshift(a),
                n.push(e[u]),
                h.push(n)) : h.push({
                    type: 1,
                    value: e[u].value(a.value, n.value)
                });
            else if (2 === e[u].type || 9 === e[u].type)
                n = h.pop(),
                a = h.pop(),
                Array.isArray(a) ? ((a = a.concat(n)).push(e[u]),
                h.push(a)) : Array.isArray(n) ? (n.unshift(a),
                n.push(e[u]),
                h.push(n)) : h.push({
                    type: 1,
                    value: e[u].value(a.value, n.value)
                });
            else if (12 === e[u].type) {
                n = h.pop();
                var f = void 0;
                f = !Array.isArray(n) && n ? [n] : n || [],
                a = h.pop(),
                o = h.pop(),
                h.push({
                    type: 1,
                    value: e[u].value(o.value, a.value, f)
                })
            } else
                13 === e[u].type && (r ? h.push({
                    value: t[e[u].value],
                    type: 3
                }) : h.push([e[u]]));
        if (h.length > 1)
            throw new Error("Uncaught Syntax error");
        return parseFloat(h[0].value.toFixed(15))
    }
    var m = function() {
        function t() {
            var t;
            this.toPostfix = c,
            this.addToken = v,
            this.lex = y,
            this.postfixEval = w,
            this.math = (t = this,
            {
                isDegree: !0,
                acos: function(e) {
                    return t.math.isDegree ? 180 / Math.PI * Math.acos(e) : Math.acos(e)
                },
                add: function(e, t) {
                    return e + t
                },
                asin: function(e) {
                    return t.math.isDegree ? 180 / Math.PI * Math.asin(e) : Math.asin(e)
                },
                atan: function(e) {
                    return t.math.isDegree ? 180 / Math.PI * Math.atan(e) : Math.atan(e)
                },
                acosh: function(e) {
                    return Math.log(e + Math.sqrt(e * e - 1))
                },
                asinh: function(e) {
                    return Math.log(e + Math.sqrt(e * e + 1))
                },
                atanh: function(e) {
                    return Math.log((1 + e) / (1 - e))
                },
                C: function(e, n) {
                    var a = 1
                      , o = e - n
                      , h = n;
                    h < o && (h = o,
                    o = n);
                    for (var r = h + 1; r <= e; r++)
                        a *= r;
                    var u = t.math.fact(o);
                    return "NaN" === u ? "NaN" : a / u
                },
                changeSign: function(e) {
                    return -e
                },
                cos: function(e) {
                    return t.math.isDegree && (e = t.math.toRadian(e)),
                    Math.cos(e)
                },
                cosh: function(e) {
                    return (Math.pow(Math.E, e) + Math.pow(Math.E, -1 * e)) / 2
                },
                div: function(e, t) {
                    return e / t
                },
                fact: function(e) {
                    if (e % 1 != 0)
                        return "NaN";
                    for (var t = 1, n = 2; n <= e; n++)
                        t *= n;
                    return t
                },
                inverse: function(e) {
                    return 1 / e
                },
                log: function(e) {
                    return Math.log(e) / Math.log(10)
                },
                mod: function(e, t) {
                    return e % t
                },
                mul: function(e, t) {
                    return e * t
                },
                P: function(e, t) {
                    for (var n = 1, a = Math.floor(e) - Math.floor(t) + 1; a <= Math.floor(e); a++)
                        n *= a;
                    return n
                },
                Pi: function(e, n, a) {
                    for (var o = 1, h = e; h <= n; h++)
                        o *= Number(t.postfixEval(a, {
                            n: h
                        }));
                    return o
                },
                pow10x: function(e) {
                    for (var t = 1; e--; )
                        t *= 10;
                    return t
                },
                sigma: function(e, n, a) {
                    for (var o = 0, h = e; h <= n; h++)
                        o += Number(t.postfixEval(a, {
                            n: h
                        }));
                    return o
                },
                sin: function(e) {
                    return t.math.isDegree && (e = t.math.toRadian(e)),
                    Math.sin(e)
                },
                sinh: function(e) {
                    return (Math.pow(Math.E, e) - Math.pow(Math.E, -1 * e)) / 2
                },
                sub: function(e, t) {
                    return e - t
                },
                tan: function(e) {
                    return t.math.isDegree && (e = t.math.toRadian(e)),
                    Math.tan(e)
                },
                tanh: function(e) {
                    return t.math.sinh(e) / t.math.cosh(e)
                },
                toRadian: function(e) {
                    return e * Math.PI / 180
                },
                and: function(e, t) {
                    return e & t
                }
            }),
            this.tokens = function(t) {
                return [{
                    token: "sin",
                    show: "sin",
                    type: 0,
                    value: t.math.sin
                }, {
                    token: "cos",
                    show: "cos",
                    type: 0,
                    value: t.math.cos
                }, {
                    token: "tan",
                    show: "tan",
                    type: 0,
                    value: t.math.tan
                }, {
                    token: "pi",
                    show: "&pi;",
                    type: 3,
                    value: "PI"
                }, {
                    token: "(",
                    show: "(",
                    type: 4,
                    value: "("
                }, {
                    token: ")",
                    show: ")",
                    type: 5,
                    value: ")"
                }, {
                    token: "P",
                    show: "P",
                    type: 10,
                    value: t.math.P
                }, {
                    token: "C",
                    show: "C",
                    type: 10,
                    value: t.math.C
                }, {
                    token: " ",
                    show: " ",
                    type: 14,
                    value: " ".anchor
                }, {
                    token: "asin",
                    show: "asin",
                    type: 0,
                    value: t.math.asin
                }, {
                    token: "acos",
                    show: "acos",
                    type: 0,
                    value: t.math.acos
                }, {
                    token: "atan",
                    show: "atan",
                    type: 0,
                    value: t.math.atan
                }, {
                    token: "7",
                    show: "7",
                    type: 1,
                    value: "7"
                }, {
                    token: "8",
                    show: "8",
                    type: 1,
                    value: "8"
                }, {
                    token: "9",
                    show: "9",
                    type: 1,
                    value: "9"
                }, {
                    token: "int",
                    show: "Int",
                    type: 0,
                    value: Math.floor
                }, {
                    token: "cosh",
                    show: "cosh",
                    type: 0,
                    value: t.math.cosh
                }, {
                    token: "acosh",
                    show: "acosh",
                    type: 0,
                    value: t.math.acosh
                }, {
                    token: "ln",
                    show: " ln",
                    type: 0,
                    value: Math.log
                }, {
                    token: "^",
                    show: "^",
                    type: 10,
                    value: Math.pow
                }, {
                    token: "root",
                    show: "root",
                    type: 0,
                    value: Math.sqrt
                }, {
                    token: "4",
                    show: "4",
                    type: 1,
                    value: "4"
                }, {
                    token: "5",
                    show: "5",
                    type: 1,
                    value: "5"
                }, {
                    token: "6",
                    show: "6",
                    type: 1,
                    value: "6"
                }, {
                    token: "/",
                    show: "&divide;",
                    type: 2,
                    value: t.math.div
                }, {
                    token: "!",
                    show: "!",
                    type: 7,
                    value: t.math.fact
                }, {
                    token: "tanh",
                    show: "tanh",
                    type: 0,
                    value: t.math.tanh
                }, {
                    token: "atanh",
                    show: "atanh",
                    type: 0,
                    value: t.math.atanh
                }, {
                    token: "Mod",
                    show: " Mod ",
                    type: 2,
                    value: t.math.mod
                }, {
                    token: "1",
                    show: "1",
                    type: 1,
                    value: "1"
                }, {
                    token: "2",
                    show: "2",
                    type: 1,
                    value: "2"
                }, {
                    token: "3",
                    show: "3",
                    type: 1,
                    value: "3"
                }, {
                    token: "*",
                    show: "&times;",
                    type: 2,
                    value: t.math.mul
                }, {
                    token: "sinh",
                    show: "sinh",
                    type: 0,
                    value: t.math.sinh
                }, {
                    token: "asinh",
                    show: "asinh",
                    type: 0,
                    value: t.math.asinh
                }, {
                    token: "e",
                    show: "e",
                    type: 3,
                    value: "E"
                }, {
                    token: "log",
                    show: " log",
                    type: 0,
                    value: t.math.log
                }, {
                    token: "0",
                    show: "0",
                    type: 1,
                    value: "0"
                }, {
                    token: ".",
                    show: ".",
                    type: 6,
                    value: "."
                }, {
                    token: "+",
                    show: "+",
                    type: 9,
                    value: t.math.add
                }, {
                    token: "-",
                    show: "-",
                    type: 9,
                    value: t.math.sub
                }, {
                    token: ",",
                    show: ",",
                    type: 11,
                    value: ","
                }, {
                    token: "Sigma",
                    show: "&Sigma;",
                    type: 12,
                    value: t.math.sigma
                }, {
                    token: "n",
                    show: "n",
                    type: 13,
                    value: "n"
                }, {
                    token: "Pi",
                    show: "&Pi;",
                    type: 12,
                    value: t.math.Pi
                }, {
                    token: "pow",
                    show: "pow",
                    type: 8,
                    value: Math.pow,
                    numberOfArguments: 2
                }, {
                    token: "&",
                    show: "&",
                    type: 9,
                    value: t.math.and
                }].map((function(t) {
                    return e({}, t, {
                        precedence: n[t.type]
                    })
                }
                ))
            }(this)
        }
        return t.prototype.eval = function(e, t, n) {
            return this.postfixEval(this.toPostfix(this.lex(e, t)), n)
        }
        ,
        t
    }();
    return m.TOKEN_TYPES = t,
    m.tokenTypes = t,
    m
}
));
var nfRadio = Backbone.Radio;
nfRadio.channel('form').on('render:view', function() {
    jQuery('.g-recaptcha').each(function() {
        var callback = jQuery(this).data('callback');
        var fieldID = jQuery(this).data('fieldid');
        if (typeof window[callback] !== 'function') {
            window[callback] = function(response) {
                nfRadio.channel('recaptcha').request('update:response', response, fieldID);
            }
            ;
        }
    });
});
var nfRecaptcha = Marionette.Object.extend({
    initialize: function() {
        if (0 != jQuery('.g-recaptcha').length) {
            this.renderCaptcha();
        }
        this.listenTo(nfRadio.channel('form'), 'render:view', this.renderCaptcha);
        this.listenTo(nfRadio.channel('captcha'), 'reset', this.renderCaptcha);
    },
    renderCaptcha: function() {
        jQuery('.g-recaptcha:empty').each(function() {
            var opts = {
                fieldid: jQuery(this).data('fieldid'),
                size: jQuery(this).data('size'),
                theme: jQuery(this).data('theme'),
                sitekey: jQuery(this).data('sitekey'),
                callback: jQuery(this).data('callback')
            };
            var grecaptchaID = grecaptcha.render(jQuery(this)[0], opts);
            if (opts.size === 'invisible') {
                try {
                    nf_reprocess_recaptcha(grecaptchaID);
                    setInterval(nf_reprocess_recaptcha, 110000, grecaptchaID);
                } catch (e) {
                    console.log('Notice: Error trying to execute grecaptcha.');
                }
            }
        });
    }
});
var nfRenderRecaptcha = function() {
    new nfRecaptcha();
}
const nf_reprocess_recaptcha = (grecaptchaID)=>{
    grecaptcha.execute(grecaptchaID);
}
const nf_check_recaptcha_consent = ()=>{
    let stored_responses = []
      , services = [];
    if (!nf_check_data_for_recaptcha_consent()) {
        stored_responses.push(false);
        services.push("missing_cookie");
    }
    const response = {
        "consent_state": stored_responses,
        "services": services
    };
    nfFrontEnd.nf_consent_status_response = response;
    let nf_consent_status_extra_check = new CustomEvent('nf_consent_status_check',{
        detail: response
    });
    document.dispatchEvent(nf_consent_status_extra_check);
    return nfFrontEnd.nf_consent_status_response;
}
const nf_check_data_for_recaptcha_consent = ()=>{
    return nf_get_cookie_by_name("_grecaptcha") !== "";
}
const nf_get_cookie_by_name = (cname)=>{
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
const nf_reload_after_cookie_consent = (submitFieldID,layoutView)=>{
    if (typeof submitFieldID !== "undefined" && typeof layoutView !== "undefined") {
        nfRadio.channel('fields').request("remove:error", submitFieldID, "recaptcha-v3-missing");
        nfRadio.channel('fields').request("remove:error", submitFieldID, "recaptcha-v3-consent");
        nfRadio.channel('form').trigger('render:view', layoutView);
    }
}
const nf_add_reCaptcha_aria = ()=>{
    const nf_act_on_inserted_node = (mutationList,observer)=>{
        for (const mutation of mutationList) {
            if (mutation.type === 'childList' && mutation.target.className === "g-recaptcha") {
                let nf_recaptchaTextarea = document.getElementById("g-recaptcha-response");
                if (typeof nf_recaptchaTextarea !== "undefined") {
                    nf_recaptchaTextarea.setAttribute("aria-hidden", "true");
                    nf_recaptchaTextarea.setAttribute("aria-label", "Silent reCaptcha security check");
                    nf_recaptchaTextarea.setAttribute("aria-readonly", "true");
                    observer.disconnect();
                }
            }
        }
        observer.disconnect();
    }
    ;
    const nf_forms_listed = document.querySelectorAll(".ninja-forms-form-wrap");
    if (nf_forms_listed.length > 0) {
        let nf_recaptcha_observers = [];
        nf_forms_listed.forEach((nf_form)=>{
            nf_recaptcha_observers.push({
                "class": new MutationObserver(nf_act_on_inserted_node),
                "element": nf_form
            });
        }
        );
        if (nf_recaptcha_observers.length > 0) {
            nf_recaptcha_observers.forEach((object)=>{
                object.class.observe(object.element, {
                    childList: true,
                    subtree: true
                });
            }
            );
        }
    }
}
const nf_remove_noscript_tags_as_needed = ()=>{
    const noscripts = document.getElementsByClassName('ninja-forms-noscript-message')
    for (let i = 0; i < noscripts.length; i++) {
        noscripts[i].parentNode.removeChild(noscripts[i])
    }
}
jQuery(document).on('nfFormReady', ()=>{
    nf_remove_noscript_tags_as_needed();
    nf_add_reCaptcha_aria();
}
);
