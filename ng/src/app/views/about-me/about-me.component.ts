import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-about-me',
  imports: [NavbarComponent],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {
  readonly shadows: string[] = [this.multipleBoxShadow(1400), this.multipleBoxShadow(400), this.multipleBoxShadow(200)];

  multipleBoxShadow(n: number): string {
    let rand = `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;

    for (let i = 0; i < n; i++)
      rand += `, ${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;

    return rand;
  }

  ngOnInit() {
    let root = document.documentElement;
    root.style.setProperty("--small-shadows", this.shadows[0]);
    root.style.setProperty("--medium-shadows", this.shadows[1]);
    root.style.setProperty("--big-shadows", this.shadows[2]);
    // console.log("f.e small shadows is: ", root.style.getPropertyValue("--small-shadows"));
  }
}
