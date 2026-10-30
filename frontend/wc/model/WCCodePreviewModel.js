class WCCodePreviewModel extends EventTarget
{
    constructor()
    {
        super();
        this._htmlCode = '';
        this._cssCode = '';
        this._activeTab = 'html';
    }

    getState()
    {
        return {
            htmlCode: this._htmlCode,
            cssCode: this._cssCode,
            activeTab: this._activeTab
        };
    }

    setHtmlCode(html = '')
    {
        this._htmlCode = html || '';
        this._cssCode = this.extractCss(this._htmlCode);
        this.changed();
    }

    setActiveTab(tab = 'html')
    {
        this._activeTab = ['html', 'css'].includes(tab) ? tab : 'html';
        this.changed();
    }

    changed()
    {
        this.dispatchEvent(new CustomEvent('changed', {
            detail: this.getState()
        }));
    }

    extractCss(html)
    {
        if (!html || !html.trim())
        {
            return '';
        }

        let parsedDocument = new DOMParser().parseFromString(html, 'text/html');
        let cssParts = [];

        let styles = parsedDocument.querySelectorAll('style');
        for (let i = 0; i < styles.length; i++)
        {
            let text = styles[i].textContent.trim();
            if (text)
            {
                cssParts.push(text);
            }
        }

        let styledElements = parsedDocument.querySelectorAll('[style]');
        for (let i = 0; i < styledElements.length; i++)
        {
            let element = styledElements[i];
            let declarations = (element.getAttribute('style') || '').trim();
            if (!declarations)
            {
                continue;
            }

            let selector = this.getElementSelector(element);
            let formatted = declarations.replace(/;\s*/g, ';\n  ').replace(/;\n  $/, ';');
            cssParts.push(selector + ' {\n  ' + formatted + '\n}');
        }

        return cssParts.join('\n\n');
    }

    getElementSelector(element)
    {
        let path = [];
        let current = element;

        while (current && current !== current.ownerDocument.body && current !== current.ownerDocument.documentElement)
        {
            let selector = current.localName;
            let siblings = current.parentElement ? current.parentElement.children : [];
            let sameType = [];

            for (let i = 0; i < siblings.length; i++)
            {
                if (siblings[i].localName === current.localName)
                {
                    sameType.push(siblings[i]);
                }
            }

            if (sameType.length > 1)
            {
                selector += ':nth-of-type(' + (sameType.indexOf(current) + 1) + ')';
            }

            path.unshift(selector);
            current = current.parentElement;
        }

        if (element === element.ownerDocument.body)
        {
            return 'body';
        }
        if (current === element.ownerDocument.body)
        {
            path.unshift('body');
        }
        return path.join(' > ');
    }
}

export { WCCodePreviewModel };
