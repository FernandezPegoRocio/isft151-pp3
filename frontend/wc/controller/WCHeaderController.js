class WCHeaderController
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

    onViewRequest(event)
    {
        let action = event.detail.action;

        this._view.announce('request-' + action, this._model.getHtml());
    }

    onWorkspaceUpdated(event)
    {
        let html = (event.detail && event.detail.html) ? event.detail.html : '';
        this._model.setHtml(html);
    }
}

export { WCHeaderController };
