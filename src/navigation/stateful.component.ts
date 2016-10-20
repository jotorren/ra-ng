import { UserContextService } from '../env';

export function recoverState(object: any, context: UserContextService, id: string) {
  object['state'] = context.memory.get(id) || {};

  if (object['state']) {
    for (let saved in object['state']) {
      if (object['state'].hasOwnProperty(saved)) {
        object[saved] = object['state'][saved];
      }
    }
  }
}

export function saveState(object: any, context: UserContextService, id: string) {
  for (let save of object['saveprops']) {
    if (object.hasOwnProperty(save)) {
      object['state'][save] = object[save];
    }
  }

  context.memory.put(id, object['state']);
}

export function removeState(object: any, context: UserContextService, id: string) {
  object['state'] = {};
  context.memory.remove(id);
}

export function SaveProperty(target: any, key: string) {

  if (!target['state']) {
    target['state'] = {};
  }
  if (!target['saveprops']) {
    target['saveprops'] = [];
  }
  target['saveprops'].push(key);
}
