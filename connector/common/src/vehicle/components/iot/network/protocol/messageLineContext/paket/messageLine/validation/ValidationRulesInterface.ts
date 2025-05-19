export interface ValidationRulesInterface {
  getProperty(propertyName: string): RegExp | undefined;
}