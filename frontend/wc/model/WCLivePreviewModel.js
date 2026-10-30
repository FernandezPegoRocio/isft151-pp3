class WCLivePreviewModel extends EventTarget
{
    constructor()
    {
        super();
        this._htmlCode = '';
    }

    getState()
    {
        return { htmlCode: this._htmlCode };
    }

    setHtmlCode(html = '')
    {
        this._htmlCode = html || '';
        this.changed();
    }

    changed()
    {
        this.dispatchEvent(new CustomEvent('changed', {
            detail: this.getState()
        }));
    }
}

export { WCLivePreviewModel };
