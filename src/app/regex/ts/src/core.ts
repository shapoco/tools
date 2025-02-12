import { App } from '@/app';

class RegexApp extends App {
  proj: RegexProject;

  constructor() {
    super('正規表現ツール');
    this.proj = new RegexProject();
    this.main.appendChild(this.proj.container);
  }

  onResized() {
    this.proj.onResized();
  }
}

class RegexProject {
  container: HTMLDivElement;
  nextRuleIdIndex: number;
  updateTimeoutId: number;
  rules: { [key: string]: Rule };
  inTextBox: HTMLTextAreaElement;
  ruleListPanel: HTMLDivElement;
  outTextBox: HTMLTextAreaElement;
  inPanel: HTMLDivElement;
  actPanel: HTMLDivElement;
  outPanel: HTMLDivElement;
  addReplaceButton: HTMLButtonElement;

  constructor() {
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
    
    this.inTextBox.addEventListener('keydown', e => { this.requestUpdate(); });
    this.addReplaceButton.addEventListener('click', e => { this.insertNewRule(new ReplaceRule()); });

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

  insertNewRule(r, i = 0) {
    const id = `rule${this.nextRuleIdIndex++}`;

    const closeBox = App.newCloseBox();

    this.ruleListPanel.appendChild(App.newFrame([
      closeBox,
      App.newH3(r.title),
      r.uiBody,
    ], {id: id}));

    closeBox.addEventListener('click', e => { this.removeRule(id); });
    r.uiBody.addEventListener('propertychanged', e => { this.requestUpdate(); });

    this.rules[id] = r;
    this.requestUpdate();
  }
  
  public removeRule(id: string): void {
    const rule = this.ruleListPanel.querySelector(`#${id}`);
    if (rule) {
      rule.remove();
    }
    if (id in this.rules) {
      delete this.rules[id];
    }
    this.requestUpdate();
  }

  public requestUpdate(): void {
    if (this.updateTimeoutId >= 0) clearTimeout(this.updateTimeoutId);
    this.updateTimeoutId = setTimeout(this.update.bind(this), 500);
  }

  private update(): void {
    this.updateTimeoutId = -1;
    const ctx = new ConvertContext(this.inTextBox.value);
    Array.from(this.ruleListPanel.children).forEach((rulePanel) => {
      const rule = this.rules[rulePanel.id];
      rule.convert(ctx);
    });
    this.outTextBox.value = ctx.text;
  }

  public onResized(): void { }
}

class ConvertContext {
  text: string;
  constructor(text: string) {
    this.text = text;
  }
}

class Rule {
  title: string;
  uiBody: HTMLElement;
  propertyChangedEvent: CustomEvent;

  constructor(title: string) {
    this.title = title;
    this.uiBody = App.newPanel();
    this.propertyChangedEvent = new CustomEvent('propertychanged');
  }

  convert(ctx: ConvertContext) {}

  onPropertyChanged() {
    this.uiBody.dispatchEvent(this.propertyChangedEvent);
  }
}

class ReplaceRule extends Rule {
  useRegExpCheckBox: HTMLInputElement;
  caseSensitiveCheckBox: HTMLInputElement;
  keywordBox: HTMLInputElement;
  replaceBox: HTMLInputElement;

  constructor(kwd = '', rep = '', regexp = true) {
    super('RegExp');

    this.useRegExpCheckBox = App.newCheckBox('RegExp', regexp);
    this.caseSensitiveCheckBox = App.newCheckBox('Case Sensitive', false);

    this.keywordBox = App.newTextBox({
      value: kwd,
      placeholder: 'Keyword',
      style: { width: '100%' }
    });
    
    this.replaceBox = App.newTextBox({
      value: rep,
      placeholder: 'Replace',
      style: { width: '100%' }
    });
    
    this.useRegExpCheckBox.addEventListener('click', e => { this.onPropertyChanged(); });
    this.caseSensitiveCheckBox.addEventListener('click', e => { this.onPropertyChanged(); });
    this.keywordBox.addEventListener('keydown', e => { this.onPropertyChanged(); });
    this.replaceBox.addEventListener('keydown', e => { this.onPropertyChanged(); });

    this.uiBody.appendChild(App.newP([
      this.useRegExpCheckBox.parentNode as HTMLElement,
      this.caseSensitiveCheckBox.parentNode as HTMLElement,
    ]));
    this.uiBody.appendChild(App.newP([
      this.keywordBox,
    ]));
    this.uiBody.appendChild(App.newP([
      this.replaceBox,
    ]));
  }

  convert(ctx) {
    const useRegExp = this.useRegExpCheckBox.checked;
    const caseSens = this.caseSensitiveCheckBox.checked;
    const kwd = this.keywordBox.value;
    const rep = this.replaceBox.value;

    if (!kwd) return;

    if (useRegExp || !caseSens) {
      var flags = 'g';
      if (!caseSens) flags += 'i';

      var reStr = kwd;
      if (!useRegExp) {
        reStr = kwd.replaceAll(/([\*\+\.\?\{\}\(\)\[\]\^\$\-\|\/\\])/g, '\\$1');
      }

      ctx.text = ctx.text.replaceAll(new RegExp(reStr, flags), rep);
    }
    else {
      ctx.text = ctx.text.replaceAll(kwd, rep);
    }
  }
}

const app = new RegexApp();
