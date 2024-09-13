import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

import { takeUntil, Subject } from "rxjs";

import { AppService } from '@app/app.service'
import { type Customer } from '@app/app.interface'

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatAnchor,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule
  ],
  providers: [
    AppService,
    provideNativeDateAdapter(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      }
    }
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  filters: FormGroup<{
    shipmentTrackingNo: FormControl<string | null>;
    orderTrackingNo: FormControl<string | null>;
    plate: FormControl<string | null>;
    status: FormControl<number | null>;
    releasedForDistribution: FormControl<string | null>;
  }> = new FormGroup({
    shipmentTrackingNo: new FormControl(),
    orderTrackingNo: new FormControl(),
    plate: new FormControl(),
    status: new FormControl(),
    releasedForDistribution: new FormControl()
  })

  readonly dateRange: FormGroup<{
    start: FormControl<Date | null>;
    end: FormControl<Date | null>;
  }> = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  })

  customers: Customer[] = []

  paginator = {
    pageIndex: 0,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20]
  }

  status = ['Oluşturuldu', 'İptal Edildi', 'Teslim Edildi', 'Bekliyor', 'Teslim Edilemedi']

  rows = [
    "Sipariş No",
    "Gönderi Takip No",
    "Sipariş Takip No",
    "Müşteri Ad/Soyad",
    "İlçe",
    "Plaka",
    "Dağıtıma Çıkarıldı",
    "Durum",
    "Tarih",
    "Siparş Detay"
  ];

  columns: Customer[] = []

  constructor(
    private appService: AppService,
  ) {
  }

  ngOnInit(): void {
    this.appService.customers()
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (customers) => {
          this.customers = customers;
          this.columns = customers.slice(0, this.paginator.pageSize);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  filter(): void {
    const {
      shipmentTrackingNo,
      orderTrackingNo,
      releasedForDistribution,
      status,
      plate
    } = this.filters.value;
    const { end, start } = this.dateRange.value;

    this.columns = this.customers;

    if (shipmentTrackingNo) {
      this.columns = [...this.columns.filter((column) => column.shipmentTrackingNo.toLowerCase().includes(shipmentTrackingNo.trim().toLowerCase()))]
    }

    if (orderTrackingNo) {
      this.columns = [...this.columns.filter((column) => column.orderTrackingNo.toLowerCase().includes(orderTrackingNo.trim().toLowerCase()))];
    }

    if (releasedForDistribution) {
      this.columns = [...this.columns.filter((column) => column.releasedForDistribution === releasedForDistribution)]
    }

    if (status !== undefined && status !== null) {
      this.columns = this.columns.filter((column) =>
        column.Status === status
      );
    }

    if (plate) {
      this.columns = [...this.columns.filter((column) => column.plate.toLowerCase().includes(plate.toLowerCase()))]
    }

    if (start && end) {
      this.columns = [...this.columns.filter((column) => {
        const date = new Date(column.Date);

        return date >= start && date <= end;
      })]
    }
  }

  pageChangeEvent(event: PageEvent): void {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;

    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    if (endIndex > this.customers.length){
      endIndex = this.customers.length;
    }

    this.columns = this.customers.slice(startIndex, endIndex);
  }

  hideName(fullName: string): string {
    const customer = fullName.split(" ");
    const surname = customer[1];
    return `${customer[0]} ${surname[0]}***`
  }

  dateParser(value: number): string | number {
    return value > 10 ? value : `0${value}`;
  }

  date(date: string): string {
    const selectedDate = new Date(date);

    return `${this.dateParser(selectedDate.getDate())}.${this.dateParser(selectedDate.getMonth() + 1)}.${this.dateParser(selectedDate.getFullYear())}`
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
