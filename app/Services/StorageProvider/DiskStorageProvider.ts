/* eslint-disable prettier/prettier */
import fs from 'fs'

import Application from '@ioc:Adonis/Core/Application'

import upload from 'Config/upload'

import { ISaveFileDTO, IStorageProvider } from 'Contracts/interfaces/IStorageProvider'

/**
 * DiskStorageProvider
 * Responsável por salvar, excluir e obter informações
 * sobre arquivos no sistema de arquivos local (disco)
 */
class DiskStorageProvider implements IStorageProvider {
  private folder: string

  constructor() {
    /**
     * O construtor inicializa a propriedade folder
     * com o caminho para a pasta temporária configurada
     * no arquivo upload.config.disk.folder
     */
    this.folder = Application.tmpPath(upload.config.disk.folder)
  }

  public async saveFile({ fileBuffer, fileName }: ISaveFileDTO): Promise<void> {
    /**
     * Grava o conteúdo do buffer no arquivo especificado na pasta temporária
     */
    await fs.promises.writeFile(`${this.folder}/${fileName}`, fileBuffer)
  }

  public async deleteFile(fileName: string): Promise<void> {
    /**
     * Exclui o arquivo com o nome especificado da pasta temporária
     */
    await fs.promises.unlink(`${this.folder}/${fileName}`)
  }
  public getFileSignature(fileName: string): string {
    /**
     * Retorna a URL completa para o arquivo com o nome especificado.
     * A URL é construída concatenando o URL base configurado (upload.config.disk.url) com o caminho
     * para a pasta temporária e o nome do arquivo
     */
    return `${upload.config.disk.url}/${this.folder}/${fileName}`
  }
}

export default DiskStorageProvider
