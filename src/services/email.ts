import mailjet from "node-mailjet";
import {
    emailApiKey,
    emailApiSecret,
    emailApiVersion
} from "../constants";

import { CustomError, error } from "./";

export interface EmailDetailsInterface {
    senderEmail: string;
    recieverEmail: string;
    recieverName: string;
    messageSubject: string;
    messageHtmlContent: string;
}

export interface SendEmailParameterInterface {
    apiKey: string;
    apiSecret: string;
    version: string;
    sendEmailError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError;
}

export const sendMailDefinition = (
    sendEmailArgs: SendEmailParameterInterface
): ((emailInfo: EmailDetailsInterface) => Promise<any>) => {
    return async ({
        senderEmail,
        recieverEmail,
        recieverName,
        messageHtmlContent,
        messageSubject
    }) => {
        const {
            apiKey,
            apiSecret,
            version,
            sendEmailError
        } = sendEmailArgs;
        try {
            const mailRequest = await mailjet
                .connect(apiKey, apiSecret)
                .post("send", { version })
                .request({
                    Messages: [
                        {
                            From: {
                                Email: senderEmail,
                                Name: "Task Manager Inc"
                            },
                            To: [
                                {
                                    Email: recieverEmail,
                                    Name: recieverName
                                }
                            ],
                            Subject: messageSubject,
                            HTMLPart: messageHtmlContent
                        }
                    ]
                });
            return mailRequest;
        } catch (err) {
            throw sendEmailError(
                err.statusCode,
                err.Message,
                "Send Email"
            );
        }
    }
}

export const sendMail = sendMailDefinition({
    apiSecret: emailApiSecret,
    apiKey: emailApiKey,
    version: emailApiVersion,
    sendEmailError: error
});
