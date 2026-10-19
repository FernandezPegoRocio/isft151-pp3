// WebCraftApplication.js
//El modelo --> Guardar el Estado
//La vista --> arma el layout y dispara el evento
//El Controlador --> Resuelve los pedidos
//Main --> Instancia todo
//Carga los archivos
//Del BlockyWorkspace traemos el controlador para instanciarlo


import { HeaderView, HeaderModel, HeaderController } from './Header.js';
import { WorkspaceView, WorkspaceModel, WorkspaceController } from './BlocklyWorkspace.js';
import { LivePreviewView, LivePreviewModel, LivePreviewController } from './LivePreview.js';
import { CodePreviewView, CodePreviewModel, CodePreviewController } from './CodePreview.js';




// Baja un Blob como archivo: crea un <a> temporal, lo "clickea" y lo descarta.
function downloadBlob(blob, fileName)
{
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


// Descargar HTML: guarda el HTML generado por los bloques en un .html
function downloadHtml(html)
{
    if (!html)
    {
        window.alert('Todavía no hay bloques para descargar.');
        return;
    }

    downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), 'webcraft.html');
}


// Exportar a PNG: html2canvas "saca una foto" del cuerpo de la Live Preview
// y la baja como imagen. Devuelve la promesa para poder avisar cuándo termina.
function exportPng(bodyElement)
{
    if (typeof html2canvas !== 'function' || !bodyElement)
    {
        window.alert('No se pudo exportar: falta la librería html2canvas o la vista previa.');
        return Promise.resolve();
    }

    return html2canvas(bodyElement, { backgroundColor: '#ffffff' }).then(function (canvas)
    {
        canvas.toBlob(function (blob)
        {
            downloadBlob(blob, 'webcraft.png');
        }, 'image/png');
    });
}


// Abrir proyecto: muestra el selector de archivos y le pasa el texto del
// archivo elegido a la función que recibe.
function pickTextFile(onText)
{
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';

    input.addEventListener('change', function ()
    {
        let file = input.files[0];

        if (!file)
        {
            return;
        }

        let reader = new FileReader();

        reader.addEventListener('load', function ()
        {
            onText(reader.result);
        });

        reader.readAsText(file);
    });

    input.click();
}


class WebCraftApplicationModel extends EventTarget
{

    constructor()
    {
        super();
        
        this.showingCode = false;
    }


    isShowingCode()
    {
        return this.showingCode;
    }


    toggleCodeView()
    {
        this.showingCode = !this.showingCode;
        this.changed();
    }


    changed()
    {
        this.dispatchEvent(new CustomEvent('changed', {
            detail: { showingCode: this.showingCode }
        }));
    }
}


// VISTA (HTMLElement)
// Crea las piezas, las acomoda, y traduce el clic del Header en una acción.
// NO resuelve qué hacer: solo avisa "quiero que alguien haga esto".


class WebCraftApplicationView extends HTMLElement
{
    constructor()
    {

        super();

        // Cada pieza es una Vista: se crean con new (como en la plantilla)
        this.header = new HeaderView();
        this.workspace = new WorkspaceView();
        this.preview = new LivePreviewView();
        this.codePreview = new CodePreviewView();

        // Fila que va debajo del header: workspace a la izquierda y
        // panel de previews a la derecha. La clase CSS es el "gancho" para
        // que el CSS del index.html la acomode con flex.
        this.workspaceArea = document.createElement('div');
        this.workspaceArea.classList.add('webcraft-workspace-area');

        // Live Preview y Code Preview comparten este panel
        this.previewArea = document.createElement('div');
        this.previewArea.classList.add('webcraft-preview-area');

        this.previewArea.appendChild(this.preview);
        this.previewArea.appendChild(this.codePreview);

        this.workspaceArea.appendChild(this.workspace);
        this.workspaceArea.appendChild(this.previewArea);

        // El layout completo se arma acá, en el constructor, como en la
        // plantilla de la cátedra (por eso la vista se crea con new).
        this.appendChild(this.header);
        this.appendChild(this.workspaceArea);

        // Escucha el clic del Header
        // el evento sube por el DOM porque
        // el Header lo despacha con bubbles: true
        // bind(this) para que "this" siga siendo la Vista
        this._onHeaderRequest = this._onHeaderRequest.bind(this);
        this.addEventListener('request-preview', this._onHeaderRequest);
        this.addEventListener('request-download-html', this._onHeaderRequest);
        this.addEventListener('request-export-png', this._onHeaderRequest);
        this.addEventListener('request-save', this._onHeaderRequest);
        this.addEventListener('request-save-project', this._onHeaderRequest);
        this.addEventListener('request-open-project', this._onHeaderRequest);
    }

    connectedCallback()
    {

    }

    disconnectedCallback()
    {

    }

    // La Vista se despacha un evento 'request' a sí misma, con el nombre
    // de la acción. Quién lo resuelve es problema del Controlador.


    _onHeaderRequest(event)
    {
        // Acá la Vista traduce el aviso del Header en una acción de 'request'
        let actions = {
            'request-preview': 'toggle-preview',
            'request-download-html': 'download-html',
            'request-export-png': 'export-png',
            'request-save': 'save',
            'request-save-project': 'save-project',
            'request-open-project': 'open-project'
        };

        this.dispatchEvent(new CustomEvent('request', {
            detail: { action: actions[event.type], html: event.detail.html }
        }));
    }


    // Muestra un mensaje al estudiante
    showMessage(text)
    {
        window.alert(text);
    }


