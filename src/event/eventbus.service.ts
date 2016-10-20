import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs/Rx';

import { BroadcastEvent } from './broadcast-event';

@Injectable()
export class EventBusService {
    bus: Subject<BroadcastEvent> = new Subject<BroadcastEvent>();

    dispatch(event: BroadcastEvent) {
        this.bus.next(event);
    }

    listen(handler: (event) => any): Subscription {
        return this.bus.subscribe(handler);
    }

    listenByFilter(handler: (event) => any, type?: string, source?: string, target?: string): Subscription {
        return this.bus.filter(event => {
            return (event.type === type || !type) && (event.source === source || !source) && (event.target === target || !target);
        }).subscribe(handler);
    }
}
