
//   - WorkspaceView  extends HTMLElement -> el lienzo de Blockly (con canvas),
//                                           y ahora también dueña del HTML generado

//   - WorkspaceController                -> escucha los cambios de la Vista y
//                                           los anuncia hacia afuera (webcraft:workspace-updated)

// El HTML generado es una salida visual, no un dato de dominio, así que
// vive adentro de WorkspaceView y no en un Modelo aparte. 
// Por eso ya no hay una clase Modelo en este archivo. 

// Este archivo usa el CONTRATO definido en toolbox.js (usa las funciones de toolbox)
import { registerAllBlocks, registerAllGenerators, getToolboxDefinition } from './toolbox.js';

// Se genera el codigo de html
// Hay un Blockly.Generator para todo el proyecto.

// Cada modulo de blocks/ suma sus propias funciones generator.forBlock['tipo']
// Y se hace a traves de registerAllGenerators(). Este archivo no sabe 
// que bloques existen: solo arma el generador y lo deja listo para usarse.


// esta funcion arma el HTML que representa el estado del lienzo (el "workspace"),
// no es el HTML que se va a mostrar en el futuro panel de Code Preview. 
function createWorkspaceViewGenerator()
{
    var generator = new Blockly.Generator('WebCraftHTML');

    generator.INDENT = '  ';

    
    generator.init = function (workspace)
    {
        // Por ahora no hace falta guardar estado entre bloques(anidados)
    };

    generator.finish = function (code)
    {
        return code;
    };


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
// Recorre los bloques 

function workspaceToData(workspace, generator)
{
    if (!workspace || !generator)
    {
        return { html: '' };
    }

    var code = generator.workspaceToCode(workspace);

    return { html: code };
}

// Vista
// Es el componente visual, el lienzo de Blockly en sí, 
// y ahora también la dueña del HTML generado 
// ya no hace falta un Modelo

class WorkspaceView extends HTMLElement
{
    constructor()
    {
        super();

        // El constructor de un Web Component no puede tocar sus propios hijos
        // Por eso acá solo se crea el <div>

        this.container = document.createElement('div');
        this.container.className = 'blockly-workspace-container';

        this.workspace = null;
        this.generator = null;
        this.html = '';
    }

    buildToolbox()
    {
        registerAllBlocks();
        this.generator = createWorkspaceViewGenerator();
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

    getHtml()
    {
        return this.html;
    }

    connectedCallback()
    {
        var self = this;

        // Recién acá es seguro insertar el <div> del lienzo.
        this.appendChild(this.container);

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

            // La Vista arma su propio HTML apenas detecta un cambio 
            self.html = workspaceToData(self.workspace, self.generator).html;

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
// Escucha los avisos de la Vista y los reenvia como un evento 
// a nivel document, para otras partes del sistema

class WorkspaceController
{
    constructor(view)
    {
        this.view = view;

        this.onViewRequest = this.onViewRequest.bind(this);
    }

    init()
    {
        this.view.addEventListener('request', this.onViewRequest);
    }

    release()
    {
        this.view.removeEventListener('request', this.onViewRequest);
    }

    onViewRequest(event)
    {
        if (event.detail.action === 'workspace-changed')
        {
            var html = this.view.getHtml();

            document.dispatchEvent(new CustomEvent('webcraft:workspace-updated', {
                detail: { html: html }
            }));
        }
    }
}

// inicio
var workspaceView = document.createElement('blockly-workspace-view');
document.body.appendChild(workspaceView);

var workspaceController = new WorkspaceController(workspaceView);
workspaceController.init();

export { WorkspaceView, WorkspaceController, workspaceToData };