import { WC_CHECK_ELEMENT } from '../WCNestingRules.js';

function registerBlocks() {
    Blockly.Blocks['css_background_color'] = {
         init: function() {
            this.appendDummyInput()
                .appendField("color de fondo")
                .appendField(new Blockly.FieldColour("#ffffff"), "BG_COLOR");
            this.setPreviousStatement(true, WC_CHECK_ELEMENT);
            this.setNextStatement(true, WC_CHECK_ELEMENT);
            this.setColour(160);
            this.setTooltip("Aplica el color de fondo (background-color)");
        }
    };

    Blockly.Blocks['css_spacing'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("espaciado")
                .appendField(new Blockly.FieldDropdown([
                    ["relleno (padding)", "padding"],
                    ["margen (margin)", "margin"]
                ]), "PROP")
                .appendField(new Blockly.FieldTextInput("10px"), "VALOR");
            this.setPreviousStatement(true, WC_CHECK_ELEMENT);
            this.setNextStatement(true, WC_CHECK_ELEMENT);
            this.setColour(160);
            this.setTooltip("Define padding o margin");
        }
    };

    Blockly.Blocks['css_border'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("borde (border)")
                .appendField(new Blockly.FieldTextInput("1px"), "BORDER_WIDTH")
                .appendField(new Blockly.FieldDropdown([
                    ["sólido", "solid"],
                    ["discontinuo", "dashed"],
                    ["punteado", "dotted"],
                    ["doble", "double"]
                ]), "BORDER_STYLE")
                .appendField(new Blockly.FieldColour("#000000"), "BORDER_COLOR");
            this.setPreviousStatement(true, WC_CHECK_ELEMENT);
            this.setNextStatement(true, WC_CHECK_ELEMENT);
            this.setColour(160);
            this.setTooltip("Define el borde del elemento");
        }
    };

    Blockly.Blocks['css_dimensions'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("dimensión")
                .appendField(new Blockly.FieldDropdown([
                    ["ancho (width)", "width"],
                    ["alto (height)", "height"]
                ]), "DIM")
                .appendField(new Blockly.FieldTextInput("100px"), "SIZE");
            this.setPreviousStatement(true, WC_CHECK_ELEMENT);
            this.setNextStatement(true, WC_CHECK_ELEMENT);
            this.setColour(160);
            this.setTooltip("Controla el ancho o alto");
        }
    };
}

function getCategory() {
    return {
        kind: 'category',
        name: 'Estilos de Diseño y Espaciado',
        colour: '160',
        contents: [
            { kind: 'block', type: 'css_background_color' },
            { kind: 'block', type: 'css_spacing' },
            { kind: 'block', type: 'css_border' },
            { kind: 'block', type: 'css_dimensions' }
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
    generator.forBlock['css_background_color'] = function(block) {
        const color = block.getFieldValue('BG_COLOR');
        return declaration(block, `background-color: ${color};`);
    };

    generator.forBlock['css_spacing'] = function(block) {
        const prop = block.getFieldValue('PROP');
        const valor = block.getFieldValue('VALOR');
        return declaration(block, `${prop}: ${addUnits(valor)};`);
    };

    generator.forBlock['css_border'] = function(block) {
        const width = block.getFieldValue('BORDER_WIDTH');
        const style = block.getFieldValue('BORDER_STYLE');
        const color = block.getFieldValue('BORDER_COLOR');
        return declaration(block, `border: ${addUnits(width)} ${style} ${color};`);
    };

    generator.forBlock['css_dimensions'] = function(block) {
        const dim = block.getFieldValue('DIM');
        const size = block.getFieldValue('SIZE');
        return declaration(block, `${dim}: ${addUnits(size)};`);
    };
}

export { registerBlocks, getCategory, registerGenerators };