export const mongooseOptions = {
    development : {
        minPoolSize: 1,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    },
    production : {
        autoIndex : false,
        minPoolSize: 5,
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    }
};