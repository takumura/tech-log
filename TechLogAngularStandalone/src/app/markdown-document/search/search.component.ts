import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  Subject,
  takeUntil,
  startWith,
  map,
  switchMap,
  combineLatestWith,
} from 'rxjs';

import { DocumentListComponent } from 'src/app/shared/components/lists/document-list/document-list.component';
import { ExpansionDocumentListComponent } from 'src/app/shared/components/lists/expansion-document-list/expansion-document-list.component';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { searchResultSortBy, sortByOption } from 'src/app/store/models/sort-by-options.model';
import { searchResultViewType } from 'src/app/store/models/view-type-options.model';
import { selectCategories, selectTags } from 'src/app/store/document-index/document-index.selectors';
import {
  searchDocuments,
  searchDocumentsByAdvancedOptions,
  updateViewType,
} from 'src/app/store/document-search/document-search.actions';
import {
  selectFilteredDocuments,
  selectHasAdvancedOptions,
  selectSearchCategory,
  selectSearchTags,
  selectSearchWord,
  selectViewType,
} from 'src/app/store/document-search/document-search.selectors';
import { showLoading } from 'src/app/store/loading/loading.actions';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    OverlayModule,
    ScrollingModule,
    DocumentListComponent,
    ExpansionDocumentListComponent,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  searchForm = new FormGroup({
    searchInputForm: new FormControl(''),
    searchOptionForm: new FormControl(searchResultSortBy.dateLatest),
    searchCategoryForm: new FormControl(''),
    searchTagForm: new FormControl(''),
  });

  category: string = '';
  isAdvancedSearchOpen: boolean = false;
  // used for tag autocomplete separator key
  separatorKeysCodes: number[] = [ENTER, COMMA];
  sortByOptions: sortByOption[] = [
    { key: searchResultSortBy.dateLatest, value: 'by date (latest)' },
    { key: searchResultSortBy.dateOldest, value: 'by date (oldest)' },
    { key: searchResultSortBy.aToZ, value: 'by A to Z' },
    { key: searchResultSortBy.zToA, value: 'by Z to A' },
  ];
  tags: string[] = [];
  viewTypeModel = searchResultViewType;

  documents$!: Observable<DocumentRef[]>;
  allCategories$!: Observable<string[]>;
  allTags$!: Observable<string[]>;
  filteredTags$!: Observable<string[]>;
  hasAdvancedOptions$!: Observable<boolean>;
  viewType$!: Observable<number>;

  private currentViewType: number = 0;
  private onDestroy = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.documents$ = this.store.select(selectFilteredDocuments);
    this.allCategories$ = this.store.select(selectCategories);
    this.allTags$ = this.store.select(selectTags);
    this.hasAdvancedOptions$ = this.store.select(selectHasAdvancedOptions);
    this.viewType$ = this.store.select(selectViewType);

    this.filteredTags$ = this.searchForm.controls.searchTagForm.valueChanges.pipe(
      startWith(null),
      switchMap((tag: string | null) => (tag ? this.getAutocompleteTags(tag) : this.getAvailableTags()))
    );

    this.searchForm.controls.searchOptionForm.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((_) => {
      this.searchDocumentInternal();
    });

    this.searchForm?.controls?.searchInputForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.onDestroy))
      .subscribe((_) => {
        this.searchDocumentInternal();
      });

    this.store
      .select(selectSearchWord)
      .pipe(combineLatestWith(this.store.select(selectSearchCategory)), takeUntil(this.onDestroy))
      .subscribe(([searchWord, searchCategory]) => {
        this.searchForm.patchValue({
          searchInputForm: searchWord,
          searchCategoryForm: searchCategory,
        });
      });

    this.store
      .select(selectSearchTags)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((tags) => {
        this.tags = [...tags];
      });

    this.viewType$.pipe(takeUntil(this.onDestroy)).subscribe((x) => {
      this.currentViewType = x;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) this.tags.push(value);

    // Clear the input value
    event.chipInput!.clear();
    this.searchForm.patchValue({ searchTagForm: '' });
  }

  advancedSearch(): void {
    this.store.dispatch(searchDocumentsByAdvancedOptions({ tags: [...this.tags], category: this.category }));

    this.searchDocumentInternal();
    this.toggleAdvancedSearchOpen();
  }

  categorySelected(event: MatAutocompleteSelectedEvent): void {
    this.category = event.option.viewValue;
  }

  clearAdvancedSearchOptions() {
    this.store.dispatch(searchDocumentsByAdvancedOptions({ tags: [], category: '' }));
    this.category = '';
    this.searchForm.patchValue({ searchTagForm: '' });
    this.tags.splice(0);

    this.searchDocumentInternal();
    this.toggleAdvancedSearchOpen();
  }

  clearSearchCategory(): void {
    this.category = '';
    this.searchForm.patchValue({
      searchCategoryForm: '',
    });
  }

  clearSearchInput(): void {
    this.searchForm.patchValue({ searchInputForm: '', searchOptionForm: searchResultSortBy.dateLatest });
  }

  tagRemove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  tagSelected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.searchForm.patchValue({ searchTagForm: '' });
  }

  toggleAdvancedSearchOpen(): void {
    this.isAdvancedSearchOpen = !this.isAdvancedSearchOpen;
  }

  updateViewType(viewType: number): void {
    if (this.currentViewType !== viewType) {
      this.store.dispatch(updateViewType({ viewType: viewType }));
    }
  }

  private getAutocompleteTags(value: string): Observable<string[]> {
    const filterValue = value.toLowerCase();

    return this.allTags$.pipe(map((tags) => tags.filter((x) => x.toLowerCase().indexOf(filterValue) !== -1)));
  }

  private getAvailableTags(): Observable<string[]> {
    return this.allTags$.pipe(
      map((tags) => {
        return tags.filter((x) => this.tags.indexOf(x.toLowerCase()) === -1);
      })
    );
  }

  private searchDocumentInternal(): void {
    const searchWord = this.searchForm.controls.searchInputForm.value ?? '';
    const sortByValue = this.searchForm.controls.searchOptionForm.value ?? 0;

    this.store.dispatch(showLoading());
    this.store.dispatch(searchDocuments({ search: searchWord, sortBy: sortByValue }));
  }
}
