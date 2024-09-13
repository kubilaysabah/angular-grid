import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from "@angular/router";

import { takeUntil, Subject } from "rxjs";

import { AppService } from '@app/app.service'
import { type Customer } from '@app/app.interface'

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  providers: [
    AppService
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

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

  columns:Customer[] = []

  constructor(
    private appService: AppService,
  ) {
  }

  ngOnInit(): void {
    this.appService.customers()
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (customers) => {
          this.columns = customers;
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  hideName(fullName: string): string {
    const customer = fullName.split(" ");
    const surname = customer[1];
    return `${customer[0]} ${surname[0]}***`
  }

  dateParser(value: number) {
    return value > 10 ? value : `0${value}`;
  }

  date(date: string): string {
    const selectedDate = new Date(date);

    return `${this.dateParser(selectedDate.getDay())}.${this.dateParser(selectedDate.getMonth())}.${this.dateParser(selectedDate.getFullYear())}`
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
