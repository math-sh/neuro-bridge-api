import { registerDecorator, ValidationOptions } from 'class-validator';

const isValidCPF = (cpf: string): boolean => {
  // Remove non-numeric characters
  cpf = cpf.replace(/\D/g, '');

  // CPF must be 11 digits long
  if (cpf.length !== 11) return false;

  // All digits must not be the same (e.g., 000.000.000-00 is invalid)
  if (/^(\d)\1*$/.test(cpf)) return false;

  // Calculate check digits
  const calculateCheckDigit = (digits: string, length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += parseInt(digits.charAt(i)) * (length + 1 - i);
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const digit1 = calculateCheckDigit(cpf, 9);
  const digit2 = calculateCheckDigit(cpf, 10);

  // Check if the calculated check digits match the input check digits
  return (
    digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10))
  );
};

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && isValidCPF(value);
        },
        defaultMessage(): string {
          return 'valor deve ser um CPF valido';
        },
      },
    });
  };
}
