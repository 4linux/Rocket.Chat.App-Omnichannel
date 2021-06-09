import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ILivechatEventContext } from '@rocket.chat/apps-engine/definition/livechat';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export class LivechatAgentAssignedService {

    public async executePost(context: ILivechatEventContext, read: IRead, modify: IModify): Promise<void> {
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

}
