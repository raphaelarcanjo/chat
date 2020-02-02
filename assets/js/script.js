const app = new Vue({
  el: '#app',
  data: {
    calls: [],
    chat: '',
    messages: [],
    caller: '',
    hide: true
  },
  methods: {
    getCalls: function() {
      fetch('/calls')
      .then(data => data.json())
      .then(response => response.forEach((element, index) => this.calls.push(element)))
    },
    sendMsg: function() {
      this.messages.push($("#message").val())
      $.ajax({
        type: 'post',
        url: `/update/${this.chat}`,
        data: {
          messages: JSON.stringify(this.messages)
        }
      })

      $.ajax({
        type: 'get',
        url: `/get/${this.chat}`,
        success: data => this.messages = JSON.parse(data.messages)
      })

      $("#message").val('')

      this.getCalls
    }
  },
  created: function() {
    new Promise(this.getCalls)
  }
})

const calls = new Vue({
  el: '#calls',
  data: {
    calls: app.calls,
    id: '',
    hide: true
  },
  methods: {
    openMsg: function(event) {
      
      this.id = event.target.id

      fetch(`/receiver/${this.id}`)
      .then(data => data.json())
      .then(response => {
        app.messages = response.messages
        app.caller = response.caller
        this.hide = app.hide = false
      })
    },
    endMsg: function() {
      fetch('/endmsg',{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({id:this.id})
      })
      .then(data => data.text())
      .then(response => {
        if (response._id == this.id) window.location.href = '/receiver'
      })
    }
  }
})

const login = new Vue({
  el: '#login',
  data: {
    hide: false
  },
  methods: {
    login: function() {
      $.ajax({
        type: 'post',
        url: '/save',
        data: $("#login").serializeArray(),
        success: data => {
          app.chat = data
          app.caller = $("#caller").val()
          app.messages.push(`Hello ${app.caller}!`)
          this.hide = true
          app.hide = false

          $("#caller").val('')

          new Promise(calls.getCalls)
        }
      })
    }
  }
})
