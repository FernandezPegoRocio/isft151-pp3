class BlocklyModel extends EventTarget
{
    constructor()
    {
        super();

    }

    actualizar(data)
    {
        this.data = data;
        this.dispatchEvent(new CustomEvent('changed'));
    }

    getData()
    {
        return this.data;
    }
}

class BlocklyView extends HTMLElement
{
    constructor()
    {
        super();
        this.container = document.createElement('div');
        this.container.classList.add('blockly-workspace-container');
        this.appendChild(this.container);
    }

    buildToolbox()
    {
        // prueba para validar que el mecanismo de arrastre funciona.
        // Rosmary lo va a reemplazar con los bloques HTML reales.
        return {
            kind: 'flyoutToolbox',
            contents: [
                { kind: 'block', type: 'controls_if' },
                { kind: 'block', type: 'logic_compare' },
                { kind: 'block', type: 'math_number' },
                { kind: 'block', type: 'text' }
            ]
        };
    }

    connectedCallback()
    {
        //el elemento ya está insertado en el document,
        // así que el container tiene tamaño real y Blockly.inject
     
        this.toolbox = this.buildToolbox();
        this.workspace = Blockly.inject(this.container, {
            toolbox: this.toolbox
        });

        var self = this;
        this.workspace.addChangeListener(function (event) {
            self.dispatchEvent(new CustomEvent('request', {
                detail: { action: 'workspace-changed' }
            }));
        });
    }

    update(data)
    {
        // subir
    }
}

class BlocklyController
{
    constructor(model, view)
    {
        this.model = model;
        this.view = view;
        this._onModelChanged = this.onModelChanged.bind(this);
        this._onViewRequest = this.onViewRequest.bind(this);
    }

    init()
    {
        this.model.addEventListener('changed', this._onModelChanged);
        this.view.addEventListener('request', this._onViewRequest);
    }

    release()
    {
        this.model.removeEventListener('changed', this._onModelChanged);
        this.view.removeEventListener('request', this._onViewRequest);
    }

    onViewRequest(event)
    {
        this.model.actualizar(event.detail);
    }

    onModelChanged()
    {
        this.view.update(this.model.getData());
    }
}

customElements.define('blockly-workspace-view', BlocklyView);

function main()
{
    let myModel = new BlocklyModel();
    let myView = new BlocklyView();
    let myController = new BlocklyController(myModel, myView);
    myController.init();
    document.body.appendChild(myView);
}

window.onload = main;

export { BlocklyModel, BlocklyView, BlocklyController };