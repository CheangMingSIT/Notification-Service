import { QUEUE_EMAIL, QUEUE_SMS } from '@app/common';
import { RabbitmqService } from '@app/common/rabbit-mq/rabbit-mq.service';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class WsService implements OnModuleInit {
    constructor(private readonly rabbitMQService: RabbitmqService) { }

    async onModuleInit() {

        await this.rabbitMQService.subscribe(
            QUEUE_EMAIL,
            this.handleEmailMessage.bind(this),
        );

        await this.rabbitMQService.subscribe(
            QUEUE_SMS,
            this.handleSMSMessage.bind(this),
        );
    }

    private async handleEmailMessage(emailMessage: any) {
        const message = {
            subject: emailMessage.subject,
            body: {
                contentType: "Text",
                content: emailMessage.body
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: emailMessage.to
                    }
                }
            ],
            from:
            {
                emailAddress: {
                    address: emailMessage.from
                }
            }
        }

        if (emailMessage.cc) {
            message["ccRecipients"] = [
                {
                    emailAddress: {
                        address: emailMessage.cc
                    }
                }
            ]
        }

        try {
            const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    Authorization: "EwBoA8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAATZYCttTGKgunmynI2RU52nXUfIkNub0DVO4XgvicdrHL4CCsXMO1kmzHDRjMPwEIC+gvIjboY664hQELH4SXL3qfDEIx03pGFHyuqAq6ycEi1t5aAF9aogTtTvohomJR3fbDFJOIHvPqFnaLcjcxYQ6B5BkJY2yxerCzsAtWehwFqYUWUNbIHBnEQv7rtRzTCYWnRLSZvascjMV3c3ZZv1wKivkykgtSbgu0w/x7eL8v5nTolyiiaB2syZOBM7ROASt/QKoKIKXqE4ukGayubCS67XSj7IyFMUx7RXhgPu/4Ivi+gdudwLos6RBoG/Ik3/rMWKOWci+3YSJ6peMpg8DZgAACDF0EoM7Kvq8OAKReqqbHtmtiLWe+Wu4cmEW8Lql3Vp7AC7UKxLbpqmMbMJ46S9Ol7XiC61MObZS1n0YJBluGT5D7J8Pu+DPke95GT/3HCggsKRXOP/LNWFbxOEEWOaPxvQ8gGfeEHq5s1MUSUikU6NfIP99fMC6qnYWgDpTwrvcsQEXewf2CWS13LqPfZFhHPD39Y+wvL9l9YEhr3Yrs/XvCz7cXFXXpYOujSjO/o9TTb2/kW5/aRkxcOYHx/xLm691uMkhNl5A6oLsrUglwlsL01vy1qE20QrfChgsooMiC8QdtaQQ+osb4KCpWWcEQsVG1t2NT0lZVahQoTRdg/xAGYlfYLdnoMegMzVLOm2cNVk2ryrKSpvghU6YxpjqV4eeVsoT/ARYKE4FnE0OjvLxTj4fBa4N49XmB7mi+22AJAZSyMnrT5/fDYwnp3TYWsf3QgeWQCVLY2BJlwooe7/xN/PV5hcjYP9wgdthrgxI5zNALpiQi1fIepJxH1RHd4UveMBzItDiArpxQG8n4UZGSTwyq40hrP70q43aLJEkfVxpm388W8MBt069e8elcY1WM1cQl2NMPY5UY/iUwjZyoCnzxhbb/Cypd0kA3H0miCtfmQqBeiEXhRWlsrxcm9U1DI81K2NLpZPCVItE9GAYfMUcoogRh6FjhwdAJr1kksfxNqOODP0E/gz4XIyqHKD+kH951cs8sTHDxldp4uJaBcZcWNQtvYfikuU1wLXGWy7EpULDHH852BLu8cXsXTNfegI=",
                },
                body: JSON.stringify({
                    message: message,
                })
            })
            console.log(response);
        } catch (error) {
            // Handle any errors that occur in processing the email message
            console.error('Error processing email message:', error);
        }
    }

    private async handleSMSMessage(smsMessage: any) {
        try {
            const response = await fetch("https://sms.api.sinch.com/xms/v1/5b121cd7f3544f81b6cb929e842ef141/batches", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + 'c60a2deba7524fd68a9b0ad484d93151'
                },
                body: JSON.stringify({
                    from: "447520651359",
                    to: ["6592208810"],
                    body: smsMessage.body
                })
            })
            const data = await response.json()
            console.log(data);
        } catch (error) {
            // Handle any errors that occur in processing the SMS message
            console.error('Error processing SMS message:', error);
        }
    }
}

