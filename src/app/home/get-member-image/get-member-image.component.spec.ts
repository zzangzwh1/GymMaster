import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMemberImageComponent } from './get-member-image.component';

describe('GetMemberImageComponent', () => {
  let component: GetMemberImageComponent;
  let fixture: ComponentFixture<GetMemberImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetMemberImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetMemberImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
