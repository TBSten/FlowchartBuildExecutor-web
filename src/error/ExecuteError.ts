
export default class ExecuteError extends Error{
    displayMessage:string;
    constructor(debugMessage:string,displayMessage:string=""){
        super(debugMessage);
        this.displayMessage = displayMessage ;
    }
}

