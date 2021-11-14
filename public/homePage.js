'use strict';
const userLogout = new LogoutButton();

userLogout.action = () =>
    ApiConnector.logout( response => {
        if (response.success) {
            location.reload();
        }
    });

ApiConnector.current( response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const board = new RatesBoard();

function getRates() {
    ApiConnector.getRates(response => {
        if (response.success) {
            board.clearTable();
            board.fillTable(response.data);
        }
    })
}
getRates();
const intervalStocks = setInterval (getRates, 60000);

let money = new MoneyManager();

money.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) =>{
        console.log(data, response)
        if(response.success) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success, `Успешное пополнение баланса на сумму ${data.amount} ${data.currency}`)
        }
        else {
            money.setMessage(response.success, response.error);
        }
    })
}

money.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response)=>{
        if(response.success){
            ProfileWidget.showProfile(response, data);
            money.setMessage(response.success, `${data.fromAmount} ${data.fromCurrency} успешно конвертировано ${data.targetCurrency}`);
        }
        else {
            money.setMessage(response.success, response.error);
        }
    })
};

money.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        console.log(data, response);
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(response.success,`${data.amount} ${data.currency} переведено ${data.to}`);
        }
        else {
            money.setMessage(response.success, response.error);
        }
    })
}

let favorites = new FavoritesWidget();

ApiConnector.getFavorites((response) =>{
    if(response.success){
        favorites.clearTable();
        favorites.fillTable(response.data);
        money.updateUsersList(response.data);
    }
})

favorites.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data,(response) =>{
        if(response.success) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            money.updateUsersList(response.data);
            favorites.setMessage(response.success, `Пользователь ${data.name} успешно добавлен`);
        }
        else {
            favorites.setMessage(response.success, response.error);
        }
    })
}
favorites.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response)=>{
        if(response.success) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            money.updateUsersList(response.data);
            favorites.setMessage(response.success, `Пользователь успешно удален`)
        }
        else{
            favorites.setMessage(response.success,response.error);
        }
    })
}