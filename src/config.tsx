export const Config = {

    account: {
        login: process.env.REACT_APP_API_LOGIN,
        newPassword: process.env.REACT_APP_API_NEW_PASSWORD,
        forgotPassword: process.env.REACT_APP_API_FORGOT_PASSWORD,
    },

    database: {
        read: process.env.REACT_APP_API_READ,
        create: process.env.REACT_APP_API_CREATE,
        delete: process.env.REACT_APP_API_DELETE,
        update: process.env.REACT_APP_API_UPDATE,
        searchNamePhoneAddress: process.env.REACT_APP_API_SEARCH_NAME_PHONE_ADDRESS,
        currentMonth: process.env.REACT_APP_API_CURRENT_MONTH,
        currentPeriod: process.env.REACT_APP_API_CURRENT_PERIOD,
    },

}