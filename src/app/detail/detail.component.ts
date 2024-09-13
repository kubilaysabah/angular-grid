import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import { AppService} from '@app/app.service'
import { type Customer } from '@app/app.interface'

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [],
  providers: [AppService],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  customer: Customer | null = null;

  constructor(
    private appService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const orderNo = this.activatedRoute.snapshot.params["id"];

    this.appService.customers()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(async (customers) => {
        const find = customers.find((customer) => customer.orderNo === +orderNo);

        if(!find) {
          await this.router.navigate([""]);
          return;
        }

        this.customer = find;
      })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
