import { Component, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  Data,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NavbarComponent } from '../core/components/navbar/navbar.component';
import { SidebarComponent } from '../core/components/sidebar/sidebar.component';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'EduEnrollClient';
  public authService = inject(AuthService);
  private router = inject(Router);

  public onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private activatedRoute = inject(ActivatedRoute);

  public layout = signal<'navbar' | 'sidebar'>('navbar');

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        map((): ActivatedRoute => {
          let route: ActivatedRoute = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route: ActivatedRoute) => route.data),
      )
      .subscribe((data: Data) => {
        this.layout.set((data['layout'] as 'navbar' | 'sidebar') ?? 'navbar');
      });
  }
}
