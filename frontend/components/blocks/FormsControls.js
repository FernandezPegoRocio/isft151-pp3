
// Formularios y controles
function registerBlocks()
{
    if (!Blockly.Blocks['html_input_text']) {
        Blockly.Blocks['html_input_text'] = {
            init: function() {
                this.appendDummyInput().appendField('Input-Text');
                this.appendValueInput('NAME').setCheck('String').appendField('nombre');
                this.appendValueInput('PLACEHOLDER').setCheck('String').appendField('placeholder');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(290);
                this.setTooltip('Permite insertar un campo de texto');
            }
        };
    }

    if (!Blockly.Blocks['html_input_checkbox']) {
        Blockly.Blocks['html_input_checkbox'] = {
            init: function() {
                this.appendDummyInput().appendField('Checkbox');
                this.appendValueInput('NAME').setCheck('String').appendField('nombre');
                this.appendValueInput('VALUE').setCheck('String').appendField('valor');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(290);
                this.setTooltip('Casilla de verificación que permite seleccionar una o más opciones');
            }
        };
    }

    if (!Blockly.Blocks['html_input_radio']) {
        Blockly.Blocks['html_input_radio'] = {
            init: function() {
                this.appendDummyInput().appendField('Radio Button');
                this.appendValueInput('NAME').setCheck('String').appendField('nombre grupo');
                this.appendValueInput('VALUE').setCheck('String').appendField('valor');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(290);
                this.setTooltip('Botón de opción. Solo se puede seleccionar una opción por grupo.');
            }
        };
    }

    if (!Blockly.Blocks['html_button']) {
        Blockly.Blocks['html_button'] = {
            init: function() {
                this.appendDummyInput().appendField('Button');
                this.appendValueInput('TEXTO').setCheck('String').appendField('texto');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(290);
                this.setTooltip('Botón en el que se puede hacer clic');
            }
        };
    }
}

function getCategory()
{
    return {
        kind: 'category',
        name: 'Formularios',
        colour: '#d815d8',
        contents: [
            { kind: 'block', type: 'html_input_text' },
            { kind: 'block', type: 'html_input_checkbox' },
            { kind: 'block', type: 'html_input_radio' },
            { kind: 'block', type: 'html_button' }
        ]
    };
}

function registerGenerators(generator)
{
    generator.forBlock['html_input_text'] = function(block) {
        var name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
        var placeholder = generator.valueToCode(block, 'PLACEHOLDER', generator.ORDER_ATOMIC) || '""';
        return '<input type="text" name=' + name + ' placeholder=' + placeholder + '>\n';
    };

    generator.forBlock['html_input_checkbox'] = function(block) {
        var name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
        var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
        return '<input type="checkbox" name=' + name + ' value=' + value + '>\n';
    };

    generator.forBlock['html_input_radio'] = function(block) {
        var name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
        var value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
        return '<input type="radio" name=' + name + ' value=' + value + '>\n';
    };

    generator.forBlock['html_button'] = function(block) {
        var text = generator.valueToCode(block, 'TEXTO', generator.ORDER_ATOMIC) || '""';
        return '<button>' + text + '</button>\n';
    };
}

export { registerBlocks, getCategory, registerGenerators };