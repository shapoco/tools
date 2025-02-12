var App = /** @class */ (function () {
    function App(title) {
        var _this = this;
        this.title = title;
        this.header = document.createElement('header');
        this.main = document.createElement('main');
        this.footer = document.createElement('footer');
        this.header.innerHTML =
            "<div id=\"root_navi\"></div>" +
                "<h1>".concat(title, "</h1>");
        this.footer.innerHTML =
            'Copyright &copy; Shapoco';
        var body = document.querySelector('body');
        if (!body)
            throw new Error('body element not found');
        body.appendChild(this.header);
        body.appendChild(this.main);
        body.appendChild(this.footer);
        window.addEventListener('resize', function (e) { return _this.requestRelayout(); });
        this.requestRelayout();
    }
    ;
    App.prototype.requestRelayout = function () {
        var _this = this;
        window.requestAnimationFrame(function (e) { _this.relayout(); });
    };
    App.prototype.relayout = function () {
        var _this = this;
        var h = window.innerHeight;
        var hh = this.header.getBoundingClientRect().height;
        var fh = this.footer.getBoundingClientRect().height;
        this.main.style.height = "".concat(h - hh - fh, "px");
        window.requestAnimationFrame(function (e) {
            _this.onResized();
            _this.fixLayout(_this.main);
        });
    };
    App.prototype.fixLayout = function (elm) {
        var _this = this;
        var rect = elm.getBoundingClientRect();
        var style = window.getComputedStyle(elm);
        var paddingT = parseFloat(style.paddingTop) || 0;
        var paddingR = parseFloat(style.paddingRight) || 0;
        var paddingB = parseFloat(style.paddingBottom) || 0;
        var paddingL = parseFloat(style.paddingLeft) || 0;
        var w = rect.width;
        var h = rect.height;
        var vFillers = [];
        var vFillH = h - (paddingT + paddingB);
        for (var _i = 0, _a = elm.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childRect = child.getBoundingClientRect();
            var childStyle = window.getComputedStyle(child);
            var childMarginT = parseFloat(childStyle.marginTop) || 0;
            var childMarginR = parseFloat(childStyle.marginRight) || 0;
            var childMarginB = parseFloat(childStyle.marginBottom) || 0;
            var childMarginL = parseFloat(childStyle.marginLeft) || 0;
            if (child.classList.contains('vertical-fill')) {
                vFillers.push(child);
                vFillH -= (childMarginT + childMarginB);
            }
            else {
                vFillH -= (childRect.height + childMarginT + childMarginB);
            }
        }
        if (vFillers.length > 0) {
            vFillH /= vFillers.length;
            for (var _b = 0, vFillers_1 = vFillers; _b < vFillers_1.length; _b++) {
                var filler = vFillers_1[_b];
                filler.style.height = "".concat(vFillH, "px");
            }
            window.requestAnimationFrame(function (e) {
                for (var _i = 0, _a = elm.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    _this.fixLayout(child);
                }
            });
        }
        else {
            for (var _c = 0, _d = elm.children; _c < _d.length; _c++) {
                var child = _d[_c];
                this.fixLayout(child);
            }
        }
    };
    App.isDebug = function () {
        return window.location.hostname == 'localhost';
    };
    App.newPanel = function (children, attrs) {
        if (children === void 0) { children = []; }
        if (attrs === void 0) { attrs = {}; }
        App.appendClass(attrs, 'panel');
        return App.newElement('div', children, attrs);
    };
    App.newFrame = function (children, attrs) {
        if (children === void 0) { children = []; }
        if (attrs === void 0) { attrs = {}; }
        App.appendClass(attrs, 'frame');
        return App.newElement('div', children, attrs);
    };
    App.newP = function (children, attrs) {
        if (children === void 0) { children = []; }
        if (attrs === void 0) { attrs = {}; }
        return App.newElement('p', children, attrs);
    };
    App.newH2 = function (innerHTML, attrs) {
        if (attrs === void 0) { attrs = {}; }
        attrs['innerHTML'] = innerHTML;
        return App.newElement('h2', null, attrs);
    };
    App.newH3 = function (innerHTML, attrs) {
        if (attrs === void 0) { attrs = {}; }
        attrs['innerHTML'] = innerHTML;
        return App.newElement('h3', null, attrs);
    };
    App.newButton = function (innerHTML, attrs) {
        if (attrs === void 0) { attrs = {}; }
        attrs['type'] = 'button';
        attrs['innerHTML'] = innerHTML;
        return App.newElement('button', null, attrs);
    };
    App.newCloseBox = function () {
        return App.newButton('x', { classList: ['close-box'] });
    };
    App.newTextBox = function (attrs) {
        if (attrs === void 0) { attrs = {}; }
        attrs['type'] = 'text';
        return App.newElement('input', null, attrs);
    };
    App.newTextArea = function (attrs) {
        if (attrs === void 0) { attrs = {}; }
        return App.newElement('textarea', null, attrs);
    };
    App.newCheckBox = function (innerHTML, checked, attrs) {
        if (checked === void 0) { checked = false; }
        if (attrs === void 0) { attrs = {}; }
        var id = App.getNewId();
        App.appendClass(attrs, 'nowrap');
        var checkBox = this.newElement('input', null, { type: 'checkbox', id: id, checked: checked });
        var label = this.newElement('label', null, { innerHTML: innerHTML, htmlFor: id });
        var span = this.newElement('span', [checkBox, label], attrs);
        return checkBox;
    };
    App.newElement = function (tag, children, attrs) {
        if (children === void 0) { children = []; }
        if (attrs === void 0) { attrs = {}; }
        var elm = document.createElement(tag);
        if (attrs) {
            for (var _i = 0, _a = Object.keys(attrs); _i < _a.length; _i++) {
                var attrName = _a[_i];
                if (attrName == 'classList') {
                    for (var _b = 0, _c = attrs.classList; _b < _c.length; _b++) {
                        var cls = _c[_b];
                        elm.classList.add(cls);
                    }
                    ;
                }
                else if (attrName == 'style' && attrs.style) {
                    var style = attrs.style;
                    for (var _d = 0, _e = Object.keys(style); _d < _e.length; _d++) {
                        var styleName = _e[_d];
                        elm.style[styleName] = style[styleName];
                    }
                }
                else {
                    elm[attrName] = attrs[attrName];
                }
            }
        }
        if (children) {
            for (var _f = 0, children_1 = children; _f < children_1.length; _f++) {
                var child = children_1[_f];
                elm.appendChild(child);
            }
        }
        return elm;
    };
    App.appendClass = function (attrs, className) {
        if (!('classList' in attrs))
            attrs['classList'] = [];
        attrs.classList.push(className);
    };
    App.getNewId = function () {
        return "uniqid".concat(App.glbNextIdIndex++);
    };
    App.glbNextIdIndex = 0;
    return App;
}());
export { App };
