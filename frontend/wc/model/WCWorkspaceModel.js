const WORKSPACE_STORAGE_KEY = 'webcraft:workspace';

class WCWorkspaceModel extends EventTarget
{
    constructor()
    {
        super();
        this._html = '';
        this._state = null;
    }

    getHtml()
    {
        return this._html;
    }

    getState()
    {
        return this._state;
    }

    setProject(html, state)
    {
        this._html = html || '';
        this._state = state || null;
        this.saveToStorage();
        this.changed();
    }

    saveToStorage()
    {
        try
        {
            localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(this._state));
            return true;
        }
        catch (error)
        {
            return false;
        }
    }

    loadFromStorage()
    {
        try
        {
            let saved = localStorage.getItem(WORKSPACE_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        }
        catch (error)
        {
            return null;
        }
    }

    toProjectJson(state)
    {
        return JSON.stringify({
            app: 'webcraft',
            version: 1,
            workspace: state
        }, null, 2);
    }

    parseProjectJson(text)
    {
        let data = JSON.parse(text);

        if (!data || data.app !== 'webcraft' || !data.workspace)
        {
            throw new Error('El archivo no es un proyecto de WebCraft');
        }

        return data.workspace;
    }

    changed()
    {
        this.dispatchEvent(new CustomEvent('changed', {
            detail: { html: this._html }
        }));
    }
}

export { WCWorkspaceModel };
