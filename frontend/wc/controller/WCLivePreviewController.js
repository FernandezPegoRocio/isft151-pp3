class WCLivePreviewController
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

export { WCLivePreviewController };
