// LivePreview.js
// Previsualización gráfica del HTML generado por los bloques.
//
//   - LivePreviewModel      --> guarda el HTML actual y avisa cuando cambia
//   - LivePreviewView       --> HTMLElement: el panel con el iframe
//   - LivePreviewController --> escucha el evento del workspace y actualiza el Modelo
//
// El Controlador lo instancia WebCraftApplication, igual que al del workspace.


// MODELO
// Solo guarda el HTML y avisa cuando cambia. No sabe nada de pantalla.
class LivePreviewModel extends EventTarget
{
    constructor()
    {
        super();
        this._htmlCode = '';
    }

    getState()
    {
        return { htmlCode: this._htmlCode };
    }

    setHtmlCode(html = '')
    {
        this._htmlCode = html || '';
        this.changed();
    }

    changed()
    {
        this.dispatchEvent(new CustomEvent('changed', {
            detail: this.getState()
        }));
    }
}


// VISTA (HTMLElement)
// Arma su DOM en el constructor con nodos nativos (sin innerHTML).
// No decide nada: solo muestra el HTML que le piden.
class LivePreviewView extends HTMLElement
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
                background: #ffffff;
                border: 1px solid #ccc;
                box-sizing: border-box;
                overflow: hidden;
            }
            .preview-header {
                background-color: #f1f3f5;
                border-bottom: 1px solid #ddd;
                padding: 6px 12px;
                font-size: 13px;
                font-weight: bold;
                color: #333;
                font-family: sans-serif;
            }
            iframe {
                flex: 1;
                width: 100%;
                height: 100%;
                border: none;
                background-color: #ffffff;
            }
        `;

        let header = document.createElement('div');
        header.className = 'preview-header';
        header.textContent = 'Vista Previa en Vivo';

        this._iframe = document.createElement('iframe');
        this._iframe.id = 'preview-frame';
        this._iframe.setAttribute('sandbox', 'allow-same-origin');

        this.shadowRoot.append(style, header, this._iframe);
    }

    set state({ htmlCode = '' } = {})
    {
        let fullDocument = htmlCode.trim()
            ? htmlCode
            : '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><p style="color: #888; font-style: italic;">Arrastrá bloques al lienzo para empezar...</p></body></html>';

        this._iframe.srcdoc = fullDocument;
    }

    connectedCallback()
    {

    }

    disconnectedCallback()
    {

    }
}

customElements.define('live-preview', LivePreviewView);

class LivePreviewController
{
    constructor(view, model)
    {
        this._view = view;
        this._model = model;

        this._onModelChanged = this.onModelChanged.bind(this);
        this._onWorkspaceUpdated = this.onWorkspaceUpdated.bind(this);
    }

    enable()
    {
        this._model.addEventListener('changed', this._onModelChanged);
        document.addEventListener('webcraft:workspace-updated', this._onWorkspaceUpdated);

        this._view.state = this._model.getState();
    }

    disable()
    {
        this._model.removeEventListener('changed', this._onModelChanged);
        document.removeEventListener('webcraft:workspace-updated', this._onWorkspaceUpdated);
    }


    onModelChanged()
    {
        this._view.state = this._model.getState();
    }

   
    onWorkspaceUpdated(event)
    {
        let html = (event.detail && event.detail.html) ? event.detail.html : '';
        this._model.setHtmlCode(html);
    }
}

export {
    LivePreviewModel,
    LivePreviewView,
    LivePreviewController
};