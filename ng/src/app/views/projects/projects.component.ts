import { Component, ElementRef, WritableSignal, signal  } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-proyects',
  imports: [ NavbarComponent, NgClass ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  sliderState: WritableSignal<number> = signal(0);
  carrouselIdx: number = 1;

  constructor(private hostRef: ElementRef) {}

  sliderOnChange(ev: Event): void {
    let target = ev.target as HTMLFormElement;
    if (target.id.at(-1) === "1") {
      this.hostRef.nativeElement.style.setProperty("--slider-end-transform", "6rem");
      // document.documentElement.style.setProperty("--slider-end-transform", "6rem");
      this.sliderState.set(0);
    }
    else {
      this.hostRef.nativeElement.style.setProperty("--slider-end-transform", "0");
      this.sliderState.set(1);
    }

    console.log("sliderState: ", this.sliderState());
  }

  moveCarrousel(img: HTMLImageElement): void {
    // console.log("img.id: ", img.id)
    // Casos en los que overflowea:
    if (img.id === "left" && this.carrouselIdx == 0) {
      this.carrouselIdx = 2;
      // console.log("Indice carrusel: ", this.carrouselIdx);
      return;
    }

    if (img.id === "right" && this.carrouselIdx == 2) {
      this.carrouselIdx = 0;
      // console.log("Indice carrusel: ", this.carrouselIdx);
      return;
    }

    // Caso normal:
    (img.id === "left")
      ? --this.carrouselIdx
      : ++this.carrouselIdx;
  }
}
