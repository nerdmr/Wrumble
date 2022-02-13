import { OnInit } from "@angular/core";
import { HasElementRef } from "src/app/components/pasta-item/pasta-item.component";

function prependNgOnInitWithSelector(
    component: HasElementRef<HTMLElement> & OnInit,
    prependFn: (targetElement: HTMLElement, component: HasElementRef<HTMLElement> & OnInit) => void,
    childSelector?: string
) {
    const originalInit = component.ngOnInit;
    component.ngOnInit = function(...args) {
        const component = this as HasElementRef<HTMLElement> & OnInit;
        const targetElement = (childSelector) ? component.elementRef.nativeElement.querySelector(childSelector) as HTMLElement : component.elementRef.nativeElement;
        
        originalInit.apply(this, args); 
        prependFn.call(this, targetElement, component);
    }
}

/// Drag sources
/**
 * Decorator for method called when ondragstart is triggered on element. Decorated method takes `event: DragEvent` as an argument.
 * @returns 
 */
export const dragStart = (childSelector?: string) => (component: HasElementRef<HTMLElement> & OnInit, propertyKey: string, descriptor: PropertyDescriptor) => {
    prependNgOnInitWithSelector(component, (targetElement, component) => {
        targetElement.draggable;
        targetElement.ondragstart = (ev: DragEvent) => {
            descriptor.value.call(component, ev);
        }
    }, childSelector);
};

export const dragEnd = (childSelector?: string) => (component: HasElementRef<HTMLElement> & OnInit, propertyKey: string, descriptor: PropertyDescriptor) => {
    prependNgOnInitWithSelector(component, (targetElement, component) => {        
        targetElement.draggable = true;
        targetElement.ondragend = (ev: DragEvent) => {
            descriptor.value.call(component, ev);
        }
    }, childSelector);
};

// Drag targets
export const dragOver = (childSelector?: string) => (component: HasElementRef<HTMLElement> & OnInit, propertyKey: string, descriptor: PropertyDescriptor) => {
    prependNgOnInitWithSelector(component, (targetElement, component) => {        
        targetElement.ondragover = (ev: DragEvent) => {
            ev.preventDefault();
            descriptor.value.call(component, ev);
        }
    }, childSelector);
};

export const dragEnter = (childSelector?: string) => (component: HasElementRef<HTMLElement> & OnInit, propertyKey: string, descriptor: PropertyDescriptor) => {
    prependNgOnInitWithSelector(component, (targetElement, component) => {        
        targetElement.ondragenter = (ev: DragEvent) => {
            // ev.preventDefault();
            descriptor.value.call(component, ev);
        }
    }, childSelector);
};

export const dragLeave = (childSelector?: string) => (component: HasElementRef<HTMLElement> & OnInit, propertyKey: string, descriptor: PropertyDescriptor) => {
    prependNgOnInitWithSelector(component, (targetElement, component) => {        
        targetElement.ondragleave = (ev: DragEvent) => {
            // ev.preventDefault();
            descriptor.value.call(component, ev);
        }
    }, childSelector);
};

export const drop = (childSelector?: string) => (component: HasElementRef<HTMLElement> & OnInit, propertyKey: string, descriptor: PropertyDescriptor) => {
    prependNgOnInitWithSelector(component, (targetElement, component) => {        
        targetElement.ondrop = (ev: DragEvent) => {
            // ev.preventDefault();
            descriptor.value.call(component, ev);
        }
    }, childSelector);
};
