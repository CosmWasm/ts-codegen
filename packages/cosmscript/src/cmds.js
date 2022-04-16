
import _generate_jsonschema from './commands/generate-jsonschema';
import _generate_typescript from './commands/generate-typescript';
import _generate from './commands/generate';
const Commands = {};
Commands['generate-jsonschema'] = _generate_jsonschema;
Commands['generate-typescript'] = _generate_typescript;
Commands['generate'] = _generate;

  export { Commands }; 

  