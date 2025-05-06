import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterLink, RouterOutlet } from "@angular/router";
import { ShipSocketService } from "./services/socket/ship.socket.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [RouterLink, RouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private _titleService: Title,
    private _shipSocketService: ShipSocketService,
  ) {}

  ngOnInit(): void {
    this._titleService.setTitle("Config");
    this._shipSocketService.startUpConnection();
  }

  ngOnDestroy() {
    this._shipSocketService.stopConnection();
  }
}