    getHeader()
    {
        return this.header;
    }


    getWorkspace()
    {
        return this.workspace;
    }


    getPreview()
    {
        return this.preview;
    }


    getCodePreview()
    {
        return this.codePreview;
    }


    // Muestra una preview y esconde la otra
    showPreview(showingCode)
    {
        // Si muestro código, la Live Preview se oculta; si no, se deja normal.
        this.preview.style.display = showingCode ? 'none' : '';
        this.codePreview.style.display = showingCode ? '' : 'none';
    }
}


customElements.define('webcraft-application', WebCraftApplicationView);
// Registra la etiqueta <webcraft-application> en el navegador.


// CONTROLADOR (clase común)
// Tiene la instancia de la Vista y del Modelo.
// Ante un pedido de la Vista, decide qué hay que hacer.
class WebCraftApplicationController
{
    constructor(view, model)
    {
        // El Controlador recibe la Vista y el Modelo:
        // es el único que conoce a los dos.
        this._view = view;
        this._model = model;
        this._headerController = null;
        this._workspaceController = null;
        this._livePreviewController = null;
        this._codePreviewController = null;

        this._onViewRequest = this.onViewRequest.bind(this);
        this._onModelChanged = this.onModelChanged.bind(this);
    }


    enable()
    {
        // enable empieza a escuchar: los pedidos de la Vista y
        // los cambios del Modelo.
        this._view.addEventListener('request', this._onViewRequest);
        this._model.addEventListener('changed', this._onModelChanged);

        // Cada pieza tiene su propio Modelo y su propio Controlador
        this._headerController = new HeaderController(this._view.getHeader(), new HeaderModel());
        this._headerController.enable();

        this._workspaceController = new WorkspaceController(this._view.getWorkspace(), new WorkspaceModel());
        this._workspaceController.enable();

        this._livePreviewController = new LivePreviewController(this._view.getPreview(), new LivePreviewModel());
        this._livePreviewController.enable();

        this._codePreviewController = new CodePreviewController(this._view.getCodePreview(), new CodePreviewModel());
        this._codePreviewController.enable();

        // Estado inicial: muestra la Live Preview
        this._view.showPreview(this._model.isShowingCode());
    }


    disable()
    {
        // disable deshace lo de enable
        this._view.removeEventListener('request', this._onViewRequest);
        this._model.removeEventListener('changed', this._onModelChanged);

        if (this._headerController)
        {
            this._headerController.disable();
            this._headerController = null;
        }

        if (this._workspaceController)
        {
            this._workspaceController.disable();
            this._workspaceController = null;
        }

        if (this._livePreviewController)
        {
            this._livePreviewController.disable();
            this._livePreviewController = null;
        }

        if (this._codePreviewController)
        {
            this._codePreviewController.disable();
            this._codePreviewController = null;
        }
    }

    // Pedido de la Vista: según la acción, acá se resuelve qué hacer
    onViewRequest(event)
    {
        // Acá el Controlador resuelve realmente qué hacer según la acción.
        let action = event.detail.action;

        if (action === 'toggle-preview')
        {
            this._model.toggleCodeView();
        }
        else if (action === 'download-html')
        {
            downloadHtml(event.detail.html);
        }
        else if (action === 'export-png')
        {
            this.exportPreviewAsPng();
        }
        else if (action === 'save')
        {
            this.saveInBrowser();
        }
        else if (action === 'save-project')
        {
            this.downloadProject();
        }
        else if (action === 'open-project')
        {
            this.openProject();
        }
    }

    // Guardar: deja el trabajo guardado en el navegador (además del guardado automático)
    saveInBrowser()
    {
        if (this._workspaceController.saveNow())
        {
            this._view.showMessage('Proyecto guardado en este navegador.');
        }
        else
        {
            this._view.showMessage('No se pudo guardar en el navegador. Descargá el proyecto como archivo.');
        }
    }

    // Descargar proyecto: baja el lienzo como archivo .json
    downloadProject()
    {
        let json = this._workspaceController.getProjectJson();

        downloadBlob(new Blob([json], { type: 'application/json' }), 'webcraft-proyecto.json');
    }

    // Abrir proyecto: elige un archivo .json y lo carga en el lienzo
    openProject()
    {
        let workspaceController = this._workspaceController;

        pickTextFile(function (text)
        {
            workspaceController.loadProjectJson(text);
        });
    }

    // La Live Preview tiene que estar visible para poder "fotografiarla":
    // si se está mostrando el código, la muestra un momento y después la vuelve a esconder.
    exportPreviewAsPng()
    {
        let view = this._view;
        let wasShowingCode = this._model.isShowingCode();

        if (wasShowingCode)
        {
            view.showPreview(false);
        }

        exportPng(view.getPreview().getBody()).then(function ()
        {
            if (wasShowingCode)
            {
                view.showPreview(true);
            }
        });
    }

    // El Modelo cambió: le digo a la Vista que se actualice
    onModelChanged(event)
    {
        this._view.showPreview(event.detail.showingCode);
    }
}


export {
    WebCraftApplicationModel,
    WebCraftApplicationView,
    WebCraftApplicationController
};


// MAIN: instancia todo en orden y arranca la aplicación
function main()
{

    let myView = new WebCraftApplicationView();
    let myModel = new WebCraftApplicationModel();
    let myController = new WebCraftApplicationController(myView, myModel);

    myController.enable();
    document.body.appendChild(myView);

}

window.onload = main;