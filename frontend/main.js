import { WCApplication } from './wc/WCApplication.js';

function main()
{
    let myApplication = new WCApplication();

    myApplication.enable();
    document.body.appendChild(myApplication.getView());
}

window.onload = main;
