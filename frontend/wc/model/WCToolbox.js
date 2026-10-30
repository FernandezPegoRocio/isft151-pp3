import * as WCContainersStructureBlock from './WCToolbox/WCContainersStructureBlock.js';
import * as WCContentTextBlock from './WCToolbox/WCContentTextBlock.js';
import * as WCFormsControlsBlock from './WCToolbox/WCFormsControlsBlock.js';
import * as WCStyleLayoutBlock from './WCToolbox/WCStyleLayoutBlock.js';
import * as WCStyleTypographyBlock from './WCToolbox/WCStyleTypographyBlock.js';

const CATEGORY_MODULES = [
    WCContainersStructureBlock,
    WCContentTextBlock,
    WCFormsControlsBlock,
    WCStyleLayoutBlock,
    WCStyleTypographyBlock
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