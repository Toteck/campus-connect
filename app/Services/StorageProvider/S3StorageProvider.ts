/* eslint-disable prettier/prettier */
/**
 * Importação do `aws-sdk`:
 * Importamos o SDK da AWS e o tipo `s3` para interagir com o serviço S3 da AWS
 *
 */
import aws, { S3 } from 'aws-sdk'
// Importamos as configurações de upload de arquivos
import upload from 'Config/upload'
// Importamos as interfaces necessárias para definir
// os métodos e tipos usados no provedor de armazenamento
import { ISaveFileDTO, IStorageProvider } from 'Contracts/interfaces/IStorageProvider'

class S3StorageProvider implements IStorageProvider {
  // Esse é o client S3 que será usado para interagir com o serviço S3 da AWS
  private client: S3
  // Estabelecemos esse tempo para que depois desse tempo o acesso a URL seja restringido
  private signedUrlExpireSeconds = 15
  // Nome do bucket configurado no serviço da AWS
  private bucket = upload.config.aws.bucket

  constructor() {
    /**
     * Inicializa o cliente S3 com a região configurada na AWS.
     * Isso é necessário para garantir que as operações
     * sejam executadas na região correta
     */
    this.client = new aws.S3({
      region: upload.config.aws.region,
    })
  }

  // saveFile: Salva um arquivo no bucket do S3
  public async saveFile({
    fileBuffer,
    fileName,
    fileType,
    fileSubType,
    isPublic = true,
  }: ISaveFileDTO): Promise<void> {
    /**
     * Define a politica de controle de acesso.
     * Se `isPublic` for verdadeiro, o arquivo será público; caso contrário, será privado.
     */
    const ACL = isPublic ? 'public-read' : 'private'

    // Exemplo de saída: image.png ou documento.pdf
    const ContentType = `${fileType}/${fileSubType}`

    /**
     * upload: Realiza o upload do arquivo para o bucket
     * s3 com várias propriedades, como controle de
     * cache, chave (nome do arquivo), bucket, corpo do arquivo, ACL, tipo de conteúdo e disposição do conteúdo.
     */
    await this.client
      .upload({
        CacheControl: 'public,max-age=290304000',
        Key: fileName,
        Bucket: this.bucket,
        Body: fileBuffer,
        ACL,
        ContentType,
        ContentDisposition: 'inline',
      })
      .promise()
  }
  /**
   * deleteFile: Este método exclui um arquivo do bucket S3
   */
  public async deleteFile(fileName: string): Promise<void> {
    /**
     * deleteObject: Executa a exclusão do objeto especificado pelo nome do arquivo no bucket configurado
     */
    await this.client
      .deleteObject({
        Bucket: this.bucket,
        Key: fileName,
      })
      .promise()
  }

  // getFileSignature: gera uma url assinada para acessar um arquivo
  public getFileSignature(fileName: string): string {
    /**
     * getSignedUrl: Gera uma URL asssinada para o arquivo especificado.
     * A URL será válida por um período definido por signedUrlExpireSeconds
     */
    const url = this.client.getSignedUrl('getObject', {
      Bucket: this.bucket,
      Key: fileName,
      Expires: this.signedUrlExpireSeconds,
    })

    return url
  }
}

export default S3StorageProvider
