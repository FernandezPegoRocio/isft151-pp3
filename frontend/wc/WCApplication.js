import { WCApplicationController } from './controller/WCApplicationController.js';
import { WCApplicationModel } from './model/WCApplicationModel.js';
import { WCApplicationView } from './view/WCApplicationView.js';

class WCApplication
{
    constructor()
    {
        this._model = new WCApplicationModel();
        this._view = new WCApplicationView();
        this._controller = new WCApplicationController(this._view, this._model);
    }

    getView()
    {
        return this._view;
    }

    enable()
    {
        this._controller.enable();
    }

    disable()
    {
        this._controller.disable();
    }
}

export { WCApplication };
