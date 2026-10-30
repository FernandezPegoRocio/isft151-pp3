import { WC_CHECK_ELEMENT } from '../WCNestingRules.js';

function registerBlocks() {
    Blockly.Blocks['css_text_color'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("color de texto")
                .appendField(new Blockly.FieldColour("#333333"), "TEXT_COLOR");
            this.setPreviousStatement(true, WC_CHECK_ELEMENT);
            this.setNextStatement(true, WC_CHECK_ELEMENT);
            this.setColour(210);
            this.setTooltip("Aplica el color al texto (color)");
        }
    };

    Blockly.Blocks['css_font_size'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("tamaño de fuente")
                .appendField(new Blockly.FieldTextInput("16px"), "FONT_SIZE");
            this.setPreviousStatement(true, WC_CHECK_ELEMENT);
            this.setNextStatement(true, WC_CHECK_ELEMENT);
            this.setColour(210);
            this.setTooltip("Define el tamaño del texto (font-size)");
        }
    };

    Blockly.Blocks['css_text_align'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("alinear texto")
                .appendField(new Blockly.FieldDropdown([
                    ["izquierda", "left"],
                    ["centro", "center"],
                    ["derecha", "right"],
                    ["justificado", "justify"]
                ]), "ALIGN");
            this.setPreviousStatement(true, WC_CHECK_ELEMENT);
            this.setNextStatement(true, WC_CHECK_ELEMENT);
            this.setColour(210);
            this.setTooltip("Alineación del texto (text-align)");
        }
    };

    Blockly.Blocks['css_font_family'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("tipo de fuente")
                .appendField(new Blockly.FieldDropdown([
                    ["Arial", "Arial, sans-serif"],
                    ["Montserrat", "Montserrat, sans-serif"],
                    ["Calibri", "Calibri, sans-serif"],
                    ["Georgia", "Georgia, serif"],
                    ["Courier New", "Courier New, monospace"]
                ]), "FONT");
            this.setPreviousStatement(true, WC_CHECK_ELEMENT);
            this.setNextStatement(true, WC_CHECK_ELEMENT);
            this.setColour(210);
            this.setTooltip("Familia tipográfica (font-family)");
        }
    };
}

function getCategory() {
    return {
        kind: 'category',
        name: 'Estilos de Tipografía',
        colour: '210',
        contents: [
            { kind: 'block', type: 'css_text_color' },
            { kind: 'block', type: 'css_font_size' },
            { kind: 'block', type: 'css_text_align' },
            { kind: 'block', type: 'css_font_family' }
        ]
    };
}

function declaration(block, text) {
    return block.getSurroundParent() ? text + '\n' : '';
}

function addUnits(value) {
    return String(value).trim().split(/\s+/).map(function (part) {
        return /^\d+(\.\d+)?$/.test(part) && Number(part) !== 0 ? part + 'px' : part;
    }).join(' ');
}

function registerGenerators(generator) {
    generator.forBlock['css_text_color'] = function(block) {
        const color = block.getFieldValue('TEXT_COLOR');
        return declaration(block, `color: ${color};`);
    };

    generator.forBlock['css_font_size'] = function(block) {
        const size = block.getFieldValue('FONT_SIZE');
        return declaration(block, `font-size: ${addUnits(size)};`);
    };

    generator.forBlock['css_text_align'] = function(block) {
        const align = block.getFieldValue('ALIGN');
        return declaration(block, `text-align: ${align};`);
    };

    generator.forBlock['css_font_family'] = function(block) {
        const font = block.getFieldValue('FONT');
        return declaration(block, `font-family: ${font};`);
    };
}

export { registerBlocks, getCategory, registerGenerators };