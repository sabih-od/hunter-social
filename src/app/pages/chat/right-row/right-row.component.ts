import { Component, Input, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'right-row',
  templateUrl: './right-row.component.html',
  styleUrls: ['./right-row.component.scss'],
})
export class RightRowComponent implements OnInit {
  @Input() item;
  constructor(public utility: UtilityService,) { }

  showdownloadicon = true;
  downloading = false;
  ngOnInit() {
    this.showdownloadicon = Capacitor.getPlatform() == 'ios' ? false : true;
  }

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
    } finally {
      this.downloading = false;
    }
  }

  async downloadimage(url) {
    this.downloading = true;

    try {
      const date = new Date();
      const time = date.getTime()
      const fileName = Capacitor.getPlatform() == 'ios' ? `${new Date().getTime()}.jpg` : `Download/${new Date().getTime()}.jpg`;

      console.log('url => ', url)
      console.log('fileName => ', fileName)

      const base64Data = await this.base64FromPath(url!);
      console.log('base64Data => ', base64Data)

      const directory = Capacitor.getPlatform() == 'ios' ? Directory.Library : Directory.ExternalStorage

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: directory,
      });

      if (savedFile) {
        console.log('savedFile => ', savedFile.uri)
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
  }

}
