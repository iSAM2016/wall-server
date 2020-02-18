import { DotenvConfigOptions } from 'dotenv';
export interface EnvConfig {
    [key: string]: any;
}
export interface ConfigOptions extends Partial<DotenvConfigOptions> {
}
