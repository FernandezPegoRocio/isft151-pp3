// Syls
// Respetamos el contrato con toolbox.js


function registerBlocks() {
    // 1. Color de fondo
    Blockly.Blocks['css_background_color'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("color de fondo")
                .appendField(new Blockly.FieldTextInput("#ffffff"), "BG_COLOR");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Aplica el color de fondo (background-color)");
        }
    };

    // 2. Espaciado (Padding / Margin)
    Blockly.Blocks['css_spacing'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("espaciado")
                .appendField(new Blockly.FieldDropdown([
                    ["relleno (padding)", "padding"],
                    ["margen (margin)", "margin"]
                ]), "PROP")
                .appendField(new Blockly.FieldTextInput("10px"), "VALOR");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Define padding o margin");
        }
    };

    // 3. Borde
    Blockly.Blocks['css_border'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("borde (border)")
                .appendField(new Blockly.FieldTextInput("1px solid #000000"), "BORDER_VAL");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Define el borde del elemento");
        }
    };

    // 4. Dimensiones (Width / Height)
    Blockly.Blocks['css_dimensions'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("dimensión")
                .appendField(new Blockly.FieldDropdown([
                    ["ancho (width)", "width"],
                    ["alto (height)", "height"]
                ]), "DIM")
                .appendField(new Blockly.FieldTextInput("100px"), "SIZE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
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


// Si el estudiante escribe solo un número (20), se le agrega la unidad (20px),
// porque en CSS un número sin unidad no es válido (salvo el 0).
function addUnits(value) {
    return String(value).trim().split(/\s+/).map(function (part) {
        return /^\d+(\.\d+)?$/.test(part) && Number(part) !== 0 ? part + 'px' : part;
    }).join(' ');
}

// Un bloque de estilo solo tiene sentido dentro de un contenedor (<body> o <div>),
// que es quien lo pasa al atributo style. Si está suelto, no genera nada.
function declaration(block, text) {
    return block.getSurroundParent() ? text + '\n' : '';
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
        const borderVal = block.getFieldValue('BORDER_VAL');
        return declaration(block, `border: ${borderVal};`);
    };

    generator.forBlock['css_dimensions'] = function(block) {
        const dim = block.getFieldValue('DIM');
        const size = block.getFieldValue('SIZE');
        return declaration(block, `${dim}: ${addUnits(size)};`);
    };
}

export { registerBlocks, getCategory, registerGenerators };