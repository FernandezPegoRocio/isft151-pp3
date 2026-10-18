// El toolbox es un archivo que NO define ningún bloque.
// Solo junta las 5 categorías que vienen de frontend/components/...

// Aca esta el CONTRATO que debe cumplir cada módulo de blocks

import * as ContainersStructure from './blocks/ContainersStructure.js';
import * as ContentText from './blocks/ContentText.js';
import * as FormsControls from './blocks/FormsControls.js';
import * as StyleLayout from './blocks/StyleLayout.js';
import * as StyleTypography from './blocks/StyleTypography.js';


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