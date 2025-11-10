import { Component, ElementRef, ViewChild} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  section: string = "";
  @ViewChild('navbar') navbar: ElementRef | undefined;

  constructor(route: ActivatedRoute) {
    route.url.subscribe(url => {
      this.section = url[0].toString();
    })
  }


}
