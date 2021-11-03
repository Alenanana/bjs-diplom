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

setInterval(ApiConnector.getStocks(response => {
    if(response.success) {
        board.clearTable();
        board.fillTable(response.data);
    }
}), 60000);

const manager = new MoneyManager();

manager.addMoneyCallback = (currencyObj) => {
    ApiConnector.addMoney(currencyObj, response => {
        const message = !response.success ? response.data :
            `Успешное пополнение баланса на сумму ${currencyObj.amount} ${currencyObj.currency}.`;

        manager.setMessage(!response.success, message);
        if(response.success) {
            ProfileWidget.showProfile(response.data);
        }
    });
};

manager.conversionMoneyCallback = (convertObj) => {
    ApiConnector.convertMoney(convertObj, response => {
        const message = !response.success ? response.data :
            `Успешно конвертировано ${convertObj.fromAmount} ${convertObj.fromCurrency} в ${convertObj.targetCurrency}`;

        manager.setMessage(!response.success, message);
        if(response.success) {
            ProfileWidget.showProfile(response.data);
        }
    });
};

manager.sendMoneyCallback = (transfObj) => {
    ApiConnector.transferMoney(transfObj, response => {
        const message = !response.success ? response.data :
            `Перевод выполнен ${transfObj.amount} ${transfObj.currency}.`;

        manager.setMessage(!response.success, message);

        if(response.success) {
            ProfileWidget.showProfile(response.data);
        }
    });
};

const favorite = new FavoritesWidget();

ApiConnector.getFavorites( (response) => {
    if(response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        manager.updateUsersList(response.data);
    }
})

favorite.addUserCallback = (data) => {
    const addUser = favorite.getData();
    ApiConnector.addUserToFavorites(data, response => {
        if(response.success) {
            favorite.clearTable();
            favorite.fillTable(response.data);
            manager.updateUsersList(response.data);
        }
        const message = !response.success ? response.data :
            `Пользователь ${addUser.name} (ID:${addUser.id}) успешно добавлен`;

        favorite.setMessage(!response.success, message);
    });
};

favorite.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, response => {

        if(response.success) {
            favorite.clearTable();
            favorite.fillTable(response.data);
            manager.updateUsersList(response.data);
        }

        const message = 'Пользователь успешно удален';
        favorite.setMessage(!response.success, message);
    });
};