import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IMessageBuilder,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { ILivechatEventContext, ILivechatTransferEventContext, IPostLivechatAgentAssigned, IPostLivechatRoomTransferred, LivechatTransferEventType } from '@rocket.chat/apps-engine/definition/livechat';
import { IMessage, IPreMessageSentModify } from '@rocket.chat/apps-engine/definition/messages';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';

import { LivechatAgentAssignedService } from './src/services/LivechatAgentAssignedService';
import { LivechatRoomTransferredService } from './src/services/LivechatRoomTransferredService';
import { MessageSentService } from './src/services/MessageSentService';
import { SETTINGS } from './src/settings/settings';
export class RocketChatAppOmnichannelApp
    extends App
    implements IPreMessageSentModify, IPostLivechatRoomTransferred, IPostLivechatAgentAssigned {

    private messageSentService: MessageSentService;
    private livechatRoomTransferredService: LivechatRoomTransferredService;
    private livechatAgentAssignedService: LivechatAgentAssignedService;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);

        this.messageSentService = new MessageSentService();
        this.livechatRoomTransferredService = new LivechatRoomTransferredService();
        this.livechatAgentAssignedService = new LivechatAgentAssignedService();
    }

    public async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await SETTINGS.forEach((setting) => configuration.settings.provideSetting(setting));
    }

    public async executePostLivechatAgentAssigned(
        context: ILivechatEventContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify,
    ): Promise<void> {
        await this.livechatAgentAssignedService.executePost(context, read, modify);
    }

    public async executePostLivechatRoomTransferred(
        context: ILivechatTransferEventContext,
        read: IRead,
        http: IHttp,
        persis: IPersistence,
        modify: IModify,
    ): Promise<void> {
        await this.livechatRoomTransferredService.executePost(context, read, modify);
    }

    public async executePreMessageSentModify(
        message: IMessage,
        builder: IMessageBuilder,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
    ): Promise<IMessage> {
        return this.messageSentService.executePre(message, builder);
    }

}
