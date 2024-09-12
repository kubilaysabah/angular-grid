import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil, Subject } from "rxjs";
import { AppService } from '@app/app.service'

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();

  constructor(
    private appService: AppService,
  ) {
  }

  ngOnInit(): void {
    this.appService.data()
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
