import { WC_CHECK_BODY, WC_CHECK_ELEMENT } from '../WCNestingRules.js';

function splitContent(generator, block, inputName, keepBodies)
{
    let styles = [];
    let html = '';
    let bodies = [];
    let child = block.getInputTargetBlock(inputName);

    while (child)
    {
        if (keepBodies && child.type === 'html_body')
        {
            bodies.push(child);
        }
        else
        {
            let code = generator.blockToCode(child, true);

            if (child.type.indexOf('css_') === 0)
            {
                if (code.trim())
                {
                    styles.push(code.trim());
                }
            }
            else
            {
                html += code;
            }
        }

        child = child.getNextBlock();
    }

    return { style: styles.join(' '), html: html, bodies: bodies };
}

function styleAttr(generator, style)
{
    return style ? ' style=' + generator.quoteAttr(style) : '';
}

function indentContent(generator, html)
{
    return html ? generator.prefixLines(html, generator.INDENT) : '';
}

function renderBody(generator, bodyBlock, extra)
{
    let own = bodyBlock ? splitContent(generator, bodyBlock, 'CONTENIDO') : { style: '', html: '' };
    let styles = [];

    if (own.style)
    {
        styles.push(own.style);
    }

    if (extra && extra.style)
    {
        styles.push(extra.style);
    }

    let html = own.html + (extra ? extra.html : '');

    return '<body' + styleAttr(generator, styles.join(' ')) + '>\n' + indentContent(generator, html) + '</body>\n';
}

function registerBlocks()
{
    if (!Blockly.Blocks['html_root']) {
        Blockly.Blocks['html_root'] = {
            init: function() {
                this.appendDummyInput().appendField('Documento <html>');
                this.appendStatementInput('BODY').setCheck(WC_CHECK_BODY).appendField('contiene');
                this.setColour(230);
                this.setTooltip('Bloque raíz obligatorio de la página web');
            }
        };
    }

    if (!Blockly.Blocks['html_body']) {
        Blockly.Blocks['html_body'] = {
            init: function() {
                this.appendDummyInput().appendField('Cuerpo <body>');
                this.appendStatementInput('CONTENIDO').setCheck(WC_CHECK_ELEMENT);
                this.setPreviousStatement(true, WC_CHECK_BODY);
                this.setColour(230);
                this.setTooltip('Contenedor principal de lo que se ve en pantalla');
            }
        };
    }

    if (!Blockly.Blocks['html_div']) {
        Blockly.Blocks['html_div'] = {
            init: function() {
                this.appendDummyInput().appendField('Contenedor <div>');
                this.appendStatementInput('CONTENIDO').setCheck(WC_CHECK_ELEMENT);
                this.setPreviousStatement(true, WC_CHECK_ELEMENT);
                this.setNextStatement(true, WC_CHECK_ELEMENT);
                this.setColour(230);
                this.setTooltip('Agrupa elementos en una sección');
            }
        };
    }

    if (!Blockly.Blocks['html_br']) {
        Blockly.Blocks['html_br'] = {
            init: function() {
                this.appendDummyInput().appendField('Salto de línea <br>');
                this.setPreviousStatement(true, WC_CHECK_ELEMENT);
                this.setNextStatement(true, WC_CHECK_ELEMENT);
                this.setColour(160);
                this.setTooltip('Define un único salto de línea');
            }
        };
    }

    if (!Blockly.Blocks['html_hr']) {
        Blockly.Blocks['html_hr'] = {
            init: function() {
                this.appendDummyInput().appendField('Separador <hr>');
                this.setPreviousStatement(true, WC_CHECK_ELEMENT);
                this.setNextStatement(true, WC_CHECK_ELEMENT);
                this.setColour(160);
                this.setTooltip('Separador que define un cambio temático');
            }
        };
    }
}

function getCategory()
{
    return {
        kind: 'category',
        name: 'Estructura HTML',
        colour: '#112ef1',
        contents: [
            { kind: 'block', type: 'html_root' },
            { kind: 'block', type: 'html_body' },
            { kind: 'block', type: 'html_div' },
            { kind: 'block', type: 'html_br' },
            { kind: 'block', type: 'html_hr' }
        ]
    };
}

function registerGenerators(generator)
{
    generator.forBlock['html_root'] = function(block) {
        let parts = splitContent(generator, block, 'BODY', true);
        let content = '';

        if (parts.bodies.length === 0)
        {
            if (parts.html || parts.style)
            {
                content = renderBody(generator, null, parts);
            }
        }
        else
        {
            for (let i = 0; i < parts.bodies.length; i++)
            {
                content += renderBody(generator, parts.bodies[i], i === 0 ? parts : null);
            }
        }

        return '<!DOCTYPE html>\n<html>\n' + content + '\n</html>\n';
    };

    generator.forBlock['html_body'] = function(block) {
        return renderBody(generator, block, null);
    };

    generator.forBlock['html_div'] = function(block) {
        let parts = splitContent(generator, block, 'CONTENIDO');
        return '<div' + styleAttr(generator, parts.style) + '>\n' + indentContent(generator, parts.html) + '</div>\n';
    };

    generator.forBlock['html_br'] = function() {
        return '<br>\n';
    };

    generator.forBlock['html_hr'] = function() {
        return '<hr>\n';
    };
}

export { registerBlocks, getCategory, registerGenerators };