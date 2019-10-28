const app = new Vue({
    el:'#app',
    data:{
        chat:'',
        messages:[],
        caller:'',
        receiver:''
    },
    methods:{
        login: function(){
            $.ajax({
                type:'post',
                url: `/${chat}`,
                data: $("#login").serializeArray(),
                success: (data)=>console.log(data)
            })
        }
    }
})

const login = new Vue({
    el:'#login',
    data:{
    },
    methods:{
        login: function(){
            $.ajax({
                type:'post',
                url: '/',
                data: $("#login").serializeArray(),
                success: (data)=>{
                    app.chat=data.id
                    app.caller = data.caller
                    app.receiver = data.receiver
                    app.messages.push(`Hello ${data.caller}!`)
                }
            })
        }
    }
})
