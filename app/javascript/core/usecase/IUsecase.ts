export interface IUsecase<I, O> {
    execute(input: I): O;
}
