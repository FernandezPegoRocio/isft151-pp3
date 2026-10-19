//  Rosmary Completa esta parte

// Este archivo sigue el CONTRATO de Toolbox.js:
//   - registerBlocks()          
//   - getCategory()             
//   - registerGenerators  
// Mientras se cumpla, este archivo se puede editar libremente
// sin tocar Toolbox.js ni BlocklyWorkspace.js.


// FUNCIONES AUXILIARES (fuera de las funciones principales)
// Los bloques de estilo CSS que están dentro de un contenedor (<body> o <div>)
// no se escriben como texto suelto: se juntan y se ponen en el atributo style
// del contenedor, y los demás bloques se generan normalmente.
// Si keepBodies es true, los bloques <body> no se generan acá: se devuelven en
// "bodies" para que quien llama (el bloque <html>) decida qué hacer con ellos.
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
            // true = solo este bloque (el siguiente lo recorre este ciclo)
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


// Arma ' style="..."' (con comillas siempre bien cerradas) o '' si no hay estilos
function styleAttr(generator, style)
{
    return style ? ' style=' + generator.quoteAttr(style) : '';
}


// Pone adentro el contenido, con sangría; si no hay contenido no deja líneas vacías
function indentContent(generator, html)
{
    return html ? generator.prefixLines(html, generator.INDENT) : '';
}


// Arma el <body>. Si el estudiante dejó bloques sueltos al lado del <body>
// (en vez de adentro), "extra" los trae y se agregan al <body> para que
// el HTML siga bien formado.
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
                this.appendStatementInput('BODY').setCheck(null).appendField('contiene');
                this.setColour(230);
                this.setTooltip('Bloque raíz obligatorio de la página web');
            }
        };
    }

    if (!Blockly.Blocks['html_body']) {
        Blockly.Blocks['html_body'] = {
            init: function() {
                this.appendDummyInput().appendField('Cuerpo <body>');
                this.appendStatementInput('CONTENIDO').setCheck(null);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('Contenedor principal de lo que se ve en pantalla');
            }
        };
    }

    if (!Blockly.Blocks['html_div']) {
        Blockly.Blocks['html_div'] = {
            init: function() {
                this.appendDummyInput().appendField('Contenedor <div>');
                this.appendStatementInput('CONTENIDO').setCheck(null);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('Agrupa elementos en una sección');
            }
        };
    }

    if (!Blockly.Blocks['html_br']) {
        Blockly.Blocks['html_br'] = {
            init: function() {
                this.appendDummyInput().appendField('Salto de línea <br>');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(160);
                this.setTooltip('Define un único salto de línea');
            }
        };
    }

    if (!Blockly.Blocks['html_hr']) {
        Blockly.Blocks['html_hr'] = {
            init: function() {
                this.appendDummyInput().appendField('Separador <hr>');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
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
            // Sin bloque <body>: se arma uno solo con lo que haya
            if (parts.html || parts.style)
            {
                content = renderBody(generator, null, parts);
            }
        }
        else
        {
            // Lo que quedó suelto al lado del <body> se agrega al primer <body>
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