import { Component, ElementRef, ViewChild, WritableSignal, signal, AfterViewInit  } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-proyects',
  imports: [ NavbarComponent, NgClass, NgIf],
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

  // El blur como propiedad dinamica que se aplica en toda la tarjeta, sumado a otros backdrop blurs que hay en los elementos contenidos da bug.
  // Así que ese blur(1.5px) se suma en las capas separadas de el img section y el text section.
  // unfocusedCardFilterState: WritableSignal<string> = signal(`brightness(0.8)`);
  // scale no es un filter, va en el transform, al final se ha podido añadir como clase de tailwind.
  @ViewChild('cardVideo0') cardVideo0!: ElementRef<HTMLVideoElement>;
  @ViewChild('cardVideo1') cardVideo1!: ElementRef<HTMLVideoElement>;

  // Indice del vídeo de las tarjetas siendo hovereado.
  videoHoverIdx: number = -1;

  carrouselVideos: Array<ElementRef<HTMLVideoElement>> = [];

  readonly VIDEO_START_TIMEOUT = 2250;
  readonly VIDEO_PAUSE_TIMEOUT = 750;

  isSingleClick: boolean = false;

  // hostRef is a variable to the <html>, I use it to control :root
  constructor(private hostRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.carrouselVideos = [this.cardVideo0, this.cardVideo1]

    // Controla la velocidad de movimiento del carrusel con el scroll, evita el lag.
    /* Si hiciera esto (o en general procesara cualquier input tal cual llega)
     * Se notaría bastante lag porque priorizaría eso a cualquier otro input. */
    setInterval(() => {
      if (this.wheelInputs.has("up")) {this.pauseCardVideoOnTime(); ++this.carrouselIdx; this.playCardVideoOnTime();}
      if (this.wheelInputs.has("down")) {this.pauseCardVideoOnTime(); --this.carrouselIdx; this.playCardVideoOnTime();}
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
    const target = ev.target as HTMLFormElement;
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
  onArrowClickMoveCarrousel(img: HTMLImageElement): void {
    this.pauseCardVideoOnTime();
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

    this.playCardVideoOnTime();
  }

  // Executes on wheel Move inside the carrousel.
  onWheelMoveCarrousel(ev: WheelEvent): void {
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
  onClickMoveCarrousel(ev: MouseEvent): void {
    this.pauseCardVideoOnTime();
    let target = ev.target as HTMLDivElement, targetIdNumber, c = 0;

    while (Number.isNaN(targetIdNumber = Number(target.id.at(-1))) || c > 15) {
      target = target.parentElement as HTMLDivElement;
      // console.log("onClickMoveCarrousel: ", target);
      c++;
    }

    this.carrouselIdx = targetIdNumber;

    this.playCardVideoOnTime();
  }

  updateTransform(): void {
    switch(this.carrouselIdx) {
      case 0: return this.cardTransformState.set("translateX(17.5rem)");
      case 2: return this.cardTransformState.set("translateX(-17.5rem)");
      default: return this.cardTransformState.set("translateX(0)");
    }
  }

  /* Methods for accounting hover on the cards, tailwind's :hover:bottom-6 doesn't work with transition *
   * I need this for other reasons not only for css. */
  // OnMouseEnter
  onCardHover(ev: MouseEvent): void {
    const card = ev.target as HTMLDivElement;
    // Id of the cards is card-x (0,1,2)
    this.hoverIdx = (!isNaN(Number(card.id.at(-1))))
      ? Number(card.id.at(-1))
      : -1;

    this.playCardVideoOnTime();
  }

  unlistHover(): void {
    this.pauseCardVideoOnTime();
    this.hoverIdx = -1;
  }

  onVideoClick(ev: MouseEvent): void {
    const target = ev.target as HTMLVideoElement;
    ev.stopPropagation(); // Si no se activa onClickMoveCarrousel
    this.isSingleClick = true;

    setTimeout(() => (!this.isSingleClick)
      ? null
      : (target.paused)
        ? target.play()
        : target.pause()
      , 300);
  }

  onCardVideoDblClick(ev: MouseEvent): void {
    const target = ev.target as HTMLVideoElement;
    ev.stopPropagation();
    this.isSingleClick = false;
    target.requestFullscreen();

  }

  onVideoHover(ev: MouseEvent): void {
    const target = ev.target as HTMLVideoElement;
    this.videoHoverIdx = (!isNaN(Number(target.id.at(-1))))
      ? Number(target.id.at(-1))
      : -1;
  }

  unlistVideoHover(): void {
    this.videoHoverIdx = -1;
  }

  // Executes on every cardIdx and hoverIdx movement (click, click on arrow, wheel move and mouseEnter)
  // Needs to execute in cardIdx changes in case user changes card into the one hovered, so it starts the count
  // Needs its analogous version to stop the video on MouseLeave (only way to change hoverIdx)
  // mouseleave in this case occurs with unlistHover so do it there.

  // IMPORTANT: before a movement happens in the carrousel, the pause timeout happens to keep track of old carrouselIdx
  // after the movement happens, the play timeout happens.
  // if pause only tracks hoveridx then changing cards while hovering the same one won't pause its video.
  playCardVideoOnTime(): void {
    const lastHoverIdx = this.hoverIdx;
    // console.log(this.carrouselVideos);

    // if there is a hovered card and has a video, select video and setTimeout to play the video,
    // only if after the timeout the card continues being selected
    if (this.carrouselVideos[this.hoverIdx]) {
      // Necesita estar muteado o sino me salta al principio el error de la política de reproducción automática en google (no es muy relevante pero los vídeos tampoco tienen sonido) y lo pongo por ts porque por html puede no haberse inicializado todavía.
      this.carrouselVideos[this.hoverIdx].nativeElement.muted = true;
      setTimeout(() => (this.hoverIdx == lastHoverIdx && lastHoverIdx == this.carrouselIdx)
        ? this.carrouselVideos[lastHoverIdx].nativeElement.play()
        : null // (console.log("actual hoveridx: ", this.hoverIdx, "past hoveridx: ", lastHoverIdx)
      , this.VIDEO_START_TIMEOUT)

    }
  }
  // Para poder pausar necesito saber de que tarjeta vengo, por eso el pause se hace antes de cambiar el carrouselIdx.
  pauseCardVideoOnTime(): void {
    const lastHoverIdx = this.hoverIdx, lastCarrouselIdx = this.carrouselIdx;

    setTimeout(() => (this.hoverIdx != lastHoverIdx || lastHoverIdx != this.carrouselIdx)
      ? this.carrouselVideos[lastCarrouselIdx].nativeElement.pause()
      : null
      , this.VIDEO_PAUSE_TIMEOUT)
  }

  restartCardVideo(ev: Event): void {
    const target = ev.target as HTMLVideoElement;
    const id = (isNaN(Number(target.id.at(-1))))
      ? -1
      : Number(target.id.at(-1));

    target.currentTime = 0;

    if (id == -1) return;

    setTimeout(() => (id == this.hoverIdx && id == this.carrouselIdx)
      ? target.play()
      : null, 1000);

  }
}
