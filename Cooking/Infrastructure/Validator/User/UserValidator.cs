﻿namespace Cooking.Infrastructure.Validator.User
{
    public class UserValidator
    {
        private readonly PasswordValidator passwordValidator;
        private readonly EmailValidator emailValidator;
        private readonly PhoneValidator phoneValidator;

        public UserValidator()
        {
            this.passwordValidator = new PasswordValidator();
            this.emailValidator = new EmailValidator();
            this.phoneValidator = new PhoneValidator();
        }
        public UserValidatorModel Validate(UserValidatorModel user)
        {
            if (string.IsNullOrEmpty(user.Login) || user.Login.Length < 5 || user.Login.Length > 50 || user.Login.Any(x => !char.IsLetterOrDigit(x)))
            {
                throw new ArgumentException("Логин должен быть длиной от 5 до 50 символов и состоять из букв или цифр");
            }

            if (!passwordValidator.TryParse(user.Password, out var password))
            {
                throw new ArgumentException("Неправильный формат пароля");
            }

            if (!emailValidator.TryParse(user.Email, out var email))
            {
                throw new ArgumentException("Неправильный формат почты");
            }

            if (!phoneValidator.TryParse(user.Phone, out var phone))
            {
                throw new ArgumentException("Неправильный формат телефона");
            }

            return new UserValidatorModel()
            {
                Email = email,
                Login = user.Login,
                Password = password,
                Phone = phone,
            };
        }
    }
}
