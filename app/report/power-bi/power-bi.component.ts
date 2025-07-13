import { Component, OnInit } from '@angular/core';
import { IReportEmbedConfiguration, models } from 'powerbi-client';
import { PowerBiService } from './service/power-bi.service';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../iam/user/user.service';

@Component({
  selector: 'gp-power-bi',
  templateUrl: './power-bi.component.html',
  styleUrls: ['./power-bi.component.scss']
})
export class PowerBiComponent implements OnInit {
  embedConfig: IReportEmbedConfiguration = {};

  eventHandler = new Map([
    ['loaded', () => console.log('Report loaded')],
    ['rendered', () => console.log('Report rendered')],
    ['error', event => console.log(event.detail)]
  ]);

  private unsubscribe = new Subject<void>();

  constructor(
    private userService: UserService,
    private powerBiService: PowerBiService
  ) {}

  ngOnInit() {
    combineLatest([this.userService.getUserDataRestrictions(), this.powerBiService.getEmbedToken()])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([userDataRestriction, embedToken]) => {
        const queryParameter = this.generateQueryParameter(userDataRestriction.Country);
        this.embedConfig = {
          type: 'report',
          id: embedToken.reportId,
          embedUrl: `https://app.powerbi.com/reportEmbed${queryParameter}`,
          accessToken: embedToken.embeddedToken,
          tokenType: models.TokenType.Embed,
          groupId: embedToken.groupId,
          permissions: models.Permissions.All,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false
              },
              pageNavigation: {
                visible: true,
                position: models.PageNavigationPosition.Left,
              }
            },
            background: models.BackgroundType.Transparent
          }
        };
    });
  }

  canDeactivate(): boolean {
    return true;
  }

  generateQueryParameter(countryCodes?: string[]): string {
    if (!countryCodes || !countryCodes.length) {
      return '';
    }

    return `?filter=Countries/CountryIsoCode in ('${countryCodes.join('\',\'')}')`;
  }
}
