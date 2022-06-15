import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from './signup-protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

      const accountAdded = await this.addAccount.add({ name, email, password });

      return ok(accountAdded);
    } catch (error) {
      return serverError();
    }
  }
}
