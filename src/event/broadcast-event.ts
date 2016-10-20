export const EnterAnnouncedEventType    = 'enterannounced';
export const UpdateAnnouncedEventType   = 'updateannounced';
export const LeaveConfirmedEventType    = 'leaveconfirmed';
export const ValidationEventType        = 'validation';
export const ClearMessagesEventType     = 'clearmessages';

export class BroadcastEvent {
    constructor(public type: string, public data: any, public source?: string, public target?: string) {
    }
}
