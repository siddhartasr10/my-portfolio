import { Component, ElementRef, OnInit, AfterViewInit , ViewChild, WritableSignal, signal } from '@angular/core';
import { NgStyle } from '@angular/common';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

type Coords = {
    x: number,
    y: number,
  }
  // TODO: Haz una version que se vea en firefox por lo menos y no solo en blink.

@Component({
  selector: 'app-about-me',
  imports: [NavbarComponent, NgStyle],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {
  readonly shadows: string[] = [this.multipleBoxShadow(1400), this.multipleBoxShadow(400), this.multipleBoxShadow(200)];

  @ViewChild("objetivosGuia") objGuia!: ElementRef;
  @ViewChild("motivacionGuia") motGuia!: ElementRef;

  objPos : WritableSignal<{left?: string, top?: string}> = signal({});
  motPos : WritableSignal<{left?: string, top?: string}> = signal({});


  multipleBoxShadow(n: number): string {
    let rand = `${(Math.random() * 2000).toFixed(2)}px ${Math.random() * 2000}px #FFF`;

    for (let i = 0; i < n; i++)
      rand += `, ${(Math.random() * 2000).toFixed(2)}px ${Math.random() * 2000}px #FFF`;

    return rand;
  }

  ngOnInit() {
    let root = document.documentElement;
    root.style.setProperty("--small-shadows", this.shadows[0]);
    root.style.setProperty("--medium-shadows", this.shadows[1]);
    root.style.setProperty("--big-shadows", this.shadows[2]);
    // console.log("f.e small shadows is: ", root.style.getPropertyValue("--small-shadows"));


    // No se pueden seleccionar estos elementos aquí, ya que no han renderizado todavia.
    // let objGuiaDiv = this.objGuia.nativeElement as HTMLDivElement,
    // motGuiaDiv = this.motGuia.nativeElement as HTMLDivElement;

    if (localStorage.getItem("objPos"))
      this.objPos.set(JSON.parse(localStorage.getItem("objPos")!));

    if (localStorage.getItem("motPos"))
      this.motPos.set(JSON.parse(localStorage.getItem("motPos")!));

  }

  ngAfterViewInit() {
    let objGuiaDiv = this.objGuia.nativeElement as HTMLDivElement,
    motGuiaDiv = this.motGuia.nativeElement as HTMLDivElement;

    if (localStorage.getItem("objPos") && localStorage.getItem("motPos")) {

      objGuiaDiv.style.display = "none";
      motGuiaDiv.style.display = "none";

      return;
    }

    // Estas variables son el left y el top y se usan como ngStyle.
    this.objPos.set(this.coordToPos(this.getCoords(this.objGuia)));
    this.motPos.set(this.coordToPos(this.getCoords(this.motGuia)));


    objGuiaDiv.style.display = "none";
    motGuiaDiv.style.display = "none";

    // console.log("objPos: ", this.objPos, " motPos: ", this.motPos);

    localStorage.setItem("objPos", JSON.stringify(this.objPos()));
    localStorage.setItem("motPos", JSON.stringify(this.motPos()));
  }

  getCoords(ele: ElementRef | HTMLDivElement) : Coords {
    let el;

    (ele instanceof ElementRef)
      ? el = ele.nativeElement as HTMLElement
      : el = ele;

    return {x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y };
  }

  coordToPos(obj: Coords) : {left: string, top: string} {
    console.log("Coords: ", obj);
    console.log("To pos: ", `left: ${obj.x.toFixed(2)}px, top: ${obj.y.toFixed(2)}px;`);
    return {
      left: obj.x.toFixed(2) + 'px',
      top: obj.y.toFixed(2) + 'px'
    };
  }

}
