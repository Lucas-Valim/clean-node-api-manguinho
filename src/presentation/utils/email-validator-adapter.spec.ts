import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email@mail.com');
    expect(isValid).toBe(false);
  });

  it('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('valid_email@mail.com');
    expect(isValid).toBe(true);
  });

  it('Should call validator with correct email', () => {
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    const sut = new EmailValidatorAdapter();
    sut.isValid('validEmail@mail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('validEmail@mail.com');
  });
});
