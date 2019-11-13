import { Component, Input, OnInit } from "@angular/core";

import { DocumentIndex } from "src/app/core/markdown/markdown.service";

@Component({
  selector: "doc-list-template-short",
  templateUrl: "./doc-list-template-short.component.html",
  styleUrls: ["./doc-list-template-short.component.scss"],
})
export class DocListTemplateShortComponent implements OnInit {
  @Input() item: DocumentIndex;
  @Input() showCategory: boolean;

  constructor() {}

  ngOnInit() {}
}
