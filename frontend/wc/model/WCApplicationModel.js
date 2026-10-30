class WCApplicationModel extends EventTarget
{

    constructor()
    {
        super();
        
        this.showingCode = false;
    }

    isShowingCode()
    {
        return this.showingCode;
    }

    toggleCodeView()
    {
        this.showingCode = !this.showingCode;
        this.changed();
    }

    changed()
    {
        this.dispatchEvent(new CustomEvent('changed', {
            detail: { showingCode: this.showingCode }
        }));
    }
}

export { WCApplicationModel };
