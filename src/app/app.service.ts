import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAngelPage, IAngelEvent } from './interface';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { of } from 'rxjs';
import { UltronConstant } from './constant';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) {

  }

  content: any;
  getData(url = UltronConstant.ULTRON_METADATA_WIDGET_URL) {
    return this.http.get<any>(url);
  }

  getContent(url = UltronConstant.ULTRON_CONTENT_URL) {
    if (this.content) {
      return of(this.content);
    }
    return this.http.get<any>(url).pipe(tap(content => this.content = content));
  }

  getPageMetadata() {
    const localStoragePageConfig = localStorage.getItem('pageMetadata');
    return localStoragePageConfig ? _.get(JSON.parse(localStoragePageConfig), 'angel') : [];
  }

  updatePageMetadata(pageConfig: IAngelPage[]): boolean {
    try {
      localStorage.setItem(
        'pageMetadata',
        JSON.stringify({ angel: pageConfig })
      );
      return true;
    } catch (e) {
      console.error('Angel == update page config failed! ==');
      return false;
    }
  }

  getPageConfigById(pageId: string) {
    try {
      const localStoragePageConfig = JSON.parse(localStorage.getItem('pageMetadata')).angel;
      if (localStoragePageConfig.length !== 0) {
        return localStoragePageConfig.find((data: IAngelPage) => {
          if (data.id === pageId) {
            return data;
          }
        });
      }
    } catch (e) {
      return null;
    }
  }

  updateEventConfig(eventConfig: IAngelEvent[]) {
    try {
      localStorage.setItem(
        'eventMetadata',
        JSON.stringify({ angel: eventConfig })
      );
      return true;
    } catch (e) {
      console.error('Angel == update event config failed! ==');
      return false;
    }
  }

  getEventConfig(): IAngelEvent[] {
    return localStorage.getItem('eventMetadata') ? _.get(JSON.parse(localStorage.getItem('eventMetadata')), 'angel') : [];
  }

  getEventConfigById(widgetId: string): IAngelEvent[] {
    try {
      const localStorageEventConfig = JSON.parse(localStorage.getItem('eventMetadata')).angel;
      if (localStorageEventConfig.length !== 0) {
        const result = localStorageEventConfig.filter((data: IAngelEvent) => {
          if (data.widgetId === widgetId) {
            return data;
          }
        });
        return result;
      }
    } catch (e) {
      return [];
    }
  }

  exportMetadata(url = UltronConstant.ULTRON_METADATA_WIDGET_URL) {
    const pageMetadata = JSON.stringify(this.getPageMetadata());
    const eventMetadata = JSON.stringify(this.getEventConfig());
    return this.http.post<any>('http://localhost:3000/savePage', { pageMetadata, eventMetadata });
  }

  generateWidgetId() {
    const widgetIdIndex = localStorage.getItem('widgetIdIndex') ? parseInt(localStorage.getItem('widgetIdIndex'), 10) : 0;
    const nextWidgetIdIndex = widgetIdIndex + 1;
    localStorage.setItem('widgetIdIndex', nextWidgetIdIndex.toString());
    return nextWidgetIdIndex;
  }
}
