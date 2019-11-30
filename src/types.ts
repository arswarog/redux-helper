export interface AnyAction {
    type: string;
    [key: string]: any;
}

export interface Reducer<S, A extends TypedAction<string, any> = TypedAction<string>> {
    (state: S, action: A): S;
}

export type TypedAction<T extends string, A extends object = {}> = {
    readonly type: T;
} & A;

export interface OnReducer<S, A extends ActionCreator[] = ActionCreator[]> {
    (state: S, action: ResolveActionCreator<A[number]>): S;
}

export interface On<S> {
    types: ActionCreator[];
    reducer: Reducer<S>;
}

export interface ActionCreator<T extends string = string,
    A extends object = any,
    R extends any[] = any> {
    type: T;
    (...props: R): TypedAction<T, A>;
}

export type ResolveActionCreator<A>
    = A extends ActionCreator<infer T, infer O>
    ? TypedAction<T, O>
    : any;
