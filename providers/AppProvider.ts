import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import DiskStorageProvider from 'App/Services/StorageProvider/DiskStorageProvider'
import S3StorageProvider from 'App/Services/StorageProvider/S3StorageProvider'
import upload from 'Config/upload'
export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
    const storageProvider =
      upload.driver === 'disk' ? new DiskStorageProvider() : new S3StorageProvider()

    this.app.container.singleton('CampusConnect/StorageProvider', () => {
      return storageProvider
    })
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
