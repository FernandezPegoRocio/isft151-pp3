//  Rosmary Completa esta parte

// Este archivo sigue el CONTRATO de Toolbox.js:
//   - registerBlocks()          
//   - getCategory()             
//   - registerGenerators  
// Mientras se cumpla, este archivo se puede editar libremente
// sin tocar Toolbox.js ni BlocklyWorkspace.js.

function registerBlocks()
{
    // Todo de Rosmary para definir la categoria de los bloques
}

function getCategory()
{
    return {
        kind: 'category',
        name: 'Estructura y Contenedores',
        colour: '210', // azul, según la maqueta — no cambiar sin avisar al grupo
        contents: [
            // Rosmary vdefine  registerBlocks()
        ]
    };
}

function registerGenerators(generator)
{
    // Rosmary realiza el generator por cada bloque definido arriba
}

export { registerBlocks, getCategory, registerGenerators };