
//Para mas adelante, aun no designamos quien lo hace 

// sigue respetando el contrato de Toolbox.js, aca va:
//   - registerBlocks()   
//   - getCategory() 
//   - registerGenerators

function registerBlocks()
{
    // los bloques de esta categoría son:
    // (input texto, checkbox, radio button, botón)
}

function getCategory()
{
    return {
        kind: 'category',
        name: 'Formularios y Controles',
        colour: '45', // naranja — se puede cambiar el color
        contents: [
            //listar acá los json
        ]
    };
}

function registerGenerators(generator)
{
    // sumar el generator
}

export { registerBlocks, getCategory, registerGenerators };