// Contenido y texto
function registerBlocks()
{
    if (!Blockly.Blocks['html_p']) {
        Blockly.Blocks['html_p'] = {
            init: function() {
                this.appendDummyInput().appendField('Párrafo <p>');
                this.appendValueInput('TEXTO').setCheck('String').appendField('texto');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip('Párrafo o bloque de texto estándar');
            }
        };
    }

    if (!Blockly.Blocks['html_span']) {
        Blockly.Blocks['html_span'] = {
            init: function() {
                this.appendDummyInput().appendField('Sección <span>');
                this.appendValueInput('TEXTO').setCheck('String').appendField('texto');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip('Define una sección del documento');
            }
        };
    }

    if (!Blockly.Blocks['html_img']) {
        Blockly.Blocks['html_img'] = {
            init: function() {
                this.appendDummyInput().appendField('Imágen <img>');
                this.appendValueInput('SRC').setCheck('String').appendField('URL (src)');
                this.appendValueInput('ALT').setCheck('String').appendField('Texto alt');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip('Muestra una imagen. Usa la URL de origen');
            }
        };
    }

    if (!Blockly.Blocks['html_a']) {
        Blockly.Blocks['html_a'] = {
            init: function() {
                this.appendDummyInput().appendField('Enlace <a>');
                this.appendValueInput('HREF').setCheck('String').appendField('URL (href)');
                this.appendStatementInput('TEXTO').setCheck(null).appendField('texto del enlace');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip('Enlace. Crea un hipervínculo de navegación');
            }
        };
    }
}

function getCategory()
{
    return {
        kind: 'category',
        name: 'Contenido y Texto',
        colour: '#14d517',
        contents: [
            { kind: 'block', type: 'html_p' },
            { kind: 'block', type: 'html_span' },
            { kind: 'block', type: 'html_img' },
            { kind: 'block', type: 'html_a' }
        ]
    };
}

function registerGenerators(generator)
{
    generator.forBlock['html_p'] = function(block) {
        var text = generator.valueToCode(block, 'TEXTO', generator.ORDER_ATOMIC) || '""';
        return '<p>' + text + '</p>\n';
    };

    generator.forBlock['html_span'] = function(block) {
        var text = generator.valueToCode(block, 'TEXTO', generator.ORDER_ATOMIC) || '""';
        return '<span>' + text + '</span>\n';
    };

    generator.forBlock['html_img'] = function(block) {
        var src = generator.valueToCode(block, 'SRC', generator.ORDER_ATOMIC) || '""';
        var alt = generator.valueToCode(block, 'ALT', generator.ORDER_ATOMIC) || '""';
        return '<img src=' + src + ' alt=' + alt + '>\n';
    };

    generator.forBlock['html_a'] = function(block) {
        var href = generator.valueToCode(block, 'HREF', generator.ORDER_ATOMIC) || '""';
        var text = generator.statementToCode(block, 'TEXTO') || '';
        return '<a href=' + href + '>' + text + '</a>\n';
    };
}

export { registerBlocks, getCategory, registerGenerators };