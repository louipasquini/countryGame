import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import answersData from '../../../assets/data/answers.json'
import countriesData from '../../../assets/data/countries.json'
import { CommonModule } from '@angular/common';
import { format } from 'date-fns'

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
  alphabet:string[] = 'ABCDEFGHIJKLMNOPQRSTUVZ'.split('');
  seconds:number = 30;
  con:any;
  data:Continentes = countriesData;
  answers:Continentes = answersData;
  correctCountries:string[] = [];
  isStarted:boolean = false;
  points:number = 0;
  statusVisibility:boolean = false;
  fromAfrica:number = 0;
  fromAmerica:number = 0;
  fromAsia:number = 0;
  fromEurope:number = 0;
  fromOceania:number = 0;
  textShare:string = ``
  ranking:any;
  leaderboardVisibility:boolean = false;
  sendRank:boolean = false;
  rankingName:string = '';

  openLeaderboard = ():void => {
    this.statusVisibility = false;
    this.leaderboardVisibility = true;
  }

  closeLeaderboard = ():void => {
    this.leaderboardVisibility = false
  }

  closeTab = ():void => {
    this.statusVisibility = false;
    console.log(this.ranking)
  }

  start = ():void => {
    this.pause();
    this.isStarted = true;
    this.statusVisibility = false;
    this.con = setInterval(() => {
      this.timer()
    },1000);
  }

  pause = ():void => {
    clearInterval(this.con);
  }

  copyText() {
    const inputElement = document.createElement('textarea');
    inputElement.value = this.textShare;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
    alert('Texto copiado para a área de transferência.');
  }

  begin = ():void => {
    this.seconds = 30
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.isStarted = false;
    this.correctCountries = []
    this.pause()
  }

  reset = ():void => {
    if (this.isStarted === true) {
      this.seconds += 30;
      if (this.seconds >= 90) {
        this.seconds = 90;
      }
      if (this.alphabet.length > 1){
        this.alphabet.shift()
      } else {
        this.textShare = `Fiz ${this.points} pontos no Country Game!\n\nMeu resultado foi:\nÁfrica: ${this.fromAfrica} países\nAmérica: ${this.fromAmerica} países\nÁsia: ${this.fromAsia} países\nEuropa: ${this.fromEurope} países\nOceania: ${this.fromOceania} países\n\nJogue também em https://country-game-kappa.vercel.app`
        this.statusVisibility = true;
        this.begin()
      }
    }
  }

  timer = ():void => {
    this.seconds--;
    if (this.seconds == 0) {
      this.reset()
    }
  }

  sendRanking = (name:string,points:number):void => {
    fetch('https://147c423c-56c4-4e20-9296-30315e72772e-00-ncn7an2t808f.riker.replit.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name:name,points:points}) 
    })
    .then((res)=>{
      this.sendRank = false;
      console.log(this.sendRank)
      console.log(res)
    })
    .catch((error) => {
      console.error(error)
    })
  }

  send = () => {
    this.sendRank = true;
    this.obtainRankingName({value:this.rankingName})
    this.getApi()
    console.log(this.sendRank)
  }

  obtainRankingName = (e:any):void => {
    let rankingName = e.value.toString()
    this.rankingName = rankingName
    if (this.sendRank == true) {
      let newN = rankingName.split('').splice(0,5).join('')
      this.rankingName = newN
      this.sendRanking(this.rankingName,this.points)
    }
  }

  obtainText = (e:any):void => {
    if (this.isStarted) {
      let word = e.value
      word = word.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .split(" ")
        .map((palavra:string, index:number) => index === 0 || palavra.length > 2 ? palavra.charAt(0).toUpperCase() + palavra.slice(1) : palavra)
        .join(" ")
        .split("-")
        .map((palavra:string, index:number) => index === 0 || palavra.length > 2 ? palavra.charAt(0).toUpperCase() + palavra.slice(1) : palavra)
        .join("-");
      for (let continent in this.answers) {
        if (word.startsWith(this.alphabet[0]) && this.answers[continent].includes(word) && !this.correctCountries.includes(this.data[continent][this.answers[continent].indexOf(word)])) {
          this.correctCountries.push(this.data[continent][this.answers[continent].indexOf(word)])
          e.value = ''
          this.points += 1
          switch (continent) {
            case "Africa":
              this.fromAfrica += 1
              break
            case "America":
              this.fromAmerica += 1
              break
            case "Asia":
              this.fromAsia += 1
              break
            case "Europa":
              this.fromEurope += 1
              break
            case "Oceania":
              this.fromOceania += 1
              break
          }
        }
      }
    } else {
      this.start()
    }
  }

  getApi = () => {
    fetch('https://147c423c-56c4-4e20-9296-30315e72772e-00-ncn7an2t808f.riker.replit.dev/')
    .then(res => {
      if (!res.ok) {
        throw new Error('Erro');
      }
      return res.json()
    })
    .then(data => {
      this.ranking = data
      this.ranking.forEach((item:any) => {
        item.date = format(item.date, 'dd/MM/yyyy')
      });
      this.ranking.sort(function(a:any,b:any) {
        return a.points > b.points ? -1 : a.points < b.points ? 1 : 0;
    });
      this.ranking = this.ranking.splice(0,10);
    })
    .catch(error => {
      console.error(error)
    })
  }

  ngOnInit(): void {
    this.getApi()
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

}
