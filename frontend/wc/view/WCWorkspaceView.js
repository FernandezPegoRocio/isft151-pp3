import { validateNesting } from '../model/WCNestingRules.js';
import { registerAllBlocks, registerAllGenerators, getToolboxDefinition } from '../model/WCToolbox.js';

function createWorkspaceViewGenerator()
{
    let generator = new Blockly.Generator('WebCraftHTML');

    generator.INDENT = '  ';
    
    generator.ORDER_ATOMIC = 0;
    generator.ORDER_NONE = 99;

    generator.init = function (workspace)
    {
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

    generator.quoteAttr = function (value)
    {
        let texto = (value === undefined || value === null) ? '' : String(value);
        texto = texto.replace(/"/g, '&quot;');
        return '"' + texto + '"';
    };

    registerAllGenerators(generator);

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

function workspaceToData(workspace, generator)
{
    if (!workspace || !generator)
    {
        return { html: '' };
    }

    let code = generator.workspaceToCode(workspace);

    return { html: code };
}

class WCWorkspaceView extends HTMLElement
{
    constructor()
    {
        super();

        this.container = document.createElement('div');
        this.container.classList.add('wc-workspace-container');
        this.appendChild(this.container);

        this.workspace = null;
        this.generator = null;

        this._onWorkspaceChange = this._onWorkspaceChange.bind(this);
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
        return workspaceToData(this.workspace, this.generator).html;
    }

    getState()
    {
        return Blockly.serialization.workspaces.save(this.workspace);
    }

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

        validateNesting(this.workspace);
    }

    showMessage(text)
    {
        window.alert(text);
    }

    connectedCallback()
    {
        let  toolboxDefinition = this.buildToolbox();

        this.workspace = Blockly.inject(this.container, {
            toolbox: toolboxDefinition,
            media: './wc/lib/blockly/media/'
        });

        Blockly.svgResize(this.workspace);

        this.workspace.addChangeListener(this._onWorkspaceChange);

        this.dispatchEvent(new CustomEvent('request', {
            detail: { action: 'workspace-ready' }
        }));
    }

    disconnectedCallback()
    {
        if (this.workspace)
        {
            this.workspace.removeChangeListener(this._onWorkspaceChange);
            this.workspace.dispose();
            this.workspace = null;
        }
    }

    _onWorkspaceChange(event)
    {
        if (event.isUiEvent)
        {
            return;
        }

        validateNesting(this.workspace);

        this.dispatchEvent(new CustomEvent('request', {
            detail: { action: 'workspace-changed' }
        }));
    }
}

customElements.define('wc-workspace-view', WCWorkspaceView);

export { WCWorkspaceView };
