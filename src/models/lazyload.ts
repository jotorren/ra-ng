import { LazyLoadEvent } from 'primeng/primeng';

export function isSubInterval(ev1: LazyLoadEvent, ev2: LazyLoadEvent): boolean {
    if (!ev1 || !ev2) {
        return false;
    }

    if (ev1.multiSortMeta !== ev2.multiSortMeta ||
        ev1.sortField !== ev2.sortField ||
        ev1.sortOrder !== ev2.sortOrder ||
        JSON.stringify(ev1.filters) !== JSON.stringify(ev2.filters)) {
        return false;
    }

    return (ev1.first >= ev2.first && (ev1.first + ev1.rows) <= (ev2.first + ev2.rows));
}
