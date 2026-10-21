export type FlatId = string;

export interface Flat {
  id: FlatId;
  name: string;
}

export type Cuisine =
  | 'chinese'
  | 'western'
  | 'se-asian'
  | 'japanese'
  | 'korean'
  | 'hotpot-cuisine'
  | 'fusion'
  | 'other';

export type DishCategory = 'breakfast' | 'lunch' | 'dinner' | 'hotpot' | 'dessert';

export type DishCategoryFilter = DishCategory | 'all';

export type HotpotIngredientCategory = 'meat' | 'veggie' | 'seafood' | 'balls';

export type SoupBase = 'miso' | 'tom-yum' | 'spicy-sichuan' | 'clear-broth' | 'herbal';

export type BudgetMode = 'economy' | 'balanced' | 'luxury';

export type DishActivityType = 'planned' | 'comment' | 'created' | 'budget_updated';

export interface FamilyMember {
  id: string;
  name: string;
  birthday: string;
  flatId: FlatId;
  avatarUri?: string;
}

/** Optional link on a family-tree person. Child links are derived from parent links. */
export type FamilyTreeRelationKind = 'parent' | 'spouse';

export interface FamilyTreeRelation {
  personId: string;
  kind: FamilyTreeRelationKind;
}

/**
 * A person on the family tree. `relations` is optional so a record can be
 * saved with only name, age, and bio.
 */
export interface FamilyTreePerson {
  id: string;
  name: string;
  age: number;
  bio: string;
  relations?: FamilyTreeRelation[];
}

export interface FamilyTreePersonInput {
  name: string;
  age: number;
  bio: string;
  parentIds?: string[];
  spouseId?: string | null;
}

export interface WorshipAddress {
  id: string;
  name: string;
  address: string;
  note: string;
}

export interface WorshipAddressInput {
  name: string;
  address: string;
  note: string;
}

/** Guidance article. Each line of `body` is one checklist-style note. */
export interface WorshipGuide {
  id: string;
  title: string;
  body: string;
}

export interface WorshipGuideInput {
  title: string;
  body: string;
}

/**
 * A date observed every year. `monthDay` is Gregorian (MM-DD).
 * Lunar dates belong in `note` (for example 農曆九月初九).
 */
export interface WorshipOccasion {
  id: string;
  name: string;
  monthDay: string;
  note: string;
  addressId?: string;
}

export interface WorshipOccasionInput {
  name: string;
  monthDay: string;
  note: string;
  addressId?: string | null;
}

export interface WorshipRecord {
  id: string;
  date: string;
  what: string;
  notes: string;
  addressId?: string;
  occasionId?: string;
}

export interface WorshipRecordInput {
  date: string;
  what: string;
  notes: string;
  addressId?: string | null;
  occasionId?: string | null;
}

/** A photo on a family place. `uri` may be a library pick or an https link. */
export interface PlacePhoto {
  id: string;
  uri: string;
  caption: string;
}

export interface PlacePhotoInput {
  id?: string;
  uri: string;
  caption?: string;
}

/** A place the household keeps, separate from 祭祀 addresses. */
export interface Place {
  id: string;
  name: string;
  address: string;
  notes: string;
  photos: PlacePhoto[];
}

export interface PlaceInput {
  name: string;
  address: string;
  notes: string;
  photos: PlacePhotoInput[];
}

/** @deprecated Use FamilyMember */
export type FamilyProfile = FamilyMember;

export interface RecipeComment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  cuisine: Cuisine;
  ownerFlatId: FlatId;
  imageUri: string;
  recipe: string;
  ingredients: string[];
  cookingTimeMinutes: number;
  estimatedBudget: number;
  youtubeUrl?: string;
  tags: string[];
  isHotpotSet?: boolean;
  isPublic?: boolean;
  comments?: RecipeComment[];
  likesCount?: number;
}

/** Recipe shared in the global community pool (公海) */
export interface PublicDish {
  id: string;
  sourceDishId?: string;
  familyName: string;
  name: string;
  category: DishCategory;
  cuisine: Cuisine;
  imageUri: string;
  recipe: string;
  ingredients: string[];
  cookingTimeMinutes: number;
  estimatedBudget: number;
  youtubeUrl?: string;
  tags: string[];
  comments: RecipeComment[];
  likesCount: number;
}

/** @deprecated Use Dish */
export type Meal = Dish;

export interface DishComment {
  id: string;
  dishId: string;
  flatId: FlatId;
  date: string;
  author: string;
  comment: string;
  createdAt: string;
}

export interface DishActivity {
  id: string;
  dishId: string;
  flatId: FlatId;
  type: DishActivityType;
  date: string;
  message: string;
  author?: string;
  createdAt: string;
}

export interface HotpotIngredient {
  id: string;
  name: string;
  category: HotpotIngredientCategory;
}

export interface HotpotSet {
  id: string;
  name: string;
  flatId: FlatId;
  soupBase: SoupBase;
  ingredientIds: string[];
}

export type MealPlan = Record<string, string[]>;

export type MealPlansByFlat = Record<FlatId, MealPlan>;

export interface AddMemberInput {
  name: string;
  birthday: string;
  flatId: FlatId;
  avatarUri?: string;
}

export interface AddDishInput {
  name: string;
  category: DishCategory;
  cuisine: Cuisine;
  ownerFlatId: FlatId;
  imageUri: string;
  recipe: string;
  ingredients: string[];
  cookingTimeMinutes: number;
  estimatedBudget: number;
  youtubeUrl?: string;
}

export interface AddHotpotSetInput {
  name: string;
  flatId: FlatId;
  soupBase: SoupBase;
  ingredientIds: string[];
}

export interface BudgetPlanRequest {
  budget: number;
  dishCount: number;
  mode: BudgetMode;
}

export interface YoutubeRecipeExtraction {
  name: string;
  ingredients: string[];
  recipe: string;
  cookingTimeMinutes: number;
  estimatedBudget: number;
  imageUri?: string;
}
