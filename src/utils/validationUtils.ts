export const isValidEmail = (email: string, message?: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) && message) {
    return message;
  } else {
    return undefined;
  }
};

export const isValidPassword = (password: string, message?: string) => {
  //Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!regex.test(password) && message) {
    return message;
  } else {
    return undefined;
  }
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[0-9]{8,15}$/;
  return phoneRegex.test(phone);
};

export const isEmpty = (value: string, message?: string) => {
  if (value.trim().length == 0 && message) {
    return message;
  } else {
    return undefined;
  }
};
