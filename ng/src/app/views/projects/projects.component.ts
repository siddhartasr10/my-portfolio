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

  wheelStates: Set<String> = new Set();

  constructor(private hostRef: ElementRef) {
    setInterval(() => {
      if (this.wheelStates.has("up")) ++this.carrouselIdx;
      if (this.wheelStates.has("down")) --this.carrouselIdx;
      this.wheelStates.delete("up");
      this.wheelStates.delete("down");

      if (this.carrouselIdx === -1)
        this.carrouselIdx = 2;

      if (this.carrouselIdx === 3)
        this.carrouselIdx = 0;

    }, 150)

  }

  sliderOnChange(ev: Event): void {
    let target = ev.target as HTMLFormElement;
    if (target.id.at(-1) === "1") {
      this.hostRef.nativeElement.style.setProperty("--slider-end-transform", "3.62rem"); // 0.02 para hacer el slider 1px mas grande y que no se vean manchitas negras.
      // document.documentElement.style.setProperty("--slider-end-transform", "3.62rem");
      this.sliderState.set(0);
    }
    else {
      // document.documentElement.style.setProperty("--slider-end-transform", "0");
      this.hostRef.nativeElement.style.setProperty("--slider-end-transform", "0");
      this.sliderState.set(1);
    }

    console.log("sliderState: ", this.sliderState());
  }

  // Move Carrousel with the arrows.
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

  wheelMoveCarrousel(ev: WheelEvent): void {
    // (ev.deltaY > 0)
    //   ? ++this.carrouselIdx
    //   : --this.carrouselIdx;

    (ev.deltaY > 0)
      ? this.wheelStates.add("up")
      : this.wheelStates.add("down");

    // if (this.carrouselIdx === -1)
    //   this.carrouselIdx = 2;

    // if (this.carrouselIdx === 3)
    //   this.carrouselIdx = 0;
  }
}
