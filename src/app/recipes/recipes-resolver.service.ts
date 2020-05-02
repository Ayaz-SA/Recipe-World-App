import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Recipe } from './recipes-model';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';

import * as fromAppp from '../store/app.reducer';
import * as RecipesActions from './store/recipe.action';
import { of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private store: Store<fromAppp.AppState>,
                private actions$:  Actions) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select('recipes').pipe(
            take(1),
            map(recipeState => {
                return recipeState.recipes;
            }),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    this.store.dispatch(new RecipesActions.FetchRecipes()); 
                    return this.actions$.pipe(
                        ofType(RecipesActions.SET_RECIPES), 
                        take(1)
                    );
                }
                else {
                    return of(recipes);
                }
            })
        );
    }
}