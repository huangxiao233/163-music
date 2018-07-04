{
    let view = {
        el: '#songList-container',
        template: ` 

    <ul class="songList">
        <li style="border-top:1px solid red">歌曲1</li>
        <li class="active">歌曲1</li>
        <li>歌曲1</li>
        <li>歌曲1</li>
        <li>歌曲1</li>
    </ul>


`,
        render(data) {
            $(this.el).html(this.template)
        }
    }
    let model = {
        data:{
            songs:[ ],
            selectSongId:undefined,
        },
        find(){
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

        }

    }
    controller.init(view, model)
}