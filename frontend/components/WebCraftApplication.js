// WebCraftApplication.js

// Este es el contenedor general del proyecto: no define bloques ni lógica
// propia, solo arma el layout grande que junta a los componentes
// y los acomoda en pantalla.

// Cada import de abajo carga el archivo que define su propio Web Component

import { WorkspaceView, WorkspaceController } from './BlocklyWorkspace.js';
import './Header.js';
import './LivePreview.js';
import './CodePreview.js';

class WebCraftApplication extends HTMLElement
{
    constructor()
    {
        super();

        // El constructor no puede tocar sus propios hijos (misma regla que
        // en WorkspaceView), así que acá solo se preparan las piezas.
        this.header = document.createElement('webcraft-header');
        this.workspace = document.createElement('blockly-workspace-view');
        this.preview = document.createElement('webcraft-preview');
        this.codePreview = document.createElement('code-preview');

        this.workspaceArea = document.createElement('div');
        this.workspaceArea.className = 'webcraft-workspace-area';

        // Preview y Code Preview comparten este panel y se turnan con el
        // botón "Previsualizar HTML" en vez de ir cada uno en su columna.
        this.previewArea = document.createElement('div');
        this.previewArea.className = 'webcraft-preview-area';

        this.showingCode = false;

        this.workspaceController = null;
        this.onHeaderPreviewRequest = this.onHeaderPreviewRequest.bind(this);
    }

    connectedCallback()
    {
        // Recién acá es seguro armar el layout: header arriba, y debajo una
        // fila con el workspace y el panel compartido de preview/código.
        this.appendChild(this.header);

        this.previewArea.appendChild(this.preview);
        this.previewArea.appendChild(this.codePreview);

        this.workspaceArea.appendChild(this.workspace);
        this.workspaceArea.appendChild(this.previewArea);
        this.appendChild(this.workspaceArea);

        // Arranca mostrando la Live Preview, con el Code Preview escondido.
        this.applyPreviewVisibility();

        // El botón "Previsualizar HTML" del Header dispara 'request-preview'
        // (bubbles: true); lo escuchamos acá para alternar cuál se muestra.
        this.addEventListener('request-preview', this.onHeaderPreviewRequest);

        // Acá es donde antes BlocklyWorkspace.js armaba su propio
        // Controlador. Ahora lo arma la Aplicación, porque es quien conoce
        // dónde vive cada pieza.
        this.workspaceController = new WorkspaceController(this.workspace);
        this.workspaceController.init();
    }

    disconnectedCallback()
    {
        this.removeEventListener('request-preview', this.onHeaderPreviewRequest);

        if (this.workspaceController)
        {
            this.workspaceController.release();
            this.workspaceController = null;
        }
    }

    onHeaderPreviewRequest()
    {
        this.showingCode = !this.showingCode;
        this.applyPreviewVisibility();
    }

    applyPreviewVisibility()
    {
        this.preview.style.display = this.showingCode ? 'none' : '';
        this.codePreview.style.display = this.showingCode ? '' : 'none';
    }
}

customElements.define('webcraft-application', WebCraftApplication);

export { WebCraftApplication };

// inicio
var app = document.createElement('webcraft-application');
document.body.appendChild(app);