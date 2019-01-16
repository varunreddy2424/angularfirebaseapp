import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();

    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore
      ) { }

    completeExercise() {
        this.addDateToDatebase({ 
            ...this.runningExercise,
            date: new Date(),
            state: 'Completed'
         });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDateToDatebase({ 
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'Cancelled'
         });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    fetchAvailableExercises(): void {
        this.fbSubs.push(this.db.collection('availableExercises').snapshotChanges()
        .pipe(
          map((docArray: any) => {
            return docArray.map(doc => {
              return {
                id: doc.payload.doc.id,
                ...doc.payload.doc.data()
              };
            });
          })
        ).subscribe((exercises: Exercise[]) => {
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
        }));
    }

    startExercise(selectedId: string): void {
        // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
        this.runningExercise = this.availableExercises.find(exercise => exercise.id === selectedId);
        this.exerciseChanged.next({ ... this.runningExercise });
    }

    getRunningExercise(): Exercise {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises(): void {
        this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
            this.finishedExercisesChanged.next([...exercises]);
        }));
    }

    cancleSubscriptions(): void {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDateToDatebase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}