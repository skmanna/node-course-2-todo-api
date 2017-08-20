const env = process.env.NODE_ENV || 'development';

if(env === 'development') {
    process.env.port = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost/TodoApp'
} else if (env === 'test') {
    process.env.port = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost/TodoAppTest';
}
