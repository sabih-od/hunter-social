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
  downloading = false;
  ngOnInit() {
    this.showdownloadicon = Capacitor.getPlatform() == 'ios' ? false : true;
  }


  // imageSrc
  // imageLoaded = false;
  // createImageFromBlob(imageBlob: Blob) {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => {
  //     this.imageSrc = reader.result;
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
  //   return new Promise<void>((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       this.writeFile(targetPath, reader.result)
  //         .then(() => resolve())
  //         .catch(error => reject(error));
  //     };
  //     reader.onerror = error => {
  //       reject(error);
  //     };
  //     reader.readAsArrayBuffer(blob);
  //   });
  // }

  // private writeFile(filePath: string, data: any): Promise<void> {
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
  
      const blob = await response.blob();
  
      return new Promise<string>((resolve, reject) => {
        // const reader = new FileReader();
        let reader = this.getFileReader();
    

        // const zoneOriginalInstance = (reader as any)["__zone_symbol__originalInstance"];
        // if (zoneOriginalInstance) {
    
        // }

        reader.onerror = reject;
        reader.onload = () => {
      
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject('Method did not return a string');
          }
        };
    
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Errorb:', error);
      throw error;
    } finally {
      this.downloading = false;
    }
  }

  async downloadimage(url) {
    this.downloading = true;
    // this.photoLibrary.requestAuthorization().then((res) => {

    //   // this.photoLibrary.savePhoto(imageData, 'My Image').then((libraryItem: LibraryItem) => {

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
  
  

      const base64Data = await this.base64FromPath(url!);
  

      const directory = Capacitor.getPlatform() == 'ios' ? Directory.Library : Directory.ExternalStorage

      // try {
      //   const savedFilea = await Filesystem.mkdir({
      //     path: Capacitor.getPlatform() == 'ios' ? 'Download' : 'HunterSocial',
      //     directory: directory,
      //     recursive: true, // Create parent directories if they don't exist
      //   });
  
      // } catch (e) {
      //   //console.error("Unable to make directory", e);
      // }



      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: directory,
      });

      if (savedFile) {
    

        // if (Capacitor.getPlatform() == 'ios') {
        //   const targetpath = `file:///var/mobile/Media/DCIM/100APPLE/${fileName}`;
    
        //   const copiedFile = await Filesystem.copy({
        //     from: savedFile.uri,
        //     to: targetpath,
        //   });
    
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
    } finally {
      this.downloading = false;
    }

    // const targetPath = cordova.file.dataDirectory + 'image.jpg';
    // this.downloadImage(url, targetPath)

    // this.utility.downloadAndSaveImage(url, 'image.jpg')
    //   .then(() => {

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

    //     this.utility.presentSuccessToast('image downloaded successfully');
    //   },
    //   (error) => {
    //     console.error('Image download error:', error);
    //     this.utility.presentFailureToast(error.message);
    //   }
    // );
  }

}
