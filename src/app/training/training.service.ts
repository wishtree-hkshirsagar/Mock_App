import { Exercise } from './exercise.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    availableExercises: Exercise[] = [];

    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService){}

    fetchAvailableExercises(): any {
        this.uiService.loadingStateChanged.next(true);
        this.fbSubs.push(this.db.collection<Exercise>('availableExercises')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        name: doc.payload.doc.data().name,
                        duration: doc.payload.doc.data().duration,
                        calories: doc.payload.doc.data().calories
                    };
                });
            })
            .subscribe((exercises: Exercise[]) => {
                this.uiService.loadingStateChanged.next(false);
                this.availableExercises = exercises;
                this.exercisesChanged.next([...this.availableExercises]);
            }, () => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
                this.exercisesChanged.next(null);
            }));
    }

    startExercise(selectedId: string): void {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise(): void {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number): void {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise(): Exercise {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises(): void {
       this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
            this.finishedExercisesChanged.next(exercises);
        }));
    }

    cancelSubscriptions(): void {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise): void {
        this.db.collection('finishedExercises').add(exercise);
    }
}
