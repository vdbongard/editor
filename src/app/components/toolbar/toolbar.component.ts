import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'circle-tool',
      sanitizer.bypassSecurityTrustResourceUrl('assets/circle-tool.svg')
    );
    iconRegistry.addSvgIcon(
      'line-tool',
      sanitizer.bypassSecurityTrustResourceUrl('assets/line-tool.svg')
    );

    iconRegistry.addSvgIcon(
      'polygon-tool',
      sanitizer.bypassSecurityTrustResourceUrl('assets/polygon-tool.svg')
    );
    iconRegistry.addSvgIcon(
      'rectangle-tool',
      sanitizer.bypassSecurityTrustResourceUrl('assets/rectangle-tool.svg')
    );
    iconRegistry.addSvgIcon(
      'select-tool',
      sanitizer.bypassSecurityTrustResourceUrl('assets/select-tool.svg')
    );
  }

  ngOnInit(): void {}
}
