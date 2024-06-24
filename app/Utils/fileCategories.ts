/* eslint-disable prettier/prettier */
const fileCategories = ['thumbnail', 'anexo'] as const

// eslint-disable-next-line prettier/prettier
type FileCategory = (typeof fileCategories)[number]

export { fileCategories, FileCategory }
