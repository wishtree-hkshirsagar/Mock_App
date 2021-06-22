import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  isLoading = true;
  private exerciseSubscription: Subscription;
  private loadingSubs: Subscription;

  constructor(private trainingService: TrainingService, private db: AngularFirestore,
              private uiService: UIService) { }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
    exercises => {
      this.exercises = exercises;
    });
    this.fetchExercises();
  }

  fetchExercises(): void {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

}
