interface Action {
    type: string;
}

const arraysAreNotAllowedMsg = 'arrays are not allowed in action creators';
/** @deprecated */
type ArraysAreNotAllowed = typeof arraysAreNotAllowedMsg;

const typePropertyIsNotAllowedMsg = 'type property is not allowed in action creators';
/** @deprecated */
type TypePropertyIsNotAllowed = typeof typePropertyIsNotAllowedMsg;

type PropsReturnType<T extends object> = {
    _as: 'props';
    _p: T;
};
/** @deprecated */
type DisallowArraysAndTypeProperty<T> = T;

type FunctionWithParametersType<P extends unknown[], R = void> = (...args: P) => R;

interface TypedAction<T extends string> extends Action {
    readonly type: T;
}

type ActionType<A> = A extends ActionCreator<infer T, infer C> ? ReturnType<C> & {
    type: T;
} : never;

interface ActionReducer<T, V extends Action = Action> {
    (state: T | undefined, action: V): T;
}

interface OnReducer<S, C extends ActionCreator[]> {
    (state: S, action: ActionType<C[number]>): S;
}

interface On<S> {
    reducer: ActionReducer<S>;
    types: string[];
}

function on<C1 extends ActionCreator, S>(
    creator1: C1,
    reducer: OnReducer<S, [C1]>,
): On<S>;

function on(
    ...args: (ActionCreator | Function)[]
): {reducer: Function; types: string[]} {
    const reducer = args.pop() as Function;
    const types   = args.reduce(
        (result, creator) => [...result, (creator as ActionCreator).type],
        [] as string[],
    );
    return {reducer, types};
}
type Creator<P extends any[] = any[],
    R extends object = object> = FunctionWithParametersType<P, R>;

function createReducer<S, A extends Action = Action>(initialState: S, ...ons: On<S>[]): ActionReducer<S, A>;

function createReducer<S, A extends Action = Action>(
    initialState: S,
    ...ons: On<S>[]
): ActionReducer<S, A> {
    const map = new Map<string, ActionReducer<S, A>>();
    for (let on of ons) {
        for (let type of on.types) {
            if (map.has(type)) {
                const existingReducer                 = map.get(type) as ActionReducer<S, A>;
                const newReducer: ActionReducer<S, A> = (state, action) =>
                    on.reducer(existingReducer(state, action), action);
                map.set(type, newReducer);
            } else {
                map.set(type, on.reducer);
            }
        }
    }

    return function(state: S = initialState, action: A): S {
        const reducer = map.get(action.type);
        return reducer ? reducer(state, action) : state;
    };
}
type ActionCreator<T extends string = string,
    C extends Creator = Creator,
    > = C & TypedAction<T>;

function createAction<T extends string>(type: T): ActionCreator<T, () => TypedAction<T>>;
function createAction<T extends string, P extends object>(type: T, config: {
    _as: 'props';
    _p: P;
}): ActionCreator<T, (props: P) => P & TypedAction<T>>;
function createAction<T extends string,
    P extends any[],
    R extends object>(type: T,
                      creator: Creator<P, R>):
    FunctionWithParametersType<P, R & TypedAction<T>> & TypedAction<T>;

function createAction<T extends string, C extends Creator>(
    type: T,
    config?: {_as: 'props'} | C,
): Creator {
    if (typeof config === 'function') {
        return defineType(type, (...args: any[]) => ({
            ...config(...args),
            type,
        }));
    }
    const as = config ? config._as : 'empty';
    switch (as) {
        case 'empty':
            return defineType(type, () => ({type}));
        case 'props':
            return defineType(type, (props: object) => ({
                ...props,
                type,
            }));
        default:
            throw new Error('Unexpected config.');
    }
}

function props<P extends object>(): PropsReturnType<P>;

function props<P extends object>(): PropsReturnType<P> {
    // the return type does not match TypePropertyIsNotAllowed, so double casting
    // is used.
    return ({_as: 'props', _p: undefined!} as unknown) as PropsReturnType<P>;
}

function defineType(type: string, creator: Creator): Creator {
    return Object.defineProperty(creator, 'type', {
        value   : type,
        writable: false,
    });
}

interface IState {
    name: string;
    age: number;
}

describe('Helper', () => {
    it('ngrx', () => {
        const type   = 'change';
        const Change = createAction(type, props<{name: string}>());

        const reducer = createReducer<IState>(
            {name: 'vasya', age: 1},
            on(Change, (state, action) => {
                return {
                    ...state,
                    name: action.name,
                };
            }),
        );

        const action = Change({name: 'oleg'});

        const state = reducer(undefined, action);

        expect(state).toEqual({
            name: 'oleg',
            age : 1,
        });
    });
    it('core', () => {

    });
});

