
import _create_boilerplate from './commands/create-boilerplate';
import _generate from './commands/generate';
import _install from './commands/install';
const Commands: any = {};
Commands['create-boilerplate'] = _create_boilerplate;
Commands['generate'] = _generate;
Commands['install'] = _install;

export { Commands };

  
