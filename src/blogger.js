import { EntryDatas } from "./entry_datas.js"

export class Blogger{
  #resolve
  #reject

  constructor(options){
    this.promise = new Promise((resolve, reject)=>{
      this.time = (+new Date())
      this.options = options || {}
      this.set_callback()
      this.#resolve = resolve
      this.#reject  = reject
      this.#load()
    })
  }

  get domain(){
    if(this.options.blog_name){
      return `${this.options.blog_name}.blogspot.com`
    }
    else if(this.options.domain){
      return this.options.domain
    }
    // else if(this.options.blog_id){
    //   return `https://www.blogger.com/feeds/${this.options.blog_id}`
    // }
    else{
      return null
    }
  }

  get type(){
    switch(this.options.type){
      case "pages":
      case "page":
        return "pages"

      case "article":
      case "posts":
      default:
        return "posts"
    }
  }

  get feed(){
    // blog_idを指定すると、取得件数が多くできる
    const feed = this.options.blog_id ? `https://www.blogger.com/feeds/${this.options.blog_id}` : `https://${this.domain}/feeds`

    switch(this.type){
      case "pages":
        return `${feed}/pages/${this.response}`
      case "comments":
        return `${feed}/comments/${this.response}`
      case "post_comments"://postID/comments
        return `${feed}/${this.options.post_id}/comments/${this.response}`
      case "posts":
        default:
        return `${feed}/posts/${this.response}`
    }
  }

  get response(){
    switch(this.options.response){
      case "summary":
        return "summary"

      default:
        return "default"
    }
  }

  get path(){
    if(this.options.path){
      return this.options.path
    }
    else if(this.options.page){
      return this.options.page
    }
  }

  get label(){
    if(!this.options.label){
      return ""
    }
    // ラベルが複数（配列）ある場合（AND検索）
    if(this.options.label.constructor === Array){
      // return "/-/" + this.options.label.join("/")
      return ""
    }
    else{
      return `/-/${this.options.label}`
    }
  }

  get max_results(){
    return this.options.max_results ? this.options.max_results : ""
  }

  // 並び順 (published:公開日:default , updated:更新日 )
  get orderby(){
    return this.options.orderby || ""
  }

  get start_index(){
    return this.options.start_index || ""
  }

  // 公開日（◯日以降）: yyyy-mm-dd
  get published_min(){
    return this.options.publiched_min || ""
  }

  // 公開日（◯日以前）: yyyy-mm-dd
  get published_max(){
    return this.options.publiched_max || ""
  }

  // 原稿内検索 (A+B AND検索, A-B NOT検索 , A|B OR検索)
  get search(){
    const datas = []
    if(this.options.search && this.options.search.constructor === Array){
      for(const word of this.options.search){
        datas.push(word)
      }
    }
    else if(typeof this.options.search === "string"){
      datas.push(this.options.search)
    }
    if(this.options.label && this.options.label.constructor === Array){
      for(const label of this.options.label){
        datas.push(`label:${label}`)
      }
    }
    return datas.join("|")
  }

  get query(){
    const datas = []
    if(this.max_results){
      datas.push(`max-results=${this.max_results}`)
    }
    if(this.orderby){
      datas.push(`orderby=${this.orderby}`)
    }
    if(this.start_index){
      datas.push(`start-index=${this.start_index}`)
    }
    if(this.published_min){
      datas.push(`published-min=${this.published_min}`)
    }
    if(this.published_max){
      datas.push(`published-max=${this.published_max}`)
    }
    if(this.search){
      datas.push(`q=${this.search}`)
    }
    if(this.path){
      datas.push(`path=${this.path}`)
    }

    if(datas.length){
      return "&"+ datas.join("&")
    }
    else{
      return ""
    }
  }

  get url(){
    if(this.options.url){
      return this.options.url
    }
    else if(this.type === "pages"){
      return `${this.feed}${this.label}?alt=json&callback=window.${this.callback_name}&${this.path}${this.query}`
    }
    else{
      return `${this.feed}${this.label}?alt=json&callback=window.${this.callback_name}&${this.query}`
    }
  }

  get callback_name(){
    return `blogger_callback_${this.time}`
  }

  set_callback(){
    window[this.callback_name] = this.blogger_callback.bind(this)
  }

  #load(){
    if(!this.domain && !this.feed){
      this.finish(null)
      return
    }
    const script = document.createElement("script")
    script.src = this.url
    document.body.appendChild(script)
  }

  blogger_callback(res){
    if(!res || !res.feed || !res.feed.entry){
      console.warn(res)
      this.finish(null)
      return
    }
    const entry_datas = new EntryDatas(res)
    entry_datas.feed = this.feed
    entry_datas.url  = this.url
    this.finish(entry_datas, res)
  }

  finish(datas=[], res=null){
    this.#resolve(datas, res)
  }
}