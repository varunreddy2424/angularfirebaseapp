import { Subject } from 'rxjs/Subject';
import { Exercise } from './exercise.model';

export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    private availableExercises: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
        { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    ];

    private runningExercise: Exercise;
    private exercises: Exercise[] = [];

    completreExercise() {
        this.exercises.push({ 
            ...this.runningExercise,
            date: new Date(),
            state: 'Completed'
         });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({ 
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'Cancelled'
         });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getAvailableExercises(): Exercise[] {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string): void {
        this.runningExercise = this.availableExercises.find(exercise => exercise.id === selectedId);
        this.exerciseChanged.next({ ... this.runningExercise });
    }

    getRunningExercise(): Exercise {
        return { ...this.runningExercise };
    }

    getCompletedOrCancelledExercises(): Exercise[] {
        return this.exercises.slice();
    }
}