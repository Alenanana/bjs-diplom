`use strict`

const userForm = new UserForm();

userForm.loginFormCallback = data => {
    console.log(data);
    ApiConnector.login (data, response => {
        console.log(response);
        response.success ? location.reload() : userForm.setLoginErrorMessage('Неверный логин или пароль');
    })
}

userForm.registerFormCallback = data =>{
    ApiConnector.register (data, response => {
        response.success ? location.reload() : userForm.setRegisterErrorMessage('Пользователь уже зарегстрирован');
    })
}