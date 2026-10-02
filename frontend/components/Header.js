// Header.js (Cabecera): Contiene las acciones globales de control.
// Botones: 
// * request-preview: Mostrará el componente/area CodePreview cuando se haga click
// * request-save: guardará el proyecto en el local storage
// * request-download-html: Cuando se hace clic en "Descargar HTML".
// * request-export-png: Cuando se hace clic en "Exportar a PNG".
	

class WebCraftHeader extends HTMLElement {
    constructor() {
        super();
        this.html = '';
        this.onWorkspaceUpdated = this.onWorkspaceUpdated.bind(this);
        this.onAction = this.onAction.bind(this);
    }

    connectedCallback() {
        this.render();
        document.addEventListener('webcraft:workspace-updated', this.onWorkspaceUpdated);
    }

    disconnectedCallback() {
        document.removeEventListener('webcraft:workspace-updated', this.onWorkspaceUpdated);
    }

    render() {
        this.innerHTML = `
            <header>
                <h1>WebCraft - Entorno Blockly</h1>
                <div class="acciones">
                    <button type="button" data-action="preview">Previsualizar HTML</button>
                    <button type="button" data-action="save">Guardar</button>
                    <button type="button" data-action="download-html">Descargar HTML</button>
                    <button type="button" data-action="export-png">Exportar a PNG</button>
                </div>
            </header>
        `;

        this.querySelector('.acciones').addEventListener('click', this.onAction);
    }

    onWorkspaceUpdated(event) {
        this.html = event.detail?.html || '';
    }

    onAction(event) {
        const button = event.target.closest('[data-action]');
        if (!button) return;

        const actions = {
            preview: 'request-preview',
            save: 'request-save',
            'download-html': 'request-download-html',
            'export-png': 'request-export-png'
        };
        const action = actions[button.dataset.action];

        if (button.dataset.action === 'save') {
            localStorage.setItem('webcraft:html', this.html);
        }

        this.dispatchEvent(new CustomEvent(action, {
            bubbles: true,
            detail: { html: this.html }
        }));
    }
}

customElements.define('webcraft-header', WebCraftHeader);

export { WebCraftHeader };

