import { WCCodePreviewView } from './WCCodePreviewView.js';
import { WCFooterView } from './WCFooterView.js';
import { WCHeaderView } from './WCHeaderView.js';
import { WCLivePreviewView } from './WCLivePreviewView.js';
import { WCWorkspaceView } from './WCWorkspaceView.js';

class WCApplicationView extends HTMLElement
{
    constructor()
    {

        super();

        this.header = new WCHeaderView();
        this.workspace = new WCWorkspaceView();
        this.preview = new WCLivePreviewView();
        this.codePreview = new WCCodePreviewView();
        this.footer = new WCFooterView();

        this.workspaceArea = document.createElement('div');
        this.workspaceArea.classList.add('wc-workspace-area');

        this.previewArea = document.createElement('div');
        this.previewArea.classList.add('wc-preview-area');

        this.previewArea.appendChild(this.preview);
        this.previewArea.appendChild(this.codePreview);

        this.workspaceArea.appendChild(this.workspace);
        this.workspaceArea.appendChild(this.previewArea);

        this.appendChild(this.header);
        this.appendChild(this.workspaceArea);
        this.appendChild(this.footer);

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

    _onHeaderRequest(event)
    {
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

    showPreview(showingCode)
    {
        this.preview.style.display = showingCode ? 'none' : '';
        this.codePreview.style.display = showingCode ? '' : 'none';
    }
}

customElements.define('wc-application', WCApplicationView);

export { WCApplicationView };
