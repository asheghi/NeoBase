export interface Callback<Args extends any[] | any = void, Output = void> {
    (...args: Args | any): Output;
}