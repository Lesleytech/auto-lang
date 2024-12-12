export interface IInputParams {
  from: string;
  to: string[];
  dir: string;
  genType: string;
  skipExisting: boolean;
  diff: [string, string];
}

export type TranslationObject = Record<string, any>;
