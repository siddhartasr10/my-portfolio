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
  // Indice de la tarjeta del carrousel que esté hovereada. (hago esto porque añadir estilos mediante clases de tailwind con hover o mediante css vanilla no funciona. tailwind tiene ya bugeado al navegador.
  hoverIdx: number = -1;
  wheelInputs: Set<String> = new Set();

  cardTransformState: WritableSignal<string> = signal("");
  focusedCardShadow: WritableSignal<string> = signal(`0px 14px 35px 12px rgba(26,26,52,.15),
                                                      0px 22px 30px 7px rgba(26,26,52,.15),
                                                      3px 22px 28px 4px rgba(26,26,52,.15),
                                                      3px 23px 35px 4px rgba(26,26,52,.15),
                                                      9px 35px 45px rgba(26,26,52,.15)`);

  unfocusedCardShadow: WritableSignal<string> = signal(`3px 6px 9px rgba(26,26,52,0.25),
                                                        6px 12px 25px rgba(26,26,52,0.25),
                                                        12px 24px 36px rgba(26,26,52,0.25)`);

  // focusedCardFilterState: WritableSignal<string> = signal(``); Las sombras van por separado así que...
  unfocusedCardFilterState: WritableSignal<string> = signal(`blur(1.5px) brightness(0.8)`);
  // scale no es un filter, va en el transform, al final se ha podido añadir como clase de tailwind.
  constructor(private hostRef: ElementRef) {
    // Controla la velocidad de movimiento del carrusel con el scroll, evita el lag.
    /* Si hiciera esto (o en general procesara cualquier input tal cual llega)
     * Se notaría bastante lag porque priorizaría eso a cualquier otro input.
     */
    setInterval(() => {
      if (this.wheelInputs.has("up")) ++this.carrouselIdx;
      if (this.wheelInputs.has("down")) --this.carrouselIdx;
      this.wheelInputs.delete("up");
      this.wheelInputs.delete("down");

      if (this.carrouselIdx === -1)
        this.carrouselIdx = 2;

      if (this.carrouselIdx === 3)
        this.carrouselIdx = 0;
      // Actualizo el estilo del transform para cada cambio de índice del carrusel.
      this.updateTransform();

    }, 100)

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

  // Move Carrousel with the arrows. Executes on click on the arrows.
  moveCarrousel(img: HTMLImageElement): void {
    // console.log("img.id: ", img.id)
    // Casos en los que overflowea:
    if (img.id === "left" && this.carrouselIdx == 0) {
      this.carrouselIdx = 2;
      this.updateTransform();
      // console.log("Indice carrusel: ", this.carrouselIdx);
      return;
    }

    if (img.id === "right" && this.carrouselIdx == 2) {
      this.carrouselIdx = 0;
      this.updateTransform();
      // console.log("Indice carrusel: ", this.carrouselIdx);
      return;
    }

    // Caso normal:
    (img.id === "left")
      ? --this.carrouselIdx
      : ++this.carrouselIdx;
    this.updateTransform();
  }

  // Executes on wheel Move inside the carrousel.
  wheelMoveCarrousel(ev: WheelEvent): void {
    ev.preventDefault();

    (ev.deltaY > 0)
      ? this.wheelInputs.add("up")
      : this.wheelInputs.add("down");


    // Ahora se ejecuta en un intervalo
    // Funcionamiento antiguo, causa lag porque no espera.
    // (ev.deltaY > 0)
    //   ? ++this.carrouselIdx
    //   : --this.carrouselIdx;

    // if (this.carrouselIdx === -1)
    //   this.carrouselIdx = 2;

    // if (this.carrouselIdx === 3)
    //   this.carrouselIdx = 0;

  }

  // Executes onclick on the carrousel cards
  // This function only executes as click event inside the carrousel.
  // So if the code doesn't find the card's parent div it will search recursively.
  // the c counter is to avoid infinite loops
  clickMoveCarrousel(ev: MouseEvent): void {
    let target = ev.target as HTMLDivElement, targetIdNumber, c = 0;

    while (Number.isNaN(targetIdNumber = Number(target.id.at(-1))) || c > 15) {
      target = target.parentElement as HTMLDivElement;
      // console.log("clickMoveCarrousel: ", target);
      c++;
    }

    this.carrouselIdx = targetIdNumber;
  }

  updateTransform(): void {
    switch(this.carrouselIdx) {
      case 0: return this.cardTransformState.set("translateX(17.5rem)");
      case 2: return this.cardTransformState.set("translateX(-17.5rem)");
      default: return this.cardTransformState.set("translateX(0)");
    }
  }

  /* Methods for accounting hover on the cards, tailwind's :hover:bottom-6 doesn't work with transition */
  registerHover(ev: MouseEvent): void {
    let card = ev.target as HTMLDivElement;
    // Id of the cards is card-x (0,1,2)
    this.hoverIdx = (!isNaN(Number(card.id.at(-1))))
      ? Number(card.id.at(-1))
      : -1;
  }

  unlistHover(): void {
    this.hoverIdx = -1;
  }
}
