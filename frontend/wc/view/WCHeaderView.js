const HEADER_ICONS = {
    'preview': [
        ['path', { d: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z' }],
        ['circle', { cx: '12', cy: '12', r: '3' }]
    ],
    'save': [
        ['path', { d: 'M5 3h11l4 4v14H5z' }],
        ['path', { d: 'M8 3v6h8V3' }],
        ['path', { d: 'M8 21v-7h8v7' }]
    ],
    'download-html': [
        ['path', { d: 'M12 3v12' }],
        ['path', { d: 'M7 10l5 5 5-5' }],
        ['path', { d: 'M5 21h14' }]
    ],
    'export-png': [
        ['rect', { x: '3', y: '4', width: '18', height: '16', rx: '2' }],
        ['circle', { cx: '9', cy: '10', r: '1.5' }],
        ['path', { d: 'M21 16l-5-5-8 9' }]
    ],
    'save-project': [
        ['path', { d: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }],
        ['path', { d: 'M12 10v6' }],
        ['path', { d: 'M9.5 13.5L12 16l2.5-2.5' }]
    ],
    'open-project': [
        ['path', { d: 'M3 19V6a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v2' }],
        ['path', { d: 'M5 19h13a2 2 0 0 0 2-1.5l1.5-6A1 1 0 0 0 20.5 10H7a2 2 0 0 0-2 1.5L3 19' }]
    ]
};

const BRAND_BLOCKS = [
    { x: 2, y: 5, color: '#5B67A5' },
    { x: 8, y: 17, color: '#5BA55B' },
    { x: 14, y: 29, color: '#A55B99' }
];

function createBrandBlockPath(x, y)
{
    let width = 30;
    let height = 12;

    return [
        'M' + (x + 2) + ' ' + y,
        'H' + (x + 7),
        'L' + (x + 8) + ' ' + (y + 3),
        'H' + (x + 14),
        'L' + (x + 15) + ' ' + y,
        'H' + (x + width - 2),
        'Q' + (x + width) + ' ' + y + ' ' + (x + width) + ' ' + (y + 2),
        'V' + (y + height - 2),
        'Q' + (x + width) + ' ' + (y + height) + ' ' + (x + width - 2) + ' ' + (y + height),
        'H' + (x + 15),
        'L' + (x + 14) + ' ' + (y + height + 3),
        'H' + (x + 8),
        'L' + (x + 7) + ' ' + (y + height),
        'H' + (x + 2),
        'Q' + x + ' ' + (y + height) + ' ' + x + ' ' + (y + height - 2),
        'V' + (y + 2),
        'Q' + x + ' ' + y + ' ' + (x + 2) + ' ' + y,
        'Z'
    ].join(' ');
}

function createBrandIcon()
{
    let namespace = 'http://www.w3.org/2000/svg';
    let svg = document.createElementNS(namespace, 'svg');

    svg.setAttribute('viewBox', '0 0 48 48');
    svg.setAttribute('width', '54');
    svg.setAttribute('height', '54');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('wc-brand-icon');

    for (let i = 0; i < BRAND_BLOCKS.length; i++)
    {
        let block = BRAND_BLOCKS[i];

        let path = document.createElementNS(namespace, 'path');
        path.setAttribute('d', createBrandBlockPath(block.x, block.y));
        path.setAttribute('fill', block.color);
        svg.appendChild(path);

        let stud = document.createElementNS(namespace, 'circle');
        stud.setAttribute('cx', block.x + 23);
        stud.setAttribute('cy', block.y + 6);
        stud.setAttribute('r', '2.4');
        stud.setAttribute('fill', '#ffffff');
        stud.setAttribute('fill-opacity', '0.85');
        svg.appendChild(stud);
    }

    return svg;
}

function createBrandLogo()
{
    let brand = document.createElement('div');
    brand.classList.add('wc-brand');
    brand.setAttribute('aria-label', 'WebCraft');

    let texts = document.createElement('div');
    texts.classList.add('wc-brand-texts');

    let name = document.createElement('h1');
    name.classList.add('wc-brand-name');

    let web = document.createElement('span');
    web.classList.add('wc-brand-web');
    web.appendChild(document.createTextNode('Web'));

    let craft = document.createElement('span');
    craft.classList.add('wc-brand-craft');
    craft.appendChild(document.createTextNode('Craft'));

    name.appendChild(web);
    name.appendChild(craft);

    let tagline = document.createElement('p');
    tagline.classList.add('wc-brand-tagline');
    tagline.appendChild(document.createTextNode('Editor de bloques HTML y CSS'));

    texts.appendChild(name);
    texts.appendChild(tagline);

    brand.appendChild(createBrandIcon());
    brand.appendChild(texts);

    return brand;
}

function createHeaderIcon(action)
{
    let namespace = 'http://www.w3.org/2000/svg';
    let svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    let shapes = HEADER_ICONS[action];
    for (let i = 0; i < shapes.length; i++)
    {
        let shape = document.createElementNS(namespace, shapes[i][0]);
        for (let name in shapes[i][1])
        {
            shape.setAttribute(name, shapes[i][1][name]);
        }
        svg.appendChild(shape);
    }

    return svg;
}

function createHeaderButton(action, text)
{
    let button = document.createElement('button');
    button.type = 'button';
    button.dataset.action = action;
    button.title = text;
    button.setAttribute('aria-label', text);
    button.appendChild(createHeaderIcon(action));
    return button;
}

class WCHeaderView extends HTMLElement
{
    constructor()
    {
        super();

        let header = document.createElement('header');

        let title = createBrandLogo();

        this.actions = document.createElement('div');
        this.actions.classList.add('acciones');
        this.actions.appendChild(createHeaderButton('preview', 'Previsualizar HTML'));
        this.actions.appendChild(createHeaderButton('save', 'Guardar'));
        this.actions.appendChild(createHeaderButton('download-html', 'Descargar HTML'));
        this.actions.appendChild(createHeaderButton('export-png', 'Exportar a PNG'));
        this.actions.appendChild(createHeaderButton('save-project', 'Descargar proyecto'));
        this.actions.appendChild(createHeaderButton('open-project', 'Abrir proyecto'));

        header.appendChild(title);
        header.appendChild(this.actions);
        this.appendChild(header);

        this._onActionsClick = this._onActionsClick.bind(this);
        this.actions.addEventListener('click', this._onActionsClick);
    }

    connectedCallback()
    {

    }

    disconnectedCallback()
    {

    }

    _onActionsClick(event)
    {
        let button = event.target.closest('[data-action]');
        if (!button)
        {
            return;
        }

        this.dispatchEvent(new CustomEvent('request', {
            detail: { action: button.dataset.action }
        }));
    }

    announce(eventName, html)
    {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { html: html }
        }));
    }
}

customElements.define('wc-header', WCHeaderView);

export { WCHeaderView };
