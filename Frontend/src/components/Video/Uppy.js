import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'

const uppy = new Uppy()
  .use(XHRUpload, {
    endpoint: 'http://localhost:3000/api/v1/upload/s3',
    fieldName: 'file'
  })