import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

export const hashToken = async (token) => {
  return bcrypt.hash(token, 12)
}

export const compareToken = async (token, hashedToken) => {
  return bcrypt.compare(token, hashedToken)
}
