// CodePreview.js
// Previsualización del código (HTML y CSS) generado por los bloques.
//
//   - CodePreviewModel      -> guarda el HTML, el CSS extraído y la pestaña activa
//   - CodePreviewView       -> HTMLElement: el panel con las pestañas HTML / CSS
//   - CodePreviewController -> escucha al workspace y a la Vista, y actualiza el Modelo
//
// El Controlador lo instancia WebCraftApplication, igual que al del workspace.


// MODELO
// Guarda el estado y avisa cuando cambia. No sabe nada de pantalla.
class CodePreviewModel extends EventTarget
{
    constructor()
    {
        super();
        this._htmlCode = '';
        this._cssCode = '';
        this._activeTab = 'html';
    }

    getState()
    {
        return {
            htmlCode: this._htmlCode,
            cssCode: this._cssCode,
            activeTab: this._activeTab
        };
    }

    setHtmlCode(html = '')
    {
        this._htmlCode = html || '';
        this._cssCode = this.extractCss(this._htmlCode);
        this.changed();
    }

    setActiveTab(tab = 'html')
    {
        this._activeTab = ['html', 'css'].includes(tab) ? tab : 'html';
        this.changed();
    }

    changed()
    {
        this.dispatchEvent(new CustomEvent('changed', {
            detail: this.getState()
        }));
    }

    extractCss(html)
    {
        if (!html || !html.trim())
        {
            return '';
        }

        let parsedDocument = new DOMParser().parseFromString(html, 'text/html');
        let cssParts = [];

        let styles = parsedDocument.querySelectorAll('style');
        for (let i = 0; i < styles.length; i++)
        {
            let text = styles[i].textContent.trim();
            if (text)
            {
                cssParts.push(text);
            }
        }

        let styledElements = parsedDocument.querySelectorAll('[style]');
        for (let i = 0; i < styledElements.length; i++)
        {
            let element = styledElements[i];
            let declarations = (element.getAttribute('style') || '').trim();
            if (!declarations)
            {
                continue;
            }

            let selector = this.getElementSelector(element);
            let formatted = declarations.replace(/;\s*/g, ';\n  ').replace(/;\n  $/, ';');
            cssParts.push(selector + ' {\n  ' + formatted + '\n}');
        }

        return cssParts.join('\n\n');
    }

    getElementSelector(element)
    {
        let path = [];
        let current = element;

        while (current && current !== current.ownerDocument.body && current !== current.ownerDocument.documentElement)
        {
            let selector = current.localName;
            let siblings = current.parentElement ? current.parentElement.children : [];
            let sameType = [];

            for (let i = 0; i < siblings.length; i++)
            {
                if (siblings[i].localName === current.localName)
                {
                    sameType.push(siblings[i]);
                }
            }

            if (sameType.length > 1)
            {
                selector += ':nth-of-type(' + (sameType.indexOf(current) + 1) + ')';
            }

            path.unshift(selector);
            current = current.parentElement;
        }

        if (element === element.ownerDocument.body)
        {
            return 'body';
        }
        if (current === element.ownerDocument.body)
        {
            path.unshift('body');
        }
        return path.join(' > ');
    }
}


// VISTA (HTMLElement)
// Arma su DOM en el constructor con nodos nativos (sin innerHTML) y conecta
// sus propias pestañas. No decide qué hacer: despacha un 'request'.
class CodePreviewView extends HTMLElement
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
                min-width: 0;
                min-height: 0;
                overflow: hidden;
                box-sizing: border-box;
                color: #e6edf3;
                background: #0d1117;
                font-family: sans-serif;
            }
            .panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 6px 12px;
                border-bottom: 1px solid #30363d;
                background: #161b22;
                font: 600 13px/1.4 sans-serif;
            }
            .status {
                color: #3fb950;
                font: 11px/1.4 sans-serif;
            }
            .tabs {
                display: flex;
                flex: 0 0 auto;
                border-bottom: 1px solid #30363d;
                background: #161b22;
            }
            .tab {
                padding: 6px 14px;
                border: 0;
                border-bottom: 2px solid transparent;
                color: #8b949e;
                background: transparent;
                font: 12px/1.4 sans-serif;
                cursor: pointer;
            }
            .tab[aria-selected="true"] {
                border-bottom-color: #58a6ff;
                color: #f0f6fc;
            }
            .tab:focus-visible {
                outline: 2px solid #58a6ff;
                outline-offset: -2px;
            }
            .output {
                flex: 1;
                min-height: 0;
                margin: 0;
                padding: 14px;
                overflow: auto;
                color: #c9d1d9;
                font: 12px/1.6 sans-serif;
                tab-size: 2;
                white-space: pre-wrap;
                overflow-wrap: anywhere;
            }
            .output[hidden] {
                display: none;
            }
            .output.is-placeholder code {
                font-style: italic;
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

        // La Vista conecta sus propias pestañas. bind(this) para que "this"
        // siga siendo la Vista cuando el navegador llame a la función.
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

    // Traduce el clic en un pedido: "quiero cambiar de pestaña"
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

customElements.define('code-preview', CodePreviewView);


// CONTROLADOR (clase común)
// Escucha a la Vista y al workspace, y actualiza el Modelo. Cuando el Modelo
// cambia, le pide a la Vista que se dibuje.
class CodePreviewController
{
    constructor(view, model)
    {
        this._view = view;
        this._model = model;

        this._onModelChanged = this.onModelChanged.bind(this);
        this._onViewRequest = this.onViewRequest.bind(this);
        this._onWorkspaceUpdated = this.onWorkspaceUpdated.bind(this);
    }

    enable()
    {
        this._model.addEventListener('changed', this._onModelChanged);
        this._view.addEventListener('request', this._onViewRequest);
        document.addEventListener('webcraft:workspace-updated', this._onWorkspaceUpdated);

        // Estado inicial de la Vista
        this._view.state = this._model.getState();
    }

    disable()
    {
        this._model.removeEventListener('changed', this._onModelChanged);
        this._view.removeEventListener('request', this._onViewRequest);
        document.removeEventListener('webcraft:workspace-updated', this._onWorkspaceUpdated);
    }

    // El Modelo cambió: le digo a la Vista que se actualice
    onModelChanged()
    {
        this._view.state = this._model.getState();
    }

    // Pedido de la Vista: según la acción, acá se resuelve qué hacer
    onViewRequest(event)
    {
        if (event.detail.action === 'tab-change')
        {
            this._model.setActiveTab(event.detail.tab);
        }
    }

    // El workspace avisó que cambió el HTML generado
    onWorkspaceUpdated(event)
    {
        let html = (event.detail && event.detail.html) ? event.detail.html : '';
        this._model.setHtmlCode(html);
    }
}

export {
    CodePreviewModel,
    CodePreviewView,
    CodePreviewController
};