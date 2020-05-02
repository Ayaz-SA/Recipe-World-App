import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthAction from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.action';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
    private userSub: Subscription;
    isAuthenticated = false;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit() {
        this.userSub = this.store.select('auth')
        .pipe(map(authState => authState.user ))
        .subscribe(user => {
            this.isAuthenticated = !!user;
        });
    }
  
    onSaveData() {
        // this.dataStorageService.storedRecipe();
        this.store.dispatch(new RecipesActions.StoreRecipes());
    }

    onFetchRecipe() {
        // this.dataStorageService.fetchRecipe().subscribe();
        this.store.dispatch(new RecipesActions.FetchRecipes());
    }

    onLogOut() {
        this.store.dispatch(new AuthAction.Logout());
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}