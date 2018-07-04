{
    let view = {
        el: '#page > main',
        template: `
        <span style="font-weight:bolder">新建歌曲</span>
        <form class="form">
            <div class="row">
                <label>歌名</label>
                <input name="name" type="text" value = "__name__">
            </div>
            <div class="row">
                <label>歌手</label>
                <input name="singer" type="text" value = "__singer__">
            </div>
            <div class="row">
                <label>外链</label>
                <input name = "url" type="text" value = "__url__">
                
            </div>
            <button type="submit">
                    保存
            </button>
        </form>
        `,
        render(data={}) {
            let placeholders = ['name','url','singer','id','cover','lyrics']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string]||'')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑</h1>')
            }else{
                $(this.el).prepend('<h1>新建</h1>')
            }
        }，
        reset(){
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', id: '', cover: '', lyrics: ''
        },
        update(data) {
            var Song = AV.Object.extend('Song');
            // 新建一个 Todo 对象
            var song = new Song();
            song.set('name', 'data.name');
            song.set('singer', 'data.singer');
            song.set('url', 'data.url');
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                // this.data.name = attributes.name
                // this.data.singer = attributes.singer
                // this.data.url = attributes.url
                // var a ={id:1},
                // var b ={name:'aa',age:'ww'},
                // var c = {...a,...b} = {id:1,name:'aa',age:'ww'}
                

                Object.assign(this.data, { id, ...attributes })
            }, (error) => {
                console.log(error)
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                if (this.model.data.id) {
                    this.model.data = {
                        name: '', url: '', id: '', singer: '', lyrics: ''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
            })
        },
        create() {
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(() => {
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create', object)
                })
        },
        update() {
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`name=${string}`).val()
            })
            this.model.update(data)
                .then(() => {
                    window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))

                })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)
}