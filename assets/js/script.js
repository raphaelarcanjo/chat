const app = new Vue({
    el:'#app',
    data:{
        chat:'',
        messages:[],
        caller:'',
        receiver:'',
        hide:true
    },
    methods:{
        sendMsg: function(){
            this.messages.push($("#message").val())
            $.ajax({
                type:'post',
                url: `/update/${this.chat}`,
                data: {messages:JSON.stringify(this.messages)}
            })

            $.ajax({
                type:'get',
                url: `/get/${this.chat}`,
                success: (data)=>this.messages = JSON.parse(data.messages)
            })
            $("#message").val('')
        }
    }
})

const login = new Vue({
    el:'#login',
    data:{
        hide:false
    },
    methods:{
        login: function(){
            $.ajax({
                type:'post',
                url: '/save',
                data: $("#login").serializeArray(),
                success: (data)=>{
                    app.chat = data
                    app.caller = $("#caller").val()
                    app.receiver = $("#receiver").val()
                    app.messages.push(`Hello ${app.caller}!`)
                    this.hide = true
                    app.hide = false
                    $("#caller").val('')
                }
            })
        }
    }
})
