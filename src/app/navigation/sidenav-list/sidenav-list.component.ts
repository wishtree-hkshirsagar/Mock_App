import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output() closeSidenav = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onClose(): void {
    this.closeSidenav.emit();
  }

  onLogout(): void {
    this.onClose();
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
