class WCHeaderModel extends EventTarget
{
    constructor()
    {
        super();
        this._html = '';
    }

    getHtml()
    {
        return this._html;
    }

    setHtml(html)
    {
        this._html = html || '';
        this.changed();
    }

    changed()
    {
        this.dispatchEvent(new CustomEvent('changed', {
            detail: { html: this._html }
        }));
    }
}

export { WCHeaderModel };
