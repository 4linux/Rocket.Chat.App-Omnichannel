import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ILivechatTransferEventContext, LivechatTransferEventType } from '@rocket.chat/apps-engine/definition/livechat';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export class LivechatRoomTransferredService {

    public async executePost(context: ILivechatTransferEventContext, read: IRead, modify: IModify): Promise<void> {
        if (context.room.type !== RoomType.LIVE_CHAT) {
            return;
        }

        const messageText = context.type === LivechatTransferEventType.AGENT ?
            `*Você foi transferido para outro atendente.*` :
            `*Você foi transferido para o departamento ${context.to.name}.*`;

        const appUser = await read.getUserReader().getAppUser() as IUser;

        const message = modify.getCreator()
            .startLivechatMessage()
            .setRoom(context.room)
            .setText(messageText)
            .setSender(appUser);

        await modify.getCreator().finish(message);
    }

}
