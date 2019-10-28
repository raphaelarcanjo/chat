let chat = ''

const login = new Vue({
    el:'#login',
    data:{
        caller:'',
        receiver:''
    },
    methods:{
        login: function(){
            fetch('/',{
                method:'POST',
                body:new FormData(document.querySelector("#login"))
            })
            .then(response=>response.text())
            .then(data=>chat=data)
        }
    }
})

const app = new Vue({
    el:'#app',
    data:{
        chat:chat,
        message:'false'
    },
    methods:{
        sendMsg: function(){
            fetch('/'+chat,{method:'post'})
            .then(response=>response.json())
            .then(data=>this.message = data)
        }
    }
})