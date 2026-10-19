// Header.js (Cabecera): contiene las acciones globales de control, en MVC.
//
//   - HeaderModel      extends EventTarget -> guarda el último HTML generado y sabe guardarlo
//   - HeaderView       extends HTMLElement -> el título y los botones; despacha 'request'
//   - HeaderController                     -> resuelve cada botón
//
// Botones y eventos que sube la cabecera hacia la aplicación (bubbles):
// * request-preview       : "Previsualizar HTML"
// * request-save          : "Guardar" (deja el proyecto guardado en el navegador)
// * request-download-html : "Descargar HTML"
// * request-export-png    : "Exportar a PNG"
// * request-save-project  : "Descargar proyecto" (baja el lienzo como archivo .json)
// * request-open-project  : "Abrir proyecto" (carga un archivo .json en el lienzo)


// MODELO
// Guarda el último HTML generado. La persistencia del lienzo (RF11) la maneja el Modelo del workspace.
class HeaderModel extends EventTarget
{
    constructor()
    {
        super();
        this._html = '';
    }

    getHtml()
    {
        return this._html;
    }

    setHtml(html)
    {
        this._html = html || '';
        this.changed();
    }

    changed()
    {
        this.dispatchEvent(new CustomEvent('changed', {
            detail: { html: this._html }
        }));
    }
}


// Crea un botón de la cabecera 
function createHeaderButton(action, text)
{
    let button = document.createElement('button');
    button.type = 'button';
    button.dataset.action = action;
    button.appendChild(document.createTextNode(text));
    return button;
}


// VISTA (HTMLElement)
// Arma el DOM en el constructor con nodos nativos (sin innerHTML).
// No decide qué hacer con cada botón: despacha un 'request'.
class HeaderView extends HTMLElement
{
    constructor()
    {
        super();

        let header = document.createElement('header');

        let title = document.createElement('h1');
        title.appendChild(document.createTextNode('WebCraft - Entorno Blockly'));

        this.actions = document.createElement('div');
        this.actions.classList.add('acciones');
        this.actions.appendChild(createHeaderButton('preview', 'Previsualizar HTML'));
        this.actions.appendChild(createHeaderButton('save', 'Guardar'));
        this.actions.appendChild(createHeaderButton('download-html', 'Descargar HTML'));
        this.actions.appendChild(createHeaderButton('export-png', 'Exportar a PNG'));
        this.actions.appendChild(createHeaderButton('save-project', 'Descargar proyecto'));
        this.actions.appendChild(createHeaderButton('open-project', 'Abrir proyecto'));

        header.appendChild(title);
        header.appendChild(this.actions);
        this.appendChild(header);

        // bind(this) para que "this" siga siendo la Vista
        this._onActionsClick = this._onActionsClick.bind(this);
        this.actions.addEventListener('click', this._onActionsClick);
    }

    connectedCallback()
    {

    }

    disconnectedCallback()
    {

    }

    // Traduce el clic de un botón en un pedido
    _onActionsClick(event)
    {
        let button = event.target.closest('[data-action]');
        if (!button)
        {
            return;
        }

        this.dispatchEvent(new CustomEvent('request', {
            detail: { action: button.dataset.action }
        }));
    }

    // Sube un aviso a la aplicación (bubbles: sube por el DOM)
    announce(eventName, html)
    {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { html: html }
        }));
    }
}

customElements.define('webcraft-header', HeaderView);


// CONTROLADOR (clase común)
// Resuelve qué hace cada botón y escucha el HTML que genera el workspace.
class HeaderController
{
    constructor(view, model)
    {
        this._view = view;
        this._model = model;

        this._onViewRequest = this.onViewRequest.bind(this);
        this._onWorkspaceUpdated = this.onWorkspaceUpdated.bind(this);
    }

    enable()
    {
        this._view.addEventListener('request', this._onViewRequest);
        document.addEventListener('webcraft:workspace-updated', this._onWorkspaceUpdated);
    }

    disable()
    {
        this._view.removeEventListener('request', this._onViewRequest);
        document.removeEventListener('webcraft:workspace-updated', this._onWorkspaceUpdated);
    }

    // Pedido de la Vista: según la acción, acá se resuelve qué hacer
    onViewRequest(event)
    {
        let action = event.detail.action;

        this._view.announce('request-' + action, this._model.getHtml());
    }

    // El workspace avisó que cambió el HTML generado
    onWorkspaceUpdated(event)
    {
        let html = (event.detail && event.detail.html) ? event.detail.html : '';
        this._model.setHtml(html);
    }
}

export {
    HeaderModel,
    HeaderView,
    HeaderController
};