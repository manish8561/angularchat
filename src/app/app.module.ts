import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChatliveModule } from "./components/chatlive/chatlive.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ChatliveModule.forRoot({
      url: "http://10.0.1.14:3000",
      admin_room: 1,
      room: "default",
      username: "admin",
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
