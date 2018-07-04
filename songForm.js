{
    let view={
        el:'#page > main',
        template:`
        <span style="font-weight:bolder">新建歌曲</span>
        <form class="form">
            <div class="row">
                <label>歌名</label>
                <input type="text">
            </div>
            <div class="row">
                <label>歌手</label>
                <input type="text">
            </div>
            <div class="row">
                <label>外链</label>
                <input type="text">
                
            </div>
            <button type="submit">
                    保存
            </button>
        </form>
        `,
        render(data){
            $(this.el).html(this.template)
        }
    }
    let model ={}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
        }
    }
    controller.init(view,model)
}