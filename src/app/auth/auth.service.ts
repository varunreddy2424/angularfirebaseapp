import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService) {}

    initAuthListener(): void {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true); 
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancleSubscriptions();
                this.authChange.next(false);    
                this.router.navigate(['/login']);   
                this.isAuthenticated = false; 
            }
        });
    }

    registerUser(authData: AuthData): void {
        this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
            })
            .catch(error => console.log(error));
    }

    login(authData: AuthData): void {
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
            })
            .catch(error => console.log(error));
    }

    logout(): void {
        this.afAuth.auth.signOut();
    }

    isAuth(): boolean {
        return this.isAuthenticated;
    }
}