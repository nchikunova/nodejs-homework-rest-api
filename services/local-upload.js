const jimp = require('jimp')
const path = require('path')
const fs = require('fs/promises')

class UploadAvatarService {
  constructor(folderAvatars) {
    this.folderAvatars = folderAvatars
  }

  async transformAvatar(pathFile) {
    const img = await jimp.read(pathFile)
    await img
      .autocrop()
      .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE)
      .writeAsync(pathFile)
  }

  async saveAvatar({ file }) {
    console.log('🚀 ~ file: local-upload.js ~ line 19 ~ UploadAvatarService ~ saveAvatar ~ file', file)
    await this.transformAvatar(file.path)
    const folderUserAvatar = path.join('public', this.folderAvatars)

    await fs.rename(file.path, path.join(folderUserAvatar, file.filename))
    return path.normalize(path.join(this.folderAvatars, file.filename))
  }
}

module.exports = UploadAvatarService
