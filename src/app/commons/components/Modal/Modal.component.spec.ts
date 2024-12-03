import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './Modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el modal cuando isVisible es true', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const modalContainer = fixture.debugElement.query(
      By.css('.modal-container')
    );
    expect(modalContainer).toBeTruthy();
  });

  it('no debería mostrar el modal cuando isVisible es false', () => {
    component.isVisible = false;
    fixture.detectChanges();

    const modalContainer = fixture.debugElement.query(
      By.css('.modal-container')
    );
    expect(modalContainer).toBeNull();
  });

  it('debería mostrar el título correcto', () => {
    const testTitle = 'Título de prueba';
    component.title = testTitle;
    component.isVisible = true;
    fixture.detectChanges();

    const modalTitle = fixture.debugElement.query(
      By.css('.modal-header h3')
    ).nativeElement;
    expect(modalTitle.textContent).toBe(testTitle);
  });

  it('debería emitir el evento close cuando se cierre el modal', () => {
    spyOn(component.close, 'emit');

    component.isVisible = true;
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(
      By.css('.close-btn')
    ).nativeElement;
    closeButton.click();

    expect(component.close.emit).toHaveBeenCalled();
    expect(component.isVisible).toBeFalse();
  });

  it('debería cerrar el modal al hacer clic en el backdrop', () => {
    spyOn(component.close, 'emit');

    component.isVisible = true;
    fixture.detectChanges();

    const backdrop = fixture.debugElement.query(
      By.css('.modal-backdrop')
    ).nativeElement;
    backdrop.click();

    expect(component.close.emit).toHaveBeenCalled();
    expect(component.isVisible).toBeFalse();
  });
});
