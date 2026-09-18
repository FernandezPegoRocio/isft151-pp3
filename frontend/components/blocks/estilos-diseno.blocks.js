
// Syls
// Respetamos el contrato con toolbox.js
// aca va a ir:
//   - registerBlocks()
//   - getCategory()  
//   - registerGenerators


function registerBlocks()
{
    // Silvana define los bloques de esta categoría
    // (background-color, padding, margin, border, tamaño ancho/alto
    // con unidad px/%)(quedo en px, no %)
}

function getCategory()
{
    return {
        kind: 'category',
        name: 'Estilos de Diseño y Espaciado',
        colour: '160', // verde, según la maqueta — no cambiar sin avisar al grupo
        contents: [
            // TSilvana lista
        ]
    };
}

function registerGenerators(generator)
{
    // Silvana sumar generator
}

export { registerBlocks, getCategory, registerGenerators };