import { Ingredient } from '../shared/ingredient.model';

export class Recipe{
    public name: string;
    public description: string;
    public imagePath: string;
    public ingredients: Ingredient[];
    public user: {
        id: string,
        username: string
    }

    constructor(name: string, desc: string, image: string, ingredients: Ingredient[], id:string, uname: string) {
        this.name = name;
        this.description = desc;
        this.imagePath = image;
        this.ingredients = ingredients;
        this.user = {
            id: id,
            username: uname
        }
    }
}