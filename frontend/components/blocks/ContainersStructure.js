//  Rosmary Completa esta parte

// Este archivo sigue el CONTRATO de Toolbox.js:
//   - registerBlocks()          
//   - getCategory()             
//   - registerGenerators  
// Mientras se cumpla, este archivo se puede editar libremente
// sin tocar Toolbox.js ni BlocklyWorkspace.js.

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
        var bodyCode = generator.statementToCode(block, 'BODY') || '';
        return '<!DOCTYPE html>\n<html>\n' + bodyCode + '\n</html>\n';
    };

    generator.forBlock['html_body'] = function(block) {
        var content = generator.statementToCode(block, 'CONTENIDO') || '';
        return '<body>\n' + content + '</body>\n';
    };

    generator.forBlock['html_div'] = function(block) {
        var content = generator.statementToCode(block, 'CONTENIDO') || '';
        return '<div>\n' + content + '</div>\n';
    };

    generator.forBlock['html_br'] = function() {
        return '<br>\n';
    };

    generator.forBlock['html_hr'] = function() {
        return '<hr>\n';
    };
}

export { registerBlocks, getCategory, registerGenerators };