/**
 * Creates a standard Mongoose schema configuration for string Enums.
 * 
 * @param enumObj The TypeScript Enum object
 * @param defaultValue The default value from the Enum (optional)
 * @returns Mongoose schema field configuration
 */
export const createMongooseEnum = <T extends object>(
  enumObj: T, 
  defaultValue?: T[keyof T]
) => {
  const config: { type: StringConstructor; enum: string[]; default?: any } = {
    type: String,
    enum: Object.values(enumObj) as string[],
  };

  if (defaultValue !== undefined) {
    config.default = defaultValue;
  }

  return config;
};