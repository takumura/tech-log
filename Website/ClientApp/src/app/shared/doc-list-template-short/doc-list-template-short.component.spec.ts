import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DocListTemplateShortComponent } from "./doc-list-template-short.component";
import { MatIconModule, MatListModule } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";

describe("DocListTemplateShortComponent", () => {
  let component: DocListTemplateShortComponent;
  let fixture: ComponentFixture<DocListTemplateShortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocListTemplateShortComponent],
      imports: [MatIconModule, MatListModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocListTemplateShortComponent);
    component = fixture.componentInstance;
    component.item = {
      docRef: "/",
      content: {
        title: "string",
        date: "string",
        category: "string",
        tag: ["string"],
        toc: "string",
        body: "string",
        safeBody: "<h1>safe</h1>",
      },
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
