
import _generate from './commands/generate';
import _message_composer from './commands/message-composer';
import _react_query from './commands/react-query';
import _recoil from './commands/recoil';
import _types from './commands/types';
const Commands = {};
Commands['generate'] = _generate;
Commands['message-composer'] = _message_composer;
Commands['react-query'] = _react_query;
Commands['recoil'] = _recoil;
Commands['types'] = _types;

  export { Commands }; 

  