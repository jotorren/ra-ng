import { Message } from 'primeng/primeng';

import { BroadcastEvent } from './broadcast-event';

export const BroadcastMessageType = 'message';

export class BroadcastMessage extends BroadcastEvent {
    constructor(public message: Message, public source?: string, public target?: string) {
        super(BroadcastMessageType, message, source, target);
    }
}
