import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  BASE_VIDEO_API_PATH,
  BASE_VIDEO_EXTENSION,
  FILE_NAME_QUERY_PARAM,
  FILE_TYPE_QUERY_PARAM,
  LANGUAGE_QUERY_PARAM
} from '../../help.constants';
import { Video } from '../../help.model';

@Component({
  selector: 'gp-help-video-dialog',
  templateUrl: './help-video-dialog.component.html',
  styleUrls: ['./help-video-dialog.component.scss']
})
export class HelpVideoDialogComponent implements OnInit {
  video: Video;
  language: string;
  videoSource: string;

  host = `${window.location.protocol}//${window.location.host}/`;
  path = window.location.pathname.split('/')[1];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HelpVideoDialogComponent>
  ) {
    this.video = data.video;
    this.language = data.language;
  }

  ngOnInit(): void {
    this.videoSource = this.getVideoSource(this.video.name);
  }

  getVideoSource(videoName: string): string {
    const languageQueryParam = `${LANGUAGE_QUERY_PARAM}${this.language}`;
    const fileNameQueryParam = `${FILE_NAME_QUERY_PARAM}${videoName}`;
    const fileTypeQueryParam = `${FILE_TYPE_QUERY_PARAM}${BASE_VIDEO_EXTENSION}`;
    const queryParams = [languageQueryParam, fileNameQueryParam, fileTypeQueryParam].join('&');

    if (this.path === 'app' || this.path === 'local') {
      return `${this.host}${BASE_VIDEO_API_PATH}?${queryParams}`;
    }
    return `${this.host}${this.path}/${BASE_VIDEO_API_PATH}?${queryParams}`;
  }
}
