<template>
  <div id="app">
    <div class="header">
      <h1>Chatroom</h1>
      <p class="username">Username: {{ username }}</p>
      <p class="online">Online: {{ users.length }}</p>
    </div>
    
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'App',
  components: {},
  data: function() {
    return {
      username: "",
      socket: io("http://localhost:3000"),
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
         console.log(this.users)
      });
      this.socket.on('userLeft', user => {
        this.users.splice(this.users.indexOf(user), 1); 
      })
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
  border: solid 20px #4b89ac;
  border-radius: 5%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
}
</style>
