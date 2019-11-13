import { Component, OnInit, Input } from "@angular/core";

import { DocumentIndex } from "src/app/core/markdown/markdown.service";

@Component({
  selector: "doc-list-template",
  templateUrl: "./doc-list-template.component.html",
  styleUrls: ["./doc-list-template.component.scss"],
})
export class DocListTemplateComponent implements OnInit {
  @Input() item: DocumentIndex;
  @Input() showCategory: boolean;

  constructor() {}

  ngOnInit() {}
}
