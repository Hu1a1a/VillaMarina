import { Component, OnChanges, Input, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-loading",
  templateUrl: "./app.loading.component.html",
})
export class LoadingComponent implements OnChanges {
  @Input() isLoading!: boolean;
  Point = "..."
  ngOnChanges(changes: SimpleChanges) {
    if (this.isLoading === true) {
      const loading = setInterval(() => {
        if (this.Point === ".....") {
          this.Point = ""
        } else {
          this.Point += "."
        }
        if (this.isLoading === false) {
          clearInterval(loading);
        }
      }, 500)
    }
  }
}
