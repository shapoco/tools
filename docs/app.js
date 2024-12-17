
class App {
  static glbNextIdIndex = 0;

  constructor(title) {
    this.title = title;

    this.header = document.createElement('header');
    this.main = document.createElement('main');
    this.footer = document.createElement('footer');

    this.header.innerHTML = 
      `<div id="root_navi"></div>` +
      `<h1>${title}</h1>`;

    this.footer.innerHTML =
      'Copyright &copy; Shapoco';

    const body = document.querySelector('body');
    body.appendChild(this.header);
    body.appendChild(this.main);
    body.appendChild(this.footer);

    window.addEventListener('resize', e => this.requestRelayout());
    this.requestRelayout();
  }
    
  requestRelayout() {
    window.requestAnimationFrame(e => { this.relayout(); });
  }

  relayout() {
    const h = window.innerHeight;

    const hh = this.header.getBoundingClientRect().height;
    const fh = this.footer.getBoundingClientRect().height;
    this.main.style.height = `${h - hh - fh}px`;
    
    window.requestAnimationFrame(e => {
      this.onResized();
      this.fixLayout(this.main);
    });
  }

  fixLayout(elm) {
    const rect = elm.getBoundingClientRect();
    const style = window.getComputedStyle(elm);
    const paddingT = parseFloat(style.paddingTop) || 0;
    const paddingR = parseFloat(style.paddingRight) || 0;
    const paddingB = parseFloat(style.paddingBottom) || 0;
    const paddingL = parseFloat(style.paddingLeft) || 0;
    const w = rect.width;
    const h = rect.height;
    var vFillers = [];
    var vFillH = h - (paddingT + paddingB);
    for (var child of elm.children) {
      const childRect = child.getBoundingClientRect();
      const childStyle = window.getComputedStyle(child);
      const childMarginT = parseFloat(childStyle.marginTop) || 0;
      const childMarginR = parseFloat(childStyle.marginRight) || 0;
      const childMarginB = parseFloat(childStyle.marginBottom) || 0;
      const childMarginL = parseFloat(childStyle.marginLeft) || 0;
      
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
      for (var child of vFillers) {
        child.style.height = `${vFillH}px`;
      }
      window.requestAnimationFrame(e => {
        for (var child of elm.children) {
          this.fixLayout(child);
        }
      });
    }
    else {
      for (var child of elm.children) {
        this.fixLayout(child);
      }
    }
  }

  static isDebug() {
    return window.location.hostname == 'localhost';
  }

  static newPanel(children = [], attrs = {}) {
    App.appendClass(attrs, 'panel');
    return App.newElement('div', children, attrs);
  }

  static newFrame(children = [], attrs = {}) {
    App.appendClass(attrs, 'frame');
    return App.newElement('div', children, attrs);
  }

  static newP(children = [], attrs = {}) {
    return App.newElement('p', children, attrs);
  }

  static newH2(innerHTML, attrs = {}) {
    attrs['innerHTML'] = innerHTML;
    return App.newElement('h2', null, attrs);
  }

  static newH3(innerHTML, attrs = {}) {
    attrs['innerHTML'] = innerHTML;
    return App.newElement('h3', null, attrs);
  }

  static newButton(innerHTML, attrs = {}) {
    attrs['type'] = 'button';
    attrs['innerHTML'] = innerHTML;
    return App.newElement('button', null, attrs);
  }

  static newCloseBox() {
    return App.newButton('x', { classList: [ 'close-box' ] });
  }

  static newTextBox(attrs = {}) {
    attrs['type'] = 'text';
    return App.newElement('input', null, attrs);
  }

  static newTextArea(attrs = {}) {
    return App.newElement('textarea', null, attrs);
  }

  static newCheckBox(innerHTML, checked = false, attrs = {}) {
    const id = App.getNewId();
    App.appendClass(attrs, 'nowrap');
    const checkBox = this.newElement('input', null, { type: 'checkbox', id: id, checked: checked });
    const label = this.newElement('label', null, { innerHTML: innerHTML, htmlFor: id });
    const span = this.newElement('span', [ checkBox, label ], attrs);
    return checkBox;
  }

  static newElement(tag, children = [], attrs = {}) {
    const elm = document.createElement(tag);
    if (attrs) {
      for (var attrName of Object.keys(attrs)) {
        if (attrName == 'classList') {
          for (var cls of attrs.classList) {
            elm.classList.add(cls);
          };
        }
        else if (attrName == 'style' && attrs.style) {
          const style = attrs.style;
          for (var styleName of Object.keys(style)) {
            elm.style[styleName] = style[styleName];
          }
        }
        else {
          elm[attrName] = attrs[attrName];
        }
      }
    }
    if (children) {
      for (var child of children) {
        elm.appendChild(child);
      }
    }
    return elm;
  }

  static appendClass(attrs, className) {
    if (!('classList' in attrs)) attrs['classList'] = [];
    attrs.classList.push(className);
  }

  static getNewId() {
    return `uniqid${App.glbNextIdIndex++}`;
  }

}
  