import CoreBase from './coreBase';
export declare class Alert extends CoreBase {
    private ucidList;
    private sendList;
    constructor();
    sendMessage(rawUcidListString?: string, message?: string): boolean;
    private sendWXMessage;
    private checkUcidList;
    private formatMessage;
    private getLocalIpStr;
    private getMessageId;
}
