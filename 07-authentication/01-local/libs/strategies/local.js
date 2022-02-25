const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      try {
        const user = await User.findOne({email: email});
        if (!user) {
          return done(null, false, 'Нет такого пользователя');
        }
        const isPasswordOk = await user.checkPassword(password);

        if (!isPasswordOk) {
          return done(null, false, 'Неверный пароль');
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
      // done(null, false, 'Стратегия подключена, но еще не настроена');
    },
);
