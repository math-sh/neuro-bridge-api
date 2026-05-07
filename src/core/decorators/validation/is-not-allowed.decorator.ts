import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsNotAllowed(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isNotAllowed',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === undefined; // Field should not be defined
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is not allowed.`;
        },
      },
    });
  };
}
