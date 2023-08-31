import { Component, Input, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'left-row',
  templateUrl: './left-row.component.html',
  styleUrls: ['./left-row.component.scss'],
})
export class LeftRowComponent implements OnInit {
  @Input() item;
  constructor(
    public utility: UtilityService,
  ) { }
  ngOnInit() { }

  downloadimage(url) {
    console.log('downloadimage => ', url)
    this.utility.downloadImage(url).subscribe(
      (success) => {
        console.log('sucess image downloaded')
        this.utility.presentSuccessToast('image downloaded successfully');
      },
      (error) => {
        console.error('Image download error:', error);
        this.utility.presentFailureToast(error.message);
      }
    );
  }

}
