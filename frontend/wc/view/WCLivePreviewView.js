class WCLivePreviewView extends HTMLElement
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
        header.classList.add('preview-header');
        header.textContent = 'Vista Previa en Vivo';

        this._iframe = document.createElement('iframe');
        this._iframe.id = 'preview-frame';
        this._iframe.setAttribute('sandbox', 'allow-same-origin');

        this.shadowRoot.append(style, header, this._iframe);
    }

    getBody()
    {
        return this._iframe.contentDocument ? this._iframe.contentDocument.body : null;
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

customElements.define('wc-live-preview', WCLivePreviewView);

export { WCLivePreviewView };
