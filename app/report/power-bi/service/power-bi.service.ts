import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { PowerBiDetail } from '../model/power-bi.model';

const url='/app-bff/api/v1/power-bi'

@Injectable({
  providedIn: 'root'
})
export class PowerBiService {
  constructor(private apiService: ApiService) {}

  getEmbedToken(){
    return this.apiService.get<PowerBiDetail>(url+'/embed-token')
  }
}
