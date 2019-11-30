import { AnyAction, Reducer, On, OnReducer } from './types';

export function on<S,
    A1 extends ActionCreator>
(
    a1: A1,
    reducer: OnReducer<S, [A1]>,
): On<S>;
export function on<S,
    A1 extends ActionCreator,
    A2 extends ActionCreator>
(
    a1: A1,
    a2: A2,
    reducer: OnReducer<S, [A1, A2]>,
): On<S>;
export function on<S>(...props: (ActionCreator | Reducer<S>)[]): On<S> {
    const reducer = props.pop();
    return {
        types  : props as any,
        reducer: reducer as Reducer<S>,
    };
}

export function createReducer<S>(
    initialState: S,
    ...props: On<S>[]
): any {
    const actions: {[type: string]: OnReducer<S>} = {};

    props.forEach(
        onItem => onItem.types.forEach(type =>
            actions[type.type] = onItem.reducer,
        ),
    );

    return function(state: S, action: AnyAction) {
        if (state === void 0) state = initialState;
        if (action.type in actions)
            return actions[action.type](state, action);
        return state;
    };
}
