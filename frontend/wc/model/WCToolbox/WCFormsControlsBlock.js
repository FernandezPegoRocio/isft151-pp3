import { WC_CHECK_ELEMENT } from '../WCNestingRules.js';

function registerBlocks()
{
    if (!Blockly.Blocks['html_input_text']) {
        Blockly.Blocks['html_input_text'] = {
            init: function() {
                this.appendDummyInput().appendField('Input-Text');
                this.appendValueInput('NAME').setCheck('String').appendField('nombre');
                this.appendValueInput('PLACEHOLDER').setCheck('String').appendField('placeholder');
                this.setPreviousStatement(true, WC_CHECK_ELEMENT);
                this.setNextStatement(true, WC_CHECK_ELEMENT);
                this.setColour(290);
                this.setTooltip('Permite insertar un campo de texto');
            }
        };
    }

    if (!Blockly.Blocks['html_input_checkbox']) {
        Blockly.Blocks['html_input_checkbox'] = {
            init: function() {
                this.appendDummyInput().appendField('Checkbox');
                this.appendValueInput('LABEL').setCheck('String').appendField('texto');
                this.appendValueInput('NAME').setCheck('String').appendField('nombre');
                this.appendValueInput('VALUE').setCheck('String').appendField('valor');
                this.setPreviousStatement(true, WC_CHECK_ELEMENT);
                this.setNextStatement(true, WC_CHECK_ELEMENT);
                this.setColour(290);
                this.setTooltip('Casilla de verificación con texto descriptivo');
            }
        };
    }

    if (!Blockly.Blocks['html_input_radio']) {
        Blockly.Blocks['html_input_radio'] = {
            init: function() {
                this.appendDummyInput().appendField('Radio Button');
                this.appendValueInput('LABEL').setCheck('String').appendField('texto');
                this.appendValueInput('NAME').setCheck('String').appendField('nombre grupo');
                this.appendValueInput('VALUE').setCheck('String').appendField('valor');
                this.setPreviousStatement(true, WC_CHECK_ELEMENT);
                this.setNextStatement(true, WC_CHECK_ELEMENT);
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
                this.setPreviousStatement(true, WC_CHECK_ELEMENT);
                this.setNextStatement(true, WC_CHECK_ELEMENT);
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
        let name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '';
        let placeholder = generator.valueToCode(block, 'PLACEHOLDER', generator.ORDER_ATOMIC) || '';
        return '<input type="text" name=' + generator.quoteAttr(name) + ' placeholder=' + generator.quoteAttr(placeholder) + '>\n';
    };

    generator.forBlock['html_input_checkbox'] = function(block) {
        let name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '';
        let value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '';
        let label = generator.valueToCode(block, 'LABEL', generator.ORDER_ATOMIC) || '';
        let input = '<input type="checkbox" name=' + generator.quoteAttr(name) + ' value=' + generator.quoteAttr(value) + '>';
        return label ? '<label>' + input + ' ' + label + '</label>\n' : input + '\n';
    };

    generator.forBlock['html_input_radio'] = function(block) {
        let name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '';
        let value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '';
        let label = generator.valueToCode(block, 'LABEL', generator.ORDER_ATOMIC) || '';
        let input = '<input type="radio" name=' + generator.quoteAttr(name) + ' value=' + generator.quoteAttr(value) + '>';
        return label ? '<label>' + input + ' ' + label + '</label>\n' : input + '\n';
    };

    generator.forBlock['html_button'] = function(block) {
        let text = generator.valueToCode(block, 'TEXTO', generator.ORDER_ATOMIC) || '';
        return '<button>' + text + '</button>\n';
    };
}

export { registerBlocks, getCategory, registerGenerators };