
import { Directive, Input, OnInit, Type, ViewContainerRef } from '@angular/core';
import { Representation } from '../representations/representation.base';
import { PastaItem } from '../services/storage/pasta-storage.service';

/**
 * Renders a dashboard panel
 */
@Directive({
    selector: '[appRepresentation]',
})
export class RepresentationDirective implements OnInit {

    @Input('appRepresentation') options: {
        representation: Type<Representation>|Function,
        data: PastaItem,
        instances: Representation[],
    };

    constructor(public viewContainerRef: ViewContainerRef) {
        
    }
    ngOnInit(): void {
        this.loadComponent();
    }

    loadComponent() {        
        this.viewContainerRef.clear();

        const componentRef = this.viewContainerRef.createComponent<Representation>((this.options.representation as Type<Representation>));
        componentRef.instance.pasta = this.options.data;

        // update instance in collection
        const newInstance = componentRef.instance;
        this.options.instances.push(newInstance);
    }
}
