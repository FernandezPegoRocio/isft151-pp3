// BlocklyWorkspace.js — el lienzo de Blockly, en MVC:
//
//   - WorkspaceModel      extends EventTarget -> guarda el HTML generado y avisa con 'changed'
//   - WorkspaceView       extends HTMLElement -> el lienzo de Blockly; despacha 'request'
//   - WorkspaceController                     -> resuelve el pedido de la Vista, actualiza el
//                                                Modelo y anuncia hacia afuera
//                                                (webcraft:workspace-updated)

import { registerAllBlocks, registerAllGenerators, getToolboxDefinition } from './Toolbox.js';

function createWorkspaceViewGenerator()
{
    let generator = new Blockly.Generator('WebCraftHTML');

    generator.INDENT = '  ';
    
    generator.ORDER_ATOMIC = 0;
    generator.ORDER_NONE = 99;

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
        let nextBlock = block.nextConnection && block.nextConnection.targetBlock();
        let nextCode = (opt_thisOnly || !nextBlock) ? '' : generator.blockToCode(nextBlock);
        return code + nextCode;
    };

    // Garantiza que un valor quede siempre bien formado entre comillas
    generator.quoteAttr = function (value)
    {
        let texto = (value === undefined || value === null) ? '' : String(value);
        texto = texto.replace(/"/g, '&quot;');
        return '"' + texto + '"';
    };

    registerAllGenerators(generator);

    // El bloque de texto ("...") es un bloque estándar de Blockly y ninguna
    // categoría le define generador. Si nadie lo definió, se agrega acá para
    // que los bloques con entrada de texto (<p>, <span>, <img>, etc.) puedan
    // recibirlo. Devuelve el texto entre comillas, como esperan los demás.
    if (typeof generator.forBlock['text'] !== 'function')
    {
        generator.forBlock['text'] = function (block)
        {
            let valor = block.getFieldValue('TEXT');
            return [generator.quoteAttr(valor), generator.ORDER_ATOMIC];
        };
    }

    return generator;
}

// Recorre los bloques

function workspaceToData(workspace, generator)
{
    if (!workspace || !generator)
    {
        return { html: '' };
    }

    let code = generator.workspaceToCode(workspace);

    return { html: code };
}

// MODELO
// Guarda el HTML generado a partir de los bloques y avisa cuando cambia.
// No sabe nada de Blockly ni de la pantalla.
class WorkspaceModel extends EventTarget
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


// VISTA (HTMLElement)
// Es el componente visual: el lienzo de Blockly.
// No decide qué hacer con los cambios: despacha un 'request'.
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

        // bind(this) para que "this" siga siendo la Vista
        this._onBlocklyChange = this._onBlocklyChange.bind(this);
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

    // Genera el HTML a partir de los bloques que hay en el lienzo
    getHtml()
    {
        return workspaceToData(this.workspace, this.generator).html;
    }

    // EXCEPCIÓN Blockly.inject necesita que el elemento ya esté
    // conectado al documento para poder medir el lienzo.
    connectedCallback()
    {
        let  toolboxDefinition = this.buildToolbox();

        this.workspace = Blockly.inject(this.container, {
            toolbox: toolboxDefinition
        });

        // Blockly vuelve a medir su tamaño ya dentro del layout real.
        Blockly.svgResize(this.workspace);

        this.workspace.addChangeListener(this._onBlocklyChange);
    }

    disconnectedCallback()
    {
        if (this.workspace)
        {
            this.workspace.removeChangeListener(this._onBlocklyChange);
            this.workspace.dispose();
            this.workspace = null;
        }
    }

    // Traduce un cambio de Blockly en un pedido
    _onBlocklyChange(event)
    {
        if (event.isUiEvent)
        {
            return;
        }

        this.dispatchEvent(new CustomEvent('request', {
            detail: { action: 'workspace-changed' }
        }));
    }
}

customElements.define('blockly-workspace-view', WorkspaceView);


// CONTROLADOR (clase común)
// Ante el pedido de la Vista, le pide el HTML, actualiza el Modelo y,
// cuando el Modelo cambia, lo anuncia a nivel document para el resto.
class WorkspaceController
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

    // Pedido de la Vista: según la acción, acá se resuelve qué hacer
    onViewRequest(event)
    {
        if (event.detail.action === 'workspace-changed')
        {
            this._model.setHtml(this._view.getHtml());
        }
    }

    // El Modelo cambió: aviso al resto de la aplicación
    onModelChanged(event)
    {
        document.dispatchEvent(new CustomEvent('webcraft:workspace-updated', {
            detail: { html: event.detail.html }
        }));
    }
}

// Este archivo ya no inserta el <blockly-workspace-view> él solo:
// WebCraftApplication.js decide dónde va dentro del layout general y
// arma el WorkspaceModel y el WorkspaceController.

export { WorkspaceModel, WorkspaceView, WorkspaceController, workspaceToData };