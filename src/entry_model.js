
export class EntryModel{
  id
  data
  time
  title
  html
  text
  url
  path
  label
  thumbnail
  img
  img_middle
  img_small

  constructor(entry){
    if(!entry){return}
    const url  = this.#get_url(entry)
    const path = this.#get_path(url)
    const html = this.#get_html(entry)
    const img  = this.#get_img(entry)
    this.set_data(entry, url, path, html, img)
  }

  #get_url(entry){
    return entry.link.find(e => e.rel === "alternate").href
  }

  #get_path(url){
    return "/"+ url.split("/").slice(3).join("/")
  }

  #get_html(entry){
    return entry.content ? entry.content["$t"] : ""
  }

  #get_img(entry){
    return entry["media$thumbnail"] ? entry["media$thumbnail"].url : ""
  }

  set_data(entry, url, path, html, img){
    this.id         = entry.id["$t"]
    this.date       = entry.published["$t"].split("T")[0]
    this.time       = entry.published["$t"].split("T")[1].split(".")[0] //09:00:00.000+09:00
    this.title      = entry.title["$t"]
    this.html       = html
    this.text       = this.#get_html2text(html)
    this.url        = url
    this.path       = path
    this.label      = entry.category ? entry.category.map(e => e.term) : null
    this.thumbnail  = img
    this.img        = this.#convert_img_size(img, "s1600")
    this.img_middle = this.#convert_img_size(img, "s800")
    this.img_small  = this.#convert_img_size(img, "s400")
  }

  #get_html2text(html){
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent.trim()
  }

  #convert_img_size(img, size){
    const sp = img.split("/")
    sp[7]    = size
    return sp.join("/")
  }
}