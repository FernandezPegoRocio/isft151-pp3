
// Syls 

// Este archivo sigue el CONTRATO de Toolbox.js:
//   - registerBlocks()          
//   - getCategory()             
//   - registerGenerators  
// Mientras se cumpla, este archivo se puede editar libremente
// sin tocar Toolbox.js ni BlocklyWorkspace.js.

function registerBlocks()
{
    // Silvana definelos bloques de esta categoría
    // (color, font-size en px, text-align, font-family)
}

function getCategory()
{
    return {
        kind: 'category',
        name: 'Estilos de Tipografía',
        colour: '0', // rojo, se puede cambiar!
        contents: [
            // Syls lista
        ]
    };
}

function registerGenerators(generator)
{
    // Syls suma el generator
}

export { registerBlocks, getCategory, registerGenerators };