import {
    IAppAccessors,
    IHttp,
    ILogger,
    IMessageBuilder,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { ILivechatEventContext, ILivechatRoom, ILivechatTransferEventContext, IPostLivechatAgentAssigned, IPostLivechatRoomTransferred, LivechatTransferEventType } from '@rocket.chat/apps-engine/definition/livechat';
import { IMessage, IPreMessageSentModify } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser, UserType } from '@rocket.chat/apps-engine/definition/users';
export class RocketChatAppOmnichannelApp extends App implements IPreMessageSentModify, IPostLivechatRoomTransferred, IPostLivechatAgentAssigned {

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executePostLivechatAgentAssigned(
        context: ILivechatEventContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify,
    ): Promise<void> {
        if (context.room.type !== RoomType.LIVE_CHAT) {
            return;
        }

        const appUser = await read.getUserReader().getAppUser() as IUser;

        const message = modify.getCreator()
            .startLivechatMessage()
            .setRoom(context.room)
            .setText(`Você está falando com o atendente ${context.agent.name}.`)
            .setSender(appUser);

        await modify.getCreator().finish(message);
    }

    public async executePostLivechatRoomTransferred(
        context: ILivechatTransferEventContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify,
    ): Promise<void> {
        if (context.room.type !== RoomType.LIVE_CHAT) {
            return;
        }

        const messageText = context.type === LivechatTransferEventType.AGENT ?
            `*Você foi transferido um outro atendente.*` :
            `*Você foi transferido para o departamento ${context.to.name}.*`;

        const appUser = await read.getUserReader().getAppUser() as IUser;

        const message = modify.getCreator()
            .startLivechatMessage()
            .setRoom(context.room)
            .setText(messageText)
            .setSender(appUser);

        await modify.getCreator().finish(message);
    }

    public async executePreMessageSentModify(
        message: IMessage,
        builder: IMessageBuilder,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
    ): Promise<IMessage> {
        if (message.room.type !== RoomType.LIVE_CHAT) {
            return await builder.getMessage();
        }

        if (message.sender.type !== UserType.USER) {
            return await builder.getMessage();
        }

        const room = message.room as ILivechatRoom;

        if (!room.isWaitingResponse) {
            return await builder.getMessage();
        }

        const messageText = `*${message.sender.name}:*\n\n\n${message.text}`;

        builder.setText(messageText);

        return await builder.getMessage();
    }

}
