import { WCCodePreviewController } from './WCCodePreviewController.js';
import { WCCodePreviewModel } from '../model/WCCodePreviewModel.js';
import { WCHeaderController } from './WCHeaderController.js';
import { WCHeaderModel } from '../model/WCHeaderModel.js';
import { WCLivePreviewController } from './WCLivePreviewController.js';
import { WCLivePreviewModel } from '../model/WCLivePreviewModel.js';
import { WCWorkspaceController } from './WCWorkspaceController.js';
import { WCWorkspaceModel } from '../model/WCWorkspaceModel.js';

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

function downloadHtml(html)
{
    if (!html)
    {
        window.alert('Todavía no hay bloques para descargar.');
        return;
    }

    downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), 'webcraft.html');
}

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

class WCApplicationController
{
    constructor(view, model)
    {
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
        this._view.addEventListener('request', this._onViewRequest);
        this._model.addEventListener('changed', this._onModelChanged);

        this._headerController = new WCHeaderController(this._view.getHeader(), new WCHeaderModel());
        this._headerController.enable();

        this._workspaceController = new WCWorkspaceController(this._view.getWorkspace(), new WCWorkspaceModel());
        this._workspaceController.enable();

        this._livePreviewController = new WCLivePreviewController(this._view.getPreview(), new WCLivePreviewModel());
        this._livePreviewController.enable();

        this._codePreviewController = new WCCodePreviewController(this._view.getCodePreview(), new WCCodePreviewModel());
        this._codePreviewController.enable();

        this._view.showPreview(this._model.isShowingCode());
    }

    disable()
    {
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

    onViewRequest(event)
    {
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

    downloadProject()
    {
        let json = this._workspaceController.getProjectJson();

        downloadBlob(new Blob([json], { type: 'application/json' }), 'webcraft-proyecto.json');
    }

    openProject()
    {
        let workspaceController = this._workspaceController;

        pickTextFile(function (text)
        {
            workspaceController.loadProjectJson(text);
        });
    }

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

    onModelChanged(event)
    {
        this._view.showPreview(event.detail.showingCode);
    }
}

export { WCApplicationController };
