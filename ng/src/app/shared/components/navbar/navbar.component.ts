import { Component, ElementRef, ViewChild} from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @ViewChild('navbar') navbar: ElementRef | undefined;
  section: string = "";

  constructor(route: ActivatedRoute) {
    route.url.subscribe(url => {
      this.section = url[0].toString();
      if (!this.navbar) return;
    })
  }


}
