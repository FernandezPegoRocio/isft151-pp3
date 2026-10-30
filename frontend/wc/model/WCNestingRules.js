const WC_CHECK_BODY = ['wc-body'];
const WC_CHECK_ELEMENT = ['wc-element'];

const WC_NESTING_MESSAGES = {
    body: 'El cuerpo (body) tiene que estar dentro de la raíz (html).',
    element: 'Este bloque está suelto. Ponelo dentro de un Cuerpo o de un Contenedor.',
    text: 'Este texto está suelto. Conectalo a un hueco de texto de otro bloque.'
};

let appliedWarnings = new WeakMap();

function getNestingProblem(block)
{
    if (block.type === 'html_root')
    {
        return '';
    }

    if (block.type === 'text')
    {
        return block.outputConnection && block.outputConnection.isConnected() ? '' : WC_NESTING_MESSAGES.text;
    }

    if (block.getSurroundParent())
    {
        return '';
    }

    return block.type === 'html_body' ? WC_NESTING_MESSAGES.body : WC_NESTING_MESSAGES.element;
}

function validateNesting(workspace)
{
    if (!workspace)
    {
        return;
    }

    let blocks = workspace.getAllBlocks(false);

    for (let i = 0; i < blocks.length; i++)
    {
        let block = blocks[i];
        let problem = getNestingProblem(block);

        if (appliedWarnings.get(block) !== problem)
        {
            block.setWarningText(problem || null);
            appliedWarnings.set(block, problem);
        }
    }
}

export { WC_CHECK_BODY, WC_CHECK_ELEMENT, validateNesting };
