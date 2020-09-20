import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Application,
  Container,
  Graphics,
  InteractionEvent,
  Point,
  Rectangle,
} from 'pixi.js';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('content') contentRef: ElementRef;

  app: Application;
  panAndZoomContainer: Container;
  animationContainer: Graphics;
  pointerStartOffset: Point;
  stageStart: Point;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.app = new Application({
      backgroundColor: 0xf0f0f0,
      resizeTo: this.contentRef.nativeElement,
      transparent: false,
    });
    this.app.stage.interactive = true;
    this.contentRef.nativeElement.appendChild(this.app.view);

    this.panAndZoomContainer = new Container();
    this.app.stage.addChild(this.panAndZoomContainer);

    this.animationContainer = new Graphics();
    this.panAndZoomContainer.addChild(this.animationContainer);

    this.app.stage.on('pointerdown', this.handlePointerDown.bind(this));
    this.app.stage.on('pointermove', this.handlePointerMove.bind(this));
    this.app.stage.on('pointerup', this.handlePointerUp.bind(this));
    this.app.stage.on('pointerupoutside', this.handlePointerUp.bind(this));

    this.resizeStage();
  }

  ngOnDestroy(): void {
    this.app.stage.off('pointerdown', this.handlePointerDown);
    this.app.stage.off('pointermove', this.handlePointerMove);
    this.app.stage.off('pointerup', this.handlePointerUp);
    this.app.stage.off('pointerupoutside', this.handlePointerUp);
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

    this.animationContainer.clear();
    this.animationContainer.beginFill(0xffffff);
    this.animationContainer.drawRect(x, y, rectWidth, rectHeight);

    this.app.stage.hitArea = new Rectangle(0, 0, width, height);
  }

  handlePointerDown(event: InteractionEvent): void {
    if (event.data.originalEvent.which !== 2) {
      return;
    }
    this.pointerStartOffset = new Point(
      this.panAndZoomContainer.x - event.data.global.x,
      this.panAndZoomContainer.y - event.data.global.y
    );
  }

  handlePointerMove(event: InteractionEvent): void {
    if (!this.pointerStartOffset) {
      return;
    }
    const currentPoint = new Point(event.data.global.x, event.data.global.y);
    this.panAndZoomContainer.x = this.pointerStartOffset.x + currentPoint.x;
    this.panAndZoomContainer.y = this.pointerStartOffset.y + currentPoint.y;
  }

  handlePointerUp(): void {
    this.pointerStartOffset = null;
    this.stageStart = null;
  }
}
