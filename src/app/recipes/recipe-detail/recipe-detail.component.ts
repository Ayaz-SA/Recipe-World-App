import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipes-model';
import * as fromAppp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.action';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  //Getuser from localstorage
  userData: { 
    email: string,
    id: string,
  } = JSON.parse(localStorage.getItem('userData'));
  validuser: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromAppp.AppState>) { }

  

  ngOnInit() {
    // const id = this.route.snapshot.params['id'];
    this.route.params
    .pipe(
      map(params => {
        return +params['id'];
      }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes'); 
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          this.validuser = recipe.user.id;
          return index === this.id;
        });
      })
    )
    .subscribe( recipe => {
      this.recipe = recipe;
    });
  }

  toShoppingList() {
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
    this.router.navigate(['shopping-list']);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route})
  }

  onDelete() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
