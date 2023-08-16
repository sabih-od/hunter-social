import { Injectable } from '@angular/core';
// import {
//   Camera,
//   CameraResultType,
//   CameraSource,
//   GalleryImageOptions,
//   ImageOptions,
// } from '@capacitor/camera';
import {
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureImageOptions,
  CaptureVideoOptions,
} from '@awesome-cordova-plugins/media-capture/ngx';

import { ActionSheetController, Platform } from '@ionic/angular';
import { FileSelect, FileSelectResult } from 'capacitor-file-select';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { File, FileError } from '@ionic-native/file/ngx';
import {
  Camera as CordovaCamera,
  CameraOptions,
} from '@awesome-cordova-plugins/camera/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { DirectoryEntry, FileEntry } from '@ionic-native/file';
import { UtilityService } from './utility.service';
import { Config } from '../config/main.config';
import { AlertsService } from './basic/alerts.service';
import { ModalService } from './basic/modal.service';
//import ‘capacitor-file-selector’ // Comment out this line when building android/iOS app<br/>
declare var window;
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(
    private platform: Platform,
    private chooser: Chooser,
    private mediaCapture: MediaCapture,
    public actionSheetController: ActionSheetController,
    private file: File,
    private cordovaCamera: CordovaCamera,
    public modals: ModalService,
    private sanitizer: DomSanitizer,
    private filePath: FilePath,
    public alerts: AlertsService,
    private utility: UtilityService
  ) {}
  safeUrl: SafeUrl;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50,
  };

  uploadFile() {}

  openCapCamera() {
    // return new Promise((res) => {
    //   this.cordovaCamera
    //     .getPicture({
    //       quality: 90,
    //       destinationType: 0,
    //     })
    //     .then(async (imageData) => {
    //       console.log('Took a picture!', imageData);
    //       if (this.isPngOrJpg(imageData)) {
    //         let base64 = 'data:image/png;base64,' + imageData;
    //         let blob = await this.base64ToBlob(base64);
    //         res({ base64, blob });
    //       } else {
    //         this.utility.presentFailureToast(
    //           'Invalid format. Only PNG and JPG are supported'
    //         );
    //         res(null);
    //       }
    //     })
    //     .catch((e) => {
    //       console.log('Error occurred while taking a picture', e);
    //     });
    // });

    return new Promise(async (resolve) => {
      const options: CameraOptions = {
        quality: 100,
        targetWidth: 512,
        targetHeight: 512,
        saveToPhotoAlbum: false,
        destinationType: this.cordovaCamera.DestinationType.DATA_URL,
        encodingType: this.cordovaCamera.EncodingType.JPEG,
        mediaType: this.cordovaCamera.MediaType.PICTURE,
        sourceType: 1,
      };

      resolve(await this.showCamera(options));
    });
  }

  openCamera() {
    return new Promise(async (resolve) => {
      const radioOptions = [
        {
          type: 'radio',
          label: 'Camera',
          value: '1',
          checked: false,
        },
        {
          type: 'radio',
          label: 'Gallery',
          value: '0',
          checked: false,
        },
      ];

      const option = await this.alerts.presentRadioSelections(
        'Select From',
        '',
        radioOptions
      );

      if (option == null) {
        resolve(null);
        return;
      }

      const options: CameraOptions = {
        quality: 100,
        targetWidth: 512,
        targetHeight: 512,
        saveToPhotoAlbum: false,
        destinationType: this.cordovaCamera.DestinationType.DATA_URL,
        encodingType: this.cordovaCamera.EncodingType.JPEG,
        mediaType: this.cordovaCamera.MediaType.PICTURE,
        sourceType: parseInt(option, 10),
      };

      resolve(await this.showCamera(options));
    });

    // return new Promise<any>((res) => {
    //   const cameraOptions: ImageOptions = {
    //     width: 200,
    //     resultType: CameraResultType.Base64,
    //     source: CameraSource.Photos,
    //   };
    //   Camera.getPhoto(cameraOptions).then(
    //     async (imageData) => {
    //       // console.log('imageData', imageData.base64String);
    //       if (this.isPngOrJpg(imageData.base64String)) {
    //         let base64 = 'data:image/png;base64,' + imageData.base64String;
    //         let blob = await this.base64ToBlob(base64);
    //         res({ base64, blob });
    //       } else {
    //         this.utility.presentFailureToast(
    //           'Invalid format. Only PNG and JPG are supported'
    //         );
    //         res(null);
    //       }
    //     },
    //     (err) => {
    //       res(null);
    //     }
    //   );
    // });
  }

  async showCamera(options) {
    return new Promise((res) => {
      this.cordovaCamera.getPicture(options).then((imageData) => {
        // if (imageData) {
        // this.cropWithController('data:image/jpeg;base64,' + imageData, type)
        //   .then(image =>
        res('data:image/jpeg;base64,' + imageData);
        // err => console.error(err))
        // }
        // });
      });
    });
  }

  isPngOrJpg(base64) {
    return (
      base64.startsWith('/') || // jpg
      base64.startsWith('i') // png
    );
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.cordovaCamera.DestinationType.FILE_URI,
      encodingType: this.cordovaCamera.EncodingType.JPEG,
      mediaType: this.cordovaCamera.MediaType.ALLMEDIA,
    };
    this.cordovaCamera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        console.log(imageData);

        // this.croppedImagePath = 'data:image/jpeg;base64,' + imageData;
      },
      (err) => {
        // Handle error
      }
    );
  }

  getBase64StringByFilePath(fileURL): Promise<string> {
    return new Promise((resolve, reject) => {
      let fileName = fileURL.substring(fileURL.lastIndexOf('/') + 1);
      let filePath = fileURL.substring(0, fileURL.lastIndexOf('/') + 1);
      this.file
        .readAsDataURL(filePath, fileName)
        .then((file64) => {
          console.log(file64); //base64url...
          resolve(file64);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  pickVideo() {
    return new Promise((resolve) => {
      const options: CameraOptions = {
        // quality: 100,
        sourceType: this.cordovaCamera.PictureSourceType.SAVEDPHOTOALBUM,
        destinationType: this.cordovaCamera.DestinationType.DATA_URL,
        // encodingType: this.cordovaCamera.MediaType.VIDEO,
        mediaType: this.cordovaCamera.MediaType.VIDEO,
      };
      this.cordovaCamera.getPicture(options).then(
        async (imageData) => {
          // imageData is either a base64 encoded string or a file URI
          console.log(imageData);

          if (imageData.includes('file')) {
            var split = imageData.replace(/^.*[\\\/]/, '');
            console.log(split);
            var path = imageData.replace(split, '').slice(0, -1);
            console.log(path);

            window.requestFileSystem(
              this.file.externalApplicationStorageDirectory,
              0,
              function (fs) {
                console.log('file system open: ' + fs.name);
                fs.root.getFile(
                  'bot.png',
                  { create: true, exclusive: false },
                  function (fileEntry) {
                    fileEntry.file(
                      function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function () {
                          // Create a blob based on the FileReader "result", which we asked to be retrieved as an ArrayBuffer
                          var blob = new Blob([this.result], {
                            type: 'image/png',
                          });
                          var oReq = new XMLHttpRequest();
                          oReq.open(
                            'POST',
                            Config.URL + 'public/api/how-to-videos',
                            true
                          );
                          oReq.onload = function (oEvent) {
                            // all done!
                          };
                          // Pass the blob in to XHR's send method
                          oReq.send(blob);
                        };
                        // Read the file as an ArrayBuffer
                        reader.readAsArrayBuffer(file);
                      },
                      function (err) {
                        console.error('error getting fileentry file!' + err);
                      }
                    );
                  },
                  function (err) {
                    console.error('error getting file! ' + err);
                  }
                );
              },
              function (err) {
                console.error('error getting persistent fs! ' + err);
              }
            );

            // const res = await this.getBase64StringByFilePath(imageData);
            // console.log(res);

            // var reader = new FileReader();
            // reader.onloadend = function (e) {
            //   console.log(this.result);
            // };

            // reader.readAsDataURL(path, split);

            // this.file
            //   .readAsArrayBuffer(path, split)
            //   .then(
            //     (result) => {
            //       console.log(result);
            //       let blob = new Blob([result], { type: 'video/mp4' });
            //       //then upload the blob to firebase storage
            //       // this.uploadToFirebase(blob);
            //     },
            //     (err) => {
            //       console.log(err);
            //     }
            //   )
            //   .catch((err) => {
            //     console.log(err);
            //   });

            // console.log(d);

            // resolve(d);
          } else {
            resolve(imageData);
          }

          // this.croppedImagePath = 'data:image/jpeg;base64,' + imageData;
        },
        (err) => {
          // Handle error
          console.error(err);
          resolve(null);
        }
      );
    });
  }

  //open galary picture
  // openGalary() {
  //   return new Promise<string>((res) => {
  //     const cameraOptions: ImageOptions = {
  //       height: 150,
  //       width: 150,
  //       allowEditing: true,
  //       quality: 50,
  //       resultType: CameraResultType.Uri,
  //       source: CameraSource.Photos,
  //     };
  //     Camera.getPhoto(cameraOptions).then(
  //       (imageData) => {
  //         console.log('imageData', imageData);
  //         res(imageData.base64String);
  //       },
  //       (err) => {
  //         res(null);
  //       }
  //     );
  //   });
  // }

  b64toBlob(b64Data, contentType = 'image/jpeg', sliceSize = 512) {
    return new Promise<Blob>(async (resolve) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      resolve(blob);
    });
  }

  pickFiles() {
    return new Promise<any>(async (res) => {
      let fileSelectOptions = {};

      //if (!this.platform.is('desktop')) {
      this.chooser
        .getFile()
        .then(async (file) => {
          console.log(file ? file.name : 'canceled');
          // let file = v[0];
          let blob = await this.base64ToBlob(file.dataURI);
          res({ base64: file.dataURI, blob });
          //  res(file);
        })
        .catch((error: any) => console.error(error));
      return;
      //} else {
      FileSelect.select({
        multiple: false,
        extensions: [],
      })
        .then(async (v) => {
          console.log('FILES', v);
          let file = v[0];
          let blob = await this.base64ToBlob(file.dataURI);
          res({ base64: file.dataURI, blob });
          //} else res(file);
        })
        .catch((e) => {
          console.log(e);
          res(null);
        });
      // }

      // console.log();
      // console.log('pickFiles', files);

      //   let multiple_selection = false;
      //   //let ext = [".jpg",".png",".pdf",".jpeg"] // list of extensions
      //   //let ext = ['MP3', 'ImaGes']; // combination of extensions or category
      //   let ext = ['videos', 'images']; // list of all category
      //   //let ext = ["*"] // Allow any file type
      //   ext = ext.map((v) => v.toLowerCase());
      //   let formData = new FormData();
      //   let selectedFile = await FileSelector.fileSelector({
      //     multiple_selection: multiple_selection,
      //     ext: ext,
      //   });
      //   if (!selectedFile) return;
      //   if (this.platform.is('android')) {
      //     let paths = JSON.parse(selectedFile.paths);
      //     let original_names = JSON.parse(selectedFile.original_names);
      //     let extensions = JSON.parse(selectedFile.extensions);
      //     for (let index = 0; index < paths.length; index++) {
      //       const file = await fetch(paths[index]).then((r) => r.blob());
      //       formData.append(
      //         'myfile[]',
      //         file,
      //         original_names[index] + extensions[index]
      //       );
      //     }
      //   } else if (this.platform.is('ios')) {
      //     for (let index = 0; index < selectedFile.paths.length; index++) {
      //       const file = await fetch(selectedFile.paths[index]).then((r) =>
      //         r.blob()
      //       );
      //       formData.append(
      //         'myfile[]',
      //         file,
      //         selectedFile.original_names[index] + selectedFile.extensions[index]
      //       );
      //     }
      //   } else {
      //     FileSelector.addListener('onFilesSelected', (data: FileList) => {
      //       let file = data.item(0);
      //       res(file);
      //       // for (var i = 0; i < data.length; i++) {
      //       //   console.log(data.item(i));
      //       //   formData.append(
      //       //     'myfile[]',
      //       //     data.item(i),
      //       //     data.item(i).name + data.item(i).type
      //       //   );
      //       // }
      //     });
      //   }
    });
  }

  pickMediaFiles(isVideoOnly = false) {
    return new Promise<any>((resolve) => {
      const options: CameraOptions = {
        quality: 100,
        sourceType: this.cordovaCamera.PictureSourceType.SAVEDPHOTOALBUM,
        destinationType: this.cordovaCamera.DestinationType.FILE_URI,
        encodingType: this.cordovaCamera.EncodingType.JPEG,
        mediaType: isVideoOnly
          ? this.cordovaCamera.MediaType.VIDEO
          : this.cordovaCamera.MediaType.ALLMEDIA,
      };
      this.cordovaCamera.getPicture(options).then(
        async (imageData) => {
          // imageData is either a base64 encoded string or a file URI
          console.log('image data', imageData);
          let path = imageData.includes('content://')
            ? await this.getNativePath(imageData)
            : imageData.includes('file://')
            ? `${imageData}`
            : `file://${imageData}`;

          // let res = await this.makeFileIntoBlob(path);

          // let res = Capacitor.convertFileSrc(path);
          // console.log('CapacitorPath', res);
          // const fileNameIndex: number = path.lastIndexOf('/');
          let data = await this.readFilePath(path);
          let isVideo = this.isVideo(path);
          //console.log('ReadFilePath', data);
          let type = isVideo ? 'video/mp4' : 'image/png';
          let base64 = `data:${type};base64,${data}`;
          let blob = await this.base64ToBlob(base64);

          resolve({ path, base64, blob, isVideo });
          // resolve({ path, isVideo });

          // file:///storage/emulated/0/Android/data/com.myDomain.myApp/cache/

          //  FB_IMG_1532921240445.jpg?1532982282636
          // const filePath = imageData.substring(0, fileNameIndex + 1);
          // let fileName = imageData.split('/')[imageData.split('/').length - 1];
          // console.log('FilePath', filePath, 'fileName', fileName);

          // let b64 = await this.resolveBase64(`${filePath}`, fileName);
          // console.log('b64', b64);

          return;

          this.getNativePath(imageData);
          let url = await this.readFilePath(path);

          // var croppedImagePath = url; //''; data:image/png;base64,
          // fetch(croppedImagePath)
          //   .then((res) => res.blob())
          //   .then((res) => {
          //     console.log('Successfully made blob', res);
          //     resolve(res);
          //   })
          //   .catch((err) => {
          //     console.log('Unsucess', err);
          //     resolve(null);
          //   });

          // const type = imageData.split(';')[0].split('/')[1];

          // this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(
          //   Capacitor.convertFileSrc(imageData)
          //);
          // this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(
          //   imageData
          //   // Capacitor.convertFileSrc(imageData)
          // );
          // URL.revokeObjectURL(imageData);
          //console.log('SAFE_URL', this.safeUrl);

          // var filename = imageData.substring(imageData.lastIndexOf('/') + 1);
          // var path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
          //then use it in the readAsDataURL method of cordova file plugin
          //this.file is declared in constructor file :File
          // this.file.readAsDataURL(path, filename).then((res) => {
          //   console.log('readAsDataURL', res);
          //   // resolve(res);
          // });

          // if (imageData.includes('file')) {
          //   croppedImagePath = imageData;
          // } else {
          //   croppedImagePath = 'data:image/jpeg;base64,' + imageData;
          // }

          // let type = this.isImage(croppedImagePath)
          //   ? `image/${this.getExtension(croppedImagePath)}`
          //   : `video/${this.getExtension(croppedImagePath)}`;

          // console.log('TYPE', 'type');
          // let blob = await this.b64toBlob(croppedImagePath);

          // resolve(blob);

          // resolve(croppedImagePath);
        },
        (err) => {
          // Handle error
        }
      );
    });
  }

  base64ToBlob(base64) {
    return new Promise((resolve) => {
      fetch(base64)
        .then((res) => res.blob())
        .then((res) => {
          console.log('Successfully made blob', res);
          resolve(res);
        })
        .catch((err) => {
          console.log('Unsucess', err);
          resolve(null);
        });
    });
  }

  getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  isImage(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
        //etc
        return true;
    }
    return false;
  }

  isVideo(filename) {
    if (!filename) return false;

    if (filename.toString().toLowerCase().includes('video')) return true;
    if (!filename.toString().includes('.')) return false;
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
      case 'webm':
      case 'mov':
        // etc
        return true;
    }
    return false;
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.pickImage(this.cordovaCamera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(this.cordovaCamera.PictureSourceType.CAMERA);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise<any>((resolve, reject) => {
      let fileName = '';
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then((fileEntry) => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
          console.log('path', path);
          console.log('fileName', name);

          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then((buffer) => {
          console.log('Reading Buffer');

          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: `video/${
              _imagePath.split('/')[_imagePath.split('/').length - 1]
            }`,
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob,
          });
        })
        .catch((e) => {
          console.log('makeFileIntoBlob Error:', e);
          reject(e);
        });
    });
  }

  pickImages() {
    return new Promise<any>((resolve) => {
      // const imageOptions: ImageOptions = {
      //   quality: 90,
      //   allowEditing: false,
      //   resultType: CameraResultType.DataUrl,
      //   source: CameraSource.Photos,
      // };
      // Camera.getPhoto(imageOptions).then(
      //   async (imageData) => {
      //     let data = [];
      //     let x = imageData;
      //     // imageData.photos.forEach(async (x) => {
      //     let blob = await fetch(x.webPath).then((res) => res.blob());
      //     data.push({ blob, path: x.webPath });
      //     // .catch((error) => {
      //     //   console.log('Fetch error', error);
      //     // });
      //     //});
      //     resolve(data);
      //     // let res = await this.makeFileIntoBlob(imageData.photos[0].path);
      //     // console.log('makeFileIntoBlob', res);
      //   },
      //   (err) => {
      //     resolve(null);
      //   }
      // );
    });
  }

  readFilePath = async (path) => {
    return new Promise(async (resolve) => {
      const contents = await Filesystem.readFile({
        path: path,
      });

      console.log('data:', contents?.data);
      resolve(contents.data);
      //return contents.data;
    });
    // Here's an example of reading a file with a full file path. Use this to
    // read binary data (base64 encoded) from plugins that return File URIs, such as
    // the Camera.
  };

  getNativePath(path) {
    return new Promise<string>((resolve) => {
      this.filePath
        .resolveNativePath(path)
        .then((filePath) => {
          console.log('getNativePath s', filePath);
          resolve(filePath);
        })
        .catch((err) => {
          console.log('getNativePath e', err);
          resolve(null);
        });
    });
  }

  resolveBase64(path, file) {
    return new Promise<string>(async (resolve) => {
      this.file
        .readAsDataURL(path, file)
        .then((res) => {
          console.log('resolveBase64', res);
          resolve(res);
        })
        .catch((err) => {
          console.log('resolveBase64', err);
          resolve(null);
        });
    });
  }

  getImageUrl(url) {
    return `${Config.URL}storage/uploads/${url}`;
  }

  getDefaultImg() {
    return Config.URL + '/public/assets/images/ph-avatar.png';
  }



  /* ----------------------------------------------------------- */

  
  
  
}
