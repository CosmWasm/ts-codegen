export interface MinimistArgs {
  _: string[]; // Positional arguments array
  [key: string]: string | string[] | boolean | number | undefined; // Flexible types for all keys
}
