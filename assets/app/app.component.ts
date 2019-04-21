import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {ChatService} from './chat.service';
import { style } from '@angular/core/src/animation/dsl';



@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./app.component.css'],
    providers:[ChatService]
})

export class AppComponent {

    user:String;
    room:String;
    messageText:String;
    closeResult: string;
    messageArray:Array<{user: String, message: String}> = [];
    constructor(private _chatService:ChatService){
        this._chatService.newUserJoined()
        .subscribe(data=> this.messageArray.push(data))

        this._chatService.userLeftRoom()
        .subscribe(data=>this.messageArray.push(data));

        this._chatService.newMessageReceived()
        .subscribe(data=>this.messageArray.push(data));
    }


    join(){
        this._chatService.joinRoom({user:this.user, room:this.room});
    }

    leave(){
        this._chatService.leaveRoom({user:this.user, room:this.room});
    }

    sendMessage()
    {
        this._chatService.sendMessage({user:this.user, room:this.room, msg:this.messageText});
    }

    admin(){
      document.getElementById('modal-wrapper').style.display='block';
    }
    close(){
      document.getElementById('modal-wrapper').style.display='none';
      document.getElementById('modal-database').style.display='none';
      document.getElementById('modal-room').style.display='none';

    }
    login(){
      var username = document.getElementById("username").innerHTML;
      var password = document.getElementById("password").innerHTML;
      if( username == 'admin' && password == 'abc123'){
        console.log("Failed Login")

      }
      else{
        console.log("Access Granted")
        document.getElementById('modal-database').style.display='block';
      }
    }
    
    add(){
      document.getElementById('modal-room').style.display='block';

    }
}