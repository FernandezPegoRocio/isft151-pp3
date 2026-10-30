const FOOTER_MEMBERS = ['Cichillitti, Rosmary', 'Fernández Pego, Rocío', 'Luzuriaga, Silvana'];

function createFooterText(className, text)
{
    let paragraph = document.createElement('p');
    paragraph.classList.add(className);
    paragraph.appendChild(document.createTextNode(text));
    return paragraph;
}

class WCFooterView extends HTMLElement
{
    constructor()
    {
        super();

        let footer = document.createElement('footer');

        let logo = document.createElement('img');
        logo.src = './img/logo-isft.png';
        logo.alt = 'Logo del Instituto Superior de Formación Técnica N° 151';
        logo.classList.add('logo');

        let texts = document.createElement('div');
        texts.classList.add('textos');
        texts.appendChild(createFooterText('instituto', 'Instituto Superior de Formación Técnica N° 151'));
        texts.appendChild(createFooterText('leyenda', 'Proyecto realizado en la materia Prácticas Profesionalizantes III'));
        texts.appendChild(createFooterText('integrantes', FOOTER_MEMBERS.join(' · ')));

        footer.appendChild(logo);
        footer.appendChild(texts);
        this.appendChild(footer);
    }

    connectedCallback()
    {

    }

    disconnectedCallback()
    {

    }
}

customElements.define('wc-footer', WCFooterView);

export { WCFooterView };
