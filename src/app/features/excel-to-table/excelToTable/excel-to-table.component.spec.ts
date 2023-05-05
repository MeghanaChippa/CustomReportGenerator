import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelToTableComponent } from './excel-to-table.component';

describe('ExcelToTableComponent', () => {
  let component: ExcelToTableComponent;
  let fixture: ComponentFixture<ExcelToTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelToTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelToTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
