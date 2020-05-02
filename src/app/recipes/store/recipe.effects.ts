import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as RecipesActions from './recipe.action';
import { Recipe } from '../recipes-model';
import * as fromAppp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {

    @Effect()
    fetchRecipes = this.action$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(
                'https://recipeworld-f4d13.firebaseio.com/recipes.json'
            ); 
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe, 
                    ingredients: recipe.ingredients ? recipe.ingredients: []
                }
            });
        }),
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })
    );
    
    @Effect({dispatch: false})
    storeRecipe = this.action$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipeState]) => {
            return this.http.put(
                'https://recipeworld-f4d13.firebaseio.com/recipes.json',
                recipeState.recipes
            )
        })
    );
    constructor(private action$: Actions,
                private http: HttpClient,
                private store: Store<fromAppp.AppState>) {}
} 