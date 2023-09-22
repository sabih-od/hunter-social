import { Component, Input, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { UtilityService } from 'src/app/services/utility.service';
// import { PhotoLibrary, LibraryItem } from '@ionic-native/photo-library/ngx';

declare var cordova: any;
declare var window: any;
@Component({
  selector: 'left-row',
  templateUrl: './left-row.component.html',
  styleUrls: ['./left-row.component.scss'],
})
export class LeftRowComponent implements OnInit {
  @Input() item;
  constructor(
    public utility: UtilityService,
    // private photoLibrary: PhotoLibrary
  ) { }

  showdownloadicon = true;
  ngOnInit() {
    this.showdownloadicon = Capacitor.getPlatform() == 'ios' ? false : true;
  }


  // imageSrc
  // imageLoaded = false;
  // createImageFromBlob(imageBlob: Blob) {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => {
  //     this.imageSrc = reader.result;
  //     console.log('this.imageSrc => ', this.imageSrc)
  //   }, false);

  //   reader.readAsDataURL(imageBlob);
  // }

  // async downloadImage(url: string): Promise<Blob> {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error('Image download failed.');
  //   }
  //   return response.blob();
  // }

  // downloadImage(imageUrl: string, targetPath: string): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open('GET', imageUrl, true);
  //     xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  //     xhr.responseType = 'blob';

  //     xhr.onload = () => {
  //       if (xhr.status === 200) {
  //         const blob = xhr.response;
  //         console.log('targetPath1 => ', targetPath)
  //         this.saveBlobToFile(blob, targetPath)
  //           .then(() => resolve())
  //           .catch(error => reject(error));
  //       } else {
  //         reject(new Error('Image download failed. Status: ' + xhr.status));
  //       }
  //     };

  //     xhr.onerror = () => {
  //       reject(new Error('Network error occurred during image download.'));
  //     };

  //     xhr.send();
  //   });
  // }

  // private saveBlobToFile(blob: Blob, targetPath: string): Promise<void> {
  //   console.log('targetPath2 => ', targetPath)
  //   return new Promise<void>((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       console.log('targetPath => ', targetPath)
  //       this.writeFile(targetPath, reader.result)
  //         .then(() => resolve())
  //         .catch(error => reject(error));
  //     };
  //     reader.onerror = error => {
  //       console.log('onerror => ', error)
  //       reject(error);
  //     };
  //     reader.readAsArrayBuffer(blob);
  //   });
  // }

  // private writeFile(filePath: string, data: any): Promise<void> {
  //   console.log('filePath => ', filePath)
  //   return new Promise<void>((resolve, reject) => {
  //     window.resolveLocalFileSystemURL(
  //       filePath,
  //       fileEntry => {
  //         fileEntry.createWriter(
  //           fileWriter => {
  //             fileWriter.onwriteend = () => {
  //               resolve();
  //             };
  //             fileWriter.filePath = error => {
  //               reject(error);
  //             };
  //             const blob = new Blob([data], { type: 'image/jpeg' });
  //             fileWriter.write(blob);
  //           },
  //           error => {
  //             reject(error);
  //           }
  //         );
  //       },
  //       error => {
  //         reject(error);
  //       }
  //     );
  //   });
  // }
  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
    return zoneOriginalInstance || fileReader;
  }

  async base64FromPath(path: string): Promise<string> {
    try {
      const response = await fetch(path);
      console.log('response => ', response);
      const blob = await response.blob();
      console.log('Blob size:', blob.size);
      return new Promise<string>((resolve, reject) => {
        // const reader = new FileReader();
        let reader = this.getFileReader();
        console.log('reader:', reader);

        // const zoneOriginalInstance = (reader as any)["__zone_symbol__originalInstance"];
        // if (zoneOriginalInstance) {
        //   console.log('zoneOriginalInstance:', zoneOriginalInstance);
        // }

        reader.onerror = reject;
        reader.onload = () => {
          console.log('onload callback executed');
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject('Method did not return a string');
          }
        };
        console.log('Blob size inner:', blob.size);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Errorb:', error);
      throw error;
    }
  }

  async downloadimage(url) {

    // this.photoLibrary.requestAuthorization().then((res) => {
    //   console.log('photoLibrary => ', res)
    //   // this.photoLibrary.savePhoto(imageData, 'My Image').then((libraryItem: LibraryItem) => {
    //   //   console.log('Image saved to library:', libraryItem);
    //   // }).catch((err) => {
    //   //   console.error('Error saving image:', err);
    //   // });
    // }).catch((err) => {
    //   console.error('Permission denied:', err);
    // });

    try {
      // url = 'https://music-app-nodejs-mongodb.vercel.app/public/uploads/avatars-000664164452-c6z91r-t500x500-1693785253207-651497345.jpg';
      // url = 'https://hunterssocial.com/assets/images/img1.jpg';
      // const fileName = 'Download/' + Math.round(Math.random() * 109283) + '.jpg';
      const date = new Date();
      const time = date.getTime()
      const fileName = Capacitor.getPlatform() == 'ios' ? `${new Date().getTime()}.jpg` : `Download/${new Date().getTime()}.jpg`;

      // url = 'http://172.17.0.9:8028/public/test.jpg';
      console.log('url => ', url)
      console.log('fileName => ', fileName)

      const base64Data = await this.base64FromPath(url!);
      console.log('base64Data => ', base64Data)

      const directory = Capacitor.getPlatform() == 'ios' ? Directory.Library : Directory.ExternalStorage

      // try {
      //   const savedFilea = await Filesystem.mkdir({
      //     path: Capacitor.getPlatform() == 'ios' ? 'Download' : 'HunterSocial',
      //     directory: directory,
      //     recursive: true, // Create parent directories if they don't exist
      //   });
      //   console.log("savedFilea ", savedFilea);
      // } catch (e) {
      //   //console.error("Unable to make directory", e);
      // }



      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: directory,
      });

      if (savedFile) {
        console.log('savedFile => ', savedFile.uri)

        // if (Capacitor.getPlatform() == 'ios') {
        //   const targetpath = `file:///var/mobile/Media/DCIM/100APPLE/${fileName}`;
        //   console.log('targetpath => ', targetpath)
        //   const copiedFile = await Filesystem.copy({
        //     from: savedFile.uri,
        //     to: targetpath,
        //   });
        //   console.log('copied file => ', copiedFile)
        // }

        this.utility.presentSuccessToast('image downloaded successfully');
      }

      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: url,
      };

    } catch (error) {
      console.error('Errora:', error);
      this.utility.presentFailureToast(error.message);
    }

    // const targetPath = cordova.file.dataDirectory + 'image.jpg';
    // this.downloadImage(url, targetPath)

    // this.utility.downloadAndSaveImage(url, 'image.jpg')
    //   .then(() => {
    //     console.log('Image download and save complete');
    //   })
    //   .catch(error => {
    //     console.error('Error: ' + error.message);
    //   });


    // try {
    //   var xhr = new XMLHttpRequest();
    //   xhr.open("GET", url, true);
    //   xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    //   xhr.responseType = "blob";
    //   xhr.onload = function () {
    //     var urlCreator = window.URL || window.webkitURL;
    //     var imageUrl = urlCreator.createObjectURL(this.response);
    //     var tag = document.createElement('a');
    //     tag.href = imageUrl;
    //     tag.download = 'asdasdasd';
    //     document.body.appendChild(tag);
    //     tag.click();
    //     document.body.removeChild(tag);
    //   }
    //   xhr.send();
    //   this.utility.presentSuccessToast('image downloaded');
    // } catch (error) {
    //   console.error('Error:', error);
    //   this.utility.presentFailureToast(error.message);
    // }

    // this.downloadImage(url).then(
    //   blob => {
    //     this.createImageFromBlob(blob);
    //     this.imageLoaded = true;
    //   },
    //   error => {
    //     console.error('Error:', error);
    //         this.utility.presentFailureToast(error.message);
    //   }
    // );

    // this.utility.downloadImage(url).subscribe(
    //   (success) => {
    //     console.log('sucess image downloaded')
    //     this.utility.presentSuccessToast('image downloaded successfully');
    //   },
    //   (error) => {
    //     console.error('Image download error:', error);
    //     this.utility.presentFailureToast(error.message);
    //   }
    // );
  }

}
