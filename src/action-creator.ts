import { ActionCreator } from './types';

export function createAction<T extends string,
    A extends {} = {},
    R extends any[] = any[]>
(type: T, factory: (...props: R) => A): ActionCreator<T, A, R>;
export function createAction<T extends string,
    A extends {} = {},
    R extends any[] = any[]>
(type: T): ActionCreator<T, A, R>;
export function createAction<T extends string,
    A extends {} = {},
    R extends any[] = any[]>
(type: T, factory?: (...props: R) => A): ActionCreator<T, A, R> {
    let creator: any;
    if (factory)
        creator = function creator(...props: R) {
            const action: any = factory(...props);
            return {
                ...action,
                type,
            };
        };
    else
        creator = function creator() {
            return {
                type,
            };
        };
    creator.type = type;
    return creator;
}
