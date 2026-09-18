// Rosmary sigue con este archivo respetando el contrato de Tollbox.js:
//   - registerBlocks()         
//   - getCategory()             
//   - registerGenerator

function registerBlocks()
{
    // Rosmary define acá los bloques de esta categoria
    // (título unificado h1-h3, párrafo, span, imagen, enlace, y lo
    // que el profe haya corregido/agregado)
}

function getCategory()
{
    return {
        kind: 'category',
        name: 'Contenido y Texto',
        colour: '290', // estaba violeta pero se puede cambiar
        contents: [
            // Rosmary lista 
        ]
    };
}

function registerGenerators(generator)
{
    // Rosmary sumar generator
}

export { registerBlocks, getCategory, registerGenerators };