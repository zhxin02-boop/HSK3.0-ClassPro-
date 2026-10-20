const auth = require('../server-auth');

const password = process.env.CLASSPRO_PASSWORD;
if (!password) {
  console.error('Set CLASSPRO_PASSWORD before running this command.');
  process.exit(1);
}
console.log(auth.hashPassword(password));
