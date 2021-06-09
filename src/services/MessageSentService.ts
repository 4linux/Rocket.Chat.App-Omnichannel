import { IMessageBuilder } from '@rocket.chat/apps-engine/definition/accessors';
import { ILivechatRoom } from '@rocket.chat/apps-engine/definition/livechat';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { UserType } from '@rocket.chat/apps-engine/definition/users';

export class MessageSentService {

    public async executePre(message: IMessage, builder: IMessageBuilder): Promise<IMessage> {
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

        const messageText = `*${message.sender.name}:*\n\n${message.text}`;

        builder.setText(messageText);

        return await builder.getMessage();
    }

}
