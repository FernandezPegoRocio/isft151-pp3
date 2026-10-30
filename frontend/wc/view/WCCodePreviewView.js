class WCCodePreviewView extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });

        let style = document.createElement('style');
        style.textContent = `
            :host {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                min-width: 0;
                min-height: 0;
                overflow: hidden;
                box-sizing: border-box;
                border: 1px solid #ccc;
                color: #333;
                background: #ffffff;
                font-family: sans-serif;
            }
            .panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 6px 12px;
                border-bottom: 1px solid #ddd;
                background-color: #f1f3f5;
                color: #333;
                font: bold 13px sans-serif;
            }
            .status {
                color: #1a7f37;
                font: 11px/1.4 sans-serif;
            }
            .tabs {
                display: flex;
                flex: 0 0 auto;
                border-bottom: 1px solid #ddd;
                background: #ffffff;
            }
            .tab {
                padding: 6px 14px;
                border: 0;
                border-bottom: 2px solid transparent;
                color: #666;
                background: transparent;
                font: 12px/1.4 sans-serif;
                cursor: pointer;
            }
            .tab[aria-selected="true"] {
                border-bottom-color: #0969da;
                color: #333;
            }
            .tab:focus-visible {
                outline: 2px solid #0969da;
                outline-offset: -2px;
            }
            .output {
                flex: 1;
                min-height: 0;
                margin: 0;
                padding: 14px;
                overflow: auto;
                color: #333;
                font: 12px/1.6 sans-serif;
                tab-size: 2;
                white-space: pre-wrap;
                overflow-wrap: anywhere;
            }
            .output[hidden] {
                display: none;
            }
            .output.is-placeholder code {
                font-family: serif;
                font-size: 16px;
                font-style: italic;
                color: #888;
            }
        `;

        let header = document.createElement('div');
        header.classList.add('panel-header');
        let titleSpan = document.createElement('span');
        titleSpan.textContent = 'Previsualización de código';
        let statusSpan = document.createElement('span');
        statusSpan.classList.add('status');
        statusSpan.textContent = '● En vivo';
        header.append(titleSpan, statusSpan);

        let tabsContainer = document.createElement('div');
        tabsContainer.classList.add('tabs');
        tabsContainer.setAttribute('role', 'tablist');
        tabsContainer.setAttribute('aria-label', 'Tipo de código');

        this._htmlTab = document.createElement('button');
        this._htmlTab.classList.add('tab');
        this._htmlTab.type = 'button';
        this._htmlTab.setAttribute('role', 'tab');
        this._htmlTab.id = 'html-tab';
        this._htmlTab.setAttribute('aria-controls', 'html-output');
        this._htmlTab.setAttribute('aria-selected', 'true');
        this._htmlTab.dataset.tab = 'html';
        this._htmlTab.textContent = 'HTML';

        this._cssTab = document.createElement('button');
        this._cssTab.classList.add('tab');
        this._cssTab.type = 'button';
        this._cssTab.setAttribute('role', 'tab');
        this._cssTab.id = 'css-tab';
        this._cssTab.setAttribute('aria-controls', 'css-output');
        this._cssTab.setAttribute('aria-selected', 'false');
        this._cssTab.dataset.tab = 'css';
        this._cssTab.textContent = 'CSS';

        tabsContainer.append(this._htmlTab, this._cssTab);

        this._htmlOutputPre = document.createElement('pre');
        this._htmlOutputPre.classList.add('output');
        this._htmlOutputPre.id = 'html-output';
        this._htmlOutputPre.setAttribute('role', 'tabpanel');
        this._htmlOutputPre.setAttribute('aria-labelledby', 'html-tab');

        this._htmlOutputCode = document.createElement('code');
        this._htmlOutputPre.appendChild(this._htmlOutputCode);

        this._cssOutputPre = document.createElement('pre');
        this._cssOutputPre.classList.add('output');
        this._cssOutputPre.id = 'css-output';
        this._cssOutputPre.setAttribute('role', 'tabpanel');
        this._cssOutputPre.setAttribute('aria-labelledby', 'css-tab');
        this._cssOutputPre.hidden = true;

        this._cssOutputCode = document.createElement('code');
        this._cssOutputPre.appendChild(this._cssOutputCode);

        this.shadowRoot.append(style, header, tabsContainer, this._htmlOutputPre, this._cssOutputPre);

        this._onTabClick = this._onTabClick.bind(this);
        tabsContainer.addEventListener('click', this._onTabClick);
    }

    set state({ htmlCode = '', cssCode = '', activeTab = 'html' } = {})
    {
        let htmlIsPlaceholder = !htmlCode;
        let cssIsPlaceholder = !cssCode;

        this._htmlOutputCode.textContent = htmlCode || 'Arrastrá bloques al lienzo para empezar...';
        this._cssOutputCode.textContent = cssCode || '/* Todavía no se generó CSS. */';
        this._htmlOutputPre.classList.toggle('is-placeholder', htmlIsPlaceholder);
        this._cssOutputPre.classList.toggle('is-placeholder', cssIsPlaceholder);

        this._htmlTab.setAttribute('aria-selected', String(activeTab === 'html'));
        this._cssTab.setAttribute('aria-selected', String(activeTab === 'css'));

        this._htmlOutputPre.hidden = activeTab !== 'html';
        this._cssOutputPre.hidden = activeTab !== 'css';
    }

    connectedCallback()
    {

    }

    disconnectedCallback()
    {

    }

    _onTabClick(event)
    {
        let tab = event.target.closest('[data-tab]');
        if (!tab)
        {
            return;
        }

        this.dispatchEvent(new CustomEvent('request', {
            detail: { action: 'tab-change', tab: tab.dataset.tab }
        }));
    }
}

customElements.define('wc-code-preview', WCCodePreviewView);

export { WCCodePreviewView };
