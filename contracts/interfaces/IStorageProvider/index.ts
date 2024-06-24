/* eslint-disable prettier/prettier */
/**
 * Definição da interface do IStorageProvider que
 * descreve os métodos esperados para salvar, excluir e obter a assinatura de um arquivo
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IStorageProvider {
  saveFile(file: ISaveFileDTO): Promise<void>
  deleteFile(fileName: string): Promise<void>
  getFileSignature(fileName: string): string
}

export type ISaveFileDTO = {
  fileBuffer: Buffer
  fileName: string
  fileType?: string
  fileSubType?: string
  isPublic?: boolean
}
