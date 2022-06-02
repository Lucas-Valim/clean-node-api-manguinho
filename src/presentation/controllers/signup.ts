import { badRequest, serverError } from '../helpers/http-helper';
import { InvalidParamError, MissingParamError } from '../errors';
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols';
import { AddAccount } from '../../domain/usecases/add-account';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const { name, password, passwordConfirmation, email } = httpRequest.body;
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field));
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) return badRequest(new InvalidParamError('email'));

      this.addAccount.add({ name, email, password });
    } catch (error) {
      return serverError();
    }
  }
}
