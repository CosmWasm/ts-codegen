import generate from '@babel/generator';

export const expectCode = (ast) => {
    expect(
        generate(ast).code
    ).toMatchSnapshot();
}

export const printCode = (ast) => {
    console.log(
        generate(ast).code
    );
}
