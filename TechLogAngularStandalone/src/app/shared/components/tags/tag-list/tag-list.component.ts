import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, MatChipsModule, TagComponent],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  @Input() tags: string[] | undefined | null = [];

  constructor() {}
}
