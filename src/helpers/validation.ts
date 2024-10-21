import { UUID_V4_RE } from '../const/regexp'

export const isValidAge = (age: unknown): boolean => {
  return typeof age === 'number' && age > 0
}

export const isValidHobbies = (hobbies: unknown): boolean => {
  return (
    Array.isArray(hobbies) &&
    (hobbies.length === 0 ||
      hobbies.every((hobby) => typeof hobby === 'string'))
  )
}

export const isValidId = (id: unknown): boolean => {
  return typeof id === 'string' && (id.match(UUID_V4_RE)?.length ?? 0) > 0
}

export const isValidUsername = (username: unknown): boolean => {
  return typeof username === 'string' && username.trim().length > 0
}
