import { Component } from '@angular/core';
import { GameComponent } from './components/game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    GameComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'countriesGameTs';
}
