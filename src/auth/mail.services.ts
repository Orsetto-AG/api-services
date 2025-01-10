
export class MAILService {
    // sendMail API
    public static sendMail(templateContentDetails: any, recipientMailId: string | any, mailSubject: string, bcc: boolean = false, isAttachment: boolean = false, attachmentDetails: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const webhook = require('../../add-ons/WebHook/WebHookConfig');
            webhook.trigger('send_email', { templateContentDetails, recipientMailId, mailSubject, bcc, isAttachment, attachmentDetails });
        });
    }
}
