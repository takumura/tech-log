import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DocListTemplateComponent } from "./doc-list-template.component";
import { MatIconModule, MatListModule } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";

describe("DocListTemplateComponent", () => {
  let component: DocListTemplateComponent;
  let fixture: ComponentFixture<DocListTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocListTemplateComponent],
      imports: [MatIconModule, MatListModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocListTemplateComponent);
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
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
