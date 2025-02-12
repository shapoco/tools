var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { App } from '@/app';
var RegexApp = /** @class */ (function (_super) {
    __extends(RegexApp, _super);
    function RegexApp() {
        var _this = _super.call(this, '正規表現ツール') || this;
        _this.proj = new RegexProject();
        _this.main.appendChild(_this.proj.container);
        return _this;
    }
    RegexApp.prototype.onResized = function () {
        this.proj.onResized();
    };
    return RegexApp;
}(App));
var RegexProject = /** @class */ (function () {
    function RegexProject() {
        var _this = this;
        this.nextRuleIdIndex = 0;
        this.updateTimeoutId = -1;
        this.rules = {};
        this.addReplaceButton = App.newButton('➕RegExp');
        this.inTextBox = App.newTextArea({
            style: { height: '100%' },
        });
        this.ruleListPanel = App.newPanel([], {
            classList: ['vertical-fill'],
        });
        this.outTextBox = App.newTextArea({
            style: { height: '100%' },
        });
        this.inPanel = App.newPanel([
            App.newH2('Input'),
            App.newP([
                this.inTextBox,
            ], { classList: ['vertical-fill'] }),
        ], { style: { height: '100%' } });
        this.actPanel = App.newPanel([
            App.newH2('Actions'),
            App.newP([
                this.addReplaceButton,
            ]),
            this.ruleListPanel,
        ], { style: { height: '100%' } });
        this.outPanel = App.newPanel([
            App.newH2('Output'),
            App.newP([
                this.outTextBox,
            ], { classList: ['vertical-fill'] }),
        ], { style: { height: '100%' } });
        this.container = App.newPanel([
            this.inPanel,
            this.actPanel,
            this.outPanel,
        ], {
            style: {
                display: 'grid',
                gridTemplateColumns: '37.5% 25% 37.5%',
                height: '100%',
            },
        });
        this.inTextBox.addEventListener('keydown', function (e) { _this.requestUpdate(); });
        this.addReplaceButton.addEventListener('click', function (e) { _this.insertNewRule(new ReplaceRule()); });
        if (App.isDebug()) {
            this.inTextBox.value =
                'The quick brown fox jumps over the lazy dog.';
            this.insertNewRule(new ReplaceRule('fox', '__tmp__'));
            this.insertNewRule(new ReplaceRule('dog', 'FOX'));
            this.insertNewRule(new ReplaceRule('__tmp__', 'dog'));
            this.insertNewRule(new ReplaceRule('lazy', 'CRAZY'));
        }
        else {
            this.insertNewRule(new ReplaceRule());
        }
    }
    RegexProject.prototype.insertNewRule = function (r, i) {
        var _this = this;
        if (i === void 0) { i = 0; }
        var id = "rule".concat(this.nextRuleIdIndex++);
        var closeBox = App.newCloseBox();
        this.ruleListPanel.appendChild(App.newFrame([
            closeBox,
            App.newH3(r.title),
            r.uiBody,
        ], { id: id }));
        closeBox.addEventListener('click', function (e) { _this.removeRule(id); });
        r.uiBody.addEventListener('propertychanged', function (e) { _this.requestUpdate(); });
        this.rules[id] = r;
        this.requestUpdate();
    };
    RegexProject.prototype.removeRule = function (id) {
        var rule = this.ruleListPanel.querySelector("#".concat(id));
        if (rule) {
            rule.remove();
        }
        if (id in this.rules) {
            delete this.rules[id];
        }
        this.requestUpdate();
    };
    RegexProject.prototype.requestUpdate = function () {
        if (this.updateTimeoutId >= 0)
            clearTimeout(this.updateTimeoutId);
        this.updateTimeoutId = setTimeout(this.update.bind(this), 500);
    };
    RegexProject.prototype.update = function () {
        var _this = this;
        this.updateTimeoutId = -1;
        var ctx = new ConvertContext(this.inTextBox.value);
        Array.from(this.ruleListPanel.children).forEach(function (rulePanel) {
            var rule = _this.rules[rulePanel.id];
            rule.convert(ctx);
        });
        this.outTextBox.value = ctx.text;
    };
    RegexProject.prototype.onResized = function () { };
    return RegexProject;
}());
var ConvertContext = /** @class */ (function () {
    function ConvertContext(text) {
        this.text = text;
    }
    return ConvertContext;
}());
var Rule = /** @class */ (function () {
    function Rule(title) {
        this.title = title;
        this.uiBody = App.newPanel();
        this.propertyChangedEvent = new CustomEvent('propertychanged');
    }
    Rule.prototype.convert = function (ctx) { };
    Rule.prototype.onPropertyChanged = function () {
        this.uiBody.dispatchEvent(this.propertyChangedEvent);
    };
    return Rule;
}());
var ReplaceRule = /** @class */ (function (_super) {
    __extends(ReplaceRule, _super);
    function ReplaceRule(kwd, rep, regexp) {
        if (kwd === void 0) { kwd = ''; }
        if (rep === void 0) { rep = ''; }
        if (regexp === void 0) { regexp = true; }
        var _this = _super.call(this, 'RegExp') || this;
        _this.useRegExpCheckBox = App.newCheckBox('RegExp', regexp);
        _this.caseSensitiveCheckBox = App.newCheckBox('Case Sensitive', false);
        _this.keywordBox = App.newTextBox({
            value: kwd,
            placeholder: 'Keyword',
            style: { width: '100%' }
        });
        _this.replaceBox = App.newTextBox({
            value: rep,
            placeholder: 'Replace',
            style: { width: '100%' }
        });
        _this.useRegExpCheckBox.addEventListener('click', function (e) { _this.onPropertyChanged(); });
        _this.caseSensitiveCheckBox.addEventListener('click', function (e) { _this.onPropertyChanged(); });
        _this.keywordBox.addEventListener('keydown', function (e) { _this.onPropertyChanged(); });
        _this.replaceBox.addEventListener('keydown', function (e) { _this.onPropertyChanged(); });
        _this.uiBody.appendChild(App.newP([
            _this.useRegExpCheckBox.parentNode,
            _this.caseSensitiveCheckBox.parentNode,
        ]));
        _this.uiBody.appendChild(App.newP([
            _this.keywordBox,
        ]));
        _this.uiBody.appendChild(App.newP([
            _this.replaceBox,
        ]));
        return _this;
    }
    ReplaceRule.prototype.convert = function (ctx) {
        var useRegExp = this.useRegExpCheckBox.checked;
        var caseSens = this.caseSensitiveCheckBox.checked;
        var kwd = this.keywordBox.value;
        var rep = this.replaceBox.value;
        if (!kwd)
            return;
        if (useRegExp || !caseSens) {
            var flags = 'g';
            if (!caseSens)
                flags += 'i';
            var reStr = kwd;
            if (!useRegExp) {
                reStr = kwd.replaceAll(/([\*\+\.\?\{\}\(\)\[\]\^\$\-\|\/\\])/g, '\\$1');
            }
            ctx.text = ctx.text.replaceAll(new RegExp(reStr, flags), rep);
        }
        else {
            ctx.text = ctx.text.replaceAll(kwd, rep);
        }
    };
    return ReplaceRule;
}(Rule));
var app = new RegexApp();
