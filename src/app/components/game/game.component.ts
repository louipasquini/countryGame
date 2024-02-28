import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import answersData from './data/answers.json'
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
  answers:Continentes = answersData;
  correctCountries:string[] = [];
  isStarted:boolean = false;

  start = ():void => {
    this.pause();
    this.isStarted = true;
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
    if (this.isStarted) {
      let word = e.value
      word = word.normalize('NFD').charAt(0).toUpperCase() + word.slice(1);
      for (let continent in this.answers) {
        if (word.startsWith(this.alphabet[0]) && this.answers[continent].includes(word) && !this.correctCountries.includes(e.value)) {
          this.correctCountries.push(this.data[continent][this.answers[continent].indexOf(word)])
          e.value = ''
        }
      }
    } else {
      this.start()
    }
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
