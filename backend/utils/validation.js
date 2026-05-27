const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword
};