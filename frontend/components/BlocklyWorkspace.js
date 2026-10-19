// BlocklyWorkspace.js — el lienzo de Blockly, en MVC:
//
//   - WorkspaceModel      extends EventTarget -> guarda el HTML generado y el estado del lienzo
//                                                (RF11: persistencia local) y avisa con 'changed'
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
// Clave del localStorage donde se guarda el lienzo (RF11)
const WORKSPACE_STORAGE_KEY = 'webcraft:workspace';


class WorkspaceModel extends EventTarget
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

    // Guarda el HTML y el estado del lienzo. Cada cambio queda guardado
    // automáticamente en el navegador, sin que el estudiante haga nada.
    setProject(html, state)
    {
        this._html = html || '';
        this._state = state || null;
        this.saveToStorage();
        this.changed();
    }

    // Guarda el estado del lienzo en el localStorage (devuelve false si falla,
    // por ejemplo si el navegador no deja guardar o no hay espacio)
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

    // Lee el estado guardado en el localStorage (o null si no hay nada
    // o si lo que hay está dañado)
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

    // Arma el contenido del archivo .json del proyecto
    toProjectJson(state)
    {
        return JSON.stringify({
            app: 'webcraft',
            version: 1,
            workspace: state
        }, null, 2);
    }

    // Lee el contenido de un archivo .json de proyecto. Si no es un archivo
    // de WebCraft válido, lanza un error.
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


// VISTA (HTMLElement)
// Es el componente visual: el lienzo de Blockly.
// No decide qué hacer con los cambios: despacha un 'request'.
class WorkspaceView extends HTMLElement
{
    constructor()
    {
        super();

        this.container = document.createElement('div');
        this.container.classList.add('blockly-workspace-container');
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

    // Estado del lienzo como un objeto (se puede guardar como JSON)
    getState()
    {
        return Blockly.serialization.workspaces.save(this.workspace);
    }

    // Reemplaza lo que hay en el lienzo por el estado que le pasan.
    // Los eventos se apagan mientras carga para no disparar un cambio por cada bloque.
    // Si el estado no se puede cargar, vuelve a dejar el lienzo como estaba y
    // avisa con un error.
    setState(state)
    {
        let previous = Blockly.serialization.workspaces.save(this.workspace);

        Blockly.Events.disable();

        try
        {
            this.workspace.clear();
            Blockly.serialization.workspaces.load(state, this.workspace);
        }
        catch (error)
        {
            this.workspace.clear();
            Blockly.serialization.workspaces.load(previous, this.workspace);
            throw error;
        }
        finally
        {
            Blockly.Events.enable();
        }
    }

    // Muestra un mensaje al estudiante
    showMessage(text)
    {
        window.alert(text);
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

        // El lienzo ya existe: le aviso al Controlador para que restaure
        // el trabajo guardado (RF11)
        this.dispatchEvent(new CustomEvent('request', {
            detail: { action: 'workspace-ready' }
        }));
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
        let action = event.detail.action;

        if (action === 'workspace-changed')
        {
            // Cada cambio se guarda solo (guardado automático)
            this.updateModel();
        }
        else if (action === 'workspace-ready')
        {
            // Al abrir la aplicación, se recupera el trabajo guardado
            let saved = this._model.loadFromStorage();

            if (saved)
            {
                this.restoreState(saved);
            }
        }
    }

    // Pasa lo que hay en el lienzo al Modelo (HTML + estado)
    updateModel()
    {
        this._model.setProject(this._view.getHtml(), this._view.getState());
    }

    // Carga un estado en el lienzo y actualiza todo. Si el estado no se puede
    // cargar (por ejemplo, tiene bloques desconocidos), devuelve false.
    restoreState(state)
    {
        try
        {
            this._view.setState(state);
        }
        catch (error)
        {
            return false;
        }

        this.updateModel();
        return true;
    }

    // Guardar a pedido: deja el estado actual guardado en el navegador
    saveNow()
    {
        this.updateModel();
        return this._model.saveToStorage();
    }

    // Contenido del archivo .json para descargar el proyecto
    getProjectJson()
    {
        return this._model.toProjectJson(this._view.getState());
    }

    // Abrir un proyecto desde el contenido de un archivo .json
    loadProjectJson(text)
    {
        let state = null;

        try
        {
            state = this._model.parseProjectJson(text);
        }
        catch (error)
        {
            this._view.showMessage('No se pudo abrir el archivo: no es un proyecto de WebCraft válido.');
            return;
        }

        if (!this.restoreState(state))
        {
            this._view.showMessage('No se pudo abrir el archivo: tiene bloques que WebCraft no conoce.');
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