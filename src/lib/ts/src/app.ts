
export abstract class App {
  static glbNextIdIndex = 0;

  protected title: string;
  protected header: HTMLElement;
  protected main: HTMLElement;
  protected footer: HTMLElement;

  constructor(title: string) {
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
    if (!body) throw new Error('body element not found');
    body.appendChild(this.header);
    body.appendChild(this.main);
    body.appendChild(this.footer);

    window.addEventListener('resize', e => this.requestRelayout());
    this.requestRelayout();
  }
    
  protected abstract onResized(): void;;

  public requestRelayout() {
    window.requestAnimationFrame(e => { this.relayout(); });
  }

  private relayout() {
    const h = window.innerHeight;

    const hh = this.header.getBoundingClientRect().height;
    const fh = this.footer.getBoundingClientRect().height;
    this.main.style.height = `${h - hh - fh}px`;
    
    window.requestAnimationFrame(e => {
      this.onResized();
      this.fixLayout(this.main);
    });
  }

  private fixLayout(elm) {
    const rect = elm.getBoundingClientRect();
    const style = window.getComputedStyle(elm);
    const paddingT = parseFloat(style.paddingTop) || 0;
    const paddingR = parseFloat(style.paddingRight) || 0;
    const paddingB = parseFloat(style.paddingBottom) || 0;
    const paddingL = parseFloat(style.paddingLeft) || 0;
    const w = rect.width;
    const h = rect.height;
    let vFillers: HTMLElement[] = [];
    let vFillH = h - (paddingT + paddingB);
    for (let child of elm.children) {
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
      for (let filler of vFillers) {
        filler.style.height = `${vFillH}px`;
      }
      window.requestAnimationFrame(e => {
        for (let child of elm.children) {
          this.fixLayout(child);
        }
      });
    }
    else {
      for (let child of elm.children) {
        this.fixLayout(child);
      }
    }
  }

  public static isDebug(): boolean {
    return window.location.hostname == 'localhost';
  }

  public static newPanel(children: HTMLElement[] | null = [], attrs: any = {}): HTMLDivElement {
    App.appendClass(attrs, 'panel');
    return App.newElement('div', children, attrs) as HTMLDivElement;
  }

  public static newFrame(children: HTMLElement[] | null = [], attrs: any = {}): HTMLDivElement {
    App.appendClass(attrs, 'frame');
    return App.newElement('div', children, attrs) as HTMLDivElement;
  }

  public static newP(children: HTMLElement[] | null = [], attrs: any = {}): HTMLParagraphElement {
    return App.newElement('p', children, attrs) as HTMLParagraphElement;
  }

  public static newH2(innerHTML: string, attrs: any = {}): HTMLElement {
    attrs['innerHTML'] = innerHTML;
    return App.newElement('h2', null, attrs);
  }

  public static newH3(innerHTML: string, attrs: any = {}): HTMLElement {
    attrs['innerHTML'] = innerHTML;
    return App.newElement('h3', null, attrs);
  }

  public static newButton(innerHTML: string, attrs: any = {}): HTMLButtonElement {
    attrs['type'] = 'button';
    attrs['innerHTML'] = innerHTML;
    return App.newElement('button', null, attrs) as HTMLButtonElement;
  }

  public static newCloseBox(): HTMLButtonElement {
    return App.newButton('x', { classList: [ 'close-box' ] });
  }

  public static newTextBox(attrs: any = {}): HTMLInputElement {
    attrs['type'] = 'text';
    return App.newElement('input', null, attrs) as HTMLInputElement;
  }

  public static newTextArea(attrs: any = {}): HTMLTextAreaElement {
    return App.newElement('textarea', null, attrs) as HTMLTextAreaElement;
  }

  public static newCheckBox(innerHTML, checked = false, attrs: any = {}): HTMLInputElement {
    const id = App.getNewId();
    App.appendClass(attrs, 'nowrap');
    const checkBox = this.newElement('input', null, { type: 'checkbox', id: id, checked: checked });
    const label = this.newElement('label', null, { innerHTML: innerHTML, htmlFor: id });
    const span = this.newElement('span', [ checkBox, label ], attrs);
    return checkBox as HTMLInputElement;
  }

  public static newElement(tag: string, children: HTMLElement[] | null = [], attrs: any = {}): HTMLElement {
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

  public static appendClass(attrs, className: string): void {
    if (!('classList' in attrs)) attrs['classList'] = [];
    attrs.classList.push(className);
  }

  public static getNewId(): string {
    return `uniqid${App.glbNextIdIndex++}`;
  }

}
