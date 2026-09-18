//  info relevante:
//   - WorkspaceModel  extends EventTarget   -> guarda el codigo generado
//   - WorkspaceView   extends HTMLElement   -> el lienzo de Blockly (es con canvas)
//   - WorkspaceController                   -> conecta Model y View, no se conocen entre si.

// Este archivo usa el CONTRATO definido en Toolbox.js (usa las funciones de toolbox)
import { registerAllBlocks, registerAllGenerators, getToolboxDefinition } from './Toolbox.js';

// Se genera el codigo de html
// Hay un Blockly.Generator para todo el proyecto. 
// Cada modulo de blocks/ suma sus propias funciones generator.forBlock['tipo'] 
// Y se hace a traves de registerAllGenerators(). Este archivo no sabe (ni le importa) 
// que bloques existen: solo arma el generador y lo deja listo para usarse.

function createHtmlGenerator()
{
    var generator = new Blockly.Generator('WebCraftHTML');

    generator.INDENT = '  ';

    // Se ejecuta una vez al empezar a generar codigo para todo el workspace

    generator.init = function (workspace)
    {
        // Por ahora no hace falta guardar estado entre bloques(anidados)
    
    };

    // Se ejecuta una sola vez al terminar de recorrer todos los bloques

    generator.finish = function (code)
    {
        return code;
    };

    // Encadena el codigo de un bloque con el del bloque conectado debajo
    // (bloque.getNextBlock()),  es como Blockly arma sentencias en serie.

    generator.scrub_ = function (block, code, opt_thisOnly)
    {
        var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        var nextCode = (opt_thisOnly || !nextBlock) ? '' : generator.blockToCode(nextBlock);
        return code + nextCode;
    };

    registerAllGenerators(generator);

    return generator;
}

// workspace, generator
// Recorre los bloques comienza desde arriba del workspace 
// y les pide al generador el codigo HTMLn de lo que se hace
// se agrega, mueve, conecta o borra un bloque

function workspaceToData(workspace, generator)
{
    if (!workspace || !generator)
    {
        return { html: '' };
    }

    var code = generator.workspaceToCode(workspace);

    return { html: code };
}
// modelo

class WorkspaceModel extends EventTarget
{
    constructor()
    {
        super();
        this.data = { html: '' };
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

// Vista

class WorkspaceView extends HTMLElement
{
    constructor()
    {
        super();

        this.container = document.createElement('div');
        this.container.className = 'blockly-workspace-container';
        this.appendChild(this.container);

        this.workspace = null;
        this.generator = null;
    }

    buildToolbox()
    {
        registerAllBlocks();
        this.generator = createHtmlGenerator();
        return getToolboxDefinition();
    }

    getWorkspace()
    {
        return this.workspace;
    }

    getGenerator()
    {
        return this.generator;
    }

    connectedCallback()
    {
        var self = this;

        var toolboxDefinition = this.buildToolbox();

        this.workspace = Blockly.inject(this.container, {
            toolbox: toolboxDefinition
        });

        this.workspace.addChangeListener(function (event)
        {
            if (event.isUiEvent)
            {
                return;
            }

            self.dispatchEvent(new CustomEvent('request', {
                detail: { action: 'workspace-changed' }
            }));
        });
    }

    disconnectedCallback()
    {
        if (this.workspace)
        {
            this.workspace.dispose();
            this.workspace = null;
        }
    }
}

customElements.define('blockly-workspace-view', WorkspaceView);

// Controlador

class WorkspaceController
{
    constructor(model, view)
    {
        this.model = model;
        this.view = view;

        this.onViewRequest = this.onViewRequest.bind(this);
        this.onModelChanged = this.onModelChanged.bind(this);
    }

    init()
    {
        this.view.addEventListener('request', this.onViewRequest);
        this.model.addEventListener('changed', this.onModelChanged);
    }

    release()
    {
        this.view.removeEventListener('request', this.onViewRequest);
        this.model.removeEventListener('changed', this.onModelChanged);
    }

    onViewRequest(event)
    {
        if (event.detail.action === 'workspace-changed')
        {
            var data = workspaceToData(this.view.getWorkspace(), this.view.getGenerator());
            this.model.actualizar(data);
        }
    }

    onModelChanged()
    {
        var data = this.model.getData();

        // En esta parte va lo de Syls
        // El componente de Preview 

        document.dispatchEvent(new CustomEvent('webcraft:workspace-updated', {
            detail: data
        }));
    }
}


// inicio

var workspaceModel = new WorkspaceModel();
var workspaceView = document.createElement('blockly-workspace-view');
document.body.appendChild(workspaceView);

var workspaceController = new WorkspaceController(workspaceModel, workspaceView);
workspaceController.init();

export { WorkspaceModel, WorkspaceView, WorkspaceController, workspaceToData };