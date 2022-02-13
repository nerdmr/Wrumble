import { Injectable } from '@angular/core';

// @Injectable({
//     providedIn: 'root'
// })
export class ObjectMapperService {

    constructor() { }

    public static applyDefault<T>(sourceObject: T, defaults: T): T {

        const objectKeys = Object.keys(defaults);

        for (let i = 0; i < objectKeys.length; i++) {
            const key = objectKeys[i];

            if (typeof (defaults as any)[key] === 'object') {
                if (!(sourceObject as any)[key]) (sourceObject as any)[key] = {};
                (sourceObject as any)[key] = this.applyDefault((sourceObject as any)[key], (defaults as any)[key])
            } else {
                (sourceObject as any)[key] = (defaults as any)[key]
            }
        }

        return sourceObject;

    }
}
