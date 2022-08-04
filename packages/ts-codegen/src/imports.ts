import * as w from 'wasm-ast-types';

export const cosmjsAminoImportStatements = (typeHash) => {
  const cosmjsImports = ['StdFee'];

  // If the coin is not provided by the generation already, import it from cosmjs
  if (!typeHash.hasOwnProperty('Coin')) {
    cosmjsImports.unshift('Coin');
  }

  return w.importStmt(cosmjsImports, '@cosmjs/amino');
};
