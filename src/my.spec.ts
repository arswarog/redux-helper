import { createAction } from './action-creator';
import { createReducer, on } from './create-reducer';
import { Reducer, On } from './types';

const FormAction1 = createAction('a1');
const FormAction2 = createAction('a2');
const FormAction3 = createAction('a3');

function onFormAction<S>(reducer: Reducer<S>): On<S> {
    return {
        types: [FormAction1, FormAction2, FormAction3],
        reducer,
    };
}

interface IState {
    name: string;
    age: number;
}

describe('My Helper', () => {
    it('ngrx', () => {
        const type    = 'change';
        const typeAge = 'age';
        const factory = (name: string) => ({name});
        //const factory = () => ({name: 'name'});
        const Change  = createAction(type, factory);
        const Age     = createAction(typeAge);

        const x = Change('test');
        expect(Change.type).toEqual('change');
        console.log(x.type);
        console.log(x.name);
        expect(x).toEqual({
            type,
            name: 'test',
        });
        const a = Age();
        console.log(a.type);
        //console.log(a.name);// TSError
        expect(a).toEqual({type: typeAge});

        const reducer = createReducer<IState>(
            {name: 'vasya', age: 1},
            on(Change, Age, (state, action) => {
                console.log('CHANGE');
                switch (action.type) {
                    case 'change':
                        return {
                            name: action.name,
                            age : state.age,
                        };
                    case 'age':
                        action;
                        return {
                            ...state,
                            age: 0,
                        };
                }
                return state;
            }),
            on(Age, (state, action) => {
                console.log('AGE');
                return {
                    ...state,
                    //name: action.name, // TSError
                };
            }),
            onFormAction((state, action) => {
                console.log('FormAction');
                return {
                    ...state,
                    name: action.type,
                };
            }),
        );

        const action = Change('oleg');

        const state = reducer(undefined, action);

        expect(state).toEqual({
            name: 'oleg',
            age : 1,
        });

        const action2 = FormAction1();

        const state2 = reducer(undefined, action2);

        expect(state2).toEqual({
            name: 'a1',
            age : 1,
        });
    });
    it('core', () => {

    });
});

