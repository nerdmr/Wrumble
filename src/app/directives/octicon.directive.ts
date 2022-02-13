import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
// @ts-ignore
import * as octicons from '@primer/octicons';

@Directive({
    selector: '[octicon]'
})
export class OcticonDirective {

    @Input() octicon: string;
    @Input('color') color: string;
    @Input() width: number = 24;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngOnInit(): void {
        const el: HTMLElement = this.elementRef.nativeElement;
        (window as any)['octicons'] = octicons;
        el.innerHTML = octicons[this.octicon].toSVG();

        const icon: Node = el.firstChild!;
        if (this.color) {
            this.renderer.setStyle(icon, 'fill', this.color);
        }
        if (this.width) {
            this.renderer.setStyle(icon, 'width', this.width);
            this.renderer.setStyle(icon, 'height', '100%');
        }
    }

}
