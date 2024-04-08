# CM CNS :email: :iphone:

## Table of Contents

-   [Introduction](#introduction)
-   [Technologies](#computer-technologies)
-   [Installation](#installation)
-   [Running the Application](#running-the-app-rocket)
-   [Modules](#modules)
    -   [Microservices](#microservices)
    -   [Library](#library)
-   [Entities](#entities)
-   [Guards](#guardsman-guards)
    -   [Authentication](#authentication)
    -   [ApiKey Guard](#apikey-guard)
    -   [Authorization](#authorization)
-   [RabbitMQ](#rabbit-rabbitmq)
-   [Environment File](#maple_leaf-env-variables)
-   [License](#license)
-   [Author](#authors)

## Introduction

The primary purpose of this project is to develop a common notification service (CNS) as well as a notification API service that meets the specific business and technical requirements of SPTel.

## :computer: Technologies

#### Project is created with:

-   NodeJS Version: 20.10.0
-   Pnpm Version: 8.12.1
-   RabbitMQ Version: 3.12-management (Docker Image)
-   MongoDB
-   Postgres
-   NestJS Version: 10.3.1

## Installation

```bash
$ pnpm install
```

## Running the app :rocket:

```bash
# watch mode
$ pnpm run start:dev

# notification service
$ pnpm run start:notification

# CNS
$ pnpm run start:cns
```

## Modules

### Microservices

### Common Notification Service

![alt CNS](/assets/images/CNS.png)

#### CNS-User Modules ([Link to the Swagger locally and UAT](http://localhost:3070/cns-user))

File Directory:

-   [ApiAuth](/apps/cns-user/src/api-key/api-key.module.ts)
-   [Organisation](/apps/cns-user/src/organisation/organisation.module.ts)
-   [Permission](/apps/cns-user/src/permission/permission.module.ts)
-   [Role](/apps/cns-user/src/role/role.module.ts)
-   [RolePermission](/apps/cns-user/src/rolepermission/rolepermission.module.ts)
-   [User](/apps/cns-user/src/user/user.module.ts)
-   [UserAuth](/apps/cns-user/src/user-auth/user-auth.module.ts)

#### CNS-Notification-Record Module ([Link to the Swagger locally and UAT](http://localhost:3060/cns-notification-record))

File Directory:

-   [Notification-Record](/apps/cns-notification-record/src/cns-notification-record.module.ts)

### Notification Service

#### Overall Architecture of the Notification Service

![alt NotificationService](/assets/images/NotificationService.jpg)

-   CNS architecture mainly comprise of the Notification API service, Message Queues and Workers.

#### Dead-Letter-Exchange Notification API Module

> Responsible for consuming message that are stuck in the queue or unconsume from the worker service

File Directory:

-   [dlx-notification-api](/apps/dlx-notification-api/src/dlx-notification-api.module.ts)

#### Notification API Modules

File Directory:

-   [Email API](/apps/notification-api/src/modules/email-api/email-api.module.ts)
-   [SMS API](/apps/notification-api/src/modules/sms-api/sms-api.module.ts)

##### How to use the Notification API

-   Firstly, go to my cns-user swagger to generate the API-Key --> [localhost:3070](http://localhost:3070/cns-user)

-   In Postman, set up the secret key and post to `http://localhost:3000/v1/api/notification-api/email` (Email) or `http://localhost:3000/v1/api/notification-api/SMS` (SMS)

    ![NotificationAPI](/assets/images/notificationAPI.png)

-   Secondly, set up your message body to be like this

    -   Email:

        ![Email Body](/assets/images/emailBody.png)

    -   SMS:

        ![SMS Body](/assets/images/SMSBody.png)

#### Worker Service Module

> Responsible for consuming messages from the message queues and process the notifications

File Directory:

-   [WS](/apps/worker-service/src/worker-service.module.ts)

### Library

-   [Gurads](/libs/auth/src/)
    -   ApiKey
    -   Authentication
    -   Authorisation
-   [Common](/libs/common/src/)
    -   Constant
    -   Entity
    -   DTOs
    -   Exception-Filter
    -   Interceptors
    -   RabbitMQ
-   [Config](/libs/config/src/)
    -   Mongoose Configuration
    -   Postgres Configuration

## Entities

### Postgres

<img src="/assets/images/entities.png" alt="Entities Image" width="650" height="auto"/>

### MongoDB

<img src="/assets/images/mongodb.png" alt="Mongodb Image" width="650" height="auto"/>

## :guardsman: Guards

### Authentication

#### [Local Strategy](/libs/auth/src/authentication-guard/guard/local.strategy.ts)

-   The purpose of the local strategy is to verify and authenticate the credentials of a user during the sign-in process.

-   Example of using local Strategy Guard throughout the application:
    ```Typescript
    // apps/cns-user/src/user-auth/user-auth.controller.ts
    @Post('signIn')
    @UseGuards(UserAuthGuard)
    async signIn(@Request() req: any) {}
    ```

#### [Jwt Strategy](libs/auth/src/authentication-guard/guard/jwt.strategy.ts)

-   The Jwt Strategy is implemented to validate the authentication of users accessing an API, ensuring that only authenticated users are authorized to make API calls.

-   Example of using Jwt Strategy Guard throughout the application:
    ```Typescript
    // Can be seen across the different controllers
    @Get('listRoles')
    @UseGuards(JwtAuthGuard)
    async listRoles() {}
    ```

#### [Refresh-Token Strategy](libs/auth/src/authentication-guard/guard/refresh-token.strategy.ts)

-   The Refresh Token strategy is designed to handle the renewal of authentication tokens for users, allowing them to obtain new access tokens without requiring them to re-enter their credentials.

-   Example of using Refresh Token Strategy Guard:
    ```Typescript
    // apps/cns-user/src/user-auth/user-auth.controller.ts
    @Get('refreshToken')
    @UseGuards(RefreshTokenGuard)
    async refreshToken() {}
    ```

#### [Reset Password Strategy](libs/auth/src/authentication-guard/guard/reset-password-jwt.strategy.ts)

-   The Reset Password Strategy is to facilitate the process of resetting a user's password when they have forgotten it or need to change it.

-   Example of using Reset Password Strategy Guard:
    ```Typescript
    // apps/cns-user/src/user-auth/user-auth.controller.ts
    @Patch('resetPassword')
    @UseGuards(ResetPasswordGuard)
    async resetPassword() {}
    ```

### ApiKey Guard

#### [Api-Auth](libs/auth/src/apiKey-guard/guard/api-auth.strategy.ts)

-   The purpose of the ApiKey Strategy is to authenticate whether a user has the authorization to send emails.

-   Example of using ApiKey Strategy Guard:
    ```Typescript
    // apps/notification-api/src/modules/email-api/email-api.controller.ts
    @Post('/email')
    @UseGuards(ApiAuthGuard)
    async publishEmail() {}
    ```

### Authorization

#### CASL

-   The purpose of CASL is to provide user-centric access control for application. CASL enable developers to define permissions and role for the application. [To know more about CASL ](https://casl.js.org/v6/en)

##### [Casl-ability.factory.ts](libs/auth/src/authorization-guard/casl/casl-ability.factory.ts)

-   The purpose is to create the `Ability` Object for that given user
-   Method:
    ```Typescript
    async defineAbilitiesFor(user: any)
    ```

##### [Policy-guard](libs/auth/src/authorization-guard/guard/policy.guard.ts)

-   The purpose is to obtains the user information from the incoming request, and creates an ability object using the caslAbilityFactory. It then proceeds to validate each policy handler against the user's abilities.
-   The PoliciesGuard **acts as a middleware that enforces policies by checking if the user has the required abilities** to access a particular route or resource.
-   Method:
    ```Typescript
    async canActivate(context: ExecutionContext): Promise<boolean>
    ```
-   You are able to use this authorisation guard throughout the application
    -   Example:
        ```Typescript
        // Can be seen across the different controllers
        @Get('GroupUsersByOrganisation')
        @UseGuards(PolicyGuard)
        @CheckPolicies((ability: AppAbility) =>
            ability.can(Operation.Read, 'Organisation'),
        )
        async groupUsersByOrganisation() {}
        ```

## :rabbit: [RabbitMQ](libs/common/src/rabbit-mq/rabbit-mq.module.ts)

> RabbitMQ serves as a message broker, facilitating the exchange of messages between different components, systems, or services within an application or across multiple applications. [To know more about RabbitMQ.](https://www.rabbitmq.com/tutorials)

### Setting up the connection

```Typescript
onModuleInit() {
    const rabbitmqUri = this.configService.get<string>('RABBITMQ_URI');
    this.connection = connect([rabbitmqUri]);
```

-   By setting up the connection, you will be able to access the rabbitMQ: [localhost:15672](http://localhost:15672/)
    <img src="/assets/images/rabbitmqlogin.png" alt="Login Image" width="650" height="auto"/>

1. Username: guest
2. Password: guest
    > The password can be easily change under the Admin page
    > You can even add user and set its access control

-   Once Access, you can view the entire overview of the rabbitMQ
    ![rabbitMQOverview](/assets/images/rabbitmqOverview.png)

### Setting up the Channel

```Typescript
this.channel = this.connection.createChannel({
    json: true,
    setup: async (channel) => await this.setupRabbitMQ(channel),
    confirm: true,
});
```

> The code I written will automatically create the exchange, queues and simultaneously bind the queue and exchange together

### First, create the exchange

```Typescript
await channel.assertExchange(EX_NOTIFICATION, 'direct', {
    durable: true,
});
```

![Exchange](/assets/images/Exchange.png)

### Second, create the queue

```Typescript
await channel.assertQueue(QUEUE_SMS, {
    durable: true,
    arguments: {
        'x-queue-type': 'quorum',
        'x-message-ttl': 10000,
        'x-dead-letter-exchange': DLX_EXCHANGE,
        'x-dead-letter-routing-key': RK_NOTIFICATION_SMS,
        'x-delivery-limit': 5,
    },
});
```

![Queue](/assets/images/Queue.png)

You can access the queue to gain more detailed insights and information about the specific queue.

### Third, bind the queue to a routing key and the exchange

```Typescript
await channel.bindQueue(
    QUEUE_SMS,
    EX_NOTIFICATION,
    RK_NOTIFICATION_SMS,
);
```

### Publish message to the broker

```Typescript
public async publish(routingkey: string, message: any) {
    const result = await this.channel.publish(
            EX_NOTIFICATION,
            routingkey,
            Buffer.from(JSON.stringify(message)),
            );
    return result;
}
```

### Subscribing to the broker

```Typescript
public async subscribe(queue: string, onMessage: (msg) => void) {
    ...
}
```

## :fallen_leaf: Env variables

Environment files are avaliable in [here](.env)

## License

This project is licensed under the CM License

## Authors

The one and only CM :muscle:

![swag](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjI4dGtneWNyejB1MThodnhzbDZrZzM1Y2R2YmdvYWY4ZzVpMmxsZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hTa5z1RfAvqAEHVF8t/giphy.gif)
