import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import XHRUpload from '@uppy/xhr-upload'
import { BACKEND_URL } from '../../utils/constants'

const uppy = new Uppy()
  .use(XHRUpload, {
    endpoint: BACKEND_URL+'/upload/s3',
    fieldName: 'file'
  })