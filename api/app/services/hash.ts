import * as bcrypt from 'bcrypt'

const hashText = async (text: string) => {
  const salt = await bcrypt.genSalt()
  return bcrypt.hash(text, salt)
}

const validHash = async (data: string, hashedText: string) => {
  return bcrypt.compare(data, hashedText)
}

export { hashText, validHash }
