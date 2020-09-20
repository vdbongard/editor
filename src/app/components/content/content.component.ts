import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Application, Graphics } from 'pixi.js';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, AfterViewInit {
  @ViewChild('content') contentRef: ElementRef;

  app: Application;
  stage: Graphics;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.app = new Application({
      backgroundColor: 0xf0f0f0,
      resizeTo: this.contentRef.nativeElement,
    });
    this.contentRef.nativeElement.appendChild(this.app.view);
    this.stage = new Graphics();
    this.app.stage.addChild(this.stage);
    this.resizeStage();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.app.resize();
    this.resizeStage();
  }

  resizeStage(): void {
    const width = this.app.screen.width;
    const height = this.app.screen.height;
    const rectWidth = width * 0.7;
    const rectHeight = height * 0.7;
    const x = (width - rectWidth) / 2;
    const y = (height - rectHeight) / 2;

    this.stage.clear();
    this.stage.beginFill(0xffffff);
    this.stage.drawRect(x, y, rectWidth, rectHeight);
  }
}
