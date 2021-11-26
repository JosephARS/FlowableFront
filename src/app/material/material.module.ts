import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
//Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule } from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import { PaginatorService } from '../core/servicios/components/paginator.service';

const materialModule = [MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
  MatSliderModule,
  MatToolbarModule,
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatExpansionModule,
  MatIconModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatDialogModule,
  MatBadgeModule,
  MatSnackBarModule,
  MatTabsModule,
  MatCardModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatMenuModule];


@NgModule({
  declarations: [],
  imports: [    CommonModule, materialModule  ],
  exports:[materialModule],
  providers:[{ provide: MatPaginatorIntl, useClass: PaginatorService}, MatDatepickerModule,]
})
export class MaterialModule { }
