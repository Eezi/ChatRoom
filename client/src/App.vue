<template>
  <div id="app">
    <div class="header">
      <h1>Chatroom</h1>
      <p class="username">Username: {{ username }}</p>
      <p class="online">Online: {{ users.length }}</p>
    </div>
    <Chatroom v-bind:messages="messages" v-on:sendMessage="this.sendMessage" />
  </div>
</template>

<script>
import io from 'socket.io-client';
import Chatroom from './components/Chatroom';

export default {
  name: 'App',
  components: {
    Chatroom
  },
  data: function() {
    return {
      username: "",
      socket: io("http://localhost:8080"),
      messages: [],
      users: []
    }
  },
  methods: {
    joinServer: function() {
      this.socket.on('loggedIn', data => {
        this.messages = data.messages;
        this.users = data.users;
        this.socket.emit('newuser', this.username);
       
      });

      this.listen();
    },
    listen: function() {
      
      this.socket.on('userOnline', user => {
        this.users.push(user);
        
      });

      this.socket.on('userLeft', user => {
        this.users.splice(this.users.indexOf(user), 1); 
      });

      this.socket.on("msg", message => {
        this.messages.push(message)
      });
    },
    sendMessage: function(message) {
      this.socket.emit('msg', message);
    }
  },
  mounted: function() {
    this.username = prompt("What is your username?", "Anonymous")
   
    if(!this.username){
      this.username = "Anonymous";
    }
    
    this.joinServer();
  }
}
</script>

<style>

body {
  font-family: 'Avenir', Arial, Helvetica, sans-serif;
  color: #2C3E50;
  margin: 0;
  padding: 0;
}

h1 {
  text-align: center;
}

.header p {
  padding: 0px 20px;
  font-weight: bold;
}

#app {
  padding: 20px;
  box-sizing: border-box;
  border: solid 20px #393e46;
  border-radius: 2%;
  display: flex;
  flex-direction: column;
  background-color: #00adb5;
  height: 100vh;
  width: 100%;
  max-width: 768px;
  margin: 5px auto;
}
</style>
