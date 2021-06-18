import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, ConfigurationComponent, TableComponent],
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, ConfigurationComponent, TableComponent]
})
export class SharedModule {}
