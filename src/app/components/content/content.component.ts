import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Application, Container, Graphics, InteractionEvent, Point, Rectangle } from 'pixi.js';
import { ZOOM_STRENGTH } from '../../constants/interaction';

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

    this.contentRef.nativeElement.addEventListener('wheel', this.handleWheel.bind(this));

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
    const rectWidth = 900;
    const rectHeight = 600;
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
    this.panAndZoomContainer.x = this.pointerStartOffset.x + event.data.global.x;
    this.panAndZoomContainer.y = this.pointerStartOffset.y + event.data.global.y;
  }

  handlePointerUp(): void {
    this.pointerStartOffset = null;
    this.stageStart = null;
  }

  handleWheel(event: WheelEvent): void {
    const container = this.panAndZoomContainer;
    const zoomValue = Math.abs(event.deltaY) / ZOOM_STRENGTH;
    const zoomDelta = event.deltaY > 0 ? 1 / zoomValue : zoomValue;
    const x = event.offsetX;
    const y = event.offsetY;
    const worldPosition = {
      x: (x - container.x) / container.scale.x,
      y: (y - container.y) / container.scale.y,
    };
    const newScale = {
      x: container.scale.x * zoomDelta,
      y: container.scale.y * zoomDelta,
    };
    const newScreenPosition = {
      x: worldPosition.x * newScale.x + container.x,
      y: worldPosition.y * newScale.y + container.y,
    };
    container.x -= newScreenPosition.x - x;
    container.y -= newScreenPosition.y - y;
    container.scale.x = newScale.x;
    container.scale.y = newScale.y;
  }
}
