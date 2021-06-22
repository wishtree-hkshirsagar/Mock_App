import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UIService {
    loadingStateChanged = new Subject<boolean>();

    constructor(private snackbar: MatSnackBar) {}

    showSnackbar(message, action, durationParam): void {
        this.snackbar.open(message, action, {
            duration: durationParam
        });
    }
}
