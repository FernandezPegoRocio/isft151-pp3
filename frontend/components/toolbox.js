// El toolbox es un archivo que NO define ningún bloque.
// Solo junta las 5 categorías que vienen de frontend/components/...
//
// Aca esta el CONTRATO que debe cumplir cada módulo de blocks

//   - registerBlocks()        : void
//       Define los bloques de esa categoría en Blockly.Blocks.
//   - getCategory()           : { kind:'category', name, colour, contents }
//       Devuelve la definición de esa categoría para el toolbox.
//   - registerGenerators(gen) : void
//       Suma gen.forBlock['tipo'] por cada bloque que definió.

// Mientras un módulo cumpla ese contrato, quien lo escriba puede
// cambiar su contenido interno sin tocar este archivo
// quedaria algo asi:
import * as ContainersStructure from './blocks/ContainersStructure.js';
import * as ContentText from './blocks/ContentText.js';
import * as FormsControls from './blocks/FormsControls.js';
import * as StyleLayout from './blocks/StyleLayout.js';
import * as StyleTypography from './blocks/StyleTypography.js';

// Orden = orden en que aparecen las categorías en el toolbox visual (maqueta vista por el profe)

const CATEGORY_MODULES = [
    ContainersStructure,
    ContentText,
    FormsControls,
    StyleLayout,
    StyleTypography
];

function registerAllBlocks()
{
    CATEGORY_MODULES.forEach(function (categoryModule) {
        categoryModule.registerBlocks();
    });
}

function registerAllGenerators(generator)
{
    CATEGORY_MODULES.forEach(function (categoryModule) {
        categoryModule.registerGenerators(generator);
    });
}

function getToolboxDefinition()
{
    return {
        kind: 'categoryToolbox',
        contents: CATEGORY_MODULES.map(function (categoryModule) {
            return categoryModule.getCategory();
        })
    };
}

export { registerAllBlocks, registerAllGenerators, getToolboxDefinition };