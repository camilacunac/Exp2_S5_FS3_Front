import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './NavBar.component';
import { By } from '@angular/platform-browser';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el enlace "Iniciar sesión" cuando el usuario no está logueado', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();

    const loginLink = fixture.debugElement.query(By.css('a[href="/login"]'));
    expect(loginLink).toBeTruthy();
    expect(loginLink.nativeElement.textContent.trim()).toBe('Iniciar sesión');
  });

  it('debería mostrar el enlace "Cerrar sesión" cuando el usuario está logueado', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();

    const logoutLink = fixture.debugElement.query(By.css('a[href="#"]'));
    expect(logoutLink).toBeTruthy();
    expect(logoutLink.nativeElement.textContent.trim()).toBe('Cerrar sesión');
  });

  it('debería alternar el estado de login al hacer click en "Cerrar sesión"', () => {
    component.isLoggedIn = true;
    spyOn(localStorage, 'removeItem');
    fixture.detectChanges();

    const logoutLink = fixture.debugElement.query(By.css('a[href="#"]'));
    logoutLink.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isLoggedIn).toBeFalse();
    expect(localStorage.removeItem).toHaveBeenCalledWith('isLoggedIn');
  });

  it('debería mostrar el enlace "Mi Perfil" cuando el usuario está logueado', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();

    const profileLink = fixture.debugElement.query(By.css('a[href="/perfil"]'));
    expect(profileLink).toBeTruthy();
    expect(profileLink.nativeElement.textContent.trim()).toBe('Mi Perfil');
  });

  it('debería mostrar el enlace "Registro" cuando el usuario no está logueado', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();

    const registerLink = fixture.debugElement.query(
      By.css('a[href="/registro"]')
    );
    expect(registerLink).toBeTruthy();
    expect(registerLink.nativeElement.textContent.trim()).toBe('Registro');
  });
});
