import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { TagComponent } from '../tag/tag.component';

@Component({
  standalone: true,
  selector: 'app-tag-list',
  imports: [CommonModule, MatChipsModule, TagComponent],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  @Input() tags: string[] | undefined | null = [];

  constructor() {}
}
