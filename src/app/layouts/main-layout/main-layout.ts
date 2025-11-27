import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Sidebar],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent {}