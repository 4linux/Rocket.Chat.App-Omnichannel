import { IEnvironmentRead } from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISetting,
    SettingType,
} from '@rocket.chat/apps-engine/definition/settings';

export const CONFIG_NOTIFY_AGENT_ASSIGNED = 'notify_agent_assigned';
export const CONFIG_NOTIFY_ROOM_TRANSFERRED = 'notify_room_transferred';
export const CONFIG_MESSAGE_ADD_AGENT_NAME = 'message_add_agent_name';

export const SETTINGS: Array<ISetting> = [
    {
        id: CONFIG_NOTIFY_AGENT_ASSIGNED,
        type: SettingType.BOOLEAN,
        packageValue: true,
        required: true,
        public: false,
        i18nLabel: `config_${CONFIG_NOTIFY_AGENT_ASSIGNED}_label`,
        i18nDescription: `config_${CONFIG_NOTIFY_AGENT_ASSIGNED}_description`,
    },
    {
        id: CONFIG_NOTIFY_ROOM_TRANSFERRED,
        type: SettingType.BOOLEAN,
        packageValue: true,
        required: true,
        public: false,
        i18nLabel: `config_${CONFIG_NOTIFY_ROOM_TRANSFERRED}_label`,
        i18nDescription: `config_${CONFIG_NOTIFY_ROOM_TRANSFERRED}_description`,
    },
    {
        id: CONFIG_MESSAGE_ADD_AGENT_NAME,
        type: SettingType.BOOLEAN,
        packageValue: true,
        required: true,
        public: false,
        i18nLabel: `config_${CONFIG_MESSAGE_ADD_AGENT_NAME}_label`,
        i18nDescription: `config_${CONFIG_MESSAGE_ADD_AGENT_NAME}_description`,
    },
];

export async function getSettingValue(environmentRead: IEnvironmentRead, settingId: string): Promise<any> {
    const setting = (await environmentRead.getSettings().getById(settingId)) as ISetting;

    return setting.value;
}
