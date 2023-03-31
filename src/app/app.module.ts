import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { D3TreeComponent } from './d3-tree/d3-tree.component';
import { D3CollapsibleTreeComponent } from './d3-collapsible-tree/d3-collapsible-tree.component';
import { DataService } from './data.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, D3TreeComponent, D3CollapsibleTreeComponent ],
  bootstrap:    [ AppComponent ],
  providers: [DataService]
})
export class AppModule { }
