
// Syls 

// Este archivo sigue el CONTRATO de Toolbox.js:
//   - registerBlocks()          
//   - getCategory()             
//   - registerGenerators  
// Mientras se cumpla, este archivo se puede editar libremente
// sin tocar Toolbox.js ni BlocklyWorkspace.js.



function registerBlocks() {
    // 1. Color de texto
    Blockly.Blocks['css_text_color'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("color de texto")
                .appendField(new Blockly.FieldTextInput("#333333"), "TEXT_COLOR");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(210);
            this.setTooltip("Aplica el color al texto (color)");
        }
    };

    // 2. Tamaño de fuente
    Blockly.Blocks['css_font_size'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("tamaño de fuente")
                .appendField(new Blockly.FieldTextInput("16px"), "FONT_SIZE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(210);
            this.setTooltip("Define el tamaño del texto (font-size)");
        }
    };

    // 3. Alineación de texto
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
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(210);
            this.setTooltip("Alineación del texto (text-align)");
        }
    };

    // 4. Familia de fuente
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
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
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