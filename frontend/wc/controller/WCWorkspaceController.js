class WCWorkspaceController
{
    constructor(view, model)
    {
        this._view = view;
        this._model = model;

        this._onViewRequest = this.onViewRequest.bind(this);
        this._onModelChanged = this.onModelChanged.bind(this);
    }

    enable()
    {
        this._view.addEventListener('request', this._onViewRequest);
        this._model.addEventListener('changed', this._onModelChanged);
    }

    disable()
    {
        this._view.removeEventListener('request', this._onViewRequest);
        this._model.removeEventListener('changed', this._onModelChanged);
    }

    onViewRequest(event)
    {
        let action = event.detail.action;

        if (action === 'workspace-changed')
        {
            this.updateModel();
        }
        else if (action === 'workspace-ready')
        {
            let saved = this._model.loadFromStorage();

            if (saved)
            {
                this.restoreState(saved);
            }
        }
    }

    updateModel()
    {
        this._model.setProject(this._view.getHtml(), this._view.getState());
    }

    restoreState(state)
    {
        try
        {
            this._view.setState(state);
        }
        catch (error)
        {
            return false;
        }

        this.updateModel();
        return true;
    }

    saveNow()
    {
        this.updateModel();
        return this._model.saveToStorage();
    }

    getProjectJson()
    {
        return this._model.toProjectJson(this._view.getState());
    }

    loadProjectJson(text)
    {
        let state = null;

        try
        {
            state = this._model.parseProjectJson(text);
        }
        catch (error)
        {
            this._view.showMessage('No se pudo abrir el archivo: no es un proyecto de WebCraft válido.');
            return;
        }

        if (!this.restoreState(state))
        {
            this._view.showMessage('No se pudo abrir el archivo: tiene bloques que WebCraft no conoce.');
        }
    }

    onModelChanged(event)
    {
        document.dispatchEvent(new CustomEvent('webcraft:workspace-updated', {
            detail: { html: event.detail.html }
        }));
    }
}

export { WCWorkspaceController };
