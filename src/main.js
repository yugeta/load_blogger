class Main{
  constructor(){

  }
}

switch(document.readyState){
  case "complete":
  case "interactive":
    new Main();break
  default:
    window.addEventListener("DOMCOntentLoaded", (()=> new Main()))
}