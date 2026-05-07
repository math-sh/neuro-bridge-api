import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPoint(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isPoint',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const keys = ['lat', 'lng'];
          return (
            typeof value === 'object' &&
            Object.keys(value).every((a, i) => a === keys[i])
          );
        },
        defaultMessage(): string {
          return 'valor deve ser um Point valido';
        },
      },
    });
  };
}
