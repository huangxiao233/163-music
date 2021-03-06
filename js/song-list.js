{
    let view = {
        el: '#songList-container',
        template: ` 

    <ul class="songList">
    </ul>
`,
        render(data) {
            let $el = $(this.el)
            $(this.el).html(this.template)
            let{songs,selectSongId} = data
            let liList = songs.map((song)=>{
                let $li = $('<li></li>').text(song.name).attr('data-song-id',song.id)
                if(song.id === selectSongId){
                    $li.addClass('active')}
                return $li
                
            })
            $el.find('ul').empty()
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data:{
            songs:[ ],
            selectSongId:undefined,
        },
        find(){
            //query.find() is a promise,so return
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                   return {id:song.id,...song.attributes}    
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()

        },
        getAllSongs(){

            return this.model.find().then(()=>{
                this.view.render(this.model.data)
            })   
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let songId = e.currentTarget.getAttributee('data-song-id')
                this.model.data.selectSongId = songId
                this.view.render(this.model.data)
                let songs = this.model.data.songs
                for(let i =0;i<songs.lenth;i++){
                    if(songs[i].id === songId){
                        data = song[i]
                        break
                    }
                }
                window.Eventhub.emit('select',JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventHub(){
            window.Eventhub.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.Eventhub.on('new',()=>{
                this.view.clearActive()
            })
         window.Eventhub.on('update',(song)=>{
             let songs =this.model.data.songs
             for(let i =0;i<songs.lenth;i++){
                 if(sons[i].id === song.id){
                     Object.assign(songss[i],song)
                 }
             }
             this.view.render(this.model.data)
         })   
        }

    }
    controller.init(view, model)
}
