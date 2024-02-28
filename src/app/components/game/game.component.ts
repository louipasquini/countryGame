import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import countriesData from './data/countries.json'
import { CommonModule } from '@angular/common';

interface Continentes {
  [key: string]: string[]
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})

export class GameComponent implements OnInit, OnChanges {
  alphabet:string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  seconds:number = 30;
  con:any;
  data:Continentes = countriesData;
  correctCountries:string[] = []

  start = ():void => {
    this.pause();
    this.con = setInterval(() => {
      this.timer()
    },1000);
  }

  pause = ():void => {
    clearInterval(this.con);
  }

  reset = ():void => {
    this.seconds += 30;
    this.alphabet.shift()
  }

  timer = ():void => {
    this.seconds--;
    if (this.seconds == 0) {
      this.reset()
    }
  }

  obtainText = (e:any):void => {
    for (let continent in this.data) {
      if (e.value.startsWith(this.alphabet[0]) && this.data[continent].includes(e.value)) {
        this.correctCountries.push(e.value)
        e.value = ''
        console.log(this.correctCountries)
      }
    }
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
